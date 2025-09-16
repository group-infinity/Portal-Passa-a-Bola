const { cadastrarUsuario } = require("../services/userService");

describe("Cadastro de Usuário - Regras Críticas", () => {
  test("✅ Deve cadastrar usuário válido", () => {
    const user = cadastrarUsuario("João", "joao@gmail.com", "Senha123");
    expect(user.nome).toBe("João");
    expect(user.email).toBe("joao@gmail.com");
    expect(user.senha).toBe("Senha123");
  });

  test("❌ Deve lançar erro se email não tiver '@'", () => {
    expect(() => cadastrarUsuario("Maria", "mariagmail.com", "Senha123"))
      .toThrow("Email deve conter '@'.");
  });

  test("❌ Deve lançar erro se senha tiver menos de 8 caracteres", () => {
    expect(() => cadastrarUsuario("Pedro", "pedro@gmail.com", "A1b"))
      .toThrow("Senha deve ter pelo menos 8 caracteres.");
  });

  test("❌ Deve lançar erro se senha não tiver letra maiúscula", () => {
    expect(() => cadastrarUsuario("Ana", "ana@gmail.com", "senha123"))
      .toThrow("Senha deve conter pelo menos uma letra maiúscula.");
  });

  test("❌ Deve lançar erro se senha não tiver número", () => {
    expect(() => cadastrarUsuario("Carlos", "carlos@gmail.com", "SenhaSemNumero"))
      .toThrow("Senha deve conter pelo menos um número.");
  });
});