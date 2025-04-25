export type ContentType = 'sobre' | 'encontre-aqui' | 'tratamentos' | 'noticias' | 'eventos';

export interface PageContent {
  id: number;
  tipo: ContentType;
  titulo: string;
  conteudo: string;
  created_at: string;
  updated_at: string;
}

export interface ContentError {
  message: string;
  field?: string;
}

export interface ContentState {
  content: PageContent | null;
  isLoading: boolean;
  error: ContentError | null;
  isDirty: boolean;
}

export type FieldType = 'text' | 'textarea' | 'rich-text' | 'image' | 'date' | 'tags' | 'category';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
}

export interface ContentSchema {
  fields: Field[];
}

export interface Content {
  id?: string;
  titulo?: string;
  subtitulo?: string;
  conteudo?: string;
  imagem_url?: string;
  data_publicacao?: string;
  categoria?: string;
  tags?: string[];
  autor?: string;
  created_at?: string;
  updated_at?: string;
} 