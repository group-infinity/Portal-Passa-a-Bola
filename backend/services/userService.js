const User = require("../models/user");

function validarEmail(email) {
  if (!email) {
    throw new Error("Email é obrigatório.");
  }

  if (!email.includes("@")) {
    throw new Error("Email deve conter '@'.");
  }

  return true;
}

function validarSenha(senha) {
  if (!senha) {
    throw new Error("Senha é obrigatória.");
  }

  if (senha.length < 8) {
    throw new Error("Senha deve ter pelo menos 8 caracteres.");
  }

  if (!/[A-Z]/.test(senha)) {
    throw new Error("Senha deve conter pelo menos uma letra maiúscula.");
  }

  if (!/[0-9]/.test(senha)) {
    throw new Error("Senha deve conter pelo menos um número.");
  }

  return true;
}

function cadastrarUsuario(nome, email, senha) {
  if (!nome) {
    throw new Error("Nome é obrigatório.");
  }

  validarEmail(email);
  validarSenha(senha);

  return new User(nome, email, senha);
}

module.exports = { cadastrarUsuario, validarEmail, validarSenha };

