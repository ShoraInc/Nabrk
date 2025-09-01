// hooks/useTranslations.js
import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../translations';

export const useTranslations = () => {
    const { currentLanguage } = useContext(LanguageContext);

    const t = (key, options = {}) => {
        const {
            lang = currentLanguage,
            fallback = key,
            interpolation = {}
        } = options;

        const keys = key.split('.');
        let value = translations[lang];

        // Проходим по ключам
        for (const k of keys) {
            value = value?.[k];
        }

        // Если не найдено в текущем языке, пробуем fallback языки
        if (!value) {
            const fallbackLangs = ['kz', 'ru', 'en'].filter(l => l !== lang);

            for (const fallbackLang of fallbackLangs) {
                let fallbackValue = translations[fallbackLang];
                for (const k of keys) {
                    fallbackValue = fallbackValue?.[k];
                }
                if (fallbackValue) {
                    value = fallbackValue;
                    break;
                }
            }
        }

        // Если все еще не найдено, возвращаем fallback
        if (!value) {
            return fallback;
        }

        // Интерполяция переменных
        if (typeof value === 'string' && Object.keys(interpolation).length > 0) {
            return Object.keys(interpolation).reduce((str, key) => {
                return str.replace(new RegExp(`{{${key}}}`, 'g'), interpolation[key]);
            }, value);
        }

        return value;
    };

    return {
        t,
        currentLanguage,
        isRTL: currentLanguage === 'ar' // Для будущего расширения
    };
};
