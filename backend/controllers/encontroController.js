import { sql } from "@vercel/postgres";

export const getAllEncontros = async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT
        e.id, e.nome, e."diaI", e."diaF", e."totalVagas", e."jogadorasPorTime",
        i.id as inscricao_id, i.tipo, i.membros
      FROM encontros e
      LEFT JOIN inscricoes i ON e.id = i.encontro_id
      ORDER BY e.id ASC;
    `;

    const encontrosMap = new Map();
    rows.forEach((row) => {
      if (!encontrosMap.has(row.id)) {
        encontrosMap.set(row.id, {
          id: row.id,
          nome: row.nome,
          diaI: row.diaI,
          diaF: row.diaF,
          totalVagas: row.totalVagas,
          jogadorasPorTime: row.jogadorasPorTime,
          inscricoes: [],
        });
      }

      if (row.inscricao_id) {
        encontrosMap.get(row.id).inscricoes.push({
          id: row.inscricao_id,
          tipo: row.tipo,
          membros: row.membros || [],
        });
      }
    });

    const encontros = Array.from(encontrosMap.values());

    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.json(encontros);
  } catch (error) {
    console.error("Erro ao buscar encontros:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getEncontroById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: encontros } = await sql`SELECT id, nome, "diaI", "diaF", "totalVagas", "jogadorasPorTime" FROM encontros WHERE id = ${id}`;

    if (encontros.length === 0) {
      return res.status(404).json({ error: "Encontro não encontrado." });
    }

    const encontro = encontros[0];
    const { rows: inscricoes } = await sql`SELECT * FROM inscricoes WHERE encontro_id = ${id}`;
    encontro.inscricoes = inscricoes;

    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.json(encontro);
  } catch (error) {
    console.error("Erro ao buscar encontro:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createEncontro = async (req, res) => {
  const { nome, diaI, diaF, totalVagas, jogadorasPorTime } = req.body;

  if (!nome || !diaI || !diaF || !totalVagas || !jogadorasPorTime) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const { rows } = await sql`
      INSERT INTO encontros (nome, "diaI", "diaF", "totalVagas", "jogadorasPorTime")
      VALUES (${nome}, ${diaI}, ${diaF}, ${totalVagas}, ${jogadorasPorTime})
      RETURNING *
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao criar encontro:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};


export const createInscricao = async (req, res) => {
  const { id: encontro_id } = req.params;
  const { tipo, ...dados } = req.body;

  try {
    const { rows: encontros } = await sql`SELECT "totalVagas", "jogadorasPorTime" FROM encontros WHERE id = ${encontro_id}`;
    if (encontros.length === 0) {
      return res.status(404).json({ error: "Encontro não encontrado." });
    }
    const { totalVagas, jogadorasPorTime } = encontros[0];

    const { rows: inscricoesAnteriores } = await sql`SELECT tipo, membros FROM inscricoes WHERE encontro_id = ${encontro_id}`;
    let vagasOcupadas = 0;
    inscricoesAnteriores.forEach((insc) => {
      vagasOcupadas += insc.tipo === "individual" ? 1 : insc.membros?.length || 0;
    });

    const vagasNecessarias = tipo === "individual" ? 1 : dados.membros.length;
    if (vagasOcupadas + vagasNecessarias > totalVagas) {
      return res.status(400).json({ error: "Inscrições esgotadas para este encontro!" });
    }

    let emailsParaVerificar = [];
    let cpfsParaVerificar = [];

    if (tipo === "individual") {
      emailsParaVerificar.push(dados.email);
      cpfsParaVerificar.push(dados.cpf);
    } else if (tipo === "conjunta") {
      const { rows: timeExistente } = await sql`SELECT id FROM inscricoes WHERE encontro_id = ${encontro_id} AND "nomeTime" ILIKE ${dados.nomeTime}`;
      if (timeExistente.length > 0) {
        return res.status(400).json({ error: `O nome de time '${dados.nomeTime}' já está em uso neste encontro.` });
      }
      emailsParaVerificar.push(dados.emailResponsavel);

      dados.membros.forEach((membro) => {
        emailsParaVerificar.push(membro.email);
        cpfsParaVerificar.push(membro.cpf);
      });
    }

    if (emailsParaVerificar.length > 0) {
      const { rows: duplicatas } = await sql`
                SELECT email, cpf FROM inscricoes
                WHERE encontro_id = ${encontro_id} AND (email = ANY(${emailsParaVerificar}) OR cpf = ANY(${cpfsParaVerificar}))
            `;

      if (duplicatas.length > 0) {
        const dup = duplicatas[0];
        const emailDuplicado = emailsParaVerificar.includes(dup.email);
        if (emailDuplicado) {
          return res.status(400).json({ error: `O email '${dup.email}' já está inscrito neste encontro.` });
        }
        return res.status(400).json({ error: `O CPF '${dup.cpf}' já está inscrito neste encontro.` });
      }
    }

    if (tipo === "individual") {
      const { nome, email, cpf, telefone, dataNascimento } = dados;
      await sql`
                INSERT INTO inscricoes (encontro_id, tipo, nome, email, cpf, telefone, "dataNascimento")
                VALUES (${encontro_id}, ${tipo}, ${nome}, ${email}, ${cpf}, ${telefone}, ${dataNascimento})
            `;
    } else if (tipo === "conjunta") {
      const { nomeTime, responsavel, emailResponsavel, membros } = dados;
      await sql`
                INSERT INTO inscricoes (encontro_id, tipo, "nomeTime", nome, email, membros)
                VALUES (${encontro_id}, ${tipo}, ${nomeTime}, ${responsavel}, ${emailResponsavel}, ${JSON.stringify(membros)})
            `;
    }

    res.status(201).json({ message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    console.error(`Erro ao realizar inscrição:`, error);
    res.status(500).json({ error: "Ocorreu um erro inesperado. Tente novamente." });
  }
};

export const deleteEncontro = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteResult = await sql`DELETE FROM encontros WHERE id = ${id}`;

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Encontro não encontrado para exclusão.' });
    }

    res.status(200).json({ message: 'Encontro e todas as suas inscrições foram deletados com sucesso!' });
  } catch (error) {
    console.error("Erro ao deletar encontro:", error);
    res.status(500).json({ error: 'Erro interno do servidor ao tentar deletar o encontro.' });
  }
};
