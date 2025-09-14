let encontros = [
  { id: 1, nome: "Encontro nº1", diaI: "27/10/2025", diaF: "30/10/2025", totalVagas: 44, jogadorasPorTime: 11, inscricoes: [] },
  { id: 2, nome: "Encontro nº2", diaI: "10/11/2025", diaF: "13/11/2025", totalVagas: 20, jogadorasPorTime: 5, inscricoes: [] },
];
let nextId = 3;

export const getAllEncontros = (req, res) => {
  res.json(encontros);
};

export const getEncontroById = (req, res) => {
  const encontro = encontros.find(e => e.id === parseInt(req.params.id));
  if (encontro) {
    res.json(encontro);
  } else {
    res.status(404).json({ error: "Encontro não encontrado." });
  }
};


export const createEncontro = (req, res) => {
  const { nome, diaI, diaF, totalVagas, jogadorasPorTime } = req.body;

  if (!nome || !diaI || !diaF || !totalVagas || !jogadorasPorTime) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const numVagas = parseInt(totalVagas);
  const numJogadoras = parseInt(jogadorasPorTime);

  if (numVagas % numJogadoras !== 0) {
    return res.status(400).json({ error: `O total de vagas (${numVagas}) não é divisível pelo tamanho do time (${numJogadoras}).` });
  }

  const numeroDeTimes = numVagas / numJogadoras;

  if (numeroDeTimes % 2 !== 0) {
    return res.status(400).json({ error: `A combinação de vagas e tamanho do time resulta em um número ímpar de times (${numeroDeTimes}). O número de times deve ser par.` });
  }

  const newEncontro = {
    id: nextId++,
    nome,
    diaI,
    diaF,
    totalVagas: numVagas,
    jogadorasPorTime: numJogadoras,
    inscricoes: [],
  };
  encontros.push(newEncontro);
  console.log("Novo encontro criado:", newEncontro);
  res.status(201).json(newEncontro);
};

export const createInscricao = (req, res) => {
  const encontro = encontros.find(e => e.id === parseInt(req.params.id));
  if (!encontro) {
    return res.status(404).json({ error: "Encontro não encontrado." });
  }

  const emailsInscritos = new Set();
  const cpfsInscritos = new Set();
  encontro.inscricoes.forEach(insc => {
    if (insc.tipo === 'individual') {
      emailsInscritos.add(insc.email);
      cpfsInscritos.add(insc.cpf);
    } else if (insc.tipo === 'conjunta') {
      insc.membros.forEach(membro => {
        emailsInscritos.add(membro.email);
        cpfsInscritos.add(membro.cpf);
      });
    }
  });

  const novaInscricaoData = req.body;

  const vagasOcupadas = cpfsInscritos.size;
  const vagasRestantes = encontro.totalVagas - vagasOcupadas;

  if (novaInscricaoData.tipo === 'individual') {
    if (vagasRestantes < 1) {
      return res.status(400).json({ error: "Não há mais vagas disponíveis." });
    }
  } else if (novaInscricaoData.tipo === 'conjunta') {
    if (novaInscricaoData.membros.length !== encontro.jogadorasPorTime) {
        return res.status(400).json({ error: `Este encontro exige times de ${encontro.jogadorasPorTime} jogadoras.` });
    }
    if (vagasRestantes < encontro.jogadorasPorTime) {
      return res.status(400).json({ error: `Não há vagas suficientes para um time completo. Vagas restantes: ${vagasRestantes}.` });
    }
  }

  if (novaInscricaoData.tipo === 'conjunta') {
    const nomeTimeJaExiste = encontro.inscricoes.some(insc => insc.tipo === 'conjunta' && insc.nomeTime.toLowerCase() === novaInscricaoData.nomeTime.toLowerCase());
    if (nomeTimeJaExiste) {
      return res.status(400).json({ error: `O nome de time '${novaInscricaoData.nomeTime}' já está em uso.` });
    }
    for (const membro of novaInscricaoData.membros) {
      if (emailsInscritos.has(membro.email)) return res.status(400).json({ error: `O e-mail '${membro.email}' já foi inscrito.` });
      if (cpfsInscritos.has(membro.cpf)) return res.status(400).json({ error: `O CPF '${membro.cpf}' já foi inscrito.` });
    }
  } else if (novaInscricaoData.tipo === 'individual') {
    if (emailsInscritos.has(novaInscricaoData.email)) return res.status(400).json({ error: `O e-mail '${novaInscricaoData.email}' já foi inscrito.` });
    if (cpfsInscritos.has(novaInscricaoData.cpf)) return res.status(400).json({ error: `O CPF '${novaInscricaoData.cpf}' já foi inscrito.` });
  }

  const novaInscricao = { id: Date.now(), ...novaInscricaoData };
  encontro.inscricoes.push(novaInscricao);
  console.log(`Nova inscrição no encontro ${encontro.id}:`, novaInscricao);
  res.status(201).json({ message: "Inscrição realizada com sucesso!", inscricao: novaInscricao });
};