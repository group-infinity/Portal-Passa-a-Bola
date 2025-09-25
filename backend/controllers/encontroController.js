import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { Resend } from 'resend';
import qrcode from 'qrcode';

// Crie uma instância do Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailWithQRCode = async (jogadora) => {
  try {
    // Gera o QR Code em formato base64
    const qrCodeDataURL = await qrcode.toDataURL(jogadora.email);
    const qrCodeBase64 = qrCodeDataURL.split("base64,")[1];

    await resend.emails.send({
      from: 'Passa a Bola <onboarding@resend.dev>', // Remetente de teste, não precisa mudar
      to: jogadora.email,
      subject: `✅ Sua inscrição para o encontro foi confirmada!`,
      html: `
        <h1>Olá, ${jogadora.nome}!</h1>
        <p>Sua inscrição foi confirmada com sucesso.</p>
        <p>Apresente este QR Code na entrada do evento.</p>
        <p>Nos vemos em campo!</p>
        <h2>(ignore o qr code)</h2>
      `,
      attachments: [{
        filename: 'qrcode.png',
        content: qrCodeBase64,
      }]
    });

    console.log(`E-mail de confirmação enviado para ${jogadora.email}`);

  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
};

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
  const dados = req.body;
  const tipo = dados.tipo;
  const files = req.files || [];

  try {
    const { rows: encontros } = await sql`SELECT "totalVagas", "jogadorasPorTime" FROM encontros WHERE id = ${encontro_id}`;
    if (encontros.length === 0) {
      return res.status(404).json({ error: "Encontro não encontrado." });
    }
    const { totalVagas } = encontros[0];

    const { rows: inscricoesAnteriores } = await sql`SELECT tipo, membros FROM inscricoes WHERE encontro_id = ${encontro_id}`;
    let vagasOcupadas = 0;
    inscricoesAnteriores.forEach((insc) => {
      vagasOcupadas += insc.tipo === "individual" ? 1 : (insc.membros || []).length;
    });

    // CORREÇÃO: Processamento correto dos membros
    let membrosInput = [];
    if (tipo === "conjunta") {
      if (typeof dados.membros === 'string') {
        try {
          membrosInput = JSON.parse(dados.membros || "[]");
        } catch (e) {
          console.error('Erro ao parsear membros:', e);
          membrosInput = [];
        }
      } else if (Array.isArray(dados.membros)) {
        membrosInput = dados.membros;
      } else if (dados.membros && typeof dados.membros === 'object') {
        membrosInput = [dados.membros];
      }
    }

    const vagasNecessarias = tipo === "individual" ? 1 : membrosInput.length;

    if (vagasOcupadas + vagasNecessarias > totalVagas) {
      return res.status(400).json({ error: "Inscrições esgotadas para este encontro!" });
    }

    // CORREÇÃO: Construção correta do array de emails
    let emailsParaVerificar = [];
    if (tipo === "individual") {
      if (dados.email) emailsParaVerificar.push(dados.email);
    } else if (tipo === "conjunta") {
      if (dados.emailResponsavel) emailsParaVerificar.push(dados.emailResponsavel);
      membrosInput.forEach((membro) => {
        if (membro && membro.email) emailsParaVerificar.push(membro.email);
      });
    }

    // CORREÇÃO: Filtrar valores nulos/vazios e garantir que é um array plano
    const emailsUnicos = [...new Set(emailsParaVerificar.filter(email =>
      email && typeof email === 'string' && email.trim() !== ''
    ))];

    console.log('Emails para verificar:', emailsUnicos); // Debug

    if (emailsUnicos.length > 0) {
      // CORREÇÃO: Usar a sintaxe correta para arrays no PostgreSQL
      const { rows: duplicatasEmail } = await sql`
        SELECT email FROM inscricoes
        WHERE encontro_id = ${encontro_id} AND email = ANY(${emailsUnicos})
        UNION
        SELECT value->>'email' as email FROM inscricoes, jsonb_array_elements(membros)
        WHERE encontro_id = ${encontro_id} AND value->>'email' = ANY(${emailsUnicos})
      `;

      if (duplicatasEmail.length > 0) {
        return res.status(400).json({ error: `O email '${duplicatasEmail[0].email}' já está inscrito neste encontro.` });
      }
    }

    const uploadFile = async (file) => {
      if (!file) return null;
      const blob = await put(`${uuidv4()}-${file.originalname}`, file.buffer, {
        access: "public",
        contentType: file.mimetype,
      });
      return blob.url;
    };

    if (tipo === "individual") {
      const { nome, email, cpf, telefone, dataNascimento, posicaoPreferida } = dados;
      const fotoDocumentoFile = files.find((f) => f.fieldname === "fotoDocumento");
      const selfiePessoalFile = files.find((f) => f.fieldname === "selfiePessoal");

      const fotoDocumentoUrl = await uploadFile(fotoDocumentoFile);
      const selfiePessoalUrl = await uploadFile(selfiePessoalFile);

      await sql`
          INSERT INTO inscricoes (encontro_id, tipo, nome, email, cpf, telefone, "dataNascimento", "posicaoPreferida", "fotoDocumentoUrl", "selfiePessoalUrl")
          VALUES (${encontro_id}, ${tipo}, ${nome}, ${email}, ${cpf}, ${telefone}, ${dataNascimento}, ${posicaoPreferida}, ${fotoDocumentoUrl}, ${selfiePessoalUrl})
      `;
      await sendEmailWithQRCode({ nome: dados.nome, email: dados.email });
    } else if (tipo === "conjunta") {
      const { nomeTime, responsavel, emailResponsavel } = dados;

      let membrosArray = [];

      if (Array.isArray(membrosInput) && membrosInput.length > 0) {
        membrosArray = membrosInput;
      } else {
        const membrosMap = new Map();

        Object.keys(dados).forEach((key) => {
          const match = key.match(/^membros\[(\d+)\]\[(\w+)\]$/);
          if (match) {
            const index = match[1];
            const field = match[2];
            if (!membrosMap.has(index)) membrosMap.set(index, {});
            membrosMap.get(index)[field] = dados[key];
          }
        });

        files.forEach((file) => {
          const match = file.fieldname.match(/^membros\[(\d+)\]\[(\w+)\]$/);
          if (match) {
            const index = match[1];
            const field = match[2];
            if (membrosMap.has(index)) {
              membrosMap.get(index)[field] = file;
            }
          }
        });

        membrosArray = Array.from(membrosMap.values());
      }

      const membrosComUrl = await Promise.all(
        membrosArray.map(async (membro) => {
          let fotoDocumentoUrl = membro.fotoDocumentoUrl;
          let selfiePessoalUrl = membro.selfiePessoalUrl;

          if (membro.fotoDocumento && membro.fotoDocumento.buffer) {
            fotoDocumentoUrl = await uploadFile(membro.fotoDocumento);
          }
          if (membro.selfiePessoal && membro.selfiePessoal.buffer) {
            selfiePessoalUrl = await uploadFile(membro.selfiePessoal);
          }

          return {
            nome: membro.nome,
            email: membro.email,
            cpf: membro.cpf,
            telefone: membro.telefone,
            dataNascimento: membro.dataNascimento,
            posicaoPreferida: membro.posicaoPreferida,
            fotoDocumentoUrl,
            selfiePessoalUrl,
          };
        })
      );

      // CORREÇÃO: Garantir que membrosComUrl seja um array válido
      const membrosJSON = JSON.stringify(membrosComUrl);

      await sql`
          INSERT INTO inscricoes (encontro_id, tipo, "nomeTime", nome, email, membros)
          VALUES (
            ${encontro_id},
            ${tipo},
            ${nomeTime},
            ${responsavel},
            ${emailResponsavel},
            ${membrosJSON}::jsonb
          )
      `;
      for (const membro of membrosComUrl) { // 'membrosComUrl' do seu código original
        await sendEmailWithQRCode({ nome: membro.nome, email: membro.email });
      }
    }

    res.status(201).json({ message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    console.error(`Erro ao realizar inscrição:`, error);

    // CORREÇÃO: Melhor tratamento de erro para PostgreSQL
    if (error.code === "23505") { // Unique violation
      return res.status(400).json({ error: "Email já cadastrado para este encontro." });
    }
    if (error.code === "22P02") { // Invalid text representation
      return res.status(400).json({ error: "Dados inválidos no formulário." });
    }

    res.status(500).json({ error: "Ocorreu um erro inesperado. Tente novamente." });
  }
};


export const deleteEncontro = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteResult = await sql`DELETE FROM encontros WHERE id = ${id}`;

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: "Encontro não encontrado para exclusão." });
    }

    res.status(200).json({ message: "Encontro e todas as suas inscrições foram deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar encontro:", error);
    res.status(500).json({ error: "Erro interno do servidor ao tentar deletar o encontro." });
  }
};
