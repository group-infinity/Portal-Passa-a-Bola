import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const verifyAdmin = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  // 1. Pega o token do cabeçalho 'Authorization'
  const authHeader = req.headers['authorization'];
  // O formato esperado é "Bearer TOKEN", então pegamos a segunda parte
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Se não houver token, retorna um erro de não autorizado
  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
  }

  try {
    // 3. Tenta verificar o token usando o segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Verifica se o payload do token contém a role de 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: "Acesso proibido. Rota apenas para administradores." });
    }

    // 5. Se tudo estiver correto, anexa os dados do usuário à requisição
    // e permite que a requisição continue para o próximo passo (o controller)
    req.user = decoded;
    next();
  } catch (error) {
    // 6. Se o token for inválido ou expirado, retorna um erro
    res.status(400).json({ error: "Token inválido." });
  }
};