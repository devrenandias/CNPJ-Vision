using CnpjVision.API.Models;
using Microsoft.AspNetCore.Mvc;
using CnpjVision.API.Models.Requests;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var user = new Usuario { Nome = request.Nome, Email = request.Email };
        var result = await _authService.RegisterUserAsync(user, request.Senha);

        if (!result)
            return BadRequest(new { mensagem = "Usuário já existe" });

        return Ok(new { mensagem = "Usuário criado com sucesso" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var token = await _authService.AuthenticateAsync(request.Email, request.Senha);

        if (token == null)
            return Unauthorized("Email ou senha inválidos");

        return Ok(new { Token = token });
    }
}

