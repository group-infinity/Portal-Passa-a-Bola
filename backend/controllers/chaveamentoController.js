import { sql } from "@vercel/postgres";

export const getChaveamento = async (req, res) => {
  const { id } = req.params;

  try {
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

    const { rows: inscricoes } = await sql`
      SELECT * FROM inscricoes WHERE encontro_id = ${id} ORDER BY id ASC
    `;

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

    const todosOsTimes = [...timesProntos, ...timesIndividuais];

    const chaveamento = [];
    for (let i = 0; i < todosOsTimes.length; i += 2) {
      if (todosOsTimes[i + 1]) {
        chaveamento.push({
          jogo: (i / 2) + 1,
          timeA: todosOsTimes[i],
          timeB: todosOsTimes[i + 1],
        });
      } else {
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

