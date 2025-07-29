using CnpjVision.API.Data;
using CnpjVision.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

public class AuthService
{
    private readonly ApiDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApiDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    
    public async Task<bool> RegisterUserAsync(Usuario user, string password)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == user.Email))
            return false; 

        user.Senha = HashPassword(password);
        _context.Usuarios.Add(user);
        await _context.SaveChangesAsync();

        return true;
    }

    
    public async Task<string> AuthenticateAsync(string email, string password)
    {
        var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null || !VerifyPassword(password, user.Senha))
            return null;

        return GenerateJwtToken(user);
    }

    
    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    
    private bool VerifyPassword(string password, string hashedPassword)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput == hashedPassword;
    }

    // Gera o JWT
    private string GenerateJwtToken(Usuario user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim("id", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
