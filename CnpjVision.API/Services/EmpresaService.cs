using System;
using System.Globalization;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using CnpjVision.API.Data;
using CnpjVision.API.Models;
using Microsoft.EntityFrameworkCore;

public class EmpresaService
{
    private readonly ApiDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public EmpresaService(ApiDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }
    private string LimparCnpj(string cnpj)
    {
        return new string(cnpj.Where(char.IsDigit).ToArray());
    }
    public async Task<Empresa> ConsultarECadastrarEmpresaAsync(string cnpj, int usuarioId)
    {
        var cnpjLimpo = LimparCnpj(cnpj); 
        var client = _httpClientFactory.CreateClient();
        var url = $"https://www.receitaws.com.br/v1/cnpj/{cnpjLimpo}"; 

        var response = await client.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Erro ao consultar API da ReceitaWS.");
        }

        var json = await response.Content.ReadAsStringAsync();

        var receitaResponse = JsonSerializer.Deserialize<ReceitaWsResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (receitaResponse == null)
            throw new Exception("Resposta inválida da ReceitaWS.");

        if (!DateTime.TryParseExact(
            receitaResponse.abertura,
            "dd/MM/yyyy",
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
            out var abertura))
        {
            throw new Exception("Data de abertura inválida.");
        }

        var empresa = new Empresa
        {
            NomeEmpresarial = receitaResponse.nome,
            NomeFantasia = receitaResponse.fantasia,
            CNPJ = cnpjLimpo, 
            Situacao = receitaResponse.situacao,
            Abertura = abertura,
            Tipo = receitaResponse.tipo,
            NaturezaJuridica = receitaResponse.natureza_juridica,
            AtividadePrincipal = receitaResponse.atividade_principal != null && receitaResponse.atividade_principal.Count > 0 ?
                receitaResponse.atividade_principal[0].text : null,
            Logradouro = receitaResponse.logradouro,
            Numero = receitaResponse.numero,
            Complemento = receitaResponse.complemento,
            Bairro = receitaResponse.bairro,
            Municipio = receitaResponse.municipio,
            UF = receitaResponse.uf,
            CEP = receitaResponse.cep,
            UsuarioId = usuarioId
        };

        _context.Empresas.Add(empresa);
        await _context.SaveChangesAsync();

        return empresa;
    }
    public async Task<List<Empresa>> ListarEmpresasPorUsuarioAsync(int usuarioId)
    {
        return await _context.Empresas
            .Where(e => e.UsuarioId == usuarioId)
            .ToListAsync();
    }

    public async Task<Empresa?> ObterEmpresaPorIdAsync(int id, int usuarioId)
    {
        return await _context.Empresas
            .FirstOrDefaultAsync(e => e.Id == id && e.UsuarioId == usuarioId);
    }

    public async Task<bool> ExcluirEmpresaAsync(int id, int usuarioId)
    {
        var empresa = await _context.Empresas
            .FirstOrDefaultAsync(e => e.Id == id && e.UsuarioId == usuarioId);

        if (empresa == null)
            return false;

        _context.Empresas.Remove(empresa);
        await _context.SaveChangesAsync();
        return true;
    }

}
