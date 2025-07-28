using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmpresaController : ControllerBase
{
    private readonly EmpresaService _empresaService;

    public EmpresaController(EmpresaService empresaService)
    {
        _empresaService = empresaService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarEmpresas()
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null)
            return Unauthorized();

        if (!int.TryParse(userIdClaim, out int usuarioId))
            return Unauthorized();

        var empresas = await _empresaService.ListarEmpresasPorUsuarioAsync(usuarioId);
        return Ok(empresas);
    }

    [HttpPost("{cnpj}")]
    public async Task<IActionResult> CadastrarEmpresa(string cnpj)
    {
        // Pegar id do usuário logado no token JWT (claim "id")
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null)
            return Unauthorized();

        if (string.IsNullOrEmpty(cnpj))
            return BadRequest("CNPJ é obrigatório.");

        if (!int.TryParse(userIdClaim, out int usuarioId))
            return Unauthorized();

        try
        {
            var empresa = await _empresaService.ConsultarECadastrarEmpresaAsync(cnpj, usuarioId);
            return Ok(empresa);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }

        
    }
}
