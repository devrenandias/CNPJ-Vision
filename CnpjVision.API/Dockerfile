# Etapa 1: Build da aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo de projeto e restaura as dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o restante do código
COPY . ./

# Publica em modo Release na pasta /app/out
RUN dotnet publish -c Release -o /app/out

# Etapa 2: Imagem de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copia o build publicado da etapa anterior
COPY --from=build /app/out ./

# Define a variável de ambiente para a URL da aplicação
ENV ASPNETCORE_URLS=http://+:5000

# Expõe a porta 5000 para fora do container
EXPOSE 5000

# Define o comando para iniciar a aplicação
ENTRYPOINT ["dotnet", "CnpjVision.API.dll"]
