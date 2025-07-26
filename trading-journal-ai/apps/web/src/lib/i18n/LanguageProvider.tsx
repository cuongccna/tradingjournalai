'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dictionaries, Language, DictionaryKeys } from './dictionaries';
import { useAuth } from '@/hooks/useAuth';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof dictionaries[Language];
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('vi'); // Default to Vietnamese
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load language preference from localStorage or user profile
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        // Try to get from user profile first
        if (user) {
          const response = await fetch('/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          });
          
          if (response.ok) {
            const profile = await response.json();
            if (profile.data?.language) {
              setLanguageState(profile.data.language);
              localStorage.setItem('trading-journal-language', profile.data.language);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback to localStorage
        const savedLanguage = localStorage.getItem('trading-journal-language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
          setLanguageState(savedLanguage);
        } else {
          // Default to Vietnamese
          setLanguageState('vi');
          localStorage.setItem('trading-journal-language', 'vi');
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        setLanguageState('vi'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    loadLanguagePreference();
  }, [user]);

  // Save language preference to user profile and localStorage
  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      localStorage.setItem('trading-journal-language', lang);

      // Save to user profile if authenticated
      if (user) {
        const response = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          },
          body: JSON.stringify({ language: lang })
        });

        if (!response.ok) {
          console.error('Failed to save language preference to profile');
        }
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: dictionaries[language],
    loading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper function for nested translations
export function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}
