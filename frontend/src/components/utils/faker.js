const nomes = ["Ana", "Beatriz", "Carla", "Daniela", "Eduarda", "Fernanda", "Gabriela", "Helena", "Isabela", "Juliana", "Laura", "Manuela", "Natalia", "Olivia", "Patricia"];
const sobrenomes = ["Silva", "Souza", "Costa", "Santos", "Oliveira", "Pereira", "Rodrigues", "Almeida", "Nascimento", "Lima", "Araujo", "Fernandes"];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNum = (max) => Math.floor(Math.random() * max);

// --- NOVA FUNÇÃO PARA GERAR CPF VÁLIDO ---
const gerarCPFValido = () => {
  const n = Array(9).fill(0).map(() => Math.floor(Math.random() * 10));

  // Calcula o primeiro dígito verificador
  let d1 = n.reduce((acc, val, i) => acc + val * (10 - i), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;

  // Calcula o segundo dígito verificador
  let d2 = n.reduce((acc, val, i) => acc + val * (11 - i), 0) + (d1 * 2);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;

  return `${n.slice(0, 3).join('')}.${n.slice(3, 6).join('')}.${n.slice(6, 9).join('')}-${d1}${d2}`;
};


export const gerarDadosJogadora = () => {
  const nomeCompleto = `${randomItem(nomes)} ${randomItem(sobrenomes)}`;
  const email = `${nomeCompleto.toLowerCase().replace(/\s+/g, '.')}@example.com`;

  const cpf = gerarCPFValido();

  const telefone = `(11) 9${String(randomNum(10000)).padStart(4, '0')}-${String(randomNum(10000)).padStart(4, '0')}`;
  const dataNascimento = `${String(randomNum(28) + 1).padStart(2, '0')}/${String(randomNum(12) + 1).padStart(2, '0')}/${randomNum(25) + 1985}`;

  return {
    nome: nomeCompleto,
    email,
    cpf,
    telefone,
    dataNascimento,
  };
};