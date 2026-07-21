# ⚡ PokéTeam API

API REST desenvolvida em **Node.js**, **Express**, **TypeScript**, **Prisma ORM** e **PostgreSQL**. A API consome os dados da [PokeAPI](https://pokeapi.co/) para sincronizar e armazenar **1025 Pokémon** em um banco de dados local próprio, disponibilizando endpoints otimizados para o **PokéTeam Portal**.

---

## 🚀 Tecnologias

- **Node.js** (v20+)
- **Express.js**
- **TypeScript**
- **Prisma ORM** (v5)
- **PostgreSQL**
- **Axios**
- **TSX** (Execução TypeScript em modo dev)

---

## 📋 Pré-requisitos

Antes de iniciar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) rodando na porta `5432` com usuário/senha (padrão: `postgres` / `postgres`).

---

## 🛠️ Passo a Passo para Gerar e Popular o Banco de Dados

### 1. Clonar o repositório
```bash
git clone https://github.com/SohJorgeMesmo78/PokeTeam-api.git
cd PokeTeam-api
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Criar o arquivo `.env`
Crie um arquivo chamado `.env` na raiz da pasta `PokeTeam-api` com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/PokeTeamDb?schema=public"
PORT=3000
```
> 💡 *Caso a senha ou a porta do seu PostgreSQL local seja diferente, ajuste a URL acima.*

### 4. Criar o banco e carregar os 1025 Pokémon (Comando Único)
Rode o comando abaixo:

```bash
npm run db:setup
```

#### ⚙️ O que o `npm run db:setup` faz?
1. **`prisma db push`**: Conecta ao PostgreSQL, cria o banco de dados `PokeTeamDb` (se não existir) e gera todas as tabelas (`pokemons`, `types`, `abilities`, `pokemon_types`, `pokemon_abilities`).
2. **`prisma db seed`**: Dispara o script de carga ([seed.ts](src/scripts/seed.ts)) que busca todos os 1025 Pokémon na PokeAPI e insere no PostgreSQL.

---

## 📜 Todos os Comandos Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run db:setup` | **Cria o banco, gera as tabelas e roda a seed** (1025 Pokémon) |
| `npm run db:push` | Apenas cria/sincroniza as tabelas do schema Prisma |
| `npm run db:seed` | Apenas executa a carga dos Pokémon da PokeAPI para o banco |
| `npm run dev` | Inicia o servidor da API em modo de desenvolvimento (`http://localhost:3000`) |
| `npm run prisma:generate` | Gera o cliente do Prisma |

---

## 🟢 Executando a API

Após rodar a seed, inicie o servidor:

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000`

---

## 📌 Endpoints da API

### 1. Listar Pokémon
- **URL**: `GET /api/pokemons`
- **Parâmetros Query**:
  - `page` (número, padrão: `1`)
  - `limit` (número, padrão: `24`)
  - `search` (string, busca por nome do pokémon)
  - `type` (string, filtro por tipo elemental: `fire`, `water`, `grass`, etc.)
- **Exemplo**: `http://localhost:3000/api/pokemons?type=fire&limit=12`

### 2. Detalhes de um Pokémon
- **URL**: `GET /api/pokemons/:idOrName`
- **Exemplo**: `http://localhost:3000/api/pokemons/pikachu` ou `http://localhost:3000/api/pokemons/25`

### 3. Listar Tipos Elementais
- **URL**: `GET /api/types`
- **Retorno**: Array de nomes de tipos `["bug", "dark", "dragon", "electric", "fire", ...]`

### 4. Forçar Sincronização
- **URL**: `POST /api/pokemons/sync`
- **Body JSON** (Opcional): `{ "limit": 151 }`
- **Descrição**: Dispara a carga da PokeAPI em background.

---

## 🗄️ Modelo de Dados (Prisma Schema)

O esquema do banco de dados inclui as seguintes tabelas:
- **`pokemons`**: id, nome, altura, peso, URLs das imagens/artwork, e stats base (HP, Ataque, Defesa, Sp. Atk, Sp. Def, Velocidade).
- **`types`**: tipos elementais únicos.
- **`abilities`**: habilidades únicas.
- **`pokemon_types` & `pokemon_abilities`**: tabelas de relacionamento (N:N).
