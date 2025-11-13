using Microsoft.EntityFrameworkCore;
using MovieManager.Models;

namespace MovieManager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Movie> Movies => Set<Movie>();
    }
}