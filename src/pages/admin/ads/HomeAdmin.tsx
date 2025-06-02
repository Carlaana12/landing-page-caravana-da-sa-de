import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Star } from 'lucide-react';
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
import AdCarouselAdmin from '@/components/AdCarouselAdmin';
import ReactDOM from 'react-dom';
import ImageUploader from '@/components/admin/ImageUploader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import VideoUploader from '@/components/admin/VideoUploader';
import DoctorCrudAdmin from '@/components/admin/DoctorCrudAdmin';

const buttonClass =
  'flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-[#3a7bd5]/20 text-[#3a7bd5] font-semibold shadow hover:bg-[#3a7bd5]/90 hover:text-white transition-all duration-200';

// Tipo do slide do carrossel admin
interface AdminCarouselSlide {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  link: string;
  ordem: number;
}

// Tipo do destaque admin
interface AdminHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  ordem: number;
  value?: string;
}

// Tipo do médico admin
interface AdminDoctor {
  id: string;
  name: string;
  image_url: string;
  specialty: string;
}

// Tipo do post do blog admin
interface AdminBlogPost {
  id: string;
  titulo: string;
  resumo: string;
  imagem_url: string;
  autor: string;
  data: string;
  link: string;
  ordem: number;
}

// Tipo do episódio de podcast admin
interface AdminPodcast {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  media_url: string; // novo campo para vídeo/áudio
  link: string;
  data: string;
  ordem: number;
}

// Tipo do evento admin
interface AdminEvent {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  data: string;
  local: string;
  link: string;
  ordem: number;
}

// Tipo da notícia admin
interface AdminNews {
  id: string;
  titulo: string;
  resumo: string;
  imagem_url: string;
  data: string;
  link: string;
  ordem: number;
}

// Tipo do CTA admin
interface AdminCTA {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  botao: string;
  link: string;
  ordem: number;
}

// Tipo do parceiro admin
interface AdminPartner {
  id: string;
  nome: string;
  descricao: string;
  imagem_url: string;
  link: string;
  ordem: number;
}

// Tipo do contato admin
interface AdminContact {
  id: string;
  titulo: string;
  descricao: string;
  telefone: string;
  email: string;
  endereco: string;
  mapa_url: string;
  ordem: number;
}

// Tipo do FAQ admin
interface AdminFAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
}

// Adicione no topo do arquivo, após os imports
function getYoutubeId(url: string) {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}

const HomeAdmin: React.FC = () => {
  // Estado do carrossel admin
  const [slides, setSlides] = useState<AdminCarouselSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminCarouselSlide | null>(null);
  const [form, setForm] = useState<Omit<AdminCarouselSlide, 'id'>>({
    titulo: '',
    descricao: '',
    imagem_url: '',
    link: '',
    ordem: 0,
  });

  // Estado dos destaques
  const [highlights, setHighlights] = useState<AdminHighlight[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [showHighlightForm, setShowHighlightForm] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<AdminHighlight | null>(null);
  const [highlightForm, setHighlightForm] = useState<Omit<AdminHighlight, 'id'>>({
    title: '',
    description: '',
    icon: 'Star',
    color: '#3a7bd5',
    ordem: 0,
    value: '',
  });

  // Estado dos médicos
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<AdminDoctor | null>(null);
  const [doctorForm, setDoctorForm] = useState<Omit<AdminDoctor, 'id'>>({
    name: '',
    image_url: '',
    specialty: '',
  });

  // Estado dos posts do blog
  const [blogPosts, setBlogPosts] = useState<AdminBlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Omit<AdminBlogPost, 'id'>>({
    titulo: '',
    resumo: '',
    imagem_url: '',
    autor: '',
    data: '',
    link: '',
    ordem: 0,
  });

  // Estado dos episódios do podcast
  const [podcasts, setPodcasts] = useState<AdminPodcast[]>([]);
  const [loadingPodcast, setLoadingPodcast] = useState(false);
  const [showPodcastForm, setShowPodcastForm] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<AdminPodcast | null>(null);
  const [podcastForm, setPodcastForm] = useState<Omit<AdminPodcast, 'id'>>({
    titulo: '',
    descricao: '',
    imagem_url: '',
    media_url: '',
    link: '',
    data: '',
    ordem: 0,
  });

  // Estado dos eventos
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [eventForm, setEventForm] = useState<Omit<AdminEvent, 'id'>>({
    titulo: '',
    descricao: '',
    imagem_url: '',
    data: '',
    local: '',
    link: '',
    ordem: 0,
  });

  // Estado das notícias
  const [news, setNews] = useState<AdminNews[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<AdminNews | null>(null);
  const [newsForm, setNewsForm] = useState<Omit<AdminNews, 'id'>>({
    titulo: '',
    resumo: '',
    imagem_url: '',
    data: '',
    link: '',
    ordem: 0,
  });

  // Estado das CTAs
  const [ctas, setCtas] = useState<AdminCTA[]>([]);
  const [loadingCta, setLoadingCta] = useState(false);
  const [showCtaForm, setShowCtaForm] = useState(false);
  const [editingCta, setEditingCta] = useState<AdminCTA | null>(null);
  const [ctaForm, setCtaForm] = useState<Omit<AdminCTA, 'id'>>({
    titulo: '',
    descricao: '',
    imagem_url: '',
    botao: '',
    link: '',
    ordem: 0,
  });

  // Estado dos parceiros
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<AdminPartner | null>(null);
  const [partnerForm, setPartnerForm] = useState<Omit<AdminPartner, 'id'>>({
    nome: '',
    descricao: '',
    imagem_url: '',
    link: '',
    ordem: 0,
  });

  // Estado dos contatos
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<AdminContact | null>(null);
  const [contactForm, setContactForm] = useState<Omit<AdminContact, 'id'>>({
    titulo: '',
    descricao: '',
    telefone: '',
    email: '',
    endereco: '',
    mapa_url: '',
    ordem: 0,
  });

  // Estado das FAQs
  const [faqs, setFaqs] = useState<AdminFAQ[]>([]);
  const [loadingFaq, setLoadingFaq] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFAQ | null>(null);
  const [faqForm, setFaqForm] = useState<Omit<AdminFAQ, 'id'>>({
    pergunta: '',
    resposta: '',
    ordem: 0,
  });

  // Buscar slides do Supabase
  useEffect(() => {
    fetchSlides();
  }, []);

  // Buscar destaques do Supabase
  useEffect(() => {
    fetchHighlights();
  }, []);

  // Buscar médicos do Supabase (doctor_profiles)
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Buscar posts do blog do Supabase
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Buscar episódios do podcast do Supabase
  useEffect(() => {
    fetchPodcasts();
  }, []);

  // Buscar eventos do Supabase
  useEffect(() => {
    fetchEvents();
  }, []);

  // Buscar notícias do Supabase
  useEffect(() => {
    fetchNews();
  }, []);

  // Buscar parceiros do Supabase
  useEffect(() => {
    fetchPartners();
  }, []);

  // Buscar contatos do Supabase
  useEffect(() => {
    fetchContacts();
  }, []);

  // Buscar FAQs do Supabase
  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchSlides() {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_carousel')
      .select('*')
      .order('ordem', { ascending: true });
    console.log('Slides buscados:', data, 'Erro:', error);
    if (!error && data) setSlides(data);
    setLoading(false);
  }

  async function fetchHighlights() {
    setLoadingHighlights(true);
    const { data, error } = await supabase
      .from('admin_highlights')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setHighlights(data);
    setLoadingHighlights(false);
  }

  async function fetchDoctors() {
    setLoadingDoctors(true);
    const { data, error } = await supabase
      .from('admin_doctor_profiles')
      .select('id, name, image_url, specialty')
      .order('name', { ascending: true });
    if (!error && data) setDoctors(data);
    setLoadingDoctors(false);
  }

  async function fetchBlogPosts() {
    setLoadingBlog(true);
    const { data, error } = await supabase
      .from('admin_blog')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setBlogPosts(data);
    setLoadingBlog(false);
  }

  async function fetchPodcasts() {
    setLoadingPodcast(true);
    const { data, error } = await supabase
      .from('admin_podcast')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setPodcasts(data);
    setLoadingPodcast(false);
  }

  async function fetchEvents() {
    setLoadingEvents(true);
    const { data, error } = await supabase
      .from('admin_events')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setEvents(data);
    setLoadingEvents(false);
  }

  async function fetchNews() {
    setLoadingNews(true);
    const { data, error } = await supabase
      .from('admin_news')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setNews(data);
    setLoadingNews(false);
  }

  async function fetchPartners() {
    setLoadingPartners(true);
    const { data, error } = await supabase
      .from('admin_partners')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setPartners(data);
    setLoadingPartners(false);
  }

  async function fetchContacts() {
    setLoadingContacts(true);
    const { data, error } = await supabase
      .from('admin_contacts')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setContacts(data);
    setLoadingContacts(false);
  }

  async function fetchFaqs() {
    setLoadingFaq(true);
    const { data, error } = await supabase
      .from('admin_faq')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setFaqs(data);
    setLoadingFaq(false);
  }

  function openAddForm() {
    setEditing(null);
    setForm({ titulo: '', descricao: '', imagem_url: '', link: '', ordem: slides.length });
    setShowForm(true);
    console.log('Abrindo modal para adicionar slide');
  }

  function openEditForm(slide: AdminCarouselSlide) {
    console.log('Editando slide:', slide);
    setEditing(slide);
    setForm({
      titulo: slide.titulo,
      descricao: slide.descricao,
      imagem_url: slide.imagem_url,
      link: slide.link,
      ordem: slide.ordem,
    });
    setShowForm(true);
    console.log('Abrindo modal para editar slide');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      // Editar
      await supabase
        .from('admin_carousel')
        .update({
          titulo: form.titulo,
          descricao: form.descricao,
          imagem_url: form.imagem_url,
          link: form.link,
          ordem: form.ordem
        })
        .eq('id', editing.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_carousel')
        .insert([{ ...form }]);
    }
    setShowForm(false);
    setEditing(null);
    fetchSlides();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este slide?')) return;
    setLoading(true);
    await supabase.from('admin_carousel').delete().eq('id', id);
    fetchSlides();
    setLoading(false);
  }

  // Função para mover slides
  function moveSlide(idx: number, direction: number) {
    if (idx < 0 || idx >= slides.length) return;
    const newSlides = [...slides];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    // Troca as ordens
    const temp = newSlides[idx].ordem;
    newSlides[idx].ordem = newSlides[targetIdx].ordem;
    newSlides[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_carousel').update({ ordem: newSlides[idx].ordem }).eq('id', newSlides[idx].id),
      supabase.from('admin_carousel').update({ ordem: newSlides[targetIdx].ordem }).eq('id', newSlides[targetIdx].id)
    ]).then(() => fetchSlides());
  }

  function openAddHighlightForm() {
    setEditingHighlight(null);
    setHighlightForm({ title: '', description: '', icon: 'Star', color: '#3a7bd5', ordem: highlights.length, value: '' });
    setShowHighlightForm(true);
  }

  function openEditHighlightForm(highlight: AdminHighlight) {
    setEditingHighlight(highlight);
    setHighlightForm({
      title: highlight.title,
      description: highlight.description,
      icon: highlight.icon,
      color: highlight.color,
      ordem: highlight.ordem,
      value: highlight.value || '',
    });
    setShowHighlightForm(true);
  }

  async function handleSaveHighlight(e: React.FormEvent) {
    e.preventDefault();
    setLoadingHighlights(true);
    if (editingHighlight) {
      // Editar
      await supabase
        .from('admin_highlights')
        .update({
          title: highlightForm.title,
          description: highlightForm.description,
          icon: highlightForm.icon,
          color: highlightForm.color,
          ordem: highlightForm.ordem,
          value: highlightForm.value,
        })
        .eq('id', editingHighlight.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_highlights')
        .insert([{ ...highlightForm }]);
    }
    setShowHighlightForm(false);
    setEditingHighlight(null);
    fetchHighlights();
    setLoadingHighlights(false);
  }

  async function handleDeleteHighlight(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este destaque?')) return;
    setLoadingHighlights(true);
    await supabase.from('admin_highlights').delete().eq('id', id);
    fetchHighlights();
    setLoadingHighlights(false);
  }

  function moveHighlight(idx: number, direction: number) {
    if (idx < 0 || idx >= highlights.length) return;
    const newHighlights = [...highlights];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= highlights.length) return;
    // Troca as ordens
    const temp = newHighlights[idx].ordem;
    newHighlights[idx].ordem = newHighlights[targetIdx].ordem;
    newHighlights[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_highlights').update({ ordem: newHighlights[idx].ordem }).eq('id', newHighlights[idx].id),
      supabase.from('admin_highlights').update({ ordem: newHighlights[targetIdx].ordem }).eq('id', newHighlights[targetIdx].id)
    ]).then(() => fetchHighlights());
  }

  function openAddDoctorForm() {
    setEditingDoctor(null);
    setDoctorForm({ name: '', image_url: '', specialty: '' });
    setShowDoctorForm(true);
  }

  function openEditDoctorForm(doctor: AdminDoctor) {
    setEditingDoctor(doctor);
    setDoctorForm({
      name: doctor.name,
      image_url: doctor.image_url,
      specialty: doctor.specialty,
    });
    setShowDoctorForm(true);
  }

  async function handleSaveDoctor(e: React.FormEvent) {
    e.preventDefault();
    setLoadingDoctors(true);
    if (editingDoctor) {
      // Editar
      await supabase
        .from('admin_doctor_profiles')
        .update({
          name: doctorForm.name,
          image_url: doctorForm.image_url,
          specialty: doctorForm.specialty,
        })
        .eq('id', editingDoctor.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_doctor_profiles')
        .insert([{ ...doctorForm }]);
    }
    setShowDoctorForm(false);
    setEditingDoctor(null);
    fetchDoctors();
    setLoadingDoctors(false);
  }

  async function handleDeleteDoctor(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este médico?')) return;
    setLoadingDoctors(true);
    await supabase.from('admin_doctor_profiles').delete().eq('id', id);
    fetchDoctors();
    setLoadingDoctors(false);
  }

  function moveDoctor(idx: number, direction: number) {
    // Função removida pois 'ordem' não existe em AdminDoctor
    return;
  }

  function openAddBlogForm() {
    setEditingBlog(null);
    setBlogForm({ titulo: '', resumo: '', imagem_url: '', autor: '', data: '', link: '', ordem: blogPosts.length });
    setShowBlogForm(true);
  }

  function openEditBlogForm(post: AdminBlogPost) {
    setEditingBlog(post);
    setBlogForm({
      titulo: post.titulo,
      resumo: post.resumo,
      imagem_url: post.imagem_url,
      autor: post.autor,
      data: post.data,
      link: post.link,
      ordem: post.ordem,
    });
    setShowBlogForm(true);
  }

  async function handleSaveBlog(e: React.FormEvent) {
    e.preventDefault();
    setLoadingBlog(true);
    if (editingBlog) {
      // Editar
      await supabase
        .from('admin_blog')
        .update({
          titulo: blogForm.titulo,
          resumo: blogForm.resumo,
          imagem_url: blogForm.imagem_url,
          autor: blogForm.autor,
          data: blogForm.data,
          link: blogForm.link,
          ordem: blogForm.ordem,
        })
        .eq('id', editingBlog.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_blog')
        .insert([{ ...blogForm }]);
    }
    setShowBlogForm(false);
    setEditingBlog(null);
    fetchBlogPosts();
    setLoadingBlog(false);
  }

  async function handleDeleteBlog(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    setLoadingBlog(true);
    await supabase.from('admin_blog').delete().eq('id', id);
    fetchBlogPosts();
    setLoadingBlog(false);
  }

  function moveBlog(idx: number, direction: number) {
    if (idx < 0 || idx >= blogPosts.length) return;
    const newBlog = [...blogPosts];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= blogPosts.length) return;
    // Troca as ordens
    const temp = newBlog[idx].ordem;
    newBlog[idx].ordem = newBlog[targetIdx].ordem;
    newBlog[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_blog').update({ ordem: newBlog[idx].ordem }).eq('id', newBlog[idx].id),
      supabase.from('admin_blog').update({ ordem: newBlog[targetIdx].ordem }).eq('id', newBlog[targetIdx].id)
    ]).then(() => fetchBlogPosts());
  }

  function openAddPodcastForm() {
    setEditingPodcast(null);
    setPodcastForm({ titulo: '', descricao: '', imagem_url: '', media_url: '', link: '', data: '', ordem: podcasts.length });
    setShowPodcastForm(true);
  }

  function openEditPodcastForm(podcast: AdminPodcast) {
    setEditingPodcast(podcast);
    setPodcastForm({
      titulo: podcast.titulo,
      descricao: podcast.descricao,
      imagem_url: podcast.imagem_url,
      media_url: podcast.media_url,
      link: podcast.link,
      data: podcast.data,
      ordem: podcast.ordem,
    });
    setShowPodcastForm(true);
  }

  async function handleSavePodcast(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPodcast(true);
    let imagem_url = podcastForm.imagem_url;
    const videoId = getYoutubeId(podcastForm.media_url);
    // Se não houver imagem e for YouTube, usa a thumbnail oficial
    if ((!imagem_url || !imagem_url.startsWith('http')) && videoId) {
      imagem_url = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (editingPodcast) {
      // Editar
      await supabase
        .from('admin_podcast')
        .update({
          titulo: podcastForm.titulo,
          descricao: podcastForm.descricao,
          imagem_url: imagem_url,
          media_url: podcastForm.media_url,
          link: podcastForm.link,
          data: podcastForm.data,
          ordem: podcastForm.ordem,
        })
        .eq('id', editingPodcast.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_podcast')
        .insert([{ ...podcastForm, imagem_url }]);
    }
    setShowPodcastForm(false);
    setEditingPodcast(null);
    fetchPodcasts();
    setLoadingPodcast(false);
  }

  async function handleDeletePodcast(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este episódio?')) return;
    setLoadingPodcast(true);
    await supabase.from('admin_podcast').delete().eq('id', id);
    fetchPodcasts();
    setLoadingPodcast(false);
  }

  function movePodcast(idx: number, direction: number) {
    if (idx < 0 || idx >= podcasts.length) return;
    const newPodcasts = [...podcasts];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= podcasts.length) return;
    // Troca as ordens
    const temp = newPodcasts[idx].ordem;
    newPodcasts[idx].ordem = newPodcasts[targetIdx].ordem;
    newPodcasts[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_podcast').update({ ordem: newPodcasts[idx].ordem }).eq('id', newPodcasts[idx].id),
      supabase.from('admin_podcast').update({ ordem: newPodcasts[targetIdx].ordem }).eq('id', newPodcasts[targetIdx].id)
    ]).then(() => fetchPodcasts());
  }

  function openAddEventForm() {
    setEditingEvent(null);
    setEventForm({ titulo: '', descricao: '', imagem_url: '', data: '', local: '', link: '', ordem: events.length });
    setShowEventForm(true);
  }

  function openEditEventForm(event: AdminEvent) {
    setEditingEvent(event);
    setEventForm({
      titulo: event.titulo,
      descricao: event.descricao,
      imagem_url: event.imagem_url,
      data: event.data,
      local: event.local,
      link: event.link,
      ordem: event.ordem,
    });
    setShowEventForm(true);
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEvents(true);
    if (editingEvent) {
      // Editar
      await supabase
        .from('admin_events')
        .update({
          titulo: eventForm.titulo,
          descricao: eventForm.descricao,
          imagem_url: eventForm.imagem_url,
          data: eventForm.data,
          local: eventForm.local,
          link: eventForm.link,
          ordem: eventForm.ordem,
        })
        .eq('id', editingEvent.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_events')
        .insert([{ ...eventForm }]);
    }
    setShowEventForm(false);
    setEditingEvent(null);
    fetchEvents();
    setLoadingEvents(false);
  }

  async function handleDeleteEvent(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;
    setLoadingEvents(true);
    await supabase.from('admin_events').delete().eq('id', id);
    fetchEvents();
    setLoadingEvents(false);
  }

  function moveEvent(idx: number, direction: number) {
    if (idx < 0 || idx >= events.length) return;
    const newEvents = [...events];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= events.length) return;
    // Troca as ordens
    const temp = newEvents[idx].ordem;
    newEvents[idx].ordem = newEvents[targetIdx].ordem;
    newEvents[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_events').update({ ordem: newEvents[idx].ordem }).eq('id', newEvents[idx].id),
      supabase.from('admin_events').update({ ordem: newEvents[targetIdx].ordem }).eq('id', newEvents[targetIdx].id)
    ]).then(() => fetchEvents());
  }

  function openAddNewsForm() {
    setEditingNews(null);
    setNewsForm({ titulo: '', resumo: '', imagem_url: '', data: '', link: '', ordem: news.length });
    setShowNewsForm(true);
  }

  function openEditNewsForm(noticia: AdminNews) {
    setEditingNews(noticia);
    setNewsForm({
      titulo: noticia.titulo,
      resumo: noticia.resumo,
      imagem_url: noticia.imagem_url,
      data: noticia.data,
      link: noticia.link,
      ordem: noticia.ordem,
    });
    setShowNewsForm(true);
  }

  async function handleSaveNews(e: React.FormEvent) {
    e.preventDefault();
    setLoadingNews(true);
    if (editingNews) {
      // Editar
      await supabase
        .from('admin_news')
        .update({
          titulo: newsForm.titulo,
          resumo: newsForm.resumo,
          imagem_url: newsForm.imagem_url,
          data: newsForm.data,
          link: newsForm.link,
          ordem: newsForm.ordem,
        })
        .eq('id', editingNews.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_news')
        .insert([{ ...newsForm }]);
    }
    setShowNewsForm(false);
    setEditingNews(null);
    fetchNews();
    setLoadingNews(false);
  }

  async function handleDeleteNews(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta notícia?')) return;
    setLoadingNews(true);
    await supabase.from('admin_news').delete().eq('id', id);
    fetchNews();
    setLoadingNews(false);
  }

  function moveNews(idx: number, direction: number) {
    if (idx < 0 || idx >= news.length) return;
    const newNews = [...news];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= news.length) return;
    // Troca as ordens
    const temp = newNews[idx].ordem;
    newNews[idx].ordem = newNews[targetIdx].ordem;
    newNews[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_news').update({ ordem: newNews[idx].ordem }).eq('id', newNews[idx].id),
      supabase.from('admin_news').update({ ordem: newNews[targetIdx].ordem }).eq('id', newNews[targetIdx].id)
    ]).then(() => fetchNews());
  }

  function openAddPartnerForm() {
    setEditingPartner(null);
    setPartnerForm({ nome: '', descricao: '', imagem_url: '', link: '', ordem: partners.length });
    setShowPartnerForm(true);
  }

  function openEditPartnerForm(partner: AdminPartner) {
    setEditingPartner(partner);
    setPartnerForm({
      nome: partner.nome,
      descricao: partner.descricao,
      imagem_url: partner.imagem_url,
      link: partner.link,
      ordem: partner.ordem,
    });
    setShowPartnerForm(true);
  }

  async function handleSavePartner(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPartners(true);
    if (editingPartner) {
      // Editar
      await supabase
        .from('admin_partners')
        .update({
          nome: partnerForm.nome,
          descricao: partnerForm.descricao,
          imagem_url: partnerForm.imagem_url,
          link: partnerForm.link,
          ordem: partnerForm.ordem,
        })
        .eq('id', editingPartner.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_partners')
        .insert([{ ...partnerForm }]);
    }
    setShowPartnerForm(false);
    setEditingPartner(null);
    fetchPartners();
    setLoadingPartners(false);
  }

  async function handleDeletePartner(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este parceiro?')) return;
    setLoadingPartners(true);
    await supabase.from('admin_partners').delete().eq('id', id);
    fetchPartners();
    setLoadingPartners(false);
  }

  function movePartner(idx: number, direction: number) {
    if (idx < 0 || idx >= partners.length) return;
    const newPartners = [...partners];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= partners.length) return;
    // Troca as ordens
    const temp = newPartners[idx].ordem;
    newPartners[idx].ordem = newPartners[targetIdx].ordem;
    newPartners[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_partners').update({ ordem: newPartners[idx].ordem }).eq('id', newPartners[idx].id),
      supabase.from('admin_partners').update({ ordem: newPartners[targetIdx].ordem }).eq('id', newPartners[targetIdx].id)
    ]).then(() => fetchPartners());
  }

  function openAddContactForm() {
    setEditingContact(null);
    setContactForm({ titulo: '', descricao: '', telefone: '', email: '', endereco: '', mapa_url: '', ordem: contacts.length });
    setShowContactForm(true);
  }

  function openEditContactForm(contact: AdminContact) {
    setEditingContact(contact);
    setContactForm({
      titulo: contact.titulo,
      descricao: contact.descricao,
      telefone: contact.telefone,
      email: contact.email,
      endereco: contact.endereco,
      mapa_url: contact.mapa_url,
      ordem: contact.ordem,
    });
    setShowContactForm(true);
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setLoadingContacts(true);
    if (editingContact) {
      // Editar
      await supabase
        .from('admin_contacts')
        .update({
          titulo: contactForm.titulo,
          descricao: contactForm.descricao,
          telefone: contactForm.telefone,
          email: contactForm.email,
          endereco: contactForm.endereco,
          mapa_url: contactForm.mapa_url,
          ordem: contactForm.ordem,
        })
        .eq('id', editingContact.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_contacts')
        .insert([{ ...contactForm }]);
    }
    setShowContactForm(false);
    setEditingContact(null);
    fetchContacts();
    setLoadingContacts(false);
  }

  async function handleDeleteContact(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) return;
    setLoadingContacts(true);
    await supabase.from('admin_contacts').delete().eq('id', id);
    fetchContacts();
    setLoadingContacts(false);
  }

  function moveContact(idx: number, direction: number) {
    if (idx < 0 || idx >= contacts.length) return;
    const newContacts = [...contacts];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= contacts.length) return;
    // Troca as ordens
    const temp = newContacts[idx].ordem;
    newContacts[idx].ordem = newContacts[targetIdx].ordem;
    newContacts[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_contacts').update({ ordem: newContacts[idx].ordem }).eq('id', newContacts[idx].id),
      supabase.from('admin_contacts').update({ ordem: newContacts[targetIdx].ordem }).eq('id', newContacts[targetIdx].id)
    ]).then(() => fetchContacts());
  }

  function openAddFaqForm() {
    setEditingFaq(null);
    setFaqForm({ pergunta: '', resposta: '', ordem: faqs.length });
    setShowFaqForm(true);
  }

  function openEditFaqForm(faq: AdminFAQ) {
    setEditingFaq(faq);
    setFaqForm({
      pergunta: faq.pergunta,
      resposta: faq.resposta,
      ordem: faq.ordem,
    });
    setShowFaqForm(true);
  }

  async function handleSaveFaq(e: React.FormEvent) {
    e.preventDefault();
    setLoadingFaq(true);
    if (editingFaq) {
      // Editar
      await supabase
        .from('admin_faq')
        .update({
          pergunta: faqForm.pergunta,
          resposta: faqForm.resposta,
          ordem: faqForm.ordem,
        })
        .eq('id', editingFaq.id);
    } else {
      // Adicionar
      await supabase
        .from('admin_faq')
        .insert([{ ...faqForm }]);
    }
    setShowFaqForm(false);
    setEditingFaq(null);
    fetchFaqs();
    setLoadingFaq(false);
  }

  async function handleDeleteFaq(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta FAQ?')) return;
    setLoadingFaq(true);
    await supabase.from('admin_faq').delete().eq('id', id);
    fetchFaqs();
    setLoadingFaq(false);
  }

  function moveFaq(idx: number, direction: number) {
    if (idx < 0 || idx >= faqs.length) return;
    const newFaqs = [...faqs];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= faqs.length) return;
    // Troca as ordens
    const temp = newFaqs[idx].ordem;
    newFaqs[idx].ordem = newFaqs[targetIdx].ordem;
    newFaqs[targetIdx].ordem = temp;
    // Atualiza no Supabase
    Promise.all([
      supabase.from('admin_faq').update({ ordem: newFaqs[idx].ordem }).eq('id', newFaqs[idx].id),
      supabase.from('admin_faq').update({ ordem: newFaqs[targetIdx].ordem }).eq('id', newFaqs[targetIdx].id)
    ]).then(() => fetchFaqs());
  }

  return (
    <div className="min-h-screen space-y-10">
      {/* Carrossel Admin */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Carrossel</h3>
          <div className="flex gap-2">
            <button className={buttonClass} onClick={openAddForm}><Plus className="w-4 h-4" />Adicionar Slide</button>
          </div>
        </div>
        {/* Carrossel visual idêntico ao público */}
        <div className="mb-8">
          <AdCarouselAdmin slides={slides} />
        </div>
        <hr className="my-8 border-t-2 border-[#3a7bd5]/20" />
        <h4 className="text-xl font-bold mb-4 text-[#3a7bd5]">Ferramentas Administrativas</h4>
        {/* Lista de slides e ferramentas administrativas */}
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, idx) => (
              <div key={slide.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <img src={slide.imagem_url} alt={slide.titulo} className="w-full h-40 object-cover rounded-lg mb-2 border border-[#3a7bd5]/10" />
                <div className="font-bold text-lg text-[#3a7bd5]">{slide.titulo}</div>
                <div className="text-gray-600 text-sm mb-2">{slide.descricao}</div>
                {slide.link && <a href={slide.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver link</a>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => { console.log('Clicou em editar', slide); openEditForm(slide); }}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => { console.log('Clicou em excluir', slide.id); handleDelete(slide.id); }}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => moveSlide(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === slides.length - 1} onClick={() => moveSlide(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Modal/Formulário de adicionar/editar */}
        {showForm && (
          <div style={{zIndex: 9999, position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="absolute top-2 left-2 bg-yellow-200 text-yellow-800 px-3 py-1 rounded">Modal Aberto</div>
            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4 relative" style={{zIndex: 10000, position: 'relative'}}>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); console.log('Fechando modal'); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editing ? 'Editar Slide' : 'Adicionar Slide'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descrição</label>
                <textarea className="w-full border rounded px-3 py-2" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem</label>
                <ImageUploader onUpload={url => setForm(f => ({ ...f, imagem_url: url }))} />
                {form.imagem_url && (
                  <img src={form.imagem_url} alt="Preview" className="w-full h-32 object-cover rounded mt-2 border" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link (opcional)</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.ordem} onChange={e => setForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>
        )}
      </section>
      {/* Grade de Médicos */}
      <DoctorCrudAdmin />
      {/* Destaques */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Destaques</h3>
          <button className={buttonClass} onClick={openAddHighlightForm}><Plus className="w-4 h-4" />Adicionar Destaque</button>
        </div>
        {/* Visualização dos destaques (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, idx) => (
              <div key={highlight.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: highlight.color }}>
                    {/* Ícone Lucide dinâmico */}
                    {React.createElement(require('lucide-react')[highlight.icon] || require('lucide-react').Star, { className: 'w-5 h-5 text-white' })}
                  </span>
                  <span className="font-bold text-lg text-[#3a7bd5]">{highlight.title}</span>
                </div>
                <div className="text-gray-600 text-sm mb-2">{highlight.description}</div>
                {highlight.value && <div className="text-[#3a7bd5] font-bold">{highlight.value}</div>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditHighlightForm(highlight)}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeleteHighlight(highlight.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => moveHighlight(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === highlights.length - 1} onClick={() => moveHighlight(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar destaque */}
        {showHighlightForm && (
          <div style={{zIndex: 9999, position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <form onSubmit={handleSaveHighlight} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4 relative" style={{zIndex: 10000, position: 'relative'}}>
              <button type="button" onClick={() => { setShowHighlightForm(false); setEditingHighlight(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingHighlight ? 'Editar Destaque' : 'Adicionar Destaque'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={highlightForm.title} onChange={e => setHighlightForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descrição</label>
                <textarea className="w-full border rounded px-3 py-2" value={highlightForm.description} onChange={e => setHighlightForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ícone (nome do Lucide, ex: Star, Heart, Shield...)</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={highlightForm.icon} onChange={e => setHighlightForm(f => ({ ...f, icon: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Cor (hex ou nome CSS)</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={highlightForm.color} onChange={e => setHighlightForm(f => ({ ...f, color: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={highlightForm.ordem} onChange={e => setHighlightForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Valor (opcional)</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={highlightForm.value} onChange={e => setHighlightForm(f => ({ ...f, value: e.target.value }))} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>
        )}
      </section>
      {/* Blog */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Blog</h3>
          <button className={buttonClass} onClick={openAddBlogForm}><Plus className="w-4 h-4" />Adicionar Post</button>
        </div>
        {/* Visualização dos posts (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, idx) => (
              <div key={post.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <img src={post.imagem_url} alt={post.titulo} className="w-full h-40 object-cover rounded-lg mb-2 border border-[#3a7bd5]/10" />
                <div className="font-bold text-lg text-[#3a7bd5]">{post.titulo}</div>
                <div className="text-gray-600 text-sm mb-1">{post.resumo}</div>
                <div className="text-gray-600 text-xs mb-1">Autor: {post.autor}</div>
                <div className="text-gray-600 text-xs mb-1">Data: {post.data}</div>
                {post.link && <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver post</a>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditBlogForm(post)}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeleteBlog(post.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => moveBlog(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === blogPosts.length - 1} onClick={() => moveBlog(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar post */}
        {showBlogForm && ReactDOM.createPortal(
          <div
            style={{
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <form
              onSubmit={handleSaveBlog}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm max-h-[90vh] space-y-4 relative overflow-y-auto"
              style={{ zIndex: 100000, position: 'relative' }}
            >
              <button type="button" onClick={() => { setShowBlogForm(false); setEditingBlog(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingBlog ? 'Editar Post' : 'Adicionar Post'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={blogForm.titulo} onChange={e => setBlogForm(f => ({ ...f, titulo: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Resumo</label>
                <ReactQuill
                  theme="snow"
                  value={blogForm.resumo}
                  onChange={value => setBlogForm(f => ({ ...f, resumo: value }))}
                  className="bg-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem</label>
                <ImageUploader onUpload={url => setBlogForm(f => ({ ...f, imagem_url: url }))} />
                {blogForm.imagem_url && (
                  <img src={blogForm.imagem_url} alt="Preview" className="w-full h-32 object-cover rounded mt-2 border" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Autor</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={blogForm.autor} onChange={e => setBlogForm(f => ({ ...f, autor: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Data</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={blogForm.data} onChange={e => setBlogForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link (opcional)</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={blogForm.link} onChange={e => setBlogForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={blogForm.ordem} onChange={e => setBlogForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>,
          document.body
        )}
      </section>
      {/* Podcast */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Podcast</h3>
          <button className={buttonClass} onClick={openAddPodcastForm}><Plus className="w-4 h-4" />Adicionar Episódio</button>
        </div>
        {/* Visualização dos episódios (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.map((podcast, idx) => {
              const videoId = getYoutubeId(podcast.media_url);
              const thumbnail = podcast.imagem_url || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://via.placeholder.com/300x120?text=Sem+Imagem');
              return (
                <div key={podcast.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                  <img src={thumbnail} alt={podcast.titulo} className="w-full h-40 object-cover rounded-lg mb-2 border border-[#3a7bd5]/10" />
                  {/* Player de vídeo/áudio */}
                  {podcast.media_url && (
                    podcast.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={podcast.media_url} controls className="w-full h-32 object-cover rounded mt-2 border" />
                    ) : podcast.media_url.match(/\.(mp3|wav|ogg)$/i) ? (
                      <audio src={podcast.media_url} controls className="w-full mt-2" />
                    ) : videoId ? (
                      <iframe
                        width="100%"
                        height="180"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full rounded mt-2 border"
                      />
                    ) : podcast.media_url.includes('vimeo.com') ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${podcast.media_url.split('/').pop()}`}
                        width="100%"
                        height="180"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Vimeo video player"
                        className="w-full rounded mt-2 border"
                      />
                    ) : null
                  )}
                  <div className="font-bold text-lg text-[#3a7bd5]">{podcast.titulo}</div>
                  <div className="text-gray-600 text-sm mb-1">{podcast.descricao}</div>
                  <div className="text-gray-600 text-xs mb-1">Data: {podcast.data}</div>
                  {podcast.link && <a href={podcast.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ouvir episódio</a>}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditPodcastForm(podcast)}><Edit2 className="w-4 h-4" />Editar</button>
                    <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeletePodcast(podcast.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                    <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => movePodcast(idx, -1)} title="Mover para cima">↑</button>
                    <button className={buttonClass + ' border-gray-300'} disabled={idx === podcasts.length - 1} onClick={() => movePodcast(idx, 1)} title="Mover para baixo">↓</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar episódio */}
        {showPodcastForm && ReactDOM.createPortal(
          <div
            style={{
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <form
              onSubmit={handleSavePodcast}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm max-h-[90vh] space-y-4 relative overflow-y-auto"
              style={{ zIndex: 100000, position: 'relative' }}
            >
              <button type="button" onClick={() => { setShowPodcastForm(false); setEditingPodcast(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingPodcast ? 'Editar Episódio' : 'Adicionar Episódio'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={podcastForm.titulo} onChange={e => setPodcastForm(f => ({ ...f, titulo: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descrição</label>
                <textarea className="w-full border rounded px-3 py-2" value={podcastForm.descricao} onChange={e => setPodcastForm(f => ({ ...f, descricao: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem</label>
                <ImageUploader onUpload={url => setPodcastForm(f => ({ ...f, imagem_url: url }))} />
                <input
                  type="url"
                  className="w-full border rounded px-3 py-2 mt-2"
                  placeholder="Ou cole a URL da imagem"
                  value={podcastForm.imagem_url.startsWith('http') ? podcastForm.imagem_url : ''}
                  onChange={e => setPodcastForm(f => ({ ...f, imagem_url: e.target.value }))}
                />
                {(() => {
                  const videoId = getYoutubeId(podcastForm.media_url);
                  const thumbnail = podcastForm.imagem_url || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://via.placeholder.com/300x120?text=Sem+Imagem');
                  let podcastImagePreview: React.ReactNode;
                  if (podcastForm.imagem_url && podcastForm.imagem_url.startsWith('http')) {
                    podcastImagePreview = (
                      <img src={podcastForm.imagem_url} alt="Preview" className="w-full h-32 object-cover rounded mt-2 border" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x120?text=Sem+Imagem'; }} />
                    );
                  } else if (videoId) {
                    podcastImagePreview = (
                      <img src={thumbnail} alt="Preview" className="w-full h-32 object-cover rounded mt-2 border" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x120?text=Sem+Imagem'; }} />
                    );
                  } else {
                    podcastImagePreview = (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded mt-2 border text-gray-400">Sem imagem</div>
                    );
                  }
                  return podcastImagePreview;
                })()}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Vídeo/Áudio</label>
                <VideoUploader onUpload={url => setPodcastForm(f => ({ ...f, media_url: url }))} />
                <input
                  type="url"
                  className="w-full border rounded px-3 py-2 mt-2"
                  placeholder="Ou cole a URL do vídeo/áudio (YouTube, Vimeo, etc)"
                  value={podcastForm.media_url.startsWith('http') ? podcastForm.media_url : ''}
                  onChange={e => setPodcastForm(f => ({ ...f, media_url: e.target.value }))}
                />
                {podcastForm.media_url && podcastForm.media_url.startsWith('http') ? (
                  podcastForm.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={podcastForm.media_url} controls className="w-full h-32 object-cover rounded mt-2 border" />
                  ) : podcastForm.media_url.match(/\.(mp3|wav|ogg)$/i) ? (
                    <audio src={podcastForm.media_url} controls className="w-full mt-2" />
                  ) : podcastForm.media_url.includes('youtube.com') || podcastForm.media_url.includes('youtu.be') ? (
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://www.youtube.com/embed/${podcastForm.media_url.split('v=')[1]?.split('&')[0] || podcastForm.media_url.split('/').pop()}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full rounded mt-2 border"
                    />
                  ) : podcastForm.media_url.includes('vimeo.com') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${podcastForm.media_url.split('/').pop()}`}
                      width="100%"
                      height="180"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Vimeo video player"
                      className="w-full rounded mt-2 border"
                    />
                  ) : (
                    <div className="w-full h-12 flex items-center justify-center bg-gray-100 rounded mt-2 border text-gray-400">Formato de mídia não suportado</div>
                  )
                ) : (
                  <div className="w-full h-12 flex items-center justify-center bg-gray-100 rounded mt-2 border text-gray-400">Sem mídia</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link do Episódio</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={podcastForm.link} onChange={e => setPodcastForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Data</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={podcastForm.data} onChange={e => setPodcastForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={podcastForm.ordem} onChange={e => setPodcastForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>,
          document.body
        )}
      </section>
      {/* Eventos */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Eventos</h3>
          <button className={buttonClass} onClick={openAddEventForm}><Plus className="w-4 h-4" />Adicionar Evento</button>
        </div>
        {/* Visualização dos eventos (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, idx) => (
              <div key={event.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <img src={event.imagem_url} alt={event.titulo} className="w-full h-40 object-cover rounded-lg mb-2 border border-[#3a7bd5]/10" />
                <div className="font-bold text-lg text-[#3a7bd5]">{event.titulo}</div>
                <div className="text-gray-600 text-sm mb-1">{event.descricao}</div>
                <div className="text-gray-600 text-xs mb-1">Data: {event.data}</div>
                <div className="text-gray-600 text-xs mb-1">Local: {event.local}</div>
                {event.link && <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver evento</a>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditEventForm(event)}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeleteEvent(event.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => moveEvent(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === events.length - 1} onClick={() => moveEvent(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar evento */}
        {showEventForm && (
          <div style={{zIndex: 9999, position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <form onSubmit={handleSaveEvent} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4 relative" style={{zIndex: 10000, position: 'relative'}}>
              <button type="button" onClick={() => { setShowEventForm(false); setEditingEvent(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingEvent ? 'Editar Evento' : 'Adicionar Evento'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={eventForm.titulo} onChange={e => setEventForm(f => ({ ...f, titulo: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descrição</label>
                <textarea className="w-full border rounded px-3 py-2" value={eventForm.descricao} onChange={e => setEventForm(f => ({ ...f, descricao: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem (URL)</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={eventForm.imagem_url} onChange={e => setEventForm(f => ({ ...f, imagem_url: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Data</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={eventForm.data} onChange={e => setEventForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Local</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={eventForm.local} onChange={e => setEventForm(f => ({ ...f, local: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link (opcional)</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={eventForm.link} onChange={e => setEventForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={eventForm.ordem} onChange={e => setEventForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>
        )}
      </section>
      {/* Notícias */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Notícias</h3>
          <button className={buttonClass} onClick={openAddNewsForm}><Plus className="w-4 h-4" />Adicionar Notícia</button>
        </div>
        {/* Visualização das notícias (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((noticia, idx) => (
              <div key={noticia.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <img src={noticia.imagem_url} alt={noticia.titulo} className="w-full h-40 object-cover rounded-lg mb-2 border border-[#3a7bd5]/10" />
                <div className="font-bold text-lg text-[#3a7bd5]">{noticia.titulo}</div>
                <div className="text-gray-600 text-sm mb-1">{noticia.resumo}</div>
                <div className="text-gray-600 text-xs mb-1">Data: {noticia.data}</div>
                {noticia.link && <a href={noticia.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver notícia</a>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditNewsForm(noticia)}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeleteNews(noticia.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => moveNews(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === news.length - 1} onClick={() => moveNews(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar notícia */}
        {showNewsForm && ReactDOM.createPortal(
          <div
            style={{
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <form
              onSubmit={handleSaveNews}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm max-h-[90vh] space-y-4 relative overflow-y-auto"
              style={{ zIndex: 100000, position: 'relative' }}
            >
              <button type="button" onClick={() => { setShowNewsForm(false); setEditingNews(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingNews ? 'Editar Notícia' : 'Adicionar Notícia'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={newsForm.titulo} onChange={e => setNewsForm(f => ({ ...f, titulo: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Resumo</label>
                <textarea className="w-full border rounded px-3 py-2" value={newsForm.resumo} onChange={e => setNewsForm(f => ({ ...f, resumo: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem</label>
                <ImageUploader onUpload={url => setNewsForm(f => ({ ...f, imagem_url: url }))} />
                {newsForm.imagem_url && (
                  <img src={newsForm.imagem_url} alt="Preview" className="w-full h-32 object-cover rounded mt-2 border" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Data</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={newsForm.data} onChange={e => setNewsForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link (opcional)</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={newsForm.link} onChange={e => setNewsForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={newsForm.ordem} onChange={e => setNewsForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>,
          document.body
        )}
      </section>
      {/* Chamada para Ação */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Chamada para Ação</h3>
          <button className={buttonClass}><Edit2 className="w-4 h-4" />Editar</button>
        </div>
        <CTASection />
      </section>
      {/* Parceiros */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Parceiros</h3>
          <button className={buttonClass} onClick={openAddPartnerForm}><Plus className="w-4 h-4" />Adicionar Parceiro</button>
        </div>
        {/* Visualização dos parceiros (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <div key={partner.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <img src={partner.imagem_url} alt={partner.nome} className="w-full h-40 object-cover rounded-lg mb-2 border border-[#3a7bd5]/10" />
                <div className="font-bold text-lg text-[#3a7bd5]">{partner.nome}</div>
                <div className="text-gray-600 text-sm mb-1">{partner.descricao}</div>
                {partner.link && <a href={partner.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver site</a>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditPartnerForm(partner)}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeletePartner(partner.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => movePartner(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === partners.length - 1} onClick={() => movePartner(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar parceiro */}
        {showPartnerForm && ReactDOM.createPortal(
          <div
            style={{
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <form
              onSubmit={handleSavePartner}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm max-h-[90vh] space-y-4 relative overflow-y-auto"
              style={{ zIndex: 100000, position: 'relative' }}
            >
              <button type="button" onClick={() => { setShowPartnerForm(false); setEditingPartner(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingPartner ? 'Editar Parceiro' : 'Adicionar Parceiro'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Nome</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={partnerForm.nome} onChange={e => setPartnerForm(f => ({ ...f, nome: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descrição</label>
                <textarea className="w-full border rounded px-3 py-2" value={partnerForm.descricao} onChange={e => setPartnerForm(f => ({ ...f, descricao: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Imagem</label>
                <ImageUploader onUpload={url => setPartnerForm(f => ({ ...f, imagem_url: url }))} />
                {partnerForm.imagem_url && (
                  <img src={partnerForm.imagem_url} alt="Preview" className="w-full h-32 object-cover rounded mt-2 border" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link (opcional)</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={partnerForm.link} onChange={e => setPartnerForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={partnerForm.ordem} onChange={e => setPartnerForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>,
          document.body
        )}
      </section>
      {/* Contato */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Contato</h3>
          <button className={buttonClass} onClick={openAddContactForm}><Plus className="w-4 h-4" />Adicionar Contato</button>
        </div>
        {/* Visualização dos contatos (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact, idx) => (
              <div key={contact.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <div className="font-bold text-lg text-[#3a7bd5]">{contact.titulo}</div>
                <div className="text-gray-600 text-sm mb-1">{contact.descricao}</div>
                <div className="text-gray-600 text-xs mb-1">Telefone: {contact.telefone}</div>
                <div className="text-gray-600 text-xs mb-1">E-mail: {contact.email}</div>
                <div className="text-gray-600 text-xs mb-1">Endereço: {contact.endereco}</div>
                {contact.mapa_url && <a href={contact.mapa_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver no mapa</a>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditContactForm(contact)}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeleteContact(contact.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => moveContact(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === contacts.length - 1} onClick={() => moveContact(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar contato */}
        {showContactForm && ReactDOM.createPortal(
          <div
            style={{
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <form
              onSubmit={handleSaveContact}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm max-h-[90vh] space-y-4 relative overflow-y-auto"
              style={{ zIndex: 100000, position: 'relative' }}
            >
              <button type="button" onClick={() => { setShowContactForm(false); setEditingContact(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingContact ? 'Editar Contato' : 'Adicionar Contato'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={contactForm.titulo} onChange={e => setContactForm(f => ({ ...f, titulo: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descrição</label>
                <textarea className="w-full border rounded px-3 py-2" value={contactForm.descricao} onChange={e => setContactForm(f => ({ ...f, descricao: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Telefone</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={contactForm.telefone} onChange={e => setContactForm(f => ({ ...f, telefone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">E-mail</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Endereço</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={contactForm.endereco} onChange={e => setContactForm(f => ({ ...f, endereco: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Link do Mapa (opcional)</label>
                <input type="url" className="w-full border rounded px-3 py-2" value={contactForm.mapa_url} onChange={e => setContactForm(f => ({ ...f, mapa_url: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={contactForm.ordem} onChange={e => setContactForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>,
          document.body
        )}
      </section>
      {/* FAQ */}
      <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">FAQ</h3>
          <button className={buttonClass} onClick={openAddFaqForm}><Plus className="w-4 h-4" />Adicionar FAQ</button>
        </div>
        {/* Visualização das FAQs (cards) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
                <div className="font-bold text-lg text-[#3a7bd5]">{faq.pergunta}</div>
                <div className="text-gray-600 text-sm mb-1">{faq.resposta}</div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className={buttonClass + ' bg-[#3a7bd5]/10 border-[#3a7bd5]/40'} onClick={() => openEditFaqForm(faq)}><Edit2 className="w-4 h-4" />Editar</button>
                  <button className={buttonClass + ' text-red-500 hover:bg-red-100 hover:text-red-700 border-red-200'} onClick={() => handleDeleteFaq(faq.id)}><Trash2 className="w-4 h-4" />Excluir</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === 0} onClick={() => moveFaq(idx, -1)} title="Mover para cima">↑</button>
                  <button className={buttonClass + ' border-gray-300'} disabled={idx === faqs.length - 1} onClick={() => moveFaq(idx, 1)} title="Mover para baixo">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal/Formulário de adicionar/editar FAQ */}
        {showFaqForm && ReactDOM.createPortal(
          <div
            style={{
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <form
              onSubmit={handleSaveFaq}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm max-h-[90vh] space-y-4 relative overflow-y-auto"
              style={{ zIndex: 100000, position: 'relative' }}
            >
              <button type="button" onClick={() => { setShowFaqForm(false); setEditingFaq(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
              <h4 className="text-xl font-bold mb-2">{editingFaq ? 'Editar FAQ' : 'Adicionar FAQ'}</h4>
              <div>
                <label className="block text-sm font-semibold mb-1">Pergunta</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={faqForm.pergunta} onChange={e => setFaqForm(f => ({ ...f, pergunta: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Resposta</label>
                <textarea className="w-full border rounded px-3 py-2" value={faqForm.resposta} onChange={e => setFaqForm(f => ({ ...f, resposta: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={faqForm.ordem} onChange={e => setFaqForm(f => ({ ...f, ordem: Number(e.target.value) }))} min={0} />
              </div>
              <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
            </form>
          </div>,
          document.body
        )}
      </section>
    </div>
  );
};

export default HomeAdmin; 