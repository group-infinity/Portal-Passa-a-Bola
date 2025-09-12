// Simulação de um banco de dados em memória
let encontros = [
  // Dados iniciais para visualização
  { id: 1, nome: "Encontro nº1", diaI: "27/10/2025", diaF: "30/10/2025" },
  { id: 2, nome: "Encontro nº2", diaI: "10/11/2025", diaF: "13/11/2025" },
];
 
// Listar todos os encontros
export const getAllEncontros = (req, res) => {
  res.json(encontros);
};
 
// Criar um novo encontro (rota protegida)
export const createEncontro = (req, res) => {
  // Em um app real, teríamos um middleware para verificar se o usuário é admin
  const { nome, diaI, diaF } = req.body;
  if (!nome || !diaI || !diaF) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  const newEncontro = {
    id: encontros.length + 1,
    nome,
    diaI,
    diaF,
  };
  encontros.push(newEncontro);
  console.log("Novo encontro criado:", newEncontro);
  res.status(201).json(newEncontro);
};
 