# PokéTeam API

API REST construída com **Node.js**, **Express**, **TypeScript**, **Prisma ORM** e **PostgreSQL**. Esta API consome dados da [PokeAPI](https://pokeapi.co/) para popular o banco de dados `PokeTeamDb` e fornece endpoints rápidos para o frontend **PokéTeam Portal**.

## 🚀 Tecnologias
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Axios

## 🛠️ Configuração e Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/SohJorgeMesmo78/PokeTeam-api.git
   cd PokeTeam-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz da API:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/PokeTeamDb?schema=public"
   PORT=3000
   ```

4. Crie as tabelas e popule o banco de dados (1025 Pokémon):
   ```bash
   npm run db:setup
   ```

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   A API estará rodando em `http://localhost:3000`.

## 📌 Endpoints

- `GET /api/pokemons`: Lista de Pokémon com paginação, busca por nome e filtro por elemento.
- `GET /api/pokemons/:idOrName`: Detalhes de um Pokémon por ID ou nome.
- `GET /api/types`: Lista de tipos elementais.
- `POST /api/pokemons/sync`: Dispara sincronização com a PokeAPI.
