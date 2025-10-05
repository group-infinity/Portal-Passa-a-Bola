import axios from "axios";
import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import qrcode from "qrcode";
import "dotenv/config";

// Crie uma instância do Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Função de envio de email com QR Code
const sendEmailWithQRCode = async (jogadora, encontroNome, qrCodeData) => {
  try {
    const qrCodePayload = JSON.stringify(qrCodeData);
    const qrCodeDataURL = await qrcode.toDataURL(qrCodePayload);
    const qrCodeBase64 = qrCodeDataURL.split("base64,")[1];

    await resend.emails.send({
      from: "Passa a Bola <nao-responda@passaabolateste.app>",
      to: jogadora.email,
      subject: `✅ Inscrição confirmada para o ${encontroNome}!`,
      html: `
        <h1>Olá, ${jogadora.nome}!</h1>
        <p>Sua inscrição para o encontro <strong>${encontroNome}</strong> foi confirmada com sucesso.</p>
        <p>Apresente este QR Code na entrada do evento para validar seu acesso. Ele é único e intransferível.</p>
        <p>Nos vemos em campo!</p>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeBase64,
        },
      ],
    });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
  }
};

// Função para validar CPF e data de nascimento com a API Hub do Desenvolvedor
const validarCPFDataNascimento = async (cpf, dataNascimento) => {
    const token = process.env.HUBDEV_KEY;

    // Se o token não estiver configurado, pula a validação para não bloquear o desenvolvimento.
    if (!token) {
        console.warn("Atenção: Token da Hub do Desenvolvedor (HUBDEV_KEY) não configurado. Pulando a validação de CPF no backend.");
        return { valido: true };
    }

    try {
        const cpfLimpo = cpf.replace(/[^\d]/g, '');
        const dataFormatadaParaApi = dataNascimento.replace(/\//g, '');

        const response = await axios.get(`https://ws.hubdodesenvolvedor.com.br/v2/cpf/`, {
            params: {
                cpf: cpfLimpo,
                data: dataFormatadaParaApi,
                token: token
            }
        });

        if (response.data.status === true && response.data.result) {
            const apiDataNascimento = response.data.result.data_nascimento;

            if (apiDataNascimento !== dataNascimento) {
                return { valido: false, erro: 'A data de nascimento não corresponde ao CPF informado.' };
            }

            // Verificação de idade (maior de 18 anos)
            const [dia, mes, ano] = dataNascimento.split('/').map(Number);
            const dataNasc = new Date(ano, mes - 1, dia);
            const hoje = new Date();
            let idade = hoje.getFullYear() - dataNasc.getFullYear();
            const m = hoje.getMonth() - dataNasc.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
                idade--;
            }

            if (idade < 18) {
                return { valido: false, erro: 'A participante deve ser maior de 18 anos.' };
            }

            return { valido: true, dados: response.data.result };
        } else {
            const erroApi = response.data.return || "Dados inválidos ou não encontrados.";
            return { valido: false, erro: erroApi };
        }
    } catch (error) {
        console.error("Erro ao validar CPF na API Hub do Desenvolvedor:", error.response?.data || error.message);
        const erroApi = error.response?.data?.return || "Não foi possível validar o CPF neste momento.";
        return { valido: false, erro: erroApi };
    }
};

// Obter todos os encontros
export const getAllEncontros = async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT
        e.id, e.nome, e."diaI", e."diaF", e."totalVagas", e."jogadorasPorTime", e."local",
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
          local: row.local,
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

// Obter encontro por ID
export const getEncontroById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: encontros } = await sql`SELECT id, nome, "diaI", "diaF", "totalVagas", "jogadorasPorTime", "local" FROM encontros WHERE id = ${id}`;

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

// Criar encontro
export const createEncontro = async (req, res) => {
  const { nome, diaI, diaF, totalVagas, jogadorasPorTime, local } = req.body;

  if (!nome || !diaI || !diaF || !totalVagas || !jogadorasPorTime || !local) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const { rows } = await sql`
      INSERT INTO encontros (nome, "diaI", "diaF", "totalVagas", "jogadorasPorTime", local)
      VALUES (${nome}, ${diaI}, ${diaF}, ${totalVagas}, ${jogadorasPorTime}, ${local})
      RETURNING *
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao criar encontro:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Substitua TODA a sua função createInscricao por esta:
export const createInscricao = async (req, res) => {
  try {
    const { id: encontro_id } = req.params;
    const dados = req.body;
    const tipo = dados.tipo;
    const files = req.files || [];

    // --- Lógica do Encontro e Vagas (Original) ---
    const { rows: encontros } = await sql`SELECT nome, "totalVagas", "jogadorasPorTime" FROM encontros WHERE id = ${encontro_id}`;
    if (encontros.length === 0) {
      return res.status(404).json({ error: "Encontro não encontrado." });
    }
    const { nome: encontroNome, totalVagas } = encontros[0];

    const { rows: inscricoesAnteriores } = await sql`SELECT tipo, membros FROM inscricoes WHERE encontro_id = ${encontro_id}`;
    let vagasOcupadas = 0;
    inscricoesAnteriores.forEach((insc) => {
      vagasOcupadas += insc.tipo === "individual" ? 1 : (insc.membros || []).length;
    });

    const vagasNecessarias = tipo === "individual" ? 1 : Array.isArray(dados.membros) ? dados.membros.length : 0;
    if (vagasOcupadas + vagasNecessarias > totalVagas) {
      return res.status(400).json({ error: "Inscrições esgotadas para este encontro!" });
    }

    // --- Validação de CPF e Data de Nascimento ---
    if (tipo === 'individual') {
        const { cpf, dataNascimento } = dados;
        const validacao = await validarCPFDataNascimento(cpf, dataNascimento);
        if (!validacao.valido) {
            return res.status(400).json({ error: `Para ${dados.nome}: ${validacao.erro}` });
        }
    } else if (tipo === 'conjunta' && Array.isArray(dados.membros)) {
        for (const membro of dados.membros) {
            const { cpf, dataNascimento } = membro;
            const validacao = await validarCPFDataNascimento(cpf, dataNascimento);
            if (!validacao.valido) {
                return res.status(400).json({ error: `Para ${membro.nome}: ${validacao.erro}` });
            }
        }
    }

    // --- Verificação de Emails Duplicados (Refatorada) ---
    let emailsParaVerificar = [];
    if (tipo === "individual") {
        if (dados.email) emailsParaVerificar.push(dados.email);
    } else if (tipo === "conjunta" && Array.isArray(dados.membros)) {
        const emailResponsavel = Array.isArray(dados.emailResponsavel) ? dados.emailResponsavel[0] : dados.emailResponsavel;
        if (emailResponsavel) emailsParaVerificar.push(emailResponsavel);
        dados.membros.forEach(membro => {
            if (membro && membro.email) emailsParaVerificar.push(membro.email);
        });
    }

    const emailsUnicos = [...new Set(emailsParaVerificar.filter(email => email && typeof email === 'string' && email.trim() !== ''))];
    if (emailsUnicos.length > 0) {
        const { rows: duplicatasIndividuais } = await sql`
            SELECT email FROM inscricoes
            WHERE encontro_id = ${encontro_id} AND tipo = 'individual' AND email = ANY(${emailsUnicos})
        `;
        if (duplicatasIndividuais.length > 0) {
            return res.status(400).json({ error: `O email '${duplicatasIndividuais[0].email}' já está inscrito neste encontro.` });
        }
        const { rows: duplicatasConjuntas } = await sql`
            SELECT value->>'email' as email FROM inscricoes, jsonb_array_elements(membros)
            WHERE encontro_id = ${encontro_id} AND tipo = 'conjunta' AND value->>'email' = ANY(${emailsUnicos})
        `;
        if (duplicatasConjuntas.length > 0) {
            return res.status(400).json({ error: `O email '${duplicatasConjuntas[0].email}' já está inscrito neste encontro.` });
        }
    }


    const uploadFile = async (file) => {
      if (!file) return null;
      const blob = await put(`${uuidv4()}-${file.originalname}`, file.buffer, {
        access: "public",
        contentType: file.mimetype,
      });
      return blob.url;
    }; // --- Inscrição Individual (Original, sem alterações) ---

    if (tipo === "individual") {
      const { nome, email, cpf, telefone, dataNascimento, posicaoPreferida } = dados;
      const fotoDocumentoFile = files.find((f) => f.fieldname === "fotoDocumento");
      const selfiePessoalFile = files.find((f) => f.fieldname === "selfiePessoal");
      const fotoDocumentoUrl = await uploadFile(fotoDocumentoFile);
      const selfiePessoalUrl = await uploadFile(selfiePessoalFile);
      const { rows } = await sql` INSERT INTO inscricoes (encontro_id, tipo, nome, email, cpf, telefone, "dataNascimento", "posicaoPreferida", "fotoDocumentoUrl", "selfiePessoalUrl") VALUES (${encontro_id}, ${tipo}, ${nome}, ${email}, ${cpf}, ${telefone}, ${dataNascimento}, ${posicaoPreferida}, ${fotoDocumentoUrl}, ${selfiePessoalUrl}) RETURNING id`;
      const inscricaoId = rows[0].id;
      const qrCodeData = { inscricaoId, encontroId: encontro_id, nome, email, cpf };
      await sendEmailWithQRCode({ nome, email }, encontroNome, qrCodeData);
    }
    // --- Inscrição Conjunta (BLOCO TOTALMENTE CORRIGIDO) ---
    else if (tipo === "conjunta") {
      // Passo 1: Juntar os dados de texto e os arquivos em um único array
      const membrosDeTexto = Array.isArray(dados.membros) ? dados.membros : [];
      const arquivosMap = new Map();
      files.forEach((file) => {
        const match = file.fieldname.match(/^membros\[(\d+)\]\[(\w+)\]$/);
        if (match) {
          const index = match[1];
          const field = match[2];
          arquivosMap.set(`${index}_${field}`, file);
        }
      });
      const membrosArray = membrosDeTexto.map((membro, index) => ({
        ...membro,
        fotoDocumento: arquivosMap.get(`${index}_fotoDocumento`),
        selfiePessoal: arquivosMap.get(`${index}_selfiePessoal`),
      }));

      // Passo 2: Fazer o upload e criar o objeto final para o banco de dados
      const membrosComUrl = await Promise.all(
        membrosArray.map(async (membro) => {
          const fotoDocumentoUrl = await uploadFile(membro.fotoDocumento);
          const selfiePessoalUrl = await uploadFile(membro.selfiePessoal);
          return {
            jogadoraId: uuidv4(),
            nome: membro.nome,
            email: membro.email,
            cpf: membro.cpf,
            telefone: membro.telefone,
            dataNascimento: membro.dataNascimento,
            posicaoPreferida: membro.posicaoPreferida,
            fotoDocumentoUrl: fotoDocumentoUrl,
            selfiePessoalUrl: selfiePessoalUrl,
          };
        })
      );

      // Passo 3: Inserir no banco de dados
      const membrosJSON = JSON.stringify(membrosComUrl);
      // Pega o primeiro item caso o body-parser tenha criado um array
      const nomeTime = Array.isArray(dados.nomeTime) ? dados.nomeTime[0] : dados.nomeTime;
      const responsavel = Array.isArray(dados.responsavel) ? dados.responsavel[0] : dados.responsavel;
      const emailResponsavel = Array.isArray(dados.emailResponsavel) ? dados.emailResponsavel[0] : dados.emailResponsavel;

      const { rows } = await sql`
            INSERT INTO inscricoes (encontro_id, tipo, "nomeTime", nome, email, membros)
            VALUES (${encontro_id}, ${tipo}, ${nomeTime}, ${responsavel}, ${emailResponsavel}, ${membrosJSON}::jsonb)
            RETURNING id`;
      const inscricaoTimeId = rows[0].id;

      // Passo 4: Enviar e-mails
      for (const membro of membrosComUrl) {
        const qrCodeData = {
          inscricaoId: inscricaoTimeId,
          jogadoraId: membro.jogadoraId,
          encontroId: encontro_id,
          nomeTime,
          nome: membro.nome,
          email: membro.email,
          cpf: membro.cpf,
        };
        await sendEmailWithQRCode(membro, encontroNome, qrCodeData);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    res.status(201).json({ message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    console.error(`Erro ao realizar inscrição:`, error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email já cadastrado para este encontro." });
    }
    if (error.code === "22P02") {
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

// NOVA FUNÇÃO PARA DELETAR PARTICIPANTE
export const deleteParticipante = async (req, res) => {
    const { encontroId, inscricaoId, jogadoraId } = req.body;

    if (!encontroId || !inscricaoId) {
      return res.status(400).json({ error: "ID do encontro e da inscrição são obrigatórios." });
    }

    try {
      const { rows: inscricoes } = await sql`SELECT tipo, membros FROM inscricoes WHERE id = ${inscricaoId} AND encontro_id = ${encontroId}`;

      if (inscricoes.length === 0) {
        return res.status(404).json({ error: "Inscrição não encontrada neste encontro." });
      }

      const inscricao = inscricoes[0];

      if (inscricao.tipo === 'individual') {
        // Se for individual, deleta a inscrição inteira
        await sql`DELETE FROM inscricoes WHERE id = ${inscricaoId}`;
        return res.status(200).json({ message: "Participante removido com sucesso." });
      }

      if (inscricao.tipo === 'conjunta') {
        if (!jogadoraId) {
            return res.status(400).json({ error: "ID da jogadora é obrigatório para remover de um time." });
        }
        // Se for de time, remove apenas o membro do array JSONB
        const membrosAtuais = inscricao.membros || [];
        const novosMembros = membrosAtuais.filter(m => m.jogadoraId !== jogadoraId);

        if (novosMembros.length === membrosAtuais.length) {
            return res.status(404).json({ error: "Jogadora não encontrada na inscrição." });
        }

        // Se o time ficar vazio após a remoção, deleta a inscrição inteira
        if (novosMembros.length === 0) {
            await sql`DELETE FROM inscricoes WHERE id = ${inscricaoId}`;
        } else {
            const novosMembrosJson = JSON.stringify(novosMembros);
            await sql`UPDATE inscricoes SET membros = ${novosMembrosJson}::jsonb WHERE id = ${inscricaoId}`;
        }

        return res.status(200).json({ message: "Participante removido com sucesso." });
      }

    } catch (error) {
      console.error("Erro ao deletar participante:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

