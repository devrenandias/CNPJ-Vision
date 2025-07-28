using CnpjVision.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CnpjVision.API.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options) { }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Empresa> Empresas { get; set; }

    }
}
