import React from 'react';
import AccordionItem from './ItemFaq';

const Faq = () => {
  const faqData = [
    {
      title: 'Como funciona o produto?',
      content: 'Nosso produto funciona conectando-se à sua plataforma existente através de uma API segura, processando os dados em tempo real para fornecer insights valiosos.',
    },
    {
      title: 'Qual é a política de devolução?',
      content: 'Oferecemos uma política de devolução de 30 dias sem perguntas. Se você não estiver satisfeito, pode solicitar um reembolso total dentro desse período.',
    },
    {
      title: 'Como posso entrar em contato com o suporte?',
      content: 'Você pode entrar em contato com nosso suporte 24/7 através do e-mail suporte@exemplo.com ou pelo chat ao vivo em nosso site.',
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