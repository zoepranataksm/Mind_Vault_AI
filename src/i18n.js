import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// For simplicity, I'm adding the translations directly here.
// In a real application, these would be in separate JSON files.
const resources = {
  en: {
    translation: {
      "Welcome to Mind Vault": "Welcome to Mind Vault",
      "Sign in to continue": "Sign in to continue",
      "Email Address": "Email Address",
      "Password": "Password",
      "Sign In": "Sign In",
      "Don't have an account? Sign Up": "Don't have an account? Sign Up",
      "Switch to Malayalam": "Switch to Malayalam",
      "Switch to English": "Switch to English"
    }
  },
  ml: {
    translation: {
      "Welcome to Mind Vault": "മൈൻഡ് വോൾട്ടിലേക്ക് സ്വാഗതം",
      "Sign in to continue": "തുടരാൻ സൈൻ ഇൻ ചെയ്യുക",
      "Email Address": "ഇമെയിൽ വിലാസം",
      "Password": "പാസ്‌വേഡ്",
      "Sign In": "സൈൻ ഇൻ ചെയ്യുക",
      "Don't have an account? Sign Up": "അക്കൗണ്ട് ഇല്ലേ? സൈൻ അപ്പ് ചെയ്യുക",
      "Switch to Malayalam": "മലയാളത്തിലേക്ക് മാറുക",
      "Switch to English": "ഇംഗ്ലീഷിലേക്ക് മാറുക"
    }
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use English if detected language is not available
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n;
