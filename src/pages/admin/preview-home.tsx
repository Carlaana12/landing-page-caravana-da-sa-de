import React, { useState } from 'react';
import { Plus, Edit2, X, Save } from 'lucide-react';
import AdCarousel from '@/components/AdCarousel';
import FeatureHighlights from '@/components/FeatureHighlights';
import DoctorGrid from '@/components/DoctorGrid';
import BlogSection from '@/components/BlogSection';
import PodcastSection from '@/components/PodcastSection';
import EventsPreview from '@/components/EventsPreview';
import NewsSection from '@/components/NewsSection';
import CTASection from '@/components/CTASection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';
import { useAdminCarousel } from '@/hooks/useAdminCarousel';
import { useAdminHighlights } from '@/hooks/useAdminHighlights';
import { useAdminDoctors } from '@/hooks/useAdminDoctors';
import { useAdminBlog } from '@/hooks/useAdminBlog';
import { useAdminPodcast } from '@/hooks/useAdminPodcast';
import { useAdminEvents } from '@/hooks/useAdminEvents';
import { useAdminNews } from '@/hooks/useAdminNews';
import { useAdminCTA } from '@/hooks/useAdminCTA';
import { useAdminPartners } from '@/hooks/useAdminPartners';
import { useAdminContacts } from '@/hooks/useAdminContacts';
import { useAdminFAQ } from '@/hooks/useAdminFAQ';

// Importe os modais de edição já existentes ou crie versões simplificadas para cada seção
// Aqui, usaremos placeholders para os modais, mas você pode importar os reais

const buttonClass =
  'absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1 rounded-xl bg-[#3a7bd5] text-white font-semibold shadow hover:bg-[#00d2ff] transition-all duration-200';

const PreviewHomeAdmin: React.FC = () => {
  // Estados para controlar qual modal está aberto e qual item está sendo editado
  const [modal, setModal] = useState<null | string>(null);

  // Dados de cada seção
  const { slides } = useAdminCarousel();
  const { highlights } = useAdminHighlights();
  const { doctors } = useAdminDoctors();
  const { blogPosts } = useAdminBlog();
  const { podcasts } = useAdminPodcast();
  const { events } = useAdminEvents();
  const { news } = useAdminNews();
  const { ctas } = useAdminCTA();
  const { partners } = useAdminPartners();
  const { contacts } = useAdminContacts();
  const { faqs } = useAdminFAQ();

  // Funções para abrir modais de edição
  const openModal = (section: string) => setModal(section);
  const closeModal = () => setModal(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Carrossel */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('carousel')}><Edit2 className="w-4 h-4" />Editar Carrossel</button>
        <AdCarousel slides={slides} />
      </section>
      {/* Destaques */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('highlights')}><Edit2 className="w-4 h-4" />Editar Destaques</button>
        <FeatureHighlights highlights={highlights} />
      </section>
      {/* Grade de Médicos */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('doctors')}><Edit2 className="w-4 h-4" />Editar Médicos</button>
        <DoctorGrid doctors={doctors} />
      </section>
      {/* Blog */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('blog')}><Edit2 className="w-4 h-4" />Editar Blog</button>
        <BlogSection posts={blogPosts} />
      </section>
      {/* Podcast */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('podcast')}><Edit2 className="w-4 h-4" />Editar Podcast</button>
        <PodcastSection episodes={podcasts} />
      </section>
      {/* Eventos */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('events')}><Edit2 className="w-4 h-4" />Editar Eventos</button>
        <EventsPreview events={events} />
      </section>
      {/* Notícias */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('news')}><Edit2 className="w-4 h-4" />Editar Notícias</button>
        <NewsSection news={news} />
      </section>
      {/* CTA */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('cta')}><Edit2 className="w-4 h-4" />Editar CTA</button>
        <CTASection ctas={ctas} />
      </section>
      {/* Parceiros */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('partners')}><Edit2 className="w-4 h-4" />Editar Parceiros</button>
        <PartnersSection partners={partners} />
      </section>
      {/* Contato */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('contacts')}><Edit2 className="w-4 h-4" />Editar Contato</button>
        <ContactSection contacts={contacts} />
      </section>
      {/* FAQ */}
      <section className="relative">
        <button className={buttonClass} onClick={() => openModal('faq')}><Edit2 className="w-4 h-4" />Editar FAQ</button>
        <FAQSection faqs={faqs} />
      </section>

      {/* Modais de edição (placeholders, substitua pelos reais) */}
      {modal === 'carousel' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Carrossel</h2>
            {/* Aqui você pode importar e renderizar o modal real de edição do carrossel */}
            <div>Formulário de edição do carrossel...</div>
          </div>
        </div>
      )}
      {modal === 'highlights' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Destaques</h2>
            <div>Formulário de edição dos destaques...</div>
          </div>
        </div>
      )}
      {modal === 'doctors' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Médicos</h2>
            <div>Formulário de edição dos médicos...</div>
          </div>
        </div>
      )}
      {modal === 'blog' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Blog</h2>
            <div>Formulário de edição do blog...</div>
          </div>
        </div>
      )}
      {modal === 'podcast' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Podcast</h2>
            <div>Formulário de edição do podcast...</div>
          </div>
        </div>
      )}
      {modal === 'events' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Eventos</h2>
            <div>Formulário de edição dos eventos...</div>
          </div>
        </div>
      )}
      {modal === 'news' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Notícias</h2>
            <div>Formulário de edição das notícias...</div>
          </div>
        </div>
      )}
      {modal === 'cta' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar CTA</h2>
            <div>Formulário de edição do CTA...</div>
          </div>
        </div>
      )}
      {modal === 'partners' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Parceiros</h2>
            <div>Formulário de edição dos parceiros...</div>
          </div>
        </div>
      )}
      {modal === 'contacts' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar Contato</h2>
            <div>Formulário de edição do contato...</div>
          </div>
        </div>
      )}
      {modal === 'faq' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl relative">
            <button className="absolute top-2 right-2" onClick={closeModal}><X /></button>
            <h2 className="text-xl font-bold mb-4">Editar FAQ</h2>
            <div>Formulário de edição do FAQ...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewHomeAdmin; 