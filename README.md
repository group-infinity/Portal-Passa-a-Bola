# Passa a Bola - Plataforma de Futebol Feminino

![Passa a Bola Mobile](https://i.imgur.com/C1YKMHW.png)
![Passa a Bola Desktop](https://i.imgur.com/3X24Eqp.png)

## 📖 Descrição

**Passa a Bola** é uma plataforma full-stack dedicada a fortalecer e centralizar a comunidade do futebol feminino. O projeto oferece um espaço para que jogadoras e times encontrem e se inscrevam em encontros locais, além de fornecer placares de ligas importantes e notícias relevantes, tudo em um só lugar.

A aplicação conta com um sistema de autenticação para administradores, que podem gerenciar os encontros, definindo regras como limite de vagas e tamanho dos times, garantindo a organização e a qualidade dos eventos.

## ✨ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas, tanto no frontend quanto no backend:

* **Frontend:**
    * **React** com **Vite** para uma experiência de desenvolvimento rápida e otimizada.
    * **React Router** para gerenciamento de rotas e navegação.
    * **Tailwind CSS** para estilização ágil e responsiva.
    * **Zod** para validação robusta de formulários do lado do cliente.
    * **React Hook Form** para gerenciamento de estado de formulários.
* **Backend:**
    * **Node.js** com **Express** para a construção de uma API RESTful.
    * **JSON Web Tokens (JWT)** para autenticação e proteção de rotas administrativas.
    * **CORS** para permitir a comunicação entre frontend e backend.
* **Deploy:**
    * **Vercel** para deploy contínuo (CI/CD) do frontend e do backend serverless.

## 🚀 Como Rodar o Projeto Localmente

Para executar a aplicação no seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos
* Node.js (versão 18 ou superior)
* NPM ou Yarn

### Backend
1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz da pasta `backend` e adicione a chave secreta para o JWT:
    ```
    JWT_SECRET=seu-segredo-super-secreto-aqui-12345
    ```
4.  Inicie o servidor:
    ```bash
    npm run dev 
    ```
    O backend estará rodando em `http://localhost:5000`.

### Frontend
1.  Em um novo terminal, navegue até a pasta do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Verifique se o arquivo `.env.local` existe na raiz da pasta `frontend` com o seguinte conteúdo:
    ```
    VITE_API_URL=http://localhost:5000/
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173` (ou outra porta indicada no terminal).

## 🔑 Credenciais de Acesso

Para testar as funcionalidades administrativas, utilize as seguintes credenciais na página de login:

* **Email:** `admin@passaabola.com`
* **Senha:** `admin123`

## 📝 Documentação da API

Todos os endpoints são prefixados com `/api`.

---

### Autenticação (`/api/login`)

#### `POST /api/login`
Autentica um usuário. Usado na página de login para obter acesso administrativo.

* **Entrada (Body):**
    ```json
    {
      "email": "admin@passaabola.com",
      "senha": "admin123"
    }
    ```
* **Saída (Sucesso - 200):**
    ```json
    {
      "message": "Login bem-sucedido!",
      "token": "seu.jwt.token",
      "user": {
        "email": "admin@passaabola.com",
        "role": "admin"
      }
    }
    ```
* **Saída (Erro - 401):**
    ```json
    {
      "error": "Credenciais inválidas."
    }
    ```
---

### Encontros (`/api/encontros`)

#### `GET /api/encontros`
Retorna uma lista de todos os encontros cadastrados.

* **Entrada:** Nenhuma.
* **Saída (Sucesso - 200):**
    ```json
    [
      {
        "id": 1,
        "nome": "Encontro nº1",
        "diaI": "27/10/2025",
        "diaF": "30/10/2025",
        "totalVagas": 44,
        "jogadorasPorTime": 11,
        "inscricoes": []
      }
    ]
    ```

#### `GET /api/encontros/:id`
Retorna os detalhes de um encontro específico.

* **Entrada (Parâmetro de URL):** `id` do encontro (ex: `/api/encontros/1`).
* **Saída (Sucesso - 200):**
    ```json
    {
      "id": 1,
      "nome": "Encontro nº1",
      // ...demais dados do encontro
      "inscricoes": [ /* lista de inscrições */ ]
    }
    ```

#### `POST /api/encontros`
Cria um novo encontro. **Rota protegida, requer token de admin.**

* **Entrada (Body):**
    ```json
    {
      "nome": "Torneio de Verão",
      "diaI": "15/01/2026",
      "diaF": "10/01/2026",
      "totalVagas": 40,
      "jogadorasPorTime": 5
    }
    ```
* **Saída (Sucesso - 201):** O objeto do novo encontro criado.
* **Saída (Erro - 400):** Mensagem de erro se a validação de vagas falhar (não for divisível ou gerar número ímpar de times).

#### `POST /api/encontros/:id/inscricoes`
Registra uma nova inscrição (individual ou de time) em um encontro.

* **Entrada (Parâmetro de URL):** `id` do encontro.
* **Entrada (Body - Inscrição Individual):**
    ```json
    {
      "tipo": "individual",
      "nome": "Joana da Silva",
      "email": "joana@teste.com",
      "cpf": "123.456.789-00",
      "telefone": "11999999999",
      "dataNascimento": "01/01/2000"
    }
    ```
* **Entrada (Body - Inscrição de Time):**
    ```json
    {
      "tipo": "conjunta",
      "nomeTime": "Time das Estrelas FC",
      "responsavel": "Técnica Joana",
      "emailResponsavel": "joana@time.com",
      "membros": [
        { "nome": "Ana Silva", "email": "ana@time.com", "cpf": "...", "telefone": "...", "dataNascimento": "..." },
        { "nome": "Beatriz Costa", "email": "bia@time.com", "cpf": "...", "telefone": "...", "dataNascimento": "..." }
      ]
    }
    ```
* **Saída (Sucesso - 201):**
    ```json
    {
      "message": "Inscrição realizada com sucesso!",
      "inscricao": { /* objeto da inscrição criada */ }
    }
    ```
* **Saída (Erro - 400):** Mensagem de erro se houver duplicidade de dados, falta de vagas ou nome de time já em uso.

---

### Ligas e Placares (`/api/ligas`)

#### `GET /api/ligas`
Busca e retorna dados de placares e jogos de ligas de futebol feminino a partir de uma API externa (TheSportsDB).

* **Entrada:** Nenhuma.
* **Saída (Sucesso - 200):** Uma lista de objetos, cada um contendo informações da liga e listas de jogos futuros e passados.
    ```json
    [
      {
        "id": 5201,
        "nome": "Brasileirão Feminino",
        "info": { /* ...dados da liga... */ },
        "jogosFuturos": [ /* ...lista de jogos... */ ],
        "jogosPassados": [ /* ...lista de jogos... */ ]
      }
    ]
    ```

## ⚠️ Observações e Próximos Passos

* **Banco de Dados:** Atualmente, a aplicação utiliza um banco de dados em memória (um array no backend) para agilizar o desenvolvimento e a demonstração. Em um ambiente de produção serverless como a Vercel, isso pode levar a inconsistências de dados, pois cada requisição pode ser tratada por uma instância diferente do servidor.
* **Evolução:** O próximo passo crucial para este projeto seria a integração com um banco de dados persistente, como **Vercel Postgres** ou **MongoDB Atlas**, para garantir a consistência e a durabilidade dos dados.
