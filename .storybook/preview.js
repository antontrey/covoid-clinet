import { addDecorator } from '@storybook/react'
import { withI18next } from 'storybook-addon-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import '../src/App.css'

import en from '../src/i18n/en.json'
import es from '../src/i18n/es.json'
import gn from '../src/i18n/gn.json'


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: 'translation',
    fallbackNS: 'translation',
    resources: {
      en,
      es,
      gn
    },
    // fallbackLng: 'es',
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false
    }
  })

addDecorator(
  withI18next({
    i18n,
    languages: {
      es: 'Spanish',
      en: 'English',
      gn: 'Guaraní',
      none: 'No Language'
    }
  })
)
