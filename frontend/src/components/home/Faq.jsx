import React from 'react';
import AccordionItem from './ItemFaq';

const Faq = () => {
  const faqData = [
    {
      title: 'O que é o Passa a Bola?',
      content: 'O Passa a Bola é um projeto social gratuito e evoluiu para o maior canal de futebol feminino da América Latina, protagonizado por mulheres, com a missão de alavancar e melhorar o futebol feminino no Brasil.',
    },
    {
      title: 'Qual é a proposta principal da plataforma digital do Passa a Bola?',
      content: 'Desenvolver uma plataforma digital centralizada, segura e inclusiva para organizar e gerenciar campeonatos de futebol feminino amador, modernizando processos e aumentando a visibilidade das jogadoras.',
    },
    {
      title: 'Como a plataforma garante a segurança e privacidade dos dados das usuárias e contribui para a democratização do esporte?',
      content: 'Seguindo a LGPD com política de privacidade clara e validando dados para proteger as usuárias contra golpes e tráfico de pessoas, promovendo um ambiente seguro e profissional para democratizar o acesso ao futebol feminino.',
    },
    {
      title: 'Quem pode participar dos campeonatos e encontros do Passa a Bola? Há restrição de idade ou nível de jogo?',
      content: 'Para os campeonatos, somente mulheres maiores de 18 anos poderão se inscrever, com validação de idade mínima. Para os encontros mensais, a participação é aberta a qualquer mulher de qualquer idade interessada em jogar futebol, sendo um ambiente de interação social sem nível de exigência específico.',
    },
    {
      title: 'A participação nos eventos do Passa a Bola tem custo?',
      content: 'Tanto a Copa Passa a Bola quanto os encontros mensais são planejados para serem gratuitos, mantendo a essência original do projeto Passa a Bola de oferecer futebol sem custo.',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {faqData.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

export default Faq;