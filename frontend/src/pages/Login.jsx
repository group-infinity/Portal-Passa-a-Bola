import React, { useState } from "react";
import Input from "../components/cadastro/Input";
import Botao from "../components/cadastro/Botao";
import Faixa from "../components/noticias/Faixa";

const Login = () => {
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
    <main className="flex w-full flex-col items-center mt-16 py-16 lg:py-30">
      <div className="w-full px-6 md:max-w-[60%] lg:max-w-[45%]">
        <Faixa txt={'login'} />

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex w-full flex-col gap-7"
        >
          <div className="flex flex-col gap-5">
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
          </div>

          <Botao txt={'entrar'}/>
        </form>

        <div className="mt-3 flex flex-col gap-2.5 text-[#981FBA] underline lg:text-xl">
          <p>
            <a href="#">Esqueceu a senha?</a>
          </p>
          <p>
            <a href="#">Nova por aqui? Cadastre-se!</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
