import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ReactDOM from 'react-dom';

interface Doctor {
  id?: string;
  name: string;
  specialty: string;
  city: string;
  consultation_type: string;
  teleconsultation: boolean;
  exams: string[];
  location: string;
  image_url: string;
  rating: number;
  review_count: number;
  address: string;
  phone: string;
  email: string;
  bio: string;
  experience: string;
  availability: string[];
  insurance: string[];
  languages: string[];
  education: string[];
  achievements: string[];
  slug: string;
  ativo: boolean;
  ordem: number;
  created_at?: string;
}

const emptyDoctor: Doctor = {
  name: '',
  specialty: '',
  city: '',
  consultation_type: '',
  teleconsultation: false,
  exams: [],
  location: '',
  image_url: '',
  rating: 0,
  review_count: 0,
  address: '',
  phone: '',
  email: '',
  bio: '',
  experience: '',
  availability: [],
  insurance: [],
  languages: [],
  education: [],
  achievements: [],
  slug: '',
  ativo: true,
  ordem: 0,
};

const DoctorCrudAdmin: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Doctor>(emptyDoctor);

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_doctor_profiles')
      .select('*')
      .order('ordem', { ascending: true });
    if (!error && data) setDoctors(data);
    setLoading(false);
  }

  function openAddModal() {
    setEditingDoctor(null);
    setForm(emptyDoctor);
    setShowModal(true);
  }

  function openEditModal(doctor: Doctor) {
    setEditingDoctor(doctor);
    setForm({ ...doctor });
    setShowModal(true);
  }

  function safeArray(val: any): string[] {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim() !== '') return val.split(',').map((v) => v.trim());
    return [];
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const slug = form.name.toLowerCase().replace(/\s+/g, '-');
    const doctorToSave = {
      ...form,
      exams: safeArray(form.exams),
      availability: safeArray(form.availability),
      insurance: safeArray(form.insurance),
      languages: safeArray(form.languages),
      education: safeArray(form.education),
      achievements: safeArray(form.achievements),
      slug,
    };
    if (editingDoctor && editingDoctor.id) {
      await supabase
        .from('admin_doctor_profiles')
        .update(doctorToSave)
        .eq('id', editingDoctor.id);
    } else {
      await supabase
        .from('admin_doctor_profiles')
        .insert([doctorToSave]);
    }
    setShowModal(false);
    setEditingDoctor(null);
    fetchDoctors();
    setLoading(false);
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir este médico?')) return;
    setLoading(true);
    await supabase.from('admin_doctor_profiles').delete().eq('id', id);
    fetchDoctors();
    setLoading(false);
  }

  return (
    <section className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Médicos</h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-verde-cia text-white font-semibold shadow hover:bg-verde-cia-escuro transition-all" onClick={openAddModal}><Plus className="w-4 h-4" />Adicionar Médico</button>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col gap-2 border border-[#3a7bd5]/10">
              <img src={doctor.image_url} alt={doctor.name} className="w-full h-40 object-cover rounded-lg mb-2 border border-[#3a7bd5]/10" />
              <div className="font-bold text-lg text-[#3a7bd5]">{doctor.name}</div>
              <div className="text-gray-600 text-sm mb-1">{doctor.specialty}</div>
              <div className="text-gray-600 text-xs mb-1">Cidade: {doctor.city}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3a7bd5]/10 text-[#3a7bd5] font-semibold hover:bg-[#3a7bd5]/20 transition-all" onClick={() => openEditModal(doctor)}><Edit2 className="w-4 h-4" />Editar</button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-100 hover:text-red-700 border border-red-200 font-semibold" onClick={() => handleDelete(doctor.id)}><Trash2 className="w-4 h-4" />Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal de adicionar/editar médico */}
      {showModal && ReactDOM.createPortal(
        <div
          style={{zIndex: 9999, position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={() => { setShowModal(false); setEditingDoctor(null); }}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSave}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 relative"
            style={{zIndex: 10000, position: 'relative'}}
          >
            <button type="button" onClick={() => { setShowModal(false); setEditingDoctor(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X /></button>
            <h4 className="text-xl font-bold mb-2">{editingDoctor ? 'Editar Médico' : 'Adicionar Médico'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nome</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Especialidade</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Cidade</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Foto</label>
                <ImageUploader onUpload={url => setForm(f => ({ ...f, image_url: url }))} />
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="w-full h-32 object-cover rounded mt-2 border" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Endereço</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Localização</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Telefone</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Biografia</label>
                <textarea className="w-full border rounded px-3 py-2" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Experiência</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Formação</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value.split(',').map(s => s.trim()) }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Idiomas</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.languages} onChange={e => setForm(f => ({ ...f, languages: e.target.value.split(',').map(s => s.trim()) }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Convênios</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.insurance} onChange={e => setForm(f => ({ ...f, insurance: e.target.value.split(',').map(s => s.trim()) }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Disponibilidade</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value.split(',').map(s => s.trim()) }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Teleconsulta</label>
                <input type="checkbox" checked={form.teleconsultation} onChange={e => setForm(f => ({ ...f, teleconsultation: e.target.checked }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Nota</label>
                <input type="number" step="0.1" className="w-full border rounded px-3 py-2" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Nº de Avaliações</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.review_count} onChange={e => setForm(f => ({ ...f, review_count: parseInt(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ativo</label>
                <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ordem</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.ordem} onChange={e => setForm(f => ({ ...f, ordem: parseInt(e.target.value) }))} />
              </div>
            </div>
            <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Salvar</button>
          </form>
        </div>,
        document.body
      )}
    </section>
  );
};

export default DoctorCrudAdmin; 