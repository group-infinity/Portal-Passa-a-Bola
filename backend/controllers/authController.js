import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Admin "mock" (simulando um banco de dados)
const ADMIN_USER = {
  id: 1, // Adicionado um ID para o usuário
  email: "admin@passaabola.com",
  senha: "admin123", // Em um app real, isso seria uma hash!
  role: "admin",
};

export const login = (req, res) => {
  const { email, senha } = req.body;
  console.log("Corpo da requisição recebido:", req.body);

  if (email === ADMIN_USER.email && senha === ADMIN_USER.senha) {
    // Gerar o Token JWT
    const token = jwt.sign(
      { id: ADMIN_USER.id, role: ADMIN_USER.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    console.log("Admin logado com sucesso!");
    res.json({
      message: "Login bem-sucedido!",
      token, // Envia o token para o cliente
      user: {
        email: ADMIN_USER.email,
        role: ADMIN_USER.role,
      },
    });
  } else {
    res.status(401).json({ error: "Credenciais inválidas." });
  }
};