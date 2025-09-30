import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";


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

    // Define opções de expiração do token com base na role
    const tokenOptions = {};
    if (user.role === 'admin') {
      tokenOptions.expiresIn = '8h'; // Token de Admin expira em 8 horas
    }

    // Gera o token JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        tokenOptions
    );

    res.json({
      message: "Login bem-sucedido!",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        nick: user.nick,
        altura: user.altura,
        peso: user.peso,
        posicao_preferida: user.posicao_preferida,
        foto_perfil_url: user.foto_perfil_url
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
    const nick = req.params.nick;
    const { rows } = await sql`SELECT id, nome, email, role, nick, altura, peso, posicao_preferida, foto_perfil_url FROM users WHERE nick = ${nick}`;
    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilizador não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao procurar perfil do utilizador:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};


// NOVA FUNÇÃO PARA ATUALIZAR O PERFIL DO UTILIZADOR
export const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { nome, nick, email, altura, peso, posicaoPreferida } = req.body;
    const file = req.file;

    try {
      let fotoPerfilUrl = null;

      // Se um arquivo de imagem for enviado, faz o upload para o Vercel Blob
      if (file) {
        const blob = await put(`${uuidv4()}-${file.originalname}`, file.buffer, {
          access: "public",
          contentType: file.mimetype,
        });
        fotoPerfilUrl = blob.url;
      }

      // --- Lógica de atualização ---
      // Pega os dados atuais do usuário para evitar sobrescrever com null/undefined
      const { rows: existingUsers } = await sql`SELECT * FROM users WHERE id = ${userId}`;
      if (existingUsers.length === 0) {
        return res.status(404).json({ error: "Utilizador não encontrado." });
      }
      const currentUser = existingUsers[0];

      // Verifica se o novo email ou nick já estão em uso por outro utilizador
      if (email && email !== currentUser.email) {
          const { rows: emailCheck } = await sql`SELECT id FROM users WHERE email = ${email} AND id != ${userId}`;
          if (emailCheck.length > 0) {
              return res.status(409).json({ error: 'Este e-mail já está em uso.' });
          }
      }
      if (nick && nick !== currentUser.nick) {
          const { rows: nickCheck } = await sql`SELECT id FROM users WHERE nick = ${nick} AND id != ${userId}`;
          if (nickCheck.length > 0) {
              return res.status(409).json({ error: 'Este nome de utilizador já está em uso.' });
          }
      }

      // Monta a query de atualização dinamicamente
      const fieldsToUpdate = [];
      const values = [];
      let queryIndex = 1;

      if (nome) { fieldsToUpdate.push(`nome = $${queryIndex++}`); values.push(nome); }
      if (nick) { fieldsToUpdate.push(`nick = $${queryIndex++}`); values.push(nick); }
      if (email) { fieldsToUpdate.push(`email = $${queryIndex++}`); values.push(email); }
      if (altura) { fieldsToUpdate.push(`altura = $${queryIndex++}`); values.push(altura); }
      if (peso) { fieldsToUpdate.push(`peso = $${queryIndex++}`); values.push(peso); }
      if (posicaoPreferida) { fieldsToUpdate.push(`posicao_preferida = $${queryIndex++}`); values.push(posicaoPreferida); }
      if (fotoPerfilUrl) { fieldsToUpdate.push(`foto_perfil_url = $${queryIndex++}`); values.push(fotoPerfilUrl); }

      if (fieldsToUpdate.length === 0) {
        // Se só a foto foi enviada mas não entrou na condição acima, busca o usuário e retorna
        if(fotoPerfilUrl) {
            const { rows } = await sql`SELECT id, nome, email, role, nick, altura, peso, posicao_preferida, foto_perfil_url FROM users WHERE id = ${userId}`;
            return res.status(200).json({
                message: "Perfil atualizado com sucesso!",
                user: rows[0],
            });
        }
        return res.status(400).json({ message: "Nenhum dado para atualizar." });
      }

      values.push(userId);
      const updateQuery = `
        UPDATE users SET ${fieldsToUpdate.join(', ')}
        WHERE id = $${queryIndex}
        RETURNING id, nome, email, role, nick, altura, peso, posicao_preferida, foto_perfil_url;
      `;

      const { rows } = await sql.query(updateQuery, values);

      res.status(200).json({
        message: "Perfil atualizado com sucesso!",
        user: rows[0],
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

