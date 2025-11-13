using System.ComponentModel.DataAnnotations;

namespace MovieManager.Models
{
    public class Movie
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Genre { get; set; }

        // Optional rating (1-5)
        public int? Rating { get; set; }

        // URL poster
        public string? PosterUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}