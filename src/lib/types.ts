// Registration Types
export interface PatientRegistration {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  termsAccepted: boolean;
}

export interface ProfessionalRegistration {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  registrationType: 'CRM' | 'CRO' | 'CREFITO' | 'CRP' | 'COREN' | 'OUTRO';
  registrationNumber: string;
  registrationState: string;
  registrationExpiry?: string;
  specialty: string;
  location?: string;
  documentUrl?: string;
  termsAccepted: boolean;
}

// Profile Types
export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  registrationType: string;
  registrationNumber: string;
  registrationState: string;
  registrationExpiry?: string;
  specialty: string;
  location?: string;
  documentUrl?: string;
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Specialist Types
export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  city: string;
  location?: string;
  consultationType: 'presencial' | 'domiciliar' | 'ambos';
  teleconsultation: boolean;
  exams: string[];
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  phone?: string;
  email?: string;
  bio?: string;
  availability?: string[];
  languages?: string[];
  insurance?: string[];
  experience?: string;
  education?: string[];
  achievements?: string[];
  slug?: string;
  availability_slots?: Array<{day: number, startTime: string, endTime: string}>;
  consultation_duration?: number;
  public_profile_complete?: boolean;
  view_count?: number;
}

export interface Exam {
  id: string;
  name: string;
  specialistId: string;
  specialistName: string;
  specialty: string;
  location: string;
  price?: string;
  description?: string;
}

// Component Types
export const COMPONENT_TYPES = {
  CAROUSEL: 'carousel',
  DOCTOR_SEARCH: 'doctor_search',
  SPECIALTIES_GRID: 'specialties_grid',
  HIGHLIGHTS: 'highlights',
  EVENTS_PREVIEW: 'events_preview',
  NEWS_SECTION: 'news_section',
  PARTNERS_SECTION: 'partners_section',
  CONTACT_SECTION: 'contact_section'
};

export interface ComponentSettings {
  [key: string]: any;
}

export interface PageComponent {
  id: string;
  page_id?: string;
  type: string;
  name: string;
  settings: ComponentSettings;
  display_order: number;
  active: boolean;
}

// Review Types
export interface Review {
  id: string;
  doctorId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Appointment Types
export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'in-person' | 'teleconsultation';
  notes?: string;
  createdAt: string;
}

export interface Utility {
  id: string;
  name: string;
  type: 'emergency' | 'publicHospital' | 'hospitalPharmacy' | 'homeopathicClinic';
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  observations?: string | null;
  city?: string;
  number?: string; // Para contatos de emergência
  label?: string; // Para contatos de emergência
}