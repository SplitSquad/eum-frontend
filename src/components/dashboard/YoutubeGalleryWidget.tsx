import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton as MuiIconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { env } from '../../config/env';
import axios from 'axios';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';
import { useTranslation } from '@/shared/i18n';
import { useLanguageStore } from '../../features/theme/store/languageStore';
import { useAuthStore } from '../../features/auth/store/authStore';

interface VideoItem {
  id: string;
  thumbnail: string;
  title: string;
  channelName: string;
  liked: boolean;
  tags: string[];
  views: string;
}

// 목적별 검색어 정의 (영어만 사용하여 API 호출 문제 해결)
const PURPOSE_SEARCH_QUERIES = {
  travel: 'Korea travel guide tourist attractions Seoul Busan destinations',
  living: 'Korea living guide daily life expat residence apartment',
  study: 'Korea study abroad university life student guide education',
  job: 'Korea employment work visa job interview career opportunities',
  work: 'Korea employment work visa job interview career opportunities', // work를 job과 동일하게 처리
};

// API 키가 없거나 오류 발생 시 사용할 샘플 데이터 (실제 YouTube 영상 ID 사용)
// 🎯 목적별로 6개씩 준비하여 랜덤으로 3개 선택 가능 (총 24개 고유 비디오)
const getSampleVideosByPurpose = (
  purpose: keyof typeof PURPOSE_SEARCH_QUERIES,
  language: string = 'ko'
): VideoItem[] => {
  // 언어별 비디오 제목 번역
  const videoTitles = {
    '2v8uecv5LEQ': {
      ko: '서울 2024 완벽 여행 가이드 - 7일 일정',
      en: 'Seoul 2024 Ultimate Travel Guide - 7-Day Itinerary',
      ja: 'ソウル2024完全旅行ガイド - 7日間日程',
      zh: '首尔2024完美旅行指南 - 7天行程',
      fr: 'Guide de Voyage Complet de Séoul 2024 - Itinéraire 7 Jours',
      es: 'Guía Completa de Viaje a Seúl 2024 - Itinerario de 7 Días',
      de: 'Seoul 2024 Kompletter Reiseführer - 7-Tage Reiseplan',
      ru: 'Полный Путеводитель по Сеулу 2024 - 7-дневный Маршрут',
      vi: 'Hướng Dẫn Du Lịch Seoul 2024 Hoàn Hảo - Lịch Trình 7 Ngày',
    },
    O5_jxkEBSZU: {
      ko: '2024 한국 여행 가이드',
      en: '2024 South Korea Travel Guide',
      ja: '2024韓国旅行ガイド',
      zh: '2024韩国旅行指南',
      fr: 'Guide de Voyage Corée du Sud 2024',
      es: 'Guía de Viaje Corea del Sur 2024',
      de: 'Südkorea Reiseführer 2024',
      ru: 'Путеводитель по Южной Корее 2024',
      vi: 'Hướng Dẫn Du Lịch Hàn Quốc 2024',
    },
    '4GKwxnk0E4s': {
      ko: '한국 2025 여행 가이드 - 최고 명소와 할 거리',
      en: 'Korea 2025 Travel Guide - Best Places & Things to Do',
      ja: '韓国2025旅行ガイド - 最高の名所とやること',
      zh: '韩国2025旅行指南 - 最佳景点和活动',
      fr: 'Guide Voyage Corée 2025 - Meilleurs Lieux & Activités',
      es: 'Guía de Viaje Corea 2025 - Mejores Lugares y Actividades',
      de: 'Korea 2025 Reiseführer - Beste Orte & Aktivitäten',
      ru: 'Путеводитель по Корее 2025 - Лучшие Места и Мероприятия',
      vi: 'Hướng Dẫn Du Lịch Hàn Quốc 2025 - Địa Điểm & Hoạt Động Tốt Nhất',
    },
    hx0cbc2jr90: {
      ko: '2025 한국 입국 요건과 여행 준비사항',
      en: '2025 Korea Entry Requirements & Travel Preparations',
      ja: '2025年韓国入国要件と旅行準備事項',
      zh: '2025年韩国入境要求和旅行准备',
      fr: "Exigences d'Entrée Corée 2025 & Préparations Voyage",
      es: 'Requisitos de Entrada a Corea 2025 y Preparativos de Viaje',
      de: 'Korea 2025 Einreisebestimmungen & Reisevorbereitungen',
      ru: 'Требования Въезда в Корею 2025 и Подготовка к Путешествию',
      vi: 'Yêu Cầu Nhập Cảnh Hàn Quốc 2025 & Chuẩn Bị Du Lịch',
    },
    kDvDk2lw72c: {
      ko: '한국 문화와 관습 - 외국인이 알아야 할 것들',
      en: 'Korean Culture & Customs - What Foreigners Should Know',
      ja: '韓国文化と慣習 - 外国人が知るべきこと',
      zh: '韩国文化和习俗 - 外国人应该了解的事项',
      fr: 'Culture & Coutumes Coréennes - Ce que les Étrangers Doivent Savoir',
      es: 'Cultura y Costumbres Coreanas - Lo que los Extranjeros Deben Saber',
      de: 'Koreanische Kultur & Bräuche - Was Ausländer Wissen Sollten',
      ru: 'Корейская Культура и Обычаи - Что Должны Знать Иностранцы',
      vi: 'Văn Hóa & Phong Tục Hàn Quốc - Điều Người Nước Ngoài Cần Biết',
    },
    ELdMLCfrNy4: {
      ko: '외국인이 놀라는 한국 문화들',
      en: 'Korean Cultures That Surprise Foreigners',
      ja: '外国人が驚く韓国文化',
      zh: '让外国人惊讶的韩国文化',
      fr: 'Cultures Coréennes qui Surprennent les Étrangers',
      es: 'Culturas Coreanas que Sorprenden a los Extranjeros',
      de: 'Koreanische Kulturen, die Ausländer Überraschen',
      ru: 'Корейские Культуры, Которые Удивляют Иностранцев',
      vi: 'Những Nét Văn Hóa Hàn Quốc Khiến Người Nước Ngoài Ngạc Nhiên',
    },
    '7jMw6Ueyhb4': {
      ko: '한국 생활 6개월 vs 6년의 차이',
      en: 'Living in Korea: 6 Months vs 6 Years',
      ja: '韓国生活6ヶ月 vs 6年の違い',
      zh: '在韩生活6个月vs6年的差异',
      fr: 'Vivre en Corée: 6 Mois vs 6 Ans',
      es: 'Vivir en Corea: 6 Meses vs 6 Años',
      de: 'Leben in Korea: 6 Monate vs 6 Jahre',
      ru: 'Жизнь в Корее: 6 Месяцев против 6 Лет',
      vi: 'Sống ở Hàn Quốc: 6 Tháng vs 6 Năm',
    },
    '3ymWhY7RLAE': {
      ko: '한국에선 한국말을 합시다!',
      en: "Let's Speak Korean in Korea!",
      ja: '韓国では韓国語を話しましょう！',
      zh: '在韩国说韩语吧！',
      fr: 'Parlons Coréen en Corée !',
      es: '¡Hablemos Coreano en Corea!',
      de: 'Lasst uns Koreanisch in Korea sprechen!',
      ru: 'Давайте Говорить по-Корейски в Корее!',
      vi: 'Hãy Nói Tiếng Hàn ở Hàn Quốc!',
    },
    '0Fg-P67MTnk': {
      ko: '한국에 너무 오래 살면 생기는 부작용들',
      en: 'Side Effects of Living in Korea Too Long',
      ja: '韓国に長く住みすぎると起こる副作用',
      zh: '在韩国住太久会产生的副作用',
      fr: 'Effets Secondaires de Vivre Trop Longtemps en Corée',
      es: 'Efectos Secundarios de Vivir en Corea Demasiado Tiempo',
      de: 'Nebenwirkungen des zu Langen Lebens in Korea',
      ru: 'Побочные Эффекты Слишком Долгой Жизни в Корее',
      vi: 'Tác Dụng Phụ Của Việc Sống ở Hàn Quốc Quá Lâu',
    },
    '5kDbfjQAA6Q': {
      ko: '외국인을 위한 한국 아파트 구하기 완벽 가이드',
      en: 'Complete Apartment Hunting Guide for Foreigners in Korea',
      ja: '外国人のための韓国アパート探し完全ガイド',
      zh: '外国人在韩国找公寓完全指南',
      fr: "Guide Complet de Recherche d'Appartement pour Étrangers en Corée",
      es: 'Guía Completa de Búsqueda de Apartamento para Extranjeros en Corea',
      de: 'Kompletter Wohnungssuche-Leitfaden für Ausländer in Korea',
      ru: 'Полное Руководство по Поиску Квартиры для Иностранцев в Корее',
      vi: 'Hướng Dẫn Hoàn Hảo Tìm Căn Hộ cho Người Nước Ngoài ở Hàn Quốc',
    },
    '81rLgi8zRhw': {
      ko: '서울 생활비 완전 분석 2025',
      en: 'Complete Analysis of Seoul Living Costs 2025',
      ja: 'ソウル生活費完全分析2025',
      zh: '首尔生活费完整分析2025',
      fr: 'Analyse Complète des Coûts de la Vie à Séoul 2025',
      es: 'Análisis Completo de Costos de Vida en Seúl 2025',
      de: 'Vollständige Analyse der Lebenshaltungskosten in Seoul 2025',
      ru: 'Полный Анализ Стоимости Жизни в Сеуле 2025',
      vi: 'Phân Tích Hoàn Toàn Chi Phí Sống ở Seoul 2025',
    },
    f8KgNP5qyOs: {
      ko: '한국 생활 꿀팁 모음집',
      en: 'Korea Living Tips Collection',
      ja: '韓国生活お得情報集',
      zh: '韩国生活实用小贴士合集',
      fr: 'Collection de Conseils pour Vivre en Corée',
      es: 'Colección de Consejos para Vivir en Corea',
      de: 'Korea Leben Tipps Sammlung',
      ru: 'Сборник Советов для Жизни в Корее',
      vi: 'Tuyển Tập Mẹo Sống ở Hàn Quốc',
    },
    Rcd3faBUpAQ: {
      ko: '한국어 학습과 TOPIK 시험 5가지 팁',
      en: '5 Tips for Korean Learning & TOPIK Test',
      ja: '韓国語学習とTOPIK試験5つのコツ',
      zh: '韩语学习和TOPIK考试5个技巧',
      fr: '5 Conseils pour Apprendre le Coréen & Test TOPIK',
      es: '5 Consejos para Aprender Coreano y Examen TOPIK',
      de: '5 Tipps für Koreanisch Lernen & TOPIK Prüfung',
      ru: '5 Советов для Изучения Корейского и Экзамена TOPIK',
      vi: '5 Mẹo Học Tiếng Hàn & Kỳ Thi TOPIK',
    },
    uh2Td2D9BVo: {
      ko: 'TOPIK 시험 완전 정복 가이드',
      en: 'Ultimate Guide to Acing TOPIK Exam',
      ja: 'TOPIK試験完全攻略ガイド',
      zh: 'TOPIK考试完全攻略指南',
      fr: "Guide Ultime pour Réussir l'Examen TOPIK",
      es: 'Guía Definitiva para Dominar el Examen TOPIK',
      de: 'Ultimativer Leitfaden zur TOPIK Prüfung',
      ru: 'Окончательное Руководство по Сдаче Экзамена TOPIK',
      vi: 'Hướng Dẫn Chinh Phục Hoàn Toàn Kỳ Thi TOPIK',
    },
    EamULGaprtw: {
      ko: 'TOPIK 6급까지 한국어 학습 여정',
      en: 'Korean Learning Journey to TOPIK Level 6',
      ja: 'TOPIK6級までの韓国語学習の道のり',
      zh: '韩语学习到TOPIK6级的历程',
      fr: "Parcours d'Apprentissage du Coréen jusqu'au TOPIK Niveau 6",
      es: 'Viaje de Aprendizaje de Coreano hasta TOPIK Nivel 6',
      de: 'Koreanisch Lernreise bis TOPIK Level 6',
      ru: 'Путь Изучения Корейского до TOPIK Уровня 6',
      vi: 'Hành Trình Học Tiếng Hàn đến TOPIK Cấp 6',
    },
    g9BA2vIvaiA: {
      ko: '6개월 만에 TOPIK 1급에서 5급까지',
      en: 'TOPIK Level 1 to 5 in 6 Months',
      ja: '6ヶ月でTOPIK1級から5級まで',
      zh: '6个月内从TOPIK1级到5级',
      fr: 'TOPIK Niveau 1 à 5 en 6 Mois',
      es: 'TOPIK Nivel 1 a 5 en 6 Meses',
      de: 'TOPIK Level 1 bis 5 in 6 Monaten',
      ru: 'TOPIK Уровень 1 до 5 за 6 Месяцев',
      vi: 'TOPIK Từ Cấp 1 đến 5 trong 6 Tháng',
    },
    tx_7pKLr1c8: {
      ko: '한국 유학 전 꼭 알아야 할 10가지',
      en: '10 Things You Must Know Before Studying in Korea',
      ja: '韓国留学前に必ず知るべき10のこと',
      zh: '韩国留学前必须知道的10件事',
      fr: "10 Choses à Savoir Absolument Avant d'Étudier en Corée",
      es: '10 Cosas que Debes Saber Antes de Estudiar en Corea',
      de: '10 Dinge die Sie vor dem Studium in Korea Wissen Müssen',
      ru: '10 Вещей, Которые Нужно Знать Перед Учебой в Корее',
      vi: '10 Điều Bạn Phải Biết Trước Khi Du Học Hàn Quốc',
    },
    bZJpJ6svccA: {
      ko: '한국 유학생 숙소 구하기 완전 가이드',
      en: 'Complete Guide to Finding Student Housing in Korea',
      ja: '韓国留学生宿舎探し完全ガイド',
      zh: '韩国留学生住宿完全指南',
      fr: 'Guide Complet pour Trouver un Logement Étudiant en Corée',
      es: 'Guía Completa para Encontrar Alojamiento Estudiantil en Corea',
      de: 'Kompletter Leitfaden zur Studentenunterkunft in Korea',
      ru: 'Полное Руководство по Поиску Студенческого Жилья в Корее',
      vi: 'Hướng Dẫn Hoàn Hảo Tìm Chỗ Ở Sinh Viên ở Hàn Quốc',
    },
    Yt7l_XklAg8: {
      ko: '외국인으로서 한국에서 일하는 현실',
      en: 'Reality of Working in Korea as a Foreigner',
      ja: '外国人として韓国で働く現実',
      zh: '作为外国人在韩国工作的现实',
      fr: "Réalité de Travailler en Corée en tant qu'Étranger",
      es: 'Realidad de Trabajar en Corea como Extranjero',
      de: 'Realität des Arbeitens in Korea als Ausländer',
      ru: 'Реальность Работы в Корее как Иностранца',
      vi: 'Thực Tế Làm Việc ở Hàn Quốc với Tư Cách Người Nước Ngoài',
    },
    db4YC3J1VAU: {
      ko: '한국 면접 질문 답변법',
      en: 'How to Answer Korean Job Interview Questions',
      ja: '韓国面接質問の答え方',
      zh: '韩国面试问题回答技巧',
      fr: "Comment Répondre aux Questions d'Entretien d'Embauche Coréen",
      es: 'Cómo Responder Preguntas de Entrevista de Trabajo Coreana',
      de: 'Wie man Koreanische Vorstellungsgespräch Fragen Beantwortet',
      ru: 'Как Отвечать на Вопросы Корейского Собеседования',
      vi: 'Cách Trả Lời Câu Hỏi Phỏng Vấn Việc Làm Hàn Quốc',
    },
    VSamY6SHwRs: {
      ko: '한국 취업 성공기 - E7 비자까지',
      en: 'Success Story: Getting a Job in Korea - E7 Visa Journey',
      ja: '韓国就職成功記 - E7ビザまで',
      zh: '韩国就业成功记 - 直到E7签证',
      fr: 'Histoire de Succès: Obtenir un Emploi en Corée - Parcours Visa E7',
      es: 'Historia de Éxito: Conseguir Trabajo en Corea - Viaje Visa E7',
      de: 'Erfolgsgeschichte: Job in Korea Bekommen - E7 Visa Reise',
      ru: 'История Успеха: Получение Работы в Корее - Путь к Визе E7',
      vi: 'Câu Chuyện Thành Công: Tìm Việc ở Hàn Quốc - Hành Trình Visa E7',
    },
    '-WjlvfggAjE': {
      ko: '한국인이 생각하는 해외 한국인에 대한 인식',
      en: 'What Koreans Think About Overseas Koreans',
      ja: '韓国人が考える海外韓国人に対する認識',
      zh: '韩国人对海外韩国人的看法',
      fr: "Ce que les Coréens Pensent des Coréens d'Outre-mer",
      es: 'Lo que los Coreanos Piensan Sobre los Coreanos en el Extranjero',
      de: 'Was Koreaner über Übersee-Koreaner Denken',
      ru: 'Что Корейцы Думают о Зарубежных Корейцах',
      vi: 'Người Hàn Quốc Nghĩ Gì Về Người Hàn Quốc Hải Ngoại',
    },
    PmmKNGMI9F8: {
      ko: '한국 사회 적응과 직장 문화 이해하기',
      en: 'Understanding Korean Society & Workplace Culture',
      ja: '韓国社会適応と職場文化の理解',
      zh: '理解韩国社会适应和职场文化',
      fr: 'Comprendre la Société Coréenne et la Culture du Travail',
      es: 'Entender la Sociedad Coreana y la Cultura Laboral',
      de: 'Verständnis der Koreanischen Gesellschaft & Arbeitsplatzkultur',
      ru: 'Понимание Корейского Общества и Культуры Рабочего Места',
      vi: 'Hiểu Xã Hội Hàn Quốc & Văn Hóa Công Sở',
    },
    s4QrQYg7M5Y: {
      ko: '한국 직장인 생활과 쇼핑 문화',
      en: 'Korean Office Worker Life & Shopping Culture',
      ja: '韓国会社員生活とショッピング文化',
      zh: '韩国上班族生活和购物文化',
      fr: 'Vie des Employés de Bureau Coréens et Culture du Shopping',
      es: 'Vida de Oficinista Coreano y Cultura de Compras',
      de: 'Koreanisches Büroangestelltenleben & Einkaufskultur',
      ru: 'Жизнь Корейского Офисного Работника и Культура Шопинга',
      vi: 'Cuộc Sống Nhân Viên Văn Phòng Hàn Quốc & Văn Hóa Mua Sắm',
    },
  };

  // 제목 번역 함수
  const getTranslatedTitle = (videoId: string): string => {
    const titles = videoTitles[videoId as keyof typeof videoTitles];
    if (!titles) return videoId;
    return titles[language as keyof typeof titles] || titles.ko || videoId;
  };

  const baseSampleVideos = {
    travel: [
      {
        id: '2v8uecv5LEQ',
        thumbnail: 'https://img.youtube.com/vi/2v8uecv5LEQ/mqdefault.jpg',
        title: getTranslatedTitle('2v8uecv5LEQ'),
        channelName: 'Korean Englishman',
        liked: false,
        tags: ['travel'],
        views: '',
      },
      {
        id: 'O5_jxkEBSZU',
        thumbnail: 'https://img.youtube.com/vi/O5_jxkEBSZU/mqdefault.jpg',
        title: getTranslatedTitle('O5_jxkEBSZU'),
        channelName: 'Travel Korea',
        liked: false,
        tags: ['tourism'],
        views: '',
      },
      {
        id: '4GKwxnk0E4s',
        thumbnail: 'https://img.youtube.com/vi/4GKwxnk0E4s/mqdefault.jpg',
        title: getTranslatedTitle('4GKwxnk0E4s'),
        channelName: 'Korea Tourism',
        liked: false,
        tags: ['travel'],
        views: '',
      },
      {
        id: 'hx0cbc2jr90',
        thumbnail: 'https://img.youtube.com/vi/hx0cbc2jr90/mqdefault.jpg',
        title: getTranslatedTitle('hx0cbc2jr90'),
        channelName: 'Korea Travel Updates',
        liked: false,
        tags: ['travel'],
        views: '',
      },
      {
        id: 'kDvDk2lw72c',
        thumbnail: 'https://img.youtube.com/vi/kDvDk2lw72c/mqdefault.jpg',
        title: getTranslatedTitle('kDvDk2lw72c'),
        channelName: 'Korean Culture Guide',
        liked: false,
        tags: ['tourism'],
        views: '',
      },
      {
        id: 'ELdMLCfrNy4',
        thumbnail: 'https://img.youtube.com/vi/ELdMLCfrNy4/mqdefault.jpg',
        title: getTranslatedTitle('ELdMLCfrNy4'),
        channelName: 'Korea Culture Shock',
        liked: false,
        tags: ['travel'],
        views: '',
      },
    ],
    living: [
      {
        id: '7jMw6Ueyhb4',
        thumbnail: 'https://img.youtube.com/vi/7jMw6Ueyhb4/mqdefault.jpg',
        title: getTranslatedTitle('7jMw6Ueyhb4'),
        channelName: 'DAVE (데이브)',
        liked: false,
        tags: ['living'],
        views: '',
      },
      {
        id: '3ymWhY7RLAE',
        thumbnail: 'https://img.youtube.com/vi/3ymWhY7RLAE/mqdefault.jpg',
        title: getTranslatedTitle('3ymWhY7RLAE'),
        channelName: 'DAVE (데이브)',
        liked: false,
        tags: ['living'],
        views: '',
      },
      {
        id: '0Fg-P67MTnk',
        thumbnail: 'https://img.youtube.com/vi/0Fg-P67MTnk/mqdefault.jpg',
        title: getTranslatedTitle('0Fg-P67MTnk'),
        channelName: 'DAVE (데이브)',
        liked: false,
        tags: ['living'],
        views: '',
      },
      {
        id: '5kDbfjQAA6Q',
        thumbnail: 'https://img.youtube.com/vi/5kDbfjQAA6Q/mqdefault.jpg',
        title: getTranslatedTitle('5kDbfjQAA6Q'),
        channelName: 'Korea Housing Guide',
        liked: false,
        tags: ['residence'],
        views: '',
      },
      {
        id: '81rLgi8zRhw',
        thumbnail: 'https://img.youtube.com/vi/81rLgi8zRhw/mqdefault.jpg',
        title: getTranslatedTitle('81rLgi8zRhw'),
        channelName: 'Seoul Living Cost',
        liked: false,
        tags: ['living'],
        views: '',
      },
      {
        id: 'f8KgNP5qyOs',
        thumbnail: 'https://img.youtube.com/vi/f8KgNP5qyOs/mqdefault.jpg',
        title: getTranslatedTitle('f8KgNP5qyOs'),
        channelName: 'Korea Life Tips',
        liked: false,
        tags: ['residence'],
        views: '',
      },
    ],
    study: [
      {
        id: 'Rcd3faBUpAQ',
        thumbnail: 'https://img.youtube.com/vi/Rcd3faBUpAQ/mqdefault.jpg',
        title: getTranslatedTitle('Rcd3faBUpAQ'),
        channelName: 'Korean Study Tips',
        liked: false,
        tags: ['study'],
        views: '',
      },
      {
        id: 'uh2Td2D9BVo',
        thumbnail: 'https://img.youtube.com/vi/uh2Td2D9BVo/mqdefault.jpg',
        title: getTranslatedTitle('uh2Td2D9BVo'),
        channelName: 'Yonsei Language',
        liked: false,
        tags: ['study'],
        views: '',
      },
      {
        id: 'EamULGaprtw',
        thumbnail: 'https://img.youtube.com/vi/EamULGaprtw/mqdefault.jpg',
        title: getTranslatedTitle('EamULGaprtw'),
        channelName: 'SolBridge Student',
        liked: false,
        tags: ['university'],
        views: '',
      },
      {
        id: 'g9BA2vIvaiA',
        thumbnail: 'https://img.youtube.com/vi/g9BA2vIvaiA/mqdefault.jpg',
        title: getTranslatedTitle('g9BA2vIvaiA'),
        channelName: 'Korean Fast Track',
        liked: false,
        tags: ['study'],
        views: '',
      },
      {
        id: 'tx_7pKLr1c8',
        thumbnail: 'https://img.youtube.com/vi/tx_7pKLr1c8/mqdefault.jpg',
        title: getTranslatedTitle('tx_7pKLr1c8'),
        channelName: 'Study in Korea Guide',
        liked: false,
        tags: ['university'],
        views: '',
      },
      {
        id: 'bZJpJ6svccA',
        thumbnail: 'https://img.youtube.com/vi/bZJpJ6svccA/mqdefault.jpg',
        title: getTranslatedTitle('bZJpJ6svccA'),
        channelName: 'Korean Student Housing',
        liked: false,
        tags: ['study'],
        views: '',
      },
    ],
    job: [
      {
        id: 'Yt7l_XklAg8',
        thumbnail: 'https://img.youtube.com/vi/Yt7l_XklAg8/mqdefault.jpg',
        title: getTranslatedTitle('Yt7l_XklAg8'),
        channelName: 'Korea Work Reality',
        liked: false,
        tags: ['job'],
        views: '',
      },
      {
        id: 'db4YC3J1VAU',
        thumbnail: 'https://img.youtube.com/vi/db4YC3J1VAU/mqdefault.jpg',
        title: getTranslatedTitle('db4YC3J1VAU'),
        channelName: 'Korea Interview Guide',
        liked: false,
        tags: ['job'],
        views: '',
      },
      {
        id: 'VSamY6SHwRs',
        thumbnail: 'https://img.youtube.com/vi/VSamY6SHwRs/mqdefault.jpg',
        title: getTranslatedTitle('VSamY6SHwRs'),
        channelName: 'Korea Career Success',
        liked: false,
        tags: ['work'],
        views: '',
      },
      {
        id: '-WjlvfggAjE',
        thumbnail: 'https://img.youtube.com/vi/-WjlvfggAjE/mqdefault.jpg',
        title: getTranslatedTitle('-WjlvfggAjE'),
        channelName: 'Korean Perspective',
        liked: false,
        tags: ['work'],
        views: '',
      },
      {
        id: 'PmmKNGMI9F8',
        thumbnail: 'https://img.youtube.com/vi/PmmKNGMI9F8/mqdefault.jpg',
        title: getTranslatedTitle('PmmKNGMI9F8'),
        channelName: 'Korea Social Integration',
        liked: false,
        tags: ['job'],
        views: '',
      },
      {
        id: 's4QrQYg7M5Y',
        thumbnail: 'https://img.youtube.com/vi/s4QrQYg7M5Y/mqdefault.jpg',
        title: getTranslatedTitle('s4QrQYg7M5Y'),
        channelName: 'Korea Work Life',
        liked: false,
        tags: ['work'],
        views: '',
      },
    ],
    work: [
      {
        id: 'Yt7l_XklAg8',
        thumbnail: 'https://img.youtube.com/vi/Yt7l_XklAg8/mqdefault.jpg',
        title: getTranslatedTitle('Yt7l_XklAg8'),
        channelName: 'Korea Work Reality',
        liked: false,
        tags: ['job'],
        views: '',
      },
      {
        id: 'db4YC3J1VAU',
        thumbnail: 'https://img.youtube.com/vi/db4YC3J1VAU/mqdefault.jpg',
        title: getTranslatedTitle('db4YC3J1VAU'),
        channelName: 'Korea Interview Guide',
        liked: false,
        tags: ['job'],
        views: '',
      },
      {
        id: 'VSamY6SHwRs',
        thumbnail: 'https://img.youtube.com/vi/VSamY6SHwRs/mqdefault.jpg',
        title: getTranslatedTitle('VSamY6SHwRs'),
        channelName: 'Korea Career Success',
        liked: false,
        tags: ['work'],
        views: '',
      },
      {
        id: '-WjlvfggAjE',
        thumbnail: 'https://img.youtube.com/vi/-WjlvfggAjE/mqdefault.jpg',
        title: getTranslatedTitle('-WjlvfggAjE'),
        channelName: 'Korean Perspective',
        liked: false,
        tags: ['work'],
        views: '',
      },
      {
        id: 'PmmKNGMI9F8',
        thumbnail: 'https://img.youtube.com/vi/PmmKNGMI9F8/mqdefault.jpg',
        title: getTranslatedTitle('PmmKNGMI9F8'),
        channelName: 'Korea Social Integration',
        liked: false,
        tags: ['job'],
        views: '',
      },
      {
        id: 's4QrQYg7M5Y',
        thumbnail: 'https://img.youtube.com/vi/s4QrQYg7M5Y/mqdefault.jpg',
        title: getTranslatedTitle('s4QrQYg7M5Y'),
        channelName: 'Korea Work Life',
        liked: false,
        tags: ['work'],
        views: '',
      },
    ],
  };

  // 🎯 6개 중에서 랜덤으로 3개 선택
  const allVideos = baseSampleVideos[purpose] || baseSampleVideos.travel;
  const shuffled = [...allVideos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

// 캐시 키 생성 함수
const getCacheKey = (purpose: string) => `youtube_cache_${purpose}`;

// 캐시 유효성 확인 (12시간)
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < 12 * 60 * 60 * 1000; // 12시간
};

// 로컬스토리지에서 캐시된 데이터 가져오기
const getCachedVideos = (purpose: keyof typeof PURPOSE_SEARCH_QUERIES): VideoItem[] | null => {
  try {
    const cacheKey = getCacheKey(purpose);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (isCacheValid(timestamp)) {
        console.log(`[YouTubeWidget] 캐시된 데이터 사용 (${purpose})`);
        return data;
      } else {
        // 만료된 캐시 삭제
        localStorage.removeItem(cacheKey);
      }
    }
  } catch (error) {
    console.error('캐시 읽기 오류:', error);
  }
  return null;
};

// 로컬스토리지에 데이터 캐시하기
const setCachedVideos = (purpose: keyof typeof PURPOSE_SEARCH_QUERIES, videos: VideoItem[]) => {
  try {
    const cacheKey = getCacheKey(purpose);
    const cacheData = {
      data: videos,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`[YouTubeWidget] 데이터 캐시됨 (${purpose})`);
  } catch (error) {
    console.error('캐시 저장 오류:', error);
  }
};

// visitPurpose를 PURPOSE_SEARCH_QUERIES 키로 매핑
const mapVisitPurposeToSearchKey = (visitPurpose: string): keyof typeof PURPOSE_SEARCH_QUERIES => {
  switch (visitPurpose?.toLowerCase()) {
    case 'travel':
    case '여행':
      return 'travel';
    case 'living':
    case 'residence':
    case '거주':
    case '생활':
      return 'living';
    case 'study':
    case '유학':
    case '학습':
      return 'study';
    case 'job':
    case 'work':
    case '취업':
    case '직장':
      return 'job';
    default:
      return 'travel'; // 기본값
  }
};

const YoutubeGalleryWidget: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ id: string; title: string } | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentPurpose, setCurrentPurpose] =
    useState<keyof typeof PURPOSE_SEARCH_QUERIES>('travel');
  const [isUsingSampleData, setIsUsingSampleData] = useState<boolean>(false);
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 사용자 목적에 따른 초기 purpose 설정
  useEffect(() => {
    if (user?.visitPurpose) {
      const purposeKey = mapVisitPurposeToSearchKey(user.visitPurpose);
      setCurrentPurpose(purposeKey);
      console.log('[YouTubeWidget] 사용자 목적 적용:', user.visitPurpose, '->', purposeKey);
    }
  }, [user]);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchVideosByPurpose(currentPurpose);
  }, [currentPurpose]);

  // 언어 변경 시 새로운 영상 로딩 (목적은 유지)
  useEffect(() => {
    if (language) {
      // 캐시된 데이터가 있으면 API 호출하지 않음
      const cachedVideos = getCachedVideos(currentPurpose);
      if (!cachedVideos) {
        fetchVideosByPurpose(currentPurpose);
      } else if (isUsingSampleData) {
        // 샘플 데이터 사용 중이면 언어에 맞게 제목 업데이트
        setVideos(getSampleVideosByPurpose(currentPurpose, language));
      }
    }
  }, [language]);

  // 대화상자 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
    // 약간의 딜레이 후 재생 비디오 정보 초기화 (애니메이션 완료 후)
    setTimeout(() => {
      setPlayingVideo(null);
    }, 300);
  };

  // 목적별 영상 가져오기
  const fetchVideosByPurpose = async (purpose: keyof typeof PURPOSE_SEARCH_QUERIES) => {
    try {
      setLoading(true);
      setError(null);

      // 1. 먼저 캐시된 데이터 확인
      const cachedVideos = getCachedVideos(purpose);
      if (cachedVideos) {
        setVideos(cachedVideos);
        setIsUsingSampleData(false);
        setLoading(false);
        return;
      }

      // 2. YouTube API 키 확인
      if (!env.YOUTUBE_API_KEY) {
        console.log('[YouTubeWidget] API 키가 없어서 샘플 데이터 사용');
        setVideos(getSampleVideosByPurpose(purpose, language));
        setIsUsingSampleData(true);
        setLoading(false);
        return;
      }

      const searchQuery = PURPOSE_SEARCH_QUERIES[purpose];

      // 3. YouTube API 호출 (캐시가 없을 때만)
      console.log(`[YouTubeWidget] API 호출 시작 (${purpose}) - 캐시 없음`);
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 6, // 🎯 6개 가져와서 랜덤 선택
          q: searchQuery,
          type: 'video',
          key: env.YOUTUBE_API_KEY,
          regionCode: 'KR',
          relevanceLanguage: 'ko',
        },
      });

      if (response.data.items) {
        // 비디오 ID 목록 추출
        const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');

        // 비디오 통계 정보 가져오기
        const statsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'statistics,snippet',
            id: videoIds,
            key: env.YOUTUBE_API_KEY,
          },
        });

        // 검색 결과와 통계 정보 결합
        const allVideoData = statsResponse.data.items.map((item: any) => {
          //  포맷팅
          const viewCount = parseInt(item.statistics.viewCount);
          let formattedViews = '';

          if (viewCount >= 10000) {
            formattedViews = `${(viewCount / 10000).toFixed(1)}만`;
          } else if (viewCount >= 1000) {
            formattedViews = `${(viewCount / 1000).toFixed(1)}천`;
          } else {
            formattedViews = viewCount.toString();
          }

          // 목적별 태그 설정
          const purposeTags = {
            travel: ['travel', 'tourism'],
            living: ['living', 'residence'],
            study: ['study', 'university'],
            job: ['job', 'work'],
            work: ['job', 'work'], // work 키 추가
          };

          return {
            id: item.id,
            thumbnail: item.snippet.thumbnails.high.url,
            title: item.snippet.title,
            channelName: item.snippet.channelTitle,
            liked: false,
            tags: purposeTags[purpose] || ['korea'],
            views: formattedViews,
          };
        });

        // 🎯 6개 중에서 랜덤으로 3개 선택
        const shuffledVideos = [...allVideoData].sort(() => Math.random() - 0.5);
        const selectedVideos = shuffledVideos.slice(0, 3);

        // 4. 성공한 데이터를 캐시에 저장 (선택된 3개만)
        setCachedVideos(purpose, selectedVideos);
        setVideos(selectedVideos);
        setIsUsingSampleData(false);
        console.log(
          `[YouTubeWidget] API 호출 성공 및 캐시 저장 (${purpose}) - ${allVideoData.length}개 중 ${selectedVideos.length}개 랜덤 선택`
        );
      }
    } catch (err: any) {
      console.error('YouTube API 오류:', err);

      // 5. API 오류 시 샘플 데이터 사용
      if (err.response?.status === 403) {
        console.log('[YouTubeWidget] API 할당량 초과로 샘플 데이터 사용');
        setVideos(getSampleVideosByPurpose(purpose, language));
        setIsUsingSampleData(true);
        setError(null); // 에러 메시지 숨김 (샘플 데이터로 대체)
      } else {
        console.log('[YouTubeWidget] API 오류로 샘플 데이터 사용');
        setVideos(getSampleVideosByPurpose(purpose, language));
        setIsUsingSampleData(true);
        setError(null); // 에러 메시지 숨김 (샘플 데이터로 대체)
      }
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = (id: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video => (video.id === id ? { ...video, liked: !video.liked } : video))
    );
  };

  // 비디오 재생
  const handlePlayVideo = (id: string, title: string) => {
    // 이제 모든 영상이 실제 YouTube ID이므로 정상 재생 가능
    setPlayingVideo({ id, title });
    setOpenDialog(true);
  };

  // 번역된 목적 가져오기
  const getTranslatedPurpose = (purpose: keyof typeof PURPOSE_SEARCH_QUERIES): string => {
    const purposeTranslationMap = {
      travel: 'widgets.youtubeGallery.purposes.travel',
      living: 'widgets.youtubeGallery.purposes.residence',
      study: 'widgets.youtubeGallery.purposes.study',
      job: 'widgets.youtubeGallery.purposes.employment',
      work: 'widgets.youtubeGallery.purposes.employment',
    };
    return t(purposeTranslationMap[purpose]) || purpose;
  };

  // 번역된 태그 가져오기 (하나의 태그만 표시)
  const getTranslatedTag = (tagKey: string): string => {
    return t(`widgets.youtubeGallery.tags.${tagKey}`) || tagKey;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...widgetPaperBase,
        background: widgetGradients.purple,
        p: 2,
        height: isMobile ? (isCollapsed ? '56px' : 'auto') : '100%',
        ...(isMobile && { minHeight: 'unset', maxHeight: 'unset', flex: 'unset' }),
        overflow: isMobile && isCollapsed ? 'hidden' : 'auto',
        transition: 'height 0.2s',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <YouTubeIcon sx={{ mr: 1, color: 'error.main' }} />
        <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
          {t('widgets.youtubeGallery.title')}
        </Typography>
        <IconButton
          sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1 }}
          size="small"
          onClick={() => setIsCollapsed(v => !v)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* 에러 메시지 */}
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* 로딩 표시 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} color="primary" />
        </Box>
      )}

      {/* 비디오 그리드 */}
      {(isMobile ? !isCollapsed : true) && videos.length > 0 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {videos.map(video => (
              <Box
                key={video.id}
                sx={{
                  width: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 12px)' },
                  position: 'relative',
                }}
              >
                <Card
                  sx={{
                    borderRadius: 1.5,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      '& .overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={video.thumbnail}
                      alt={video.title}
                    />

                    {/* 오버레이 */}
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}
                        onClick={() => handleLikeToggle(video.id)}
                      >
                        {video.liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}
                        onClick={() => handlePlayVideo(video.id, video.title)}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {video.channelName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {video.views}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.8rem' }}
                    >
                      {video.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {video.tags.slice(0, 1).map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={getTranslatedTag(tag)}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            color: 'error.main',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* 비디오가 없을 때 */}
      {!loading && videos.length === 0 && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography color="text.secondary">검색 결과가 없습니다.</Typography>
        </Box>
      )}

      {(isMobile ? !isCollapsed : true) && (
        <Box
          sx={{ textAlign: 'center', mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="caption" color="text.secondary">
            {isUsingSampleData
              ? t('widgets.youtubeGallery.messages.sampleDataInfo')
              : t('widgets.youtubeGallery.info.poweredBy')}
          </Typography>
        </Box>
      )}

      {/* 비디오 재생 모달 */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle1" noWrap sx={{ maxWidth: '80%' }}>
            {playingVideo?.title}
          </Typography>
          <MuiIconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              color: theme => theme.palette.grey[500],
            }}
            size="small"
          >
            <CloseIcon />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: { xs: '250px', sm: '400px', md: '500px' } }}>
          {playingVideo && (
            <Box
              component="iframe"
              sx={{
                border: 0,
                width: '100%',
                height: '100%',
              }}
              src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0`}
              title={playingVideo.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default YoutubeGalleryWidget;
