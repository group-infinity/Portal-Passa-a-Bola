const nomes = ["Ana", "Beatriz", "Carla", "Daniela", "Eduarda", "Fernanda", "Gabriela", "Helena", "Isabela", "Juliana", "Laura", "Manuela", "Natalia", "Olivia", "Patricia"];
const sobrenomes = ["Silva", "Souza", "Costa", "Santos", "Oliveira", "Pereira", "Rodrigues", "Almeida", "Nascimento", "Lima", "Araujo", "Fernandes"];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNum = (max) => Math.floor(Math.random() * max);

export const gerarDadosJogadora = () => {
  const nomeCompleto = `${randomItem(nomes)} ${randomItem(sobrenomes)}`;
  const email = `${nomeCompleto.toLowerCase().replace(' ', '.')}@example.com`;
  const cpf = `${randomNum(999)}.${randomNum(999)}.${randomNum(999)}-${randomNum(99)}`;
  const telefone = `(11) 9${randomNum(10000)}-${randomNum(10000)}`;
  const dataNascimento = `${String(randomNum(28)+1).padStart(2, '0')}/${String(randomNum(12)+1).padStart(2, '0')}/${randomNum(25) + 1985}`;

  return {
    nome: nomeCompleto,
    email,
    cpf,
    telefone,
    dataNascimento,
  };
};