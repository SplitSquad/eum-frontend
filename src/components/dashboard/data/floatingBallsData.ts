// FloatingPurposeBalls 다국어 데이터 구조

export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh' | 'de' | 'fr' | 'es' | 'ru';

export interface ContentDetail {
    location?: string;
    transport?: string;
    hours?: string;
    price?: string;
    program?: string;
    website?: string;
    basic?: string;
  
    // 공통 배열 타입
    tips?: string[];
    locations?: string[];
    specialties?: string[];
    foods?: string[];
    options?: string[];
    apps?: string[];
  
    // 공통 객체 타입
    areas?: Record<string, string>;
    districts?: Record<string, string>;
    other_cities?: Record<string, string>;
    restaurants?: Record<string, string>;
    payment?: Record<string, string>;
    saving_tips?: Record<string, string>;
    traditional?: Record<string, string>;
    modern?: Record<string, string>;
    holidays?: Record<string, string>;
    seasons?: Record<string, string>;
    offline?: Record<string, string>;
    online?: Record<string, string>;
    garbage?: Record<string, string>;
    seoul?: Record<string, string>;
    embassies?: Record<string, string>;
  
    common_problems?: Record<string, string> | string[];
    contacts?: string[];
    payment_methods?: string[];
  
    greetings?: string[];
    indoor?: string[];
  
    laundry?: string[];
    delivery?: string[];
  
    four_sections?: Record<string, string>;
    visa_types?: Record<string, string>;
    major_events?: Record<string, string>;
    platforms?: Record<string, string>;
    common_docs?: Record<string, string> | string[];
  
    // studyContent 관련
    main_procedures?: string[];
    university_examples?: string[];
    references?: string[];
  
    dining?: string[];
    dormitory?: string[];
    activities?: string[];
    facilities?: string[];
  
    preparatory_course?: string[];
    language_options?: string[];
  
    tutoring?: string[];
    language_support?: string[];
    counseling?: string[];
    learning_center?: string[];
  
    operating_hours?: string[];
    services?: string[];
    digital_resources?: string[];
  
    computer_lab?: string[];
    e_learning?: string[];
    printing?: string[];
    tech_support?: string[];
  
    procedures?: string[];
    required_docs?: string[];
    notes?: string[];
  
    application_place?: string[];
    processing_time?: string[];
    online_tips?: string[];
  
    features?: string[];
    cost?: string[];
    application?: string[];
    living_tips?: string[];
  
    housing_types?: Record<string, string> | string[];
    precautions?: string[];
  
    contract_checklist?: string[];
    address_registration?: string[];
    safety_tips?: string[];
  
    [key: string]: any;
  }
  
export interface FloatingBallContent {
  id: string;
  title: string;
  category: string;
  description: string;
  details: ContentDetail;
}

export interface MultilingualContent {
  [key: string]: FloatingBallContent[];
}

export type FloatingBallsData = Record<SupportedLanguage, {
  travel: FloatingBallContent[];
  work: FloatingBallContent[];
  residence: FloatingBallContent[];
  study: FloatingBallContent[];
}>;

// 여행 콘텐츠 import
import {
  koreanTravelContent,
  englishTravelContent,
  japaneseTravelContent,
  chineseTravelContent,
  germanTravelContent,
  frenchTravelContent,
  spanishTravelContent,
  russianTravelContent
} from './travelContent';
import {
  koreanWorkContent,
  englishWorkContent,
  japaneseWorkContent,
  chineseWorkContent,
  spanishWorkContent,
  russianWorkContent,
  germanWorkContent,
  frenchWorkContent
} from './workContent';
import {
  koreanResidenceContent,
  englishResidenceContent,
  japaneseResidenceContent,
  chineseResidenceContent,
  germanResidenceContent,
  frenchResidenceContent,
  spanishResidenceContent,
  russianResidenceContent
} from './residenceContent';
import {
  koreanStudyContent,
  englishStudyContent,
  japaneseStudyContent,
  chineseStudyContent,
  germanStudyContent,
  frenchStudyContent,
  spanishStudyContent,
  russianStudyContent
} from './studyContent';

// 임시 콘텐츠 - 추후 완전한 번역으로 대체 예정
const getPlaceholderContent = (language: SupportedLanguage, purpose: string): FloatingBallContent[] => {
  const baseContent = [
    {
      id: `${purpose}-1`,
      title: `${purpose} Content 1`,
      category: `${purpose} Category`,
      description: `${purpose} description in ${language}`,
      details: { basic: `Basic info in ${language}` }
    },
    {
      id: `${purpose}-2`,
      title: `${purpose} Content 2`,
      category: `${purpose} Category`,
      description: `${purpose} description in ${language}`,
      details: { basic: `Basic info in ${language}` }
    }
  ];
  return baseContent;
};

// 메인 다국어 데이터 구조
export const floatingBallsData: FloatingBallsData = {
  ko: {
    travel: koreanTravelContent,
    work: koreanWorkContent,
    residence: koreanResidenceContent,
    study: koreanStudyContent
  },
  en: {
    travel: englishTravelContent,
    work: englishWorkContent,
    residence: englishResidenceContent,
    study: englishStudyContent
  },
  ja: {
    travel: japaneseTravelContent,
    work: japaneseWorkContent,
    residence: japaneseResidenceContent,
    study: japaneseStudyContent
  },
  zh: {
    travel: chineseTravelContent,
    work: chineseWorkContent,
    residence: chineseResidenceContent,
    study: chineseStudyContent
  },
  de: {
    travel: germanTravelContent,
    work: germanWorkContent,
    residence: germanResidenceContent,
    study: germanStudyContent
  },
  fr: {
    travel: frenchTravelContent,
    work: frenchWorkContent,
    residence: frenchResidenceContent,
    study: frenchStudyContent
  },
  es: {
    travel: spanishTravelContent,
    work: spanishWorkContent,
    residence: spanishResidenceContent,
    study: spanishStudyContent
  },
  ru: {
    travel: russianTravelContent,
    work: russianWorkContent,
    residence: russianResidenceContent,
    study: russianStudyContent
  }
};

// 언어별 콘텐츠 가져오기 헬퍼 함수
export const getContentByLanguageAndPurpose = (
  language: SupportedLanguage,
  purpose: 'travel' | 'work' | 'residence' | 'study'
): FloatingBallContent[] => {
  return floatingBallsData[language]?.[purpose] || floatingBallsData['ko'][purpose];
};

// 디테일 섹션 레이블 번역
export const detailLabels: Record<SupportedLanguage, Record<string, string>> = {
  ko: {
    // 기본 정보
    'location': '위치',
    'transport': '교통편',
    'hours': '운영시간',
    'price': '요금',
    'program': '프로그램',
    'website': '웹사이트',
    'basic': '기본 정보',
    
    // 배열 타입 레이블
    'basic_structure': '기본 구성',
    'writing_tips': '작성 팁',
    'reference_sites': '참고 사이트',
    'interview_types': '면접 유형',
    'common_questions': '자주 나오는 질문',
    'foreigner_specific': '외국인 대상 질문',
    'tips': '꿀팁',
    'conversion_tips': '비자 전환 팁',
    'basic_rights': '기본 권리',
    'common_problems': '자주 발생하는 문제',
    'help_contacts': '도움 연락처',
    'required_items': '필수 계약 항목',
    'precautions': '주의사항',
    'references': '참고자료',
    'preparation': '준비물',
    'methods': '네트워킹 방법',
    'networking_tips': '네트워킹 팁',
    'requirements': '필요 조건',
    'working_hours': '근무 시간',
    'allowed_jobs': '허용 업종',
    'prohibited': '금지 업종',
    'warnings': '주의사항',
    'protection': '권리 보호',
    'checklist': '체크리스트',
    'main_procedures': '주요 절차',
    'university_examples': '대학 예시',
    'dining': '식사',
    'dormitory': '기숙사',
    'activities': '동아리 활동',
    'facilities': '시설',
    'preparatory_course': '예비 과정',
    'language_options': '강의 언어',
    'tutoring': '튜터링 프로그램',
    'language_support': '한국어 지원',
    'counseling': '상담',
    'learning_center': '학습센터',
    'operating_hours': '운영시간',
    'services': '제공 서비스',
    'digital_resources': '전자자료',
    'computer_lab': '컴퓨터실',
    'e_learning': '이러닝',
    'printing': '출력/복사',
    'tech_support': '기술 지원',
    'procedures': '절차',
    'required_docs': '필요 서류',
    'notes': '유의사항',
    'application_place': '신청 장소',
    'processing_time': '처리 기간',
    'online_tips': '온라인 발급 팁',
    'features': '주요 특징',
    'cost': '비용',
    'application': '신청 방법',
    'living_tips': '생활 팁',
    'address_registration': '전입신고',
    'safety_tips': '안전 팁',
    'contract_checklist': '계약 체크리스트',
    'specialties': '추천 먹거리',
    'locations': '장소',
    'foods': '음식 정보',
    'options': '옵션',
    'apps': '앱',
    'contacts': '연락처',
    'emergency': '응급연락처',
    
    // 객체 타입 레이블
    'four_sections': '자소서 4문항',
    'visa_types': '비자 종류',
    'major_events': '주요 박람회',
    'platforms': '구직 플랫폼',
    'common_docs': '자주 사용하는 서류',
    'housing_types': '거주 형태',
    'areas': '지역별 정보',
    'districts': '지역별 특징',
    'other_cities': '다른 도시',
    'restaurants': '추천 식당',
    'types': '유형',
    'includes': '포함 사항',
    'payment': '결제 방법',
    'payment_methods': '결제 수단',
    'saving_tips': '절약 팁',
    'greetings': '인사 예절',
    'indoor': '실내 예절',
    'traditional': '전통 활동',
    'modern': '현대 활동',
    'holidays': '공휴일',
    'seasons': '계절별 팁',
    'offline': '오프라인 쇼핑',
    'online': '온라인 쇼핑',
    'laundry': '세탁',
    'delivery': '택배',
    'garbage': '쓰레기',
    'seoul': '서울',
    'embassies': '주요 대사관',
    'hospitals': '병원',
    'pharmacy': '약국'
  },
  en: {
    // Basic information
    'location': 'Location',
    'transport': 'Transportation',
    'hours': 'Hours',
    'price': 'Price',
    'program': 'Program',
    'website': 'Website',
    'basic': 'Basic Info',
    
    // Array type labels
    'basic_structure': 'Basic Structure',
    'writing_tips': 'Writing Tips',
    'reference_sites': 'Reference Sites',
    'interview_types': 'Interview Types',
    'common_questions': 'Common Questions',
    'foreigner_specific': 'Foreigner-Specific Questions',
    'tips': 'Tips',
    'conversion_tips': 'Visa Conversion Tips',
    'basic_rights': 'Basic Rights',
    'common_problems': 'Common Problems',
    'help_contacts': 'Help Contacts',
    'required_items': 'Required Contract Items',
    'precautions': 'Precautions',
    'references': 'References',
    'preparation': 'Preparation',
    'methods': 'Networking Methods',
    'networking_tips': 'Networking Tips',
    'requirements': 'Requirements',
    'working_hours': 'Working Hours',
    'allowed_jobs': 'Allowed Jobs',
    'prohibited': 'Prohibited Jobs',
    'warnings': 'Warnings',
    'protection': 'Rights Protection',
    'checklist': 'Checklist',
    'main_procedures': 'Main Procedures',
    'university_examples': 'University Examples',
    'dining': 'Dining',
    'dormitory': 'Dormitory',
    'activities': 'Club Activities',
    'facilities': 'Facilities',
    'preparatory_course': 'Preparatory Course',
    'language_options': 'Language Options',
    'tutoring': 'Tutoring Programs',
    'language_support': 'Korean Language Support',
    'counseling': 'Counseling',
    'learning_center': 'Learning Center',
    'operating_hours': 'Operating Hours',
    'services': 'Services',
    'digital_resources': 'Digital Resources',
    'computer_lab': 'Computer Lab',
    'e_learning': 'E-Learning',
    'printing': 'Printing/Copying',
    'tech_support': 'Tech Support',
    'procedures': 'Procedures',
    'required_docs': 'Required Documents',
    'notes': 'Notes',
    'application_place': 'Application Place',
    'processing_time': 'Processing Time',
    'online_tips': 'Online Application Tips',
    'features': 'Features',
    'cost': 'Cost',
    'application': 'Application',
    'living_tips': 'Living Tips',
    'address_registration': 'Address Registration',
    'safety_tips': 'Safety Tips',
    'contract_checklist': 'Contract Checklist',
    'specialties': 'Specialties',
    'locations': 'Locations',
    'foods': 'Foods',
    'options': 'Options',
    'apps': 'Apps',
    'contacts': 'Contacts',
    'emergency': 'Emergency Contacts',
    
    // Object type labels
    'four_sections': 'Personal Statement 4 Sections',
    'visa_types': 'Visa Types',
    'major_events': 'Major Events',
    'platforms': 'Job Platforms',
    'common_docs': 'Common Documents',
    'housing_types': 'Housing Types',
    'areas': 'Area Information',
    'districts': 'District Features',
    'other_cities': 'Other Cities',
    'restaurants': 'Recommended Restaurants',
    'types': 'Types',
    'includes': 'Includes',
    'payment': 'Payment Methods',
    'payment_methods': 'Payment Options',
    'saving_tips': 'Saving Tips',
    'greetings': 'Greeting Etiquette',
    'indoor': 'Indoor Etiquette',
    'traditional': 'Traditional Activities',
    'modern': 'Modern Activities',
    'holidays': 'Holidays',
    'seasons': 'Seasonal Tips',
    'offline': 'Offline Shopping',
    'online': 'Online Shopping',
    'laundry': 'Laundry',
    'delivery': 'Delivery',
    'garbage': 'Garbage',
    'seoul': 'Seoul',
    'embassies': 'Major Embassies',
    'hospitals': 'Hospitals',
    'pharmacy': 'Pharmacy'
  },
  ja: {
    // 基本情報
    'location': '場所',
    'transport': '交通',
    'hours': '営業時間',
    'price': '料金',
    'program': 'プログラム',
    'website': 'ウェブサイト',
    'basic': '基本情報',
    
    // 配列タイプラベル
    'basic_structure': '基本構成',
    'writing_tips': '作成のコツ',
    'reference_sites': '参考サイト',
    'interview_types': '面接形式',
    'common_questions': 'よくある質問',
    'foreigner_specific': '外国人向け質問',
    'tips': 'コツ',
    'conversion_tips': 'ビザ転換のコツ',
    'basic_rights': '基本権利',
    'common_problems': 'よくある問題',
    'help_contacts': 'ヘルプ連絡先',
    'required_items': '必須契約項目',
    'precautions': '注意事項',
    'references': '参考資料',
    'preparation': '準備物',
    'methods': 'ネットワーキング方法',
    'networking_tips': 'ネットワーキングのコツ',
    'requirements': '必要条件',
    'working_hours': '勤務時間',
    'allowed_jobs': '許可業種',
    'prohibited': '禁止業種',
    'warnings': '警告',
    'protection': '権利保護',
    'checklist': 'チェックリスト',
    'main_procedures': '主要手続き',
    'university_examples': '大学例',
    'dining': '食事',
    'dormitory': '寮',
    'activities': 'サークル活動',
    'facilities': '施設',
    'preparatory_course': '予備課程',
    'language_options': '講義言語',
    'tutoring': 'チュータープログラム',
    'language_support': '韓国語サポート',
    'counseling': 'カウンセリング',
    'learning_center': '学習センター',
    'operating_hours': '運営時間',
    'services': '提供サービス',
    'digital_resources': '電子資料',
    'computer_lab': 'コンピュータ室',
    'e_learning': 'eラーニング',
    'printing': '印刷/コピー',
    'tech_support': '技術サポート',
    'procedures': '手続き',
    'required_docs': '必要書類',
    'notes': '注意事項',
    'application_place': '申請場所',
    'processing_time': '処理期間',
    'online_tips': 'オンライン発行のコツ',
    'features': '主要特徴',
    'cost': '費用',
    'application': '申請方法',
    'living_tips': '生活のコツ',
    'address_registration': '転入届',
    'safety_tips': '安全のコツ',
    'contract_checklist': '契約チェックリスト',
    'specialties': 'おすすめグルメ',
    'locations': '場所',
    'foods': '食べ物情報',
    'options': 'オプション',
    'apps': 'アプリ',
    'contacts': '連絡先',
    'emergency': '緊急連絡先',
    
    // オブジェクトタイプラベル
    'four_sections': '自己紹介書4項目',
    'visa_types': 'ビザ種類',
    'major_events': '主要博覧会',
    'platforms': '求職プラットフォーム',
    'common_docs': 'よく使う書類',
    'housing_types': '居住形態',
    'areas': '地域別情報',
    'districts': '地域別特徴',
    'other_cities': '他の都市',
    'restaurants': 'おすすめレストラン',
    'types': 'タイプ',
    'includes': '含むもの',
    'payment': '決済方法',
    'payment_methods': '決済手段',
    'saving_tips': '節約のコツ',
    'greetings': '挨拶エチケット',
    'indoor': '屋内エチケット',
    'traditional': '伝統活動',
    'modern': '現代活動',
    'holidays': '祝日',
    'seasons': '季節別のコツ',
    'offline': 'オフラインショッピング',
    'online': 'オンラインショッピング',
    'laundry': '洗濯',
    'delivery': '宅配',
    'garbage': 'ゴミ',
    'seoul': 'ソウル',
    'embassies': '主要大使館',
    'hospitals': '病院',
    'pharmacy': '薬局'
  },
  zh: {
    // 基本信息
    'location': '位置',
    'transport': '交通',
    'hours': '营业时间',
    'price': '价格',
    'program': '项目',
    'website': '网站',
    'basic': '基本信息',
    
    // 数组类型标签
    'basic_structure': '基本结构',
    'writing_tips': '写作技巧',
    'reference_sites': '参考网站',
    'interview_types': '面试类型',
    'common_questions': '常见问题',
    'foreigner_specific': '外国人专用问题',
    'tips': '小贴士',
    'conversion_tips': '签证转换技巧',
    'basic_rights': '基本权利',
    'common_problems': '常见问题',
    'help_contacts': '帮助联系方式',
    'required_items': '必需合同项目',
    'precautions': '注意事项',
    'references': '参考资料',
    'preparation': '准备物品',
    'methods': '网络建设方法',
    'networking_tips': '网络建设技巧',
    'requirements': '必要条件',
    'working_hours': '工作时间',
    'allowed_jobs': '允许职业',
    'prohibited': '禁止职业',
    'warnings': '警告',
    'protection': '权利保护',
    'checklist': '清单',
    'main_procedures': '主要程序',
    'university_examples': '大学示例',
    'dining': '餐饮',
    'dormitory': '宿舍',
    'activities': '社团活动',
    'facilities': '设施',
    'preparatory_course': '预备课程',
    'language_options': '授课语言',
    'tutoring': '辅导项目',
    'language_support': '韩语支持',
    'counseling': '咨询',
    'learning_center': '学习中心',
    'operating_hours': '运营时间',
    'services': '提供服务',
    'digital_resources': '电子资源',
    'computer_lab': '计算机室',
    'e_learning': '在线学习',
    'printing': '打印/复印',
    'tech_support': '技术支持',
    'procedures': '程序',
    'required_docs': '必需文件',
    'notes': '注意事项',
    'application_place': '申请地点',
    'processing_time': '处理时间',
    'online_tips': '在线申请技巧',
    'features': '主要特点',
    'cost': '费用',
    'application': '申请方法',
    'living_tips': '生活技巧',
    'address_registration': '住址登记',
    'safety_tips': '安全技巧',
    'contract_checklist': '合同清单',
    'specialties': '推荐美食',
    'locations': '地点',
    'foods': '食物信息',
    'options': '选项',
    'apps': '应用',
    'contacts': '联系方式',
    'emergency': '紧急联系方式',
    
    // 对象类型标签
    'four_sections': '自我介绍4项',
    'visa_types': '签证类型',
    'major_events': '主要博览会',
    'platforms': '求职平台',
    'common_docs': '常用文件',
    'housing_types': '住房类型',
    'areas': '地区信息',
    'districts': '地区特色',
    'other_cities': '其他城市',
    'restaurants': '推荐餐厅',
    'types': '类型',
    'includes': '包含内容',
    'payment': '支付方式',
    'payment_methods': '支付手段',
    'saving_tips': '省钱技巧',
    'greetings': '问候礼仪',
    'indoor': '室内礼仪',
    'traditional': '传统活动',
    'modern': '现代活动',
    'holidays': '节假日',
    'seasons': '季节技巧',
    'offline': '线下购物',
    'online': '在线购物',
    'laundry': '洗衣',
    'delivery': '快递',
    'garbage': '垃圾',
    'seoul': '首尔',
    'embassies': '主要大使馆',
    'hospitals': '医院',
    'pharmacy': '药房'
  },
  de: {
    // Grundinformationen
    'location': 'Standort',
    'transport': 'Transport',
    'hours': 'Öffnungszeiten',
    'price': 'Preis',
    'program': 'Programm',
    'website': 'Website',
    'basic': 'Grundinfo',
    
    // Array-Typ Labels
    'basic_structure': 'Grundstruktur',
    'writing_tips': 'Schreibtipps',
    'reference_sites': 'Referenz-Websites',
    'interview_types': 'Interview-Typen',
    'common_questions': 'Häufige Fragen',
    'foreigner_specific': 'Ausländerspezifische Fragen',
    'tips': 'Tipps',
    'conversion_tips': 'Visa-Umwandlungstipps',
    'basic_rights': 'Grundrechte',
    'common_problems': 'Häufige Probleme',
    'help_contacts': 'Hilfe-Kontakte',
    'required_items': 'Erforderliche Vertragsartikel',
    'precautions': 'Vorsichtsmaßnahmen',
    'references': 'Referenzen',
    'preparation': 'Vorbereitung',
    'methods': 'Networking-Methoden',
    'networking_tips': 'Networking-Tipps',
    'requirements': 'Anforderungen',
    'working_hours': 'Arbeitszeiten',
    'allowed_jobs': 'Erlaubte Jobs',
    'prohibited': 'Verbotene Jobs',
    'warnings': 'Warnungen',
    'protection': 'Rechteschutz',
    'checklist': 'Checkliste',
    'main_procedures': 'Hauptverfahren',
    'university_examples': 'Universitätsbeispiele',
    'dining': 'Speisen',
    'dormitory': 'Wohnheim',
    'activities': 'Club-Aktivitäten',
    'facilities': 'Einrichtungen',
    'preparatory_course': 'Vorbereitungskurs',
    'language_options': 'Sprachoptionen',
    'tutoring': 'Tutoring-Programme',
    'language_support': 'Koreanisch-Unterstützung',
    'counseling': 'Beratung',
    'learning_center': 'Lernzentrum',
    'operating_hours': 'Betriebszeiten',
    'services': 'Dienste',
    'digital_resources': 'Digitale Ressourcen',
    'computer_lab': 'Computerlabor',
    'e_learning': 'E-Learning',
    'printing': 'Drucken/Kopieren',
    'tech_support': 'Tech-Support',
    'procedures': 'Verfahren',
    'required_docs': 'Erforderliche Dokumente',
    'notes': 'Hinweise',
    'application_place': 'Antragsort',
    'processing_time': 'Bearbeitungszeit',
    'online_tips': 'Online-Antragstipps',
    'features': 'Merkmale',
    'cost': 'Kosten',
    'application': 'Anwendung',
    'living_tips': 'Lebenstipps',
    'address_registration': 'Adressregistrierung',
    'safety_tips': 'Sicherheitstipps',
    'contract_checklist': 'Vertrags-Checkliste',
    'specialties': 'Spezialitäten',
    'locations': 'Standorte',
    'foods': 'Lebensmittel',
    'options': 'Optionen',
    'apps': 'Apps',
    'contacts': 'Kontakte',
    'emergency': 'Notfallkontakte',
    
    // Objekt-Typ Labels
    'four_sections': 'Persönliche Erklärung 4 Abschnitte',
    'visa_types': 'Visa-Typen',
    'major_events': 'Hauptveranstaltungen',
    'platforms': 'Job-Plattformen',
    'common_docs': 'Häufige Dokumente',
    'housing_types': 'Wohnungstypen',
    'areas': 'Bereichsinformationen',
    'districts': 'Bezirksmerkmale',
    'other_cities': 'Andere Städte',
    'restaurants': 'Empfohlene Restaurants',
    'types': 'Typen',
    'includes': 'Beinhaltet',
    'payment': 'Zahlungsmethoden',
    'payment_methods': 'Zahlungsoptionen',
    'saving_tips': 'Spartipps',
    'greetings': 'Grußetikette',
    'indoor': 'Innen-Etikette',
    'traditional': 'Traditionelle Aktivitäten',
    'modern': 'Moderne Aktivitäten',
    'holidays': 'Feiertage',
    'seasons': 'Saisonale Tipps',
    'offline': 'Offline-Shopping',
    'online': 'Online-Shopping',
    'laundry': 'Wäsche',
    'delivery': 'Lieferung',
    'garbage': 'Müll',
    'seoul': 'Seoul',
    'embassies': 'Hauptbotschaften',
    'hospitals': 'Krankenhäuser',
    'pharmacy': 'Apotheke'
  },
  fr: {
    // Informations de base
    'location': 'Emplacement',
    'transport': 'Transport',
    'hours': 'Heures',
    'price': 'Prix',
    'program': 'Programme',
    'website': 'Site web',
    'basic': 'Info de base',
    
    // Étiquettes de type tableau
    'basic_structure': 'Structure de base',
    'writing_tips': 'Conseils de rédaction',
    'reference_sites': 'Sites de référence',
    'interview_types': 'Types d\'entretien',
    'common_questions': 'Questions fréquentes',
    'foreigner_specific': 'Questions spécifiques aux étrangers',
    'tips': 'Conseils',
    'conversion_tips': 'Conseils de conversion de visa',
    'basic_rights': 'Droits de base',
    'common_problems': 'Problèmes courants',
    'help_contacts': 'Contacts d\'aide',
    'required_items': 'Articles de contrat requis',
    'precautions': 'Précautions',
    'references': 'Références',
    'preparation': 'Préparation',
    'methods': 'Méthodes de réseautage',
    'networking_tips': 'Conseils de réseautage',
    'requirements': 'Exigences',
    'working_hours': 'Heures de travail',
    'allowed_jobs': 'Emplois autorisés',
    'prohibited': 'Emplois interdits',
    'warnings': 'Avertissements',
    'protection': 'Protection des droits',
    'checklist': 'Liste de contrôle',
    'main_procedures': 'Procédures principales',
    'university_examples': 'Exemples d\'université',
    'dining': 'Restauration',
    'dormitory': 'Dortoir',
    'activities': 'Activités de club',
    'facilities': 'Installations',
    'preparatory_course': 'Cours préparatoire',
    'language_options': 'Options linguistiques',
    'tutoring': 'Programmes de tutorat',
    'language_support': 'Support coréen',
    'counseling': 'Conseil',
    'learning_center': 'Centre d\'apprentissage',
    'operating_hours': 'Heures d\'ouverture',
    'services': 'Services',
    'digital_resources': 'Ressources numériques',
    'computer_lab': 'Laboratoire informatique',
    'e_learning': 'E-learning',
    'printing': 'Impression/Copie',
    'tech_support': 'Support technique',
    'procedures': 'Procédures',
    'required_docs': 'Documents requis',
    'notes': 'Notes',
    'application_place': 'Lieu d\'application',
    'processing_time': 'Temps de traitement',
    'online_tips': 'Conseils d\'application en ligne',
    'features': 'Caractéristiques',
    'cost': 'Coût',
    'application': 'Application',
    'living_tips': 'Conseils de vie',
    'address_registration': 'Enregistrement d\'adresse',
    'safety_tips': 'Conseils de sécurité',
    'contract_checklist': 'Liste de contrôle du contrat',
    'specialties': 'Spécialités',
    'locations': 'Emplacements',
    'foods': 'Aliments',
    'options': 'Options',
    'apps': 'Applications',
    'contacts': 'Contacts',
    'emergency': 'Contacts d\'urgence',
    
    // Étiquettes de type objet
    'four_sections': 'Déclaration personnelle 4 sections',
    'visa_types': 'Types de visa',
    'major_events': 'Événements majeurs',
    'platforms': 'Plateformes d\'emploi',
    'common_docs': 'Documents courants',
    'housing_types': 'Types de logement',
    'areas': 'Informations sur les zones',
    'districts': 'Caractéristiques du district',
    'other_cities': 'Autres villes',
    'restaurants': 'Restaurants recommandés',
    'types': 'Types',
    'includes': 'Comprend',
    'payment': 'Méthodes de paiement',
    'payment_methods': 'Options de paiement',
    'saving_tips': 'Conseils d\'économie',
    'greetings': 'Étiquette de salutation',
    'indoor': 'Étiquette intérieure',
    'traditional': 'Activités traditionnelles',
    'modern': 'Activités modernes',
    'holidays': 'Vacances',
    'seasons': 'Conseils saisonniers',
    'offline': 'Shopping hors ligne',
    'online': 'Shopping en ligne',
    'laundry': 'Blanchisserie',
    'delivery': 'Livraison',
    'garbage': 'Déchets',
    'seoul': 'Séoul',
    'embassies': 'Ambassades principales',
    'hospitals': 'Hôpitaux',
    'pharmacy': 'Pharmacie'
  },
  es: {
    // Información básica
    'location': 'Ubicación',
    'transport': 'Transporte',
    'hours': 'Horas',
    'price': 'Precio',
    'program': 'Programa',
    'website': 'Sitio web',
    'basic': 'Info básica',
    
    // Etiquetas tipo array
    'basic_structure': 'Estructura básica',
    'writing_tips': 'Consejos de escritura',
    'reference_sites': 'Sitios de referencia',
    'interview_types': 'Tipos de entrevista',
    'common_questions': 'Preguntas frecuentes',
    'foreigner_specific': 'Preguntas específicas para extranjeros',
    'tips': 'Consejos',
    'conversion_tips': 'Consejos de conversión de visa',
    'basic_rights': 'Derechos básicos',
    'common_problems': 'Problemas comunes',
    'help_contacts': 'Contactos de ayuda',
    'required_items': 'Artículos de contrato requeridos',
    'precautions': 'Precauciones',
    'references': 'Referencias',
    'preparation': 'Preparación',
    'methods': 'Métodos de networking',
    'networking_tips': 'Consejos de networking',
    'requirements': 'Requisitos',
    'working_hours': 'Horas de trabajo',
    'allowed_jobs': 'Trabajos permitidos',
    'prohibited': 'Trabajos prohibidos',
    'warnings': 'Advertencias',
    'protection': 'Protección de derechos',
    'checklist': 'Lista de verificación',
    'main_procedures': 'Procedimientos principales',
    'university_examples': 'Ejemplos de universidad',
    'dining': 'Comedor',
    'dormitory': 'Dormitorio',
    'activities': 'Actividades de club',
    'facilities': 'Instalaciones',
    'preparatory_course': 'Curso preparatorio',
    'language_options': 'Opciones de idioma',
    'tutoring': 'Programas de tutoría',
    'language_support': 'Soporte de coreano',
    'counseling': 'Consejería',
    'learning_center': 'Centro de aprendizaje',
    'operating_hours': 'Horas de operación',
    'services': 'Servicios',
    'digital_resources': 'Recursos digitales',
    'computer_lab': 'Laboratorio de computadoras',
    'e_learning': 'E-learning',
    'printing': 'Impresión/Copia',
    'tech_support': 'Soporte técnico',
    'procedures': 'Procedimientos',
    'required_docs': 'Documentos requeridos',
    'notes': 'Notas',
    'application_place': 'Lugar de aplicación',
    'processing_time': 'Tiempo de procesamiento',
    'online_tips': 'Consejos de aplicación en línea',
    'features': 'Características',
    'cost': 'Costo',
    'application': 'Aplicación',
    'living_tips': 'Consejos de vida',
    'address_registration': 'Registro de dirección',
    'safety_tips': 'Consejos de seguridad',
    'contract_checklist': 'Lista de verificación del contrato',
    'specialties': 'Especialidades',
    'locations': 'Ubicaciones',
    'foods': 'Alimentos',
    'options': 'Opciones',
    'apps': 'Aplicaciones',
    'contacts': 'Contactos',
    'emergency': 'Contactos de emergencia',
    
    // Etiquetas tipo objeto
    'four_sections': 'Declaración personal 4 secciones',
    'visa_types': 'Tipos de visa',
    'major_events': 'Eventos principales',
    'platforms': 'Plataformas de trabajo',
    'common_docs': 'Documentos comunes',
    'housing_types': 'Tipos de vivienda',
    'areas': 'Información de áreas',
    'districts': 'Características del distrito',
    'other_cities': 'Otras ciudades',
    'restaurants': 'Restaurantes recomendados',
    'types': 'Tipos',
    'includes': 'Incluye',
    'payment': 'Métodos de pago',
    'payment_methods': 'Opciones de pago',
    'saving_tips': 'Consejos de ahorro',
    'greetings': 'Etiqueta de saludo',
    'indoor': 'Etiqueta interior',
    'traditional': 'Actividades tradicionales',
    'modern': 'Actividades modernas',
    'holidays': 'Días festivos',
    'seasons': 'Consejos estacionales',
    'offline': 'Compras offline',
    'online': 'Compras online',
    'laundry': 'Lavandería',
    'delivery': 'Entrega',
    'garbage': 'Basura',
    'seoul': 'Seúl',
    'embassies': 'Embajadas principales',
    'hospitals': 'Hospitales',
    'pharmacy': 'Farmacia'
  },
  ru: {
    // Основная информация
    'location': 'Местоположение',
    'transport': 'Транспорт',
    'hours': 'Часы',
    'price': 'Цена',
    'program': 'Программа',
    'website': 'Веб-сайт',
    'basic': 'Основная информация',
    
    // Метки типа массив
    'basic_structure': 'Основная структура',
    'writing_tips': 'Советы по написанию',
    'reference_sites': 'Справочные сайты',
    'interview_types': 'Типы собеседований',
    'common_questions': 'Частые вопросы',
    'foreigner_specific': 'Вопросы для иностранцев',
    'tips': 'Советы',
    'conversion_tips': 'Советы по конвертации визы',
    'basic_rights': 'Основные права',
    'common_problems': 'Частые проблемы',
    'help_contacts': 'Контакты помощи',
    'required_items': 'Обязательные пункты контракта',
    'precautions': 'Меры предосторожности',
    'references': 'Справки',
    'preparation': 'Подготовка',
    'methods': 'Методы нетворкинга',
    'networking_tips': 'Советы по нетворкингу',
    'requirements': 'Требования',
    'working_hours': 'Рабочие часы',
    'allowed_jobs': 'Разрешенные работы',
    'prohibited': 'Запрещенные работы',
    'warnings': 'Предупреждения',
    'protection': 'Защита прав',
    'checklist': 'Чек-лист',
    'main_procedures': 'Основные процедуры',
    'university_examples': 'Примеры университетов',
    'dining': 'Питание',
    'dormitory': 'Общежитие',
    'activities': 'Клубные мероприятия',
    'facilities': 'Удобства',
    'preparatory_course': 'Подготовительный курс',
    'language_options': 'Языковые опции',
    'tutoring': 'Программы репетиторства',
    'language_support': 'Поддержка корейского',
    'counseling': 'Консультирование',
    'learning_center': 'Учебный центр',
    'operating_hours': 'Часы работы',
    'services': 'Услуги',
    'digital_resources': 'Цифровые ресурсы',
    'computer_lab': 'Компьютерная лаборатория',
    'e_learning': 'Электронное обучение',
    'printing': 'Печать/Копирование',
    'tech_support': 'Техническая поддержка',
    'procedures': 'Процедуры',
    'required_docs': 'Необходимые документы',
    'notes': 'Заметки',
    'application_place': 'Место подачи заявления',
    'processing_time': 'Время обработки',
    'online_tips': 'Советы по онлайн-заявлению',
    'features': 'Особенности',
    'cost': 'Стоимость',
    'application': 'Заявление',
    'living_tips': 'Советы по жизни',
    'address_registration': 'Регистрация адреса',
    'safety_tips': 'Советы по безопасности',
    'contract_checklist': 'Чек-лист контракта',
    'specialties': 'Специальности',
    'locations': 'Местоположения',
    'foods': 'Продукты',
    'options': 'Опции',
    'apps': 'Приложения',
    'contacts': 'Контакты',
    'emergency': 'Экстренные контакты',
    
    // Метки типа объект
    'four_sections': 'Личное заявление 4 раздела',
    'visa_types': 'Типы виз',
    'major_events': 'Основные события',
    'platforms': 'Рабочие платформы',
    'common_docs': 'Общие документы',
    'housing_types': 'Типы жилья',
    'areas': 'Информация об областях',
    'districts': 'Особенности района',
    'other_cities': 'Другие города',
    'restaurants': 'Рекомендуемые рестораны',
    'types': 'Типы',
    'includes': 'Включает',
    'payment': 'Способы оплаты',
    'payment_methods': 'Варианты оплаты',
    'saving_tips': 'Советы по экономии',
    'greetings': 'Этикет приветствия',
    'indoor': 'Внутренний этикет',
    'traditional': 'Традиционные мероприятия',
    'modern': 'Современные мероприятия',
    'holidays': 'Праздники',
    'seasons': 'Сезонные советы',
    'offline': 'Офлайн покупки',
    'online': 'Онлайн покупки',
    'laundry': 'Стирка',
    'delivery': 'Доставка',
    'garbage': 'Мусор',
    'seoul': 'Сеул',
    'embassies': 'Основные посольства',
    'hospitals': 'Больницы',
    'pharmacy': 'Аптека'
  }
}; 