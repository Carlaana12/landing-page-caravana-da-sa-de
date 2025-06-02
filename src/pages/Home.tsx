import React, { useEffect, useState } from 'react';
import AdCarousel from '@/components/AdCarousel';
import EventsPreview from '@/components/EventsPreview';
import DoctorSearch from '@/components/DoctorSearch';
import NewsSection from '@/components/NewsSection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import DoctorGrid from '@/components/DoctorGrid';
import PodcastSection from '@/components/PodcastSection';
import BlogSection from '@/components/BlogSection';
import FeatureHighlights from '@/components/FeatureHighlights';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import { supabase } from '@/lib/supabase';

const Home = () => {
  // Estados para cada bloco
  const [carousel, setCarousel] = useState<any[]>([]);
  const [blog, setBlog] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [ctas, setCtas] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [carouselRes, blogRes, podcastsRes, newsRes, doctorsRes, partnersRes, contactsRes, faqsRes, highlightsRes, ctasRes, eventsRes] = await Promise.all([
          supabase.from('admin_carousel').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_blog').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_podcast').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_news').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_doctor_profiles').select('*').order('name', { ascending: true }),
          supabase.from('admin_partners').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_contacts').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_faq').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_highlights').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_cta').select('*').order('ordem', { ascending: true }),
          supabase.from('admin_events').select('*').order('ordem', { ascending: true }),
        ]);
        setCarousel(carouselRes.data || []);
        setBlog(blogRes.data || []);
        setPodcasts(podcastsRes.data || []);
        setNews(newsRes.data || []);
        const formattedDoctors = (doctorsRes.data || []).map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          city: doc.city || '',
          location: doc.location || '',
          consultationType: doc.consultation_type || 'presencial',
          teleconsultation: doc.teleconsultation || false,
          exams: doc.exams || [],
          imageUrl: doc.image_url || '',
          rating: doc.rating ?? 0,
          reviewCount: doc.review_count ?? 0,
          address: doc.address || '',
          phone: doc.phone || '',
          email: doc.email || '',
          bio: doc.bio || '',
          availability: doc.availability || [],
          languages: doc.languages || [],
          insurance: doc.insurance || [],
          experience: doc.experience || '',
          education: doc.education || [],
          achievements: doc.achievements || [],
          slug: doc.slug || (doc.name ? doc.name.toLowerCase().replace(/\s+/g, '-') : ''),
        }));
        setDoctors(formattedDoctors);
        setPartners(partnersRes.data || []);
        setContacts(contactsRes.data || []);
        setFaqs(faqsRes.data || []);
        setHighlights(highlightsRes.data || []);
        setCtas(ctasRes.data || []);
        setEvents(eventsRes.data || []);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do site. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Carregando conteúdo...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <AdCarousel />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16 py-4 sm:py-8">
        <DoctorSearch />
        <FeatureHighlights />
        <DoctorGrid doctors={doctors} />
        <BlogSection />
        <PodcastSection />
        <EventsPreview />
        <NewsSection />
        <CTASection />
        <PartnersSection />
        <ContactSection />
        <FAQSection />
      </div>
    </div>
  );
};

export default Home;