import jwt from 'jsonwebtoken';
import 'dotenv/config';

// NOVO MIDDLEWARE PARA VERIFICAR QUALQUER TOKEN VÁLIDO
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona o payload do token (id, role) ao request
    next();
  } catch (error) {
    res.status(400).json({ error: "Token inválido." });
  }
};


export const verifyAdmin = (req, res, next) => {
  // Primeiro, verifica se o token é válido
  verifyToken(req, res, () => {
    // Depois, verifica se o utilizador tem a role 'admin'
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Acesso proibido. Rota apenas para administradores." });
    }
    next();
  });
};

