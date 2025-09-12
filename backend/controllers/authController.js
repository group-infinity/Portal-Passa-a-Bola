// Admin "mock" (simulando um banco de dados)
const ADMIN_USER = {
  email: "admin@passaabola.com",
  senha: "admin123", // Em um app real, isso seria uma hash!
  role: "admin",
};
 
export const login = (req, res) => {
  const { email, senha } = req.body;
  console.log("Corpo da requisição recebido:", req.body);
  if (email === ADMIN_USER.email && senha === ADMIN_USER.senha) {

    // Por simplicidade, vamos apenas retornar um sucesso com o role do usuário.
    console.log("Admin logado com sucesso!");
    res.json({
      message: "Login bem-sucedido!",
      user: {
        email: ADMIN_USER.email,
        role: ADMIN_USER.role,
      },
    });
  } else {
    res.status(401).json({ error: "Credenciais inválidas." });
  }
};
 