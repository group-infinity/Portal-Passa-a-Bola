import { sql } from "@vercel/postgres";

// A função de embaralhar foi removida para garantir confrontos fixos.

export const getChaveamento = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Buscar o encontro e suas configurações
    const { rows: encontros } = await sql`
      SELECT "totalVagas", "jogadorasPorTime"
      FROM encontros
      WHERE id = ${id}
    `;

    if (encontros.length === 0) {
      return res.status(404).json({ error: "Encontro não encontrado." });
    }
    const encontro = encontros[0];
    const jogadorasPorTime = encontro.jogadorasPorTime;

    // 2. Buscar todas as inscrições do encontro, ordenadas por ID para garantir consistência
    const { rows: inscricoes } = await sql`
      SELECT * FROM inscricoes WHERE encontro_id = ${id} ORDER BY id ASC
    `;

    // 3. Separar times prontos de jogadoras individuais
    const timesProntos = [];
    const jogadorasIndividuais = [];

    inscricoes.forEach(insc => {
      if (insc.tipo === 'conjunta') {
        timesProntos.push({
          nome: insc.nomeTime,
          membros: insc.membros
        });
      } else if (insc.tipo === 'individual') {
        jogadorasIndividuais.push(insc);
      }
    });

    // 4. Agrupar jogadoras individuais em novos times (sem embaralhar)
    const timesIndividuais = [];

    for (let i = 0; i < jogadorasIndividuais.length; i += jogadorasPorTime) {
      const timeSlice = jogadorasIndividuais.slice(i, i + jogadorasPorTime);
      if (timeSlice.length === jogadorasPorTime) {
        timesIndividuais.push({
          nome: `Time ${timesIndividuais.length + 1}`,
          membros: timeSlice
        });
      }
    }

    // 5. Juntar todos os times em uma ordem fixa (sem embaralhar)
    const todosOsTimes = [...timesProntos, ...timesIndividuais];

    // 6. Criar os confrontos (chaveamento)
    const chaveamento = [];
    for (let i = 0; i < todosOsTimes.length; i += 2) {
      if (todosOsTimes[i + 1]) {
        chaveamento.push({
          jogo: (i / 2) + 1,
          timeA: todosOsTimes[i],
          timeB: todosOsTimes[i + 1],
        });
      } else {
        // Se houver um número ímpar de times, o último time fica "de bye"
        chaveamento.push({
          jogo: (i / 2) + 1,
          timeA: todosOsTimes[i],
          timeB: { nome: "Aguardando adversário", membros: [] },
        });
      }
    }

    res.status(200).json({
        encontroId: id,
        totalTimes: todosOsTimes.length,
        chaveamento: chaveamento
    });

  } catch (error) {
    console.error("Erro ao gerar chaveamento:", error);
    res.status(500).json({ error: "Erro interno do servidor ao gerar chaveamento." });
  }
};

