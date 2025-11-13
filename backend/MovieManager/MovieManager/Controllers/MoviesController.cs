using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieManager.Data;
using MovieManager.Models;

namespace MovieManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;

        public MoviesController(AppDbContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        // GET: api/movies?search=&genre=&sort=
        [HttpGet]
        public async Task<IActionResult> GetAll(
            string? search,
            string? genre,
            string? sort)
        {
            var query = _context.Movies.AsQueryable();

            // Search by Title
            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(m => m.Title.ToLower().Contains(search.ToLower()));

            // Filter by Genre
            if (!string.IsNullOrWhiteSpace(genre))
                query = query.Where(m => m.Genre != null &&
                         m.Genre.ToLower().Contains(genre.ToLower()));

            // Sort
            if (sort == "title")
                query = query.OrderBy(m => m.Title);
            else if (sort == "rating")
                query = query.OrderByDescending(m => m.Rating);

            var movies = await query.ToListAsync();
            return Ok(movies);
        }

        // GET: api/movies/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound();
            return Ok(movie);
        }

        // POST with upload
        [HttpPost]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> Create(
            [FromForm] string title,
            [FromForm] string? genre,
            [FromForm] int? rating,
            IFormFile? posterFile,
            [FromForm] string? posterUrl)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest("Title is required.");

            string finalPoster;

            if (posterFile != null && posterFile.Length > 0)
            {
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(posterFile.FileName, posterFile.OpenReadStream()),
                    Folder = "moviemanager_uploads"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                finalPoster = uploadResult.SecureUrl?.AbsoluteUri ?? "";
            }
            else if (!string.IsNullOrWhiteSpace(posterUrl))
            {
                finalPoster = posterUrl;
            }
            else
            {
                finalPoster = "https://placehold.co/400x600?text=No+Poster";
            }

            var movie = new Movie
            {
                Title = title,
                Genre = genre,
                Rating = rating,
                PosterUrl = finalPoster
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return Ok(movie);
        }

        // PUT api/movies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromForm] string title,
            [FromForm] string? genre,
            [FromForm] int? rating,
            IFormFile? posterFile,
            [FromForm] string? posterUrl)
        {
            var existing = await _context.Movies.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = title;
            existing.Genre = genre;
            existing.Rating = rating;

            // Update poster if provided
            if (posterFile != null && posterFile.Length > 0)
            {
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(posterFile.FileName, posterFile.OpenReadStream()),
                    Folder = "moviemanager_uploads"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                existing.PosterUrl = uploadResult.SecureUrl?.AbsoluteUri ?? existing.PosterUrl;
            }
            else if (!string.IsNullOrWhiteSpace(posterUrl))
            {
                existing.PosterUrl = posterUrl;
            }

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE api/movies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound();

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
