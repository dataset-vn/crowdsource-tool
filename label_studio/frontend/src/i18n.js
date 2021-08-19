import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import  TRANSLATIONS_VI from "./translations/vi/translation.json";
import  TRANSLATIONS_EN from "./translations/en/translation.json";

i18n
 .use(LanguageDetector)
 .use(initReactI18next)
 .init({
   resources: {
     en: {
       translation: TRANSLATIONS_EN
     },
     vi: {
       translation: TRANSLATIONS_VI
     }
   }
 });
  var locale = navigator.language;
  if(locale == "vi"){
    i18n.changeLanguage("vi")
  }
  else if(locale == null){
    i18n.changeLanguage("vi")
  }
  else
  {
    i18n.changeLanguage("en");
  }
    
//i18n.changeLanguage("en");

