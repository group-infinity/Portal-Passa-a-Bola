import jwt from 'jsonwebtoken';
import 'dotenv/config';

const ADMIN_USER = {
  id: 1,
  email: "admin@passaabola.com",
  senha: "admin123",
  role: "admin",
};

export const login = (req, res) => {
  const { email, senha } = req.body;
  console.log("Corpo da requisição recebido:", req.body);

  if (email === ADMIN_USER.email && senha === ADMIN_USER.senha) {

    const token = jwt.sign(
      { id: ADMIN_USER.id, role: ADMIN_USER.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Admin logado com sucesso!");
    res.json({
      message: "Login bem-sucedido!",
      token,
      user: {
        email: ADMIN_USER.email,
        role: ADMIN_USER.role,
      },
    });
  } else {
    res.status(401).json({ error: "Credenciais inválidas." });
  }
};