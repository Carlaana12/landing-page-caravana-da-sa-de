import { create } from 'zustand';
import { supabase } from './supabase';
import toast from 'react-hot-toast';
import WebFont from 'webfontloader';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

interface Typography {
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;
  lineHeight: string;
}

interface Spacing {
  containerPadding: string;
  sectionSpacing: string;
}

interface ThemeState {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  setTheme: (theme: Partial<ThemeState>) => void;
  updateTheme: (theme: Partial<ThemeState>) => Promise<void>;
}

export const availableFonts = {
  heading: [
    'Montserrat',
    'Playfair Display',
    'Abril Fatface',
    'Cormorant Garamond',
    'Spectral',
    'Libre Baskerville',
    'Crimson Pro',
    'DM Serif Display',
    'Merriweather',
    'Lora',
    'Bitter',
    'Cinzel',
    'Yeseva One',
    'Rozha One',
    'Marcellus',
    'Cardo'
  ],
  body: [
    'Inter',
    'Source Sans 3',
    'Nunito Sans',
    'IBM Plex Sans',
    'Literata',
    'Quicksand',
    'Outfit',
    'Plus Jakarta Sans',
    'Rubik',
    'Work Sans',
    'Mulish',
    'Karla',
    'Manrope',
    'Sora',
    'Space Grotesk',
    'Albert Sans'
  ]
};

const defaultTheme = {
  colors: {
    primary: '#408040',
    secondary: '#1a3d1a',
    accent: '#66b366',
    text: '#1a1a1a',
    background: '#ffffff'
  },
  typography: {
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
    baseFontSize: '16px',
    lineHeight: '1.5'
  },
  spacing: {
    containerPadding: '1rem',
    sectionSpacing: '4rem'
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  ...defaultTheme,
  setTheme: (theme) => {
    set((state) => ({
      colors: { ...state.colors, ...(theme.colors || {}) },
      typography: { ...state.typography, ...(theme.typography || {}) },
      spacing: { ...state.spacing, ...(theme.spacing || {}) }
    }));

    const root = document.documentElement;
    
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }

    if (theme.typography) {
      if (theme.typography.headingFont || theme.typography.bodyFont) {
        const families = [];
        if (theme.typography.headingFont) {
          families.push(`${theme.typography.headingFont}:400,500,600,700`);
        }
        if (theme.typography.bodyFont) {
          families.push(`${theme.typography.bodyFont}:400,500,600,700`);
        }

        WebFont.load({
          google: { families },
          active: () => {
            if (theme.typography?.headingFont) {
              root.style.setProperty('--font-heading', `"${theme.typography.headingFont}"`);
            }
            if (theme.typography?.bodyFont) {
              root.style.setProperty('--font-body', `"${theme.typography.bodyFont}"`);
            }
            if (theme.typography?.baseFontSize) {
              root.style.setProperty('--font-size', theme.typography.baseFontSize);
            }
            if (theme.typography?.lineHeight) {
              root.style.setProperty('--line-height', theme.typography.lineHeight);
            }
          }
        });
      }
    }

    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
      });
    }
  },
  updateTheme: async (theme) => {
    try {
      const { data: existingTheme } = await supabase
        .from('site_appearance')
        .select('id')
        .single();

      if (existingTheme) {
        const { error } = await supabase
          .from('site_appearance')
          .update({
            theme_colors: theme.colors,
            typography: theme.typography,
            spacing: theme.spacing,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingTheme.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_appearance')
          .insert([{
            theme_colors: theme.colors || defaultTheme.colors,
            typography: theme.typography || defaultTheme.typography,
            spacing: theme.spacing || defaultTheme.spacing
          }]);

        if (error) throw error;
      }

      useThemeStore.getState().setTheme(theme);
      toast.success('Tema atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      toast.error('Erro ao atualizar tema');
      throw error;
    }
  }
}));

export async function loadTheme() {
  try {
    // First try to get theme from site_appearance table
    const { data: themeData, error: themeError } = await supabase
      .from('site_appearance')
      .select('*')
      .single();

    if (themeError && themeError.code !== 'PGRST116') {
      console.error('Error fetching theme:', themeError);
      return defaultTheme;
    }

    if (themeData) {
      const theme = {
        colors: themeData.theme_colors,
        typography: themeData.typography,
        spacing: themeData.spacing
      };
      useThemeStore.getState().setTheme(theme);
      return theme;
    }

    // If no theme exists, create default theme
    const { error: insertError } = await supabase
      .from('site_appearance')
      .insert([{
        theme_colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        spacing: defaultTheme.spacing
      }]);

    if (insertError) {
      console.error('Error creating default theme:', insertError);
      return defaultTheme;
    }

    useThemeStore.getState().setTheme(defaultTheme);
    return defaultTheme;
  } catch (error) {
    console.error('Error in loadTheme:', error);
    return defaultTheme;
  }
}

export function subscribeToThemeChanges() {
  return supabase
    .channel('theme_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'site_appearance'
      },
      (payload) => {
        if (payload.new) {
          useThemeStore.getState().setTheme({
            colors: payload.new.theme_colors,
            typography: payload.new.typography,
            spacing: payload.new.spacing
          });
        }
      }
    )
    .subscribe();
}