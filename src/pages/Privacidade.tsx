import React from 'react';

const Privacidade = () => {
  return (
    <div className="bg-gray-100">
       {/* Wrapper para o Header */}
      <div className="md:w-screen md:relative md:left-1/2 md:right-1/2 md:-ml-[50vw] md:mr-[50vw] md:max-w-none">
        <div className="bg-white py-12 px-4 border-b">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 text-center">Política de Privacidade</h1>
          </div>
        </div>
      </div>

      {/* Conteúdo restante DENTRO do container padrão */}
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        <p className="text-sm text-gray-500">Última atualização: 15 de Julho de 2024</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introdução</h2>
          <p className="text-gray-700 leading-relaxed">
            Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nosso site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Coleta de Dados</h2>
          <p className="text-gray-700 leading-relaxed">
            Coletamos informações que você nos fornece diretamente, como nome, e-mail e outras informações de contato quando você se registra ou entra em contato conosco.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Uso de Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Utilizamos cookies para melhorar sua experiência no site, analisar o tráfego e personalizar o conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Compartilhamento de Dados</h2>
          <p className="text-gray-700 leading-relaxed">
            Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Segurança</h2>
          <p className="text-gray-700 leading-relaxed">
            Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Seus Direitos</h2>
          <p className="text-gray-700 leading-relaxed">
            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos, entre em contato conosco através dos canais disponíveis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Contato</h2>
          <p className="text-gray-700 leading-relaxed">
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através do e-mail: contato@exemplo.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacidade; 