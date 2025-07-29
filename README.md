# CNPJ-Vision

## Descrição

CNPJ-Vision é uma aplicação web para cadastro e gerenciamento de empresas a partir do CNPJ.  
O sistema integra com a API pública da ReceitaWS para consulta automática dos dados das empresas, facilitando o preenchimento e garantindo dados atualizados.

O backend é desenvolvido em .NET (API REST) com autenticação JWT, enquanto o frontend é desenvolvido em Angular.

---

## Funcionalidades

- Cadastro de empresas via CNPJ consultando a ReceitaWS  
- Listagem de empresas cadastradas pelo usuário autenticado  
- Autenticação e autorização com JWT   
- Operações CRUD para empresas  
- Paginação e filtros no frontend  

---

## Tecnologias Utilizadas

- Backend: ASP.NET Core Web API  (.NET 8)
- Frontend: Angular  (18)
- Banco de dados: PostgreSQL (configuração padrão)  
- API externa: ReceitaWS para consulta de CNPJ  
- Autenticação: JWT  

---

## Pré-requisitos

- .NET SDK 8 ou superior  
- Node.js 18 ou superior  
- Angular CLI  
- PostgreSQL instalado e configurado  
- Conta e token configurado para a API ReceitaWS (se necessário)  

---

## Como rodar localmente

### Backend

1. Clone o repositório:

   ```bash
   git clone https://github.com/devrenandias/CNPJ-Vision.git
   cd CNPJ-Vision/CnpjVision.API

2. Configure a string de conexão do PostgreSQL e outras variáveis no arquivo appsettings.json (ou appsettings.Development.json):

   ```bash
   {
        "ConnectionStrings": {
            "DefaultConnection": "Host=localhost;Port=PORTA;Database=cnpjvision;Username=seuusuario;Password=suasenha"
        },
        "JwtSettings": {
            "Secret": "sua-chave-secreta-jwt",
            "Issuer": "CNPJ-Vision",
            "Audience": "CNPJ-Vision"
        }
    }

3. Instale a ferramenta do Entity Framework Core (se ainda não tiver):
    ```bash
    dotnet tool install --global dotnet-ef

4. Execute as migrações para criar o banco e as tabelas:
    ```bash
    dotnet ef database update

5. Rode a API backend:
    ```bash
    dotnet run

6. A API estará rodando geralmente em: 
    ```bash
    https://localhost:5001

### Frontend

1. Abra um terminal no diretório do frontend:
    ```bash
    cd ../CnpjVision.UI

2. Instale as dependências do projeto Angular:
    ```bash
    npm install
3. Ajuste o arquivo src/environments/environment.ts para configurar a URL da API backend (se necessário):
    ```bash
    export const environment = {
        production: false,
        urlApi: 'https://localhost:5001/api'
    };
4. Execute o servidor de desenvolvimento Angular:
    ```bash
    ng serve
5. Abra seu navegador e acesse:
    ```bash
    http://localhost:4200

6. Você poderá acessar a aplicação, fazer login, cadastrar empresas pelo CNPJ, consultar e excluir.


### Uso
- Faça login (ou registre-se, caso disponível)
- Cadastre empresas pelo número do CNPJ
- Visualize, obtenhas os dados e exclua suas empresas


