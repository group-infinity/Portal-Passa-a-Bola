# Passa a Bola - Plataforma de Futebol Feminino

![Passa a Bola Website](https://i.imgur.com/wqOxhmP.jpeg)

## 📖 Descrição

Passa a Bola é uma plataforma full-stack dedicada a fortalecer e centralizar a comunidade do futebol feminino. O projeto oferece um espaço para que jogadoras e times encontrem e se inscrevam em encontros locais, além de fornecer placares de ligas importantes e notícias relevantes, tudo em um só lugar.

A aplicação foi atualizada para incluir perfis de utilizador, permitindo que jogadoras editem as suas informações (incluindo foto de perfil, altura, peso) e acompanhem dados de saúde em tempo real (BPM, SpO2, Fadiga) através de um dashboard de saúde.

Conta com um sistema de autenticação para utilizadores e administradores, onde administradores podem gerenciar os encontros. O processo de inscrição agora é mais seguro, com validação de CPF/data de nascimento, upload de documentos e selfies para o Vercel Blob, e envio de confirmação por e-mail com QR Code (via Resend) para validação no evento.

## ✨ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

### Frontend:
- **React** (com Vite)
- **React Router** para gerenciamento de rotas
- **Tailwind CSS** para estilização
- **Zod e React Hook Form** para validação e gerenciamento de formulários
- **Recharts** para gráficos do dashboard de saúde

### Backend:
- **Node.js** com Express
- **JSON Web Tokens (JWT)** para autenticação
- **Bcrypt.js** para hashing de senhas
- **Multer** para processamento de uploads multipart/form-data

### Banco de Dados:
- **Vercel Postgres**

### Serviços & Deploy:
- **Vercel** (Deploy de Frontend & Backend Serverless)
- **Vercel Blob** (Armazenamento de arquivos, ex: fotos de perfil, documentos)
- **Resend** (para envio de e-mails transacionais com QR Code)

### APIs Externas:
- **TheSportsDB** (Placares de ligas de futebol)
- **Hub do Desenvolvedor** (Validação de CPF e data de nascimento)

## 🚀 Como Rodar o Projeto Localmente

Para executar a aplicação no seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos
- Node.js (versão 18 ou superior)
- NPM ou Yarn
- Conta no Vercel (para integração com Postgres e Blob)
- Conta no Resend (para e-mails)
- Conta no Hub do Desenvolvedor (para validação de CPF)

### Backend

1. **Navegue até a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz da pasta backend e adicione:
   ```env
   # Chave para assinar os tokens JWT
   JWT_SECRET=seu-segredo-super-secreto-aqui-12345

   # Variáveis de conexão do Vercel Postgres
   POSTGRES_URL="..."
   POSTGRES_PRISMA_URL="..."
   POSTGRES_URL_NON_POOLING="..."
   POSTGRES_USER="..."
   POSTGRES_HOST="..."
   POSTGRES_PASSWORD="..."
   POSTGRES_DATABASE="..."

   # Token do Vercel Blob (para upload de fotos)
   BLOB_READ_WRITE_TOKEN="..."

   # Chave da API do Resend (para enviar e-mails)
   RESEND_API_KEY="..."

   # Chave da API do Hub do Desenvolvedor (para validar CPF)
   HUBDEV_KEY="..."
   ```

4. **Inicie o servidor:**
   ```bash
   npm run start
   ```
   O backend estará rodando em `http://localhost:5000`.

### Frontend

1. **Em um novo terminal, navegue até a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz da pasta frontend:
   ```env
   VITE_API_URL=http://localhost:5000/
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O frontend estará acessível em `http://localhost:5173`.

**Nota:** A funcionalidade de Health Dashboard depende de um serviço local (não incluído neste repositório) que envia os dados de monitoramento. O frontend tenta contactar `http://localhost:5001` para iniciar/parar este serviço.

## 🔑 Credenciais de Acesso

Para testar as funcionalidades administrativas, utilize as seguintes credenciais na página de login (o login é feito com Nick / nome de usuário):

- **Nick:** admin (Presumido)
- **Senha:** admin123 (Presumido)

**Nota:** O usuário admin deve ser pré-cadastrado no banco de dados Vercel Postgres com a role definida como 'admin'.

## 📝 Documentação da API

Todos os endpoints são prefixados com `/api`.

### Autenticação (`/api`)

#### POST `/api/register`
Registra um novo usuário (jogadora).

**Body:**
```json
{ 
  "nome": "...", 
  "email": "...", 
  "senha": "...", 
  "nick": "..." 
}
```

#### POST `/api/login`
Autentica um usuário. (Login é por nick, não email).

**Body:**
```json
{ 
  "nick": "...", 
  "senha": "..." 
}
```

**Saída (Sucesso):** Retorna token e objeto user.
```json
{
  "message": "Login bem-sucedido!",
  "token": "seu.jwt.token",
  "user": {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "admin",
    "nick": "admin",
    "altura": null,
    "peso": null,
    "posicao_preferida": null,
    "foto_perfil_url": null
  }
}
```

#### GET `/api/profile/:nick`
Busca um perfil de usuário pelo nick. (Requer token de autenticação).

**Saída (Sucesso):**
```json
{
  "id": 1,
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "role": "admin",
  "nick": "admin",
  "altura": null,
  "peso": null,
  "posicao_preferida": null,
  "foto_perfil_url": "https://url.da.foto/imagem.png"
}
```

#### PUT `/api/profile`
Atualiza o perfil do usuário autenticado. (Requer token).

**Body:** `multipart/form-data` contendo campos a atualizar (nome, email, altura, peso, posicao_preferida) e/ou um arquivo `foto_perfil_url`.

**Saída (Sucesso):** Retorna o objeto user atualizado.
```json
{
  "message": "Perfil atualizado com sucesso!",
  "user": { "...": "(objeto do usuário atualizado)" }
}
```

### Encontros (`/api/encontros`)

#### GET `/api/encontros`
Retorna uma lista de todos os encontros cadastrados e suas inscrições.

**Saída (Sucesso):**
```json
[
  {
    "id": 1,
    "nome": "Encontro de Teste",
    "diaI": "30/10/2025",
    "diaF": "29/10/2025",
    "totalVagas": 44,
    "jogadorasPorTime": 11,
    "local": "Estádio Municipal",
    "inscricoes": [
      {
        "id": 1,
        "tipo": "individual",
        "membros": []
      },
      {
        "id": 2,
        "tipo": "conjunta",
        "membros": [ {"...": "(lista de membros)"} ]
      }
    ]
  }
]
```

#### GET `/api/encontros/:id`
Retorna os detalhes de um encontro específico.

**Saída (Sucesso):** (Similar ao objeto individual do endpoint anterior, mas com dados completos das inscrições).

#### POST `/api/encontros`
Cria um novo encontro. (Requer token de admin).

**Body:**
```json
{ 
  "nome": "...", 
  "diaI": "DD/MM/AAAA", 
  "diaF": "DD/MM/AAAA", 
  "totalVagas": 40, 
  "jogadorasPorTime": 5, 
  "local": "..." 
}
```

**Saída (Sucesso 201):** Retorna o objeto do encontro criado.

#### POST `/api/encontros/:id/inscricoes`
Registra uma nova inscrição (individual ou de time). Usa `multipart/form-data`.

- Valida CPF e idade via API externa (Hub do Desenvolvedor)
- Verifica duplicidade de e-mail no evento
- Faz upload de `fotoDocumento` e `selfiePessoal` para o Vercel Blob
- Envia e-mail de confirmação com QR Code via Resend

**Saída (Sucesso 201):**
```json
{
  "message": "Inscrição realizada com sucesso!"
}
```

#### DELETE `/api/encontros/:id`
Deleta um encontro e todas as suas inscrições. (Requer token de admin).

**Saída (Sucesso 200):**
```json
{
  "message": "Encontro e todas as suas inscrições foram deletados com sucesso!"
}
```

#### DELETE `/api/encontros/participante`
Remove um participante (individual ou de um time) de um encontro. (Requer token de admin).

**Body:**
```json
{ 
  "encontroId": 1, 
  "inscricaoId": 1, 
  "jogadoraId": "uuid-da-jogadora-se-for-time" 
}
```

**Saída (Sucesso 200):**
```json
{
  "message": "Participante removido com sucesso."
}
```

#### GET `/api/encontros/:id/chaveamento`
Retorna os confrontos (chaveamento) do torneio.

**Saída (Sucesso 200):**
```json
{
  "encontroId": "1",
  "totalTimes": 4,
  "chaveamento": [
    {
      "jogo": 1,
      "timeA": { "nome": "Time das Estrelas FC", "membros": [...] },
      "timeB": { "nome": "Time 1", "membros": [...] }
    },
    {
      "jogo": 2,
      "timeA": { "nome": "Time 2", "membros": [...] },
      "timeB": { "nome": "Aguardando adversário", "membros": [] }
    }
  ]
}
```

### Ligas e Placares (`/api/ligas`)

#### GET `/api/ligas`
Busca e retorna dados de placares e jogos de ligas (TheSportsDB).

**Saída (Sucesso 200):**
```json
[
  {
    "id": 5704,
    "nome": "Copa Libertadores Feminina",
    "info": { "...": "(dados da liga)" },
    "jogosFuturos": [ {"...": "(lista de jogos)"} ],
    "jogosPassados": [ {"...": "(lista de jogos)"} ]
  }
]
```

### Monitor de Saúde (`/api/monitor`)

#### POST `/api/monitor`
Adiciona um novo dado de saúde (BPM, saturação) para um utilizador.

**Body:**
```json
{ 
  "userId": 1, 
  "bpm": 80, 
  "saturation": 98 
}
```

**Saída (Sucesso 201):**
```json
{
  "message": "Dados de saúde adicionados com sucesso."
}
```

#### GET `/api/monitor/:userId`
Busca os últimos 20 registros de saúde de um usuário. (Requer token).

**Saída (Sucesso 200):**
```json
[
  {
    "bpm": 80,
    "saturation": 98,
    "timestamp": "2025-10-30T14:30:00.000Z"
  },
  {
    "bpm": 82,
    "saturation": 97,
    "timestamp": "2025-10-30T14:30:05.000Z"
  }
]
```

## ⚠️ Observações e Arquitetura

- **Banco de Dados:** A aplicação utiliza Vercel Postgres como banco de dados persistente, gerenciando usuários, encontros e inscrições.

- **Armazenamento de Arquivos:** Fotos de perfil e documentos de inscrição são enviados para o Vercel Blob.

- **Serviços Externos:**
  - **Resend:** Utilizado para o envio de e-mails transacionais (confirmação de inscrição e QR Code).
  - **Hub do Desenvolvedor:** Utilizado para a validação de CPF e data de nascimento no backend.

- **Monitor de Saúde:** A funcionalidade de Health Dashboard busca dados via `/api/monitor`. Para que os dados apareçam em tempo real, é necessário um serviço separado (presumivelmente um hardware ou simulador) que faça POST para `http://localhost:5001/api/start-monitoring` e envie os dados para o endpoint POST `/api/monitor` do backend.

## Integrantes do Grupo

- **Diogo Pelinson**, RM563321
- **Jessica Tavares**, RM566220
- **Luara Soares**, RM561266
- **Miguel Amaro**, RM566200
- **Pedro Henrique Caires**, RM562344
