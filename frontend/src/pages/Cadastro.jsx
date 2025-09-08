import React, { useState } from "react";
import Input from "../components/cadastro/Input";
import Faixa from "../components/noticias/Faixa";
import Botao from "../components/cadastro/Botao";

const Cadastro = () => {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    alert(`Enviado`);
  };

  return (
    <main className="flex w-full flex-col items-center py-16 lg:py-30">
      <div className="w-full px-6 pt-6 lg:max-w-[45%]">
       <Faixa txt={'cadastre-se'}/>

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex w-full flex-col gap-12"
        >
          <div className="flex flex-col gap-5">
            <Input
              label="Digite seu nome completo"
              type="text"
              name="name"
              value={formData.text}
              onChange={handleChange}
              placeholder="ex. Maria Fernanda dos Santos"
              required
            />

            <Input
              label="Digite seu CPF"
              type="text"
              name="cpf"
              value={formData.text}
              onChange={handleChange}
              placeholder="ex. 12345678900"
              required
              inputMode="numeric"
              pattern="\d*"
              minLength="11"
              maxLength="11"
            />

            <Input
              label="Insira sua data de nascimento"
              type="date"
              date="DD/MM/YYYY"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />

            <Input
              label="Digite seu endereço de e-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              required
            />

            <Input
              label="Senha"
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Crie uma senha forte"
              required
              minLength="8"
            />

            <Input
              label="Confirme sua senha"
              type="password"
              name="senha_confirm"
              value={formData.senhaConfirm}
              onChange={handleChange}
              placeholder="Digite sua senha novamente"
              required
              minLength="8"
            />
          </div>

          <Botao txt={'cadastre-se'} />
        </form>
      </div>
    </main>
  );
};

export default Cadastro;
