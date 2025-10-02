import { sql } from "@vercel/postgres";

// Função para adicionar novos dados de saúde
export const addHealthData = async (req, res) => {
  const { userId, bpm, saturation } = req.body;

  if (!userId || bpm === undefined || saturation === undefined) {
    return res.status(400).json({ error: "userId, bpm e saturation são obrigatórios." });
  }

  try {
    await sql`
      INSERT INTO health_data (user_id, bpm, saturation)
      VALUES (${userId}, ${bpm}, ${saturation});
    `;
    res.status(201).json({ message: "Dados de saúde adicionados com sucesso." });
  } catch (error) {
    console.error("Erro ao inserir dados de saúde:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Função para obter o histórico de dados de saúde de um usuário
export const getHealthData = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await sql`
      SELECT bpm, saturation, timestamp
      FROM health_data
      WHERE user_id = ${userId}
      ORDER BY timestamp DESC
      LIMIT 20;
    `;
    // Invertemos para que o gráfico mostre do mais antigo para o mais recente
    res.status(200).json(rows.reverse());
  } catch (error) {
    console.error("Erro ao buscar dados de saúde:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
