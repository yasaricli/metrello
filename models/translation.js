import fs from 'fs';
import path from 'path';

const translationsCache = {};
const isServer = typeof window === 'undefined';

export const Translations = {
  // Load translation file for a specific language
  loadTranslation(language) {
    if (translationsCache[language]) {
      return translationsCache[language];
    }

    try {
      const filePath = path.join(process.cwd(), 'imports/i18n/data', `${language}.json`);
      const content = fs.readFileSync(filePath, 'utf8');
      translationsCache[language] = JSON.parse(content);
      return translationsCache[language];
    } catch (error) {
      console.error(`Error loading translation for ${language}:`, error);
      return translationsCache[language];
    }
  },

  // Get translation text
  getTranslation(language, key) {
    const translations = this.loadTranslation(language);
    return translations ? translations[key] || key : key;
  },

  // Get available languages by scanning the i18n directory
  getAvailableLanguages() {
    if (isServer) {
      try {
        const i18nPath = path.join(process.cwd(), 'imports/i18n/data');
        return fs.readdirSync(i18nPath)
          .filter(file => file.endsWith('.json'))
          .map(file => file.replace('.json', ''));
      } catch (error) {
        console.error('Error reading available languages:', error);
        return [];
      }
    }
    return [];
  }
};

if (isServer) {
  // Initialize translations on server startup
  const languages = Translations.getAvailableLanguages();
  console.log('Available languages:', languages);
}

export default Translations;
