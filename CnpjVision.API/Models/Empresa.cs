using System.ComponentModel.DataAnnotations;

namespace CnpjVision.API.Models
{
    public class Empresa
    {
        [Key]
        public int Id { get; set; }
        public string NomeEmpresarial { get; set; }
        public string NomeFantasia { get; set; }
        public string CNPJ { get; set; }
        public string Situacao { get; set; }
        public DateTime Abertura { get; set; }
        public string Tipo { get; set; }
        public string NaturezaJuridica { get; set; }
        public string AtividadePrincipal { get; set; }
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Municipio { get; set; }
        public string UF { get; set; }
        public string CEP { get; set; }

        public int UsuarioId { get; set; }
        


    }
}
