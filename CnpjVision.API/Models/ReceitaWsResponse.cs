namespace CnpjVision.API.Models
{
    public class ReceitaWsResponse
    {
        public string nome { get; set; }
        public string fantasia { get; set; }
        public string cnpj { get; set; }
        public string situacao { get; set; }
        public string abertura { get; set; }
        public string tipo { get; set; }
        public string natureza_juridica { get; set; }
        public List<Atividade> atividade_principal { get; set; }
        public string logradouro { get; set; }
        public string numero { get; set; }
        public string complemento { get; set; }
        public string bairro { get; set; }
        public string municipio { get; set; }
        public string uf { get; set; }
        public string cep { get; set; }
    }

    public class Atividade
    {
        public string code { get; set; }
        public string text { get; set; }
    }
}
