import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PUBLIC_URLS } from '../lib/constants';

const Footer = () => {
  return (
    <footer className="bg-verde-cia-escuro text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="float-animation">
            <h3 className="text-xl font-bold mb-4 shine-text">Sobre Nós</h3>
            <p className="text-green-100 mb-4">
              A revista digital Anuário de Saúde é uma plataforma diferenciada que oferece uma ampla variedade de conteúdos e informações essenciais sobre as diversas especialidades da área da saúde, além de apresentar serviços e preços acessíveis.
            </p>
            <div className="flex space-x-4">
              <SocialLink
                href="https://facebook.com/anuariodesaude"
                icon={Facebook}
              />
              <SocialLink
                href="https://twitter.com/anuariodesaude"
                icon={Twitter}
              />
              <SocialLink
                href="https://instagram.com/anuariodesaude"
                icon={Instagram}
              />
              <SocialLink
                href="https://youtube.com/anuariodesaude"
                icon={Youtube}
              />
            </div>
          </div>

          <div className="float-animation" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-4 shine-text">Links Rápidos</h3>
            <ul className="space-y-2">
              <FooterLink to={PUBLIC_URLS.HOME} text="Home" />
              <FooterLink to={PUBLIC_URLS.SPECIALTIES} text="Encontre Aqui" />
              <FooterLink
                to={PUBLIC_URLS.DISEASES}
                text="Doenças e Tratamentos"
              />
              <FooterLink to={PUBLIC_URLS.CONTACT} text="Fale Conosco" />
              <FooterLink to="/blog" text="Blog" />
            </ul>
          </div>

          <div className="float-animation" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold mb-4 shine-text">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center hover:translate-x-2 transition-transform">
                <Phone className="h-5 w-5 mr-2 text-green-300" />
                <span>(61) 3522-8610</span>
              </li>
              <li className="flex items-center hover:translate-x-2 transition-transform">
                <Phone className="h-5 w-5 mr-2 text-green-300" />
                <span>(61) 3522-8618</span>
              </li>
              <li className="flex items-center hover:translate-x-2 transition-transform">
                <Phone className="h-5 w-5 mr-2 text-green-300" />
                <span>WhatsApp: (61) 98192-6686</span>
              </li>
              <li className="flex items-center hover:translate-x-2 transition-transform">
                <Mail className="h-5 w-5 mr-2 text-green-300" />
                <span>anuariodesaude@gmail.com</span>
              </li>
              <li className="flex items-center hover:translate-x-2 transition-transform">
                <MapPin className="h-5 w-5 mr-2 text-green-300" />
                <span>SIBIS Núcleo Bandeirante-DF</span>
              </li>
            </ul>
          </div>

          <div className="float-animation" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-bold mb-4 shine-text">Newsletter</h3>
            <p className="text-green-100 mb-4">
              Receba novidades e atualizações sobre saúde.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full px-4 py-2 rounded-md bg-green-900 text-white placeholder-green-300 border border-green-800 focus:outline-none focus:border-green-700 transition-all hover:scale-105"
              />
              <button className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all hover:scale-105 hover:shadow-lg">
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-800 pt-8">
          <p className="text-center text-green-200">
            © {new Date().getFullYear()} Anuário de Saúde. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({
  href,
  icon: Icon,
}: {
  href: string;
  icon: React.ElementType;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center hover:bg-green-700 transition-all hover:scale-125"
  >
    <Icon className="h-4 w-4" />
  </a>
);

const FooterLink = ({ to, text }: { to: string; text: string }) => (
  <li>
    <Link
      to={to}
      className="hover:text-green-300 transition-all hover:translate-x-2 inline-block"
    >
      {text}
    </Link>
  </li>
);

export default Footer;