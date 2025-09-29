import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

// FUNÇÃO DE REGISTO DE UTILIZADOR
export const register = async (req, res) => {
  const { nome, email, senha, nick } = req.body;

  if (!nome || !email || !senha || !nick) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    // Verifica se o utilizador já existe
    const { rows: existingUsers } = await sql`SELECT * FROM users WHERE email = ${email}`;
    const { rows: existingNick } = await sql`SELECT * FROM users WHERE nick = ${nick}`;

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Este e-mail já está registado." });
    }
    if (existingNick.length > 0) {
      return res.status(409).json({ error: "Este username já está registado." });
    }

    // Criptografa a palavra-passe
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Insere o novo utilizador na base de dados
    const { rows } = await sql`
      INSERT INTO users (nome, email, senha, nick)
      VALUES (${nome}, ${email}, ${senhaHash}, ${nick})
      RETURNING id, nome, email, role, nick;
    `;

    res.status(201).json({ message: "Utilizador registado com sucesso!", user: rows[0] });
  } catch (error) {
    console.error("Erro no registo:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// FUNÇÃO DE LOGIN ATUALIZADA
export const login = async (req, res) => {
  const { nick, senha } = req.body;

  if (!nick || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    // Procura o utilizador pelo e-mail
    const { rows } = await sql`SELECT * FROM users WHERE nick = ${nick}`;
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Compara a palavra-passe fornecida com a palavra-passe armazenada
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.json({
      message: "Login bem-sucedido!",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        nick: user.nick,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// FUNÇÃO PARA PROCURAR PERFIL DO UTILIZADOR
export const getUserProfile = async (req, res) => {
  try {
    const { rows } = await sql`SELECT id, nome, email, role, nick FROM users WHERE nick = ${req.user.nick}`;
    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilizador não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao procurar perfil do utilizador:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
