# ⚡ PokéTeam API

API RESTful completa desenvolvida em **Node.js**, **Express**, **TypeScript**, **Prisma ORM** e **PostgreSQL**. A API consome os dados da [PokeAPI](https://pokeapi.co/) para sincronizar **1025 Pokémon** em um banco de dados local próprio, além de gerenciar **Autenticação JWT**, **Times de Usuários** e a biblioteca de **Pokémon Salvos**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** (v20+)
- **Express.js**
- **TypeScript**
- **Prisma ORM** (v5)
- **PostgreSQL** (Banco de dados relacional)
- **JSON Web Token (JWT)** & **Bcrypt.js** (Autenticação e segurança)
- **Axios** (Integração com PokeAPI)
- **TSX** (Executor TypeScript em desenvolvimento)

---

## 📋 Pré-requisitos

1. **Node.js** (v18 ou superior)
2. **PostgreSQL** rodando na porta `5432` com usuário/senha (padrão: `postgres` / `postgres`).

---

## 🛠️ Instalação e Configuração

### 1. Clonar o repositório
```bash
git clone https://github.com/SohJorgeMesmo78/PokeTeam-api.git
cd PokeTeam-api
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Criar arquivo de variáveis de ambiente `.env`
Crie um arquivo `.env` na raiz do diretório `PokeTeam-api`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/PokeTeamDb?schema=public"
PORT=3000
JWT_SECRET="poketeam-secret-key-2026"
```

### 4. Criar o Banco e Popular 1025 Pokémon (Comando Único)
```bash
npm run db:setup
```

#### ⚙️ O que o `npm run db:setup` faz?
1. **`prisma db push`**: Conecta ao PostgreSQL local, cria o banco `PokeTeamDb` e gera as tabelas (`users`, `teams`, `team_members`, `saved_pokemons`, `pokemons`, `types`, `abilities`).
2. **`prisma db seed`**: Busca todos os 1025 Pokémon na PokeAPI e os salva com estatísticas, habilidades e tipos no PostgreSQL.

---

## 🟢 Executando o Servidor

```bash
npm run dev
```

A API estará rodando em: `http://localhost:3000`

---

## 📌 Endpoints da API

### 🔐 1. Autenticação (`/api/auth`)
| Método | Rota | Descrição | Requer Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Cria uma nova conta de usuário (`username`, `email`, `password`) | ❌ Não |
| `POST` | `/api/auth/login` | Realiza login e retorna o Token JWT (`login`, `password`) | ❌ Não |
| `GET` | `/api/auth/me` | Retorna os dados do usuário logado via Token JWT | ✅ Sim |

---

### 📖 2. Pokédex & Filtros (`/api/pokemons`)
| Método | Rota | Descrição | Requer Auth |
| --- | --- | --- | --- |
| `GET` | `/api/pokemons` | Lista Pokémon paginados com suporte a `search`, `type`, `gen`, `game`, `fullyEvolved` | ❌ Não |
| `GET` | `/api/pokemons/:idOrName` | Retorna detalhes completos do Pokémon (stats, tipos, habilidades, evoluções) | ❌ Não |
| `GET` | `/api/moves/:moveName` | Retorna detalhes técnicos do golpe (tipo, categoria, poder, PP, precisão, descrição PT) | ❌ Não |

---

### 🎮 3. Versões de Jogos & Exclusivos (`/api/games` & `/api/exclusives`)
| Método | Rota | Descrição | Requer Auth |
| --- | --- | --- | --- |
| `GET` | `/api/games` | Retorna as versões oficiais dos jogos Pokémon e suas Pokédex Regionais | ❌ Não |
| `GET` | `/api/exclusives` | Lista os pares de jogos com a relação de Pokémon exclusivos por versão | ❌ Não |
| `GET` | `/api/exclusives/tag` | Consulta se um Pokémon é exclusivo de uma versão selecionada | ❌ Não |

---

### 🛡️ 4. Gestão de Times (`/api/teams`)
*Todas as rotas de times requerem cabeçalho `Authorization: Bearer <token>`.*

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/teams` | Lista todos os times criados pelo usuário logado |
| `POST` | `/api/teams` | Cria um novo time de Pokémon com até 6 integrantes |
| `GET` | `/api/teams/:id` | Retorna os detalhes de um time específico do usuário |
| `PUT` | `/api/teams/:id` | Atualiza o nome, versão do jogo e os 6 integrantes do time |
| `DELETE` | `/api/teams/:id` | Exclui um time do usuário |

---

### 💖 5. Biblioteca "Meus Pokémon Salvos" (`/api/saved-pokemons`)
*Todas as rotas de Pokémon salvos requerem cabeçalho `Authorization: Bearer <token>`.*

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/saved-pokemons` | Lista a biblioteca de Pokémon salvos do usuário |
| `POST` | `/api/saved-pokemons` | Salva uma instância de Pokémon com apelido, natureza, habilidade e golpes |
| `GET` | `/api/saved-pokemons/:id` | Retorna um Pokémon salvo por ID |
| `PUT` | `/api/saved-pokemons/:id` | Atualiza os dados de um Pokémon salvo |
| `DELETE` | `/api/saved-pokemons/:id` | Exclui um Pokémon salvo |

---

## 🗄️ Esquema do Banco de Dados (Prisma ORM)

```prisma
model User {
  id            Int            @id @default(autoincrement())
  username      String         @unique
  email         String         @unique
  password      String
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  teams         Team[]
  savedPokemons SavedPokemon[]
}

model Team {
  id          Int          @id @default(autoincrement())
  userId      Int
  name        String
  gameVersion String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  members     TeamMember[]
}

model SavedPokemon {
  id          Int      @id @default(autoincrement())
  userId      Int
  pokemonId   Int
  pokemonName String
  nickname    String?
  spriteUrl   String
  types       Json
  nature      String?
  abilityName String?
  move1       String?
  move2       String?
  move3       String?
  move4       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 👨‍💻 Autor

Desenvolvido por **[Jorge Pereira](https://jf-pereira.vercel.app/)**.
