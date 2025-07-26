'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { toast } from 'react-hot-toast';
import { Languages, Check } from 'lucide-react';

export default function LanguageSettings() {
  const { language, setLanguage, t, loading } = useLanguage();
  const [saving, setSaving] = useState(false);

  const languages = [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'vi' as const, name: 'Vietnamese', nativeName: 'Tiếng Việt' }
  ];

  const handleLanguageChange = async (newLanguage: 'en' | 'vi') => {
    if (newLanguage === language) return;

    setSaving(true);
    try {
      await setLanguage(newLanguage);
      toast.success(t.settings.saveSuccess);
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error(t.settings.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t.common.loading}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          {t.settings.language}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            {t.settings.language}
          </Label>
          <div className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={saving}
                className={`w-full p-4 border rounded-lg text-left transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  language === lang.code
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200'
                } ${
                  saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {lang.nativeName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lang.name}
                    </div>
                  </div>
                  {language === lang.code && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            {language === 'vi' 
              ? 'Ngôn ngữ sẽ được áp dụng cho toàn bộ ứng dụng và được lưu vào hồ sơ của bạn.'
              : 'Language will be applied throughout the application and saved to your profile.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
