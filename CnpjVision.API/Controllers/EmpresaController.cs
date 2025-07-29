using CnpjVision.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmpresaController : ControllerBase
{
    private readonly EmpresaService _empresaService;
    private readonly ApiDbContext _context;

    public EmpresaController(EmpresaService empresaService, ApiDbContext apiDbContext)
    {
        _context = apiDbContext;
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
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int usuarioId))
            return Unauthorized();

        if (string.IsNullOrEmpty(cnpj))
            return BadRequest("CNPJ é obrigatório.");

        try
        {
            
            var cnpjLimpo = new string(cnpj.Where(char.IsDigit).ToArray());

            
            var jaCadastrada = await _context.Empresas
                .AnyAsync(e => e.CNPJ == cnpjLimpo && e.UsuarioId == usuarioId);

            if (jaCadastrada)
                return Conflict(new { mensagem = "Esta empresa já foi cadastrada anteriormente." });

            var empresa = await _empresaService.ConsultarECadastrarEmpresaAsync(cnpjLimpo, usuarioId);
            return Ok(empresa);
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }



    [HttpGet("{id}")]
    public async Task<IActionResult> ObterEmpresaPorId(int id)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int usuarioId))
            return Unauthorized();

        var empresa = await _empresaService.ObterEmpresaPorIdAsync(id, usuarioId);
        if (empresa == null)
            return NotFound("Empresa não encontrada");

        return Ok(empresa);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> ExcluirEmpresa(int id)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int usuarioId))
            return Unauthorized();

        var sucesso = await _empresaService.ExcluirEmpresaAsync(id, usuarioId);
        if (!sucesso)
            return NotFound("Empresa não encontrada ou não pertence ao usuário");

        return NoContent(); 
    }

}
