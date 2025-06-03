import { FloatingBallContent } from './floatingBallsData';

// 한국어 취업 콘텐츠
export const koreanWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 한국식 이력서(Resume) 작성 가이드',
    category: '이력/채용준비',
    description: '외국인 유학생을 위한 한국식 이력서 작성법',
    details: {
      basic_structure: ['인적사항 (이름, 생년월일, 연락처)', '사진 (증명사진 필수, 최근 6개월 이내)', '학력 및 경력', '어학능력 (TOPIK, TOEIC, JLPT 등)', '자격증', '수상내역 및 활동 경력'],
      writing_tips: ['워드 or 한글 문서로 작성 (PDF 저장 추천)', '한국식 연도 표기 사용 (예: 2025.03 ~ 2025.08)', '불필요한 정보 줄이고 핵심 강조 (성과 중심)'],
      reference_sites: ['사람인 이력서 양식: saramin.co.kr', '잡코리아 샘플: jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 한국식 자기소개서(자소서) 4문항 구조',
    category: '이력/채용준비',
    description: '한국 기업 자소서 작성의 핵심 구조 이해',
    details: {
      four_sections: {
        '성장 과정': '배경 설명 + 성격 형성 과정 (문화 적응력 강조 가능)',
        '성격의 장단점': '장점 중심 + 단점을 보완하려는 노력',
        '지원 동기 및 입사 후 포부': '회사/직무 조사 결과를 바탕으로 구체적으로 작성',
        '경험 및 활동 사례': 'STAR 기법 활용 (Situation, Task, Action, Result)'
      },
      writing_tips: ['너무 추상적인 표현은 피하기', '한국어로 직접 작성 후, 교정 도움 받기 (학교 커리어 센터 또는 한국인 친구)']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 외국인을 위한 한국 취업 면접 준비 전략',
    category: '이력/채용준비',
    description: '한국 기업 면접의 문화적 특성과 준비 요령',
    details: {
      interview_types: ['1차 서류 통과 후 인성 면접 (개별/패널)', '2차 실무 면접 또는 PT 면접', '일부 기업은 AI 면접, 집단 토론 포함'],
      common_questions: ['자기소개 (1분 자기소개 = "자기PR")', '지원동기 / 장단점', '갈등 해결 경험', '한국에서 일하고 싶은 이유'],
      foreigner_specific: ['한국어 능력 수준', '한국 문화 적응 경험', '비자/체류 관련 상황 설명'],
      tips: ['면접 전 모의면접 필수!', '정장 착용 + 시간 엄수 + 존댓말 사용', '마지막 질문: "하고 싶은 말 있으신가요?" → 짧고 긍정적인 마무리']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 한국 취업 비자 종류 정리 (D-10, E-7, F-2 등)',
    category: '비자/법률/노동',
    description: '졸업 후 한국 취업을 위한 비자 전환 가이드',
    details: {
      visa_types: {
        'D-10 (구직 비자)': '졸업 후 구직 활동 중인 외국인 - 최대 6개월, 1회 연장 가능',
        'E-7 (전문직 비자)': '전문 인력 (IT, 디자인, 무역 등) - 학력 + 경력 필요, 고용계약 필수',
        'F-2-7 (거주 비자)': '일정 점수 이상 우수 인재 - 자유 취업 가능, 장기 체류에 유리',
        'F-4 (재외동포)': '한국계 외국인 - 취업 제한 거의 없음, 자유로운 활동 가능'
      },
      conversion_tips: ['D-2 → D-10: 졸업 전 30일 이내 신청', 'D-10 → E-7: 고용계약서 + 관련 전공 또는 경력 증빙 필요', 'E-7 조건 강화: 연봉, 업종, 학력 기준 확인 필수']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ 외국인 근로자를 위한 한국 노동법 기초',
    category: '비자/법률/노동',
    description: '외국인 근로자의 기본 권리와 의무',
    details: {
      basic_rights: ['최저임금 보장 (2025년 기준: ₩9,860/시간)', '주 1회 유급휴일, 주 52시간 근무 제한', '4대 보험 가입 대상 (국민연금, 건강보험, 고용보험, 산재보험)', '부당 해고 시 노동청 진정 가능'],
      common_problems: ['무계약 근로 / 불법 체류 후 취업', '임금 체불', '휴일/야근 수당 미지급'],
      help_contacts: ['고용노동부 1350 콜센터 (다국어 지원)', '외국인력지원센터 또는 지역 노동청']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 외국인을 위한 근로계약서 체크리스트',
    category: '비자/법률/노동',
    description: '합법적인 근로를 위한 계약서 필수 사항',
    details: {
      required_items: ['근무지 주소', '업무 내용', '근로 시간 및 휴게 시간', '임금 (지급일, 방식 포함)', '휴일 및 연차', '퇴직금 및 계약 종료 조건'],
      precautions: ['구두계약만 존재하거나 계약서 미제공 시 거절 권리 있음', '계약서 사본 꼭 보관', '한국어로만 작성된 경우, 번역 도움 요청 가능'],
      references: ['고용노동부 외국인 고용 가이드북', 'HiKorea 비자 정보 포털']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 외국인 유학생을 위한 취업 박람회(잡페어) 안내',
    category: '잡페어/네트워킹',
    description: '취업 정보와 기회를 직접 얻을 수 있는 현장',
    details: {
      major_events: {
        '외국인 유학생 채용박람회': '주최: 고용노동부, 산업통상자원부 / 시기: 보통 9~10월 / 장소: 코엑스, SETEC 등',
        '대학별 글로벌 잡페어': '고려대, 성균관대, 연세대 등 / 외국계/국내기업 다수 참여'
      },
      preparation: ['국/영문 이력서, 자기소개서', '복장: 비즈니스 정장', '기본 한국어 회화 준비'],
      tips: ['기업별 부스 방문 전 관심 기업 조사', '현장 면접 기회 있으므로 자기소개 연습 필수']
    }
  },
  {
    id: 'networking',
    title: '🤝 한국에서 네트워킹하는 5가지 방법',
    category: '잡페어/네트워킹',
    description: '네트워크 중심 사회인 한국에서의 관계 형성법',
    details: {
      methods: ['학교 커리어 센터 프로그램 - 멘토링, 기업 특강, 취업 동아리', '국제학생 모임 - AIESEC, ISN, Buddy Program 등', '링크드인(LinkedIn) 활용 - 기업 담당자, 동문 연결', '한-외국인 기업 교류회 - 대한상공회의소, 코트라, 외국인 투자청 주최', '각국 대사관 행사 - 문화 행사 + 기업 정보 제공 병행'],
      networking_tips: ['자기소개 준비 (한/영 버전)', '명함 또는 연락처 카드 지참', '후속 연락(이메일, SNS) 필수']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 외국인 유학생의 합법적인 아르바이트 조건 (D-2 비자)',
    category: '알바/파트타임',
    description: 'D-2 비자 유학생의 아르바이트 가능 조건',
    details: {
      requirements: ['외국인등록증 발급 완료', '대학의 사전 허가 필요 (지도교수 또는 국제처 승인)', '출입국관리사무소에 근로허가 신청 후 허가증(Permission Letter) 발급'],
      working_hours: ['학기 중: 주당 20시간 이하 (주말, 공휴일 제외)', '방학 중: 시간 제한 없음', '대학원생: 조교 근무 외 별도 규정 적용 가능'],
      allowed_jobs: ['음식점 서빙, 편의점, 카페', '통·번역 보조, 외국어 강사 보조', '마트 계산, 사무보조 등 단순 서비스업'],
      prohibited: ['유흥업소, 노래방, 마사지샵, 도박 관련 업종 등']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 유학생 아르바이트 구하는 방법 5가지',
    category: '알바/파트타임',
    description: '외국인 유학생이 쉽게 접근할 수 있는 알바 구직 경로',
    details: {
      platforms: {
        '알바몬 / 알바천국': '외국인 전용 필터 있음 - https://www.albamon.com, https://www.alba.co.kr',
        '학교 국제처 게시판 / SNS': '유학생 대상 교내 알바 공고 자주 게시됨',
        '외국인 커뮤니티': 'Facebook 그룹, 카카오 오픈채팅 등',
        '지역 기반 알바 정보 앱': '당근알바, 직방 알바 등',
        '지인 추천 또는 방문 문의': '주변 상점 직접 방문 시 채용 중인 곳 발견 가능'
      },
      tips: ['이력서 준비: 간단한 한국어 자기소개 포함', '출입국 허가증(Permission Letter) 꼭 소지 후 근무']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ 외국인 유학생이 아르바이트 할 때 주의할 점',
    category: '알바/파트타임',
    description: '알바 시 체류에 문제가 되지 않도록 하는 주의사항',
    details: {
      warnings: ['출입국 허가 없이 근무 = 불법체류 간주', '최저임금 미만 지급 시 신고 가능 (2025년 기준: ₩9,860/시간)', '임금 체불 시 근로계약서 없으면 불리', '고용주가 외국인 신분 악용할 수 있음 → 항상 계약서 서면 작성'],
      protection: ['고용노동부 1350 콜센터 이용 (다국어 지원)', '외국인력지원센터 상담', '학교 국제처 신고 또는 도움 요청'],
      checklist: ['출입국 근로허가 받았는가?', '근로계약서를 썼는가?', '급여 지급 방식과 날짜는 명확한가?', '주휴수당, 야근수당 등 받을 수 있는 권리는 알고 있는가?']
    }
  }
];

// 영어 취업 콘텐츠
export const englishWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 Korean-style Resume Writing Guide',
    category: 'Resume/Job Preparation',
    description: 'How to write a Korean-style resume for international students',
    details: {
      basic_structure: ['Personal Information (Name, Date of Birth, Contact)', 'Photo (ID photo required, within 6 months)', 'Education and Experience', 'Language Skills (TOPIK, TOEIC, JLPT, etc.)', 'Certifications', 'Awards and Activities'],
      writing_tips: ['Write in Word or Hangul documents (PDF save recommended)', 'Use Korean date format (e.g., 2025.03 ~ 2025.08)', 'Reduce unnecessary information and emphasize key points (focus on achievements)'],
      reference_sites: ['Saramin resume template: saramin.co.kr', 'JobKorea samples: jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 Korean-style Personal Statement 4-Section Structure',
    category: 'Resume/Job Preparation',
    description: 'Understanding the core structure of Korean corporate personal statements',
    details: {
      four_sections: {
        'Growth Process': 'Background explanation + personality formation process (can emphasize cultural adaptability)',
        'Strengths and Weaknesses': 'Focus on strengths + efforts to overcome weaknesses',
        'Application Motivation and Future Goals': 'Write specifically based on company/job research results',
        'Experience and Activity Cases': 'Use STAR method (Situation, Task, Action, Result)'
      },
      writing_tips: ['Avoid overly abstract expressions', 'Write directly in Korean, then get help with corrections (school career center or Korean friends)']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 Korean Job Interview Preparation Strategy for Foreigners',
    category: 'Resume/Job Preparation',
    description: 'Cultural characteristics and preparation tips for Korean corporate interviews',
    details: {
      interview_types: ['1st round personality interview after document screening (individual/panel)', '2nd round practical interview or PT interview', 'Some companies include AI interviews, group discussions'],
      common_questions: ['Self-introduction (1-minute self-introduction = "self-PR")', 'Application motivation / Strengths and weaknesses', 'Conflict resolution experience', 'Reasons for wanting to work in Korea'],
      foreigner_specific: ['Korean language proficiency level', 'Korean cultural adaptation experience', 'Visa/residence status explanation'],
      tips: ['Mock interview before actual interview is essential!', 'Formal attire + punctuality + use of honorifics', 'Last question: "Do you have anything to say?" → Short and positive closing']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 Korean Work Visa Types Overview (D-10, E-7, F-2, etc.)',
    category: 'Visa/Legal/Labor',
    description: 'Visa conversion guide for employment in Korea after graduation',
    details: {
      visa_types: {
        'D-10 (Job Seeking Visa)': 'For foreigners seeking employment after graduation - Maximum 6 months, extendable once',
        'E-7 (Professional Visa)': 'For professionals (IT, design, trade, etc.) - Education + experience required, employment contract essential',
        'F-2-7 (Residence Visa)': 'For talented individuals with certain score or above - Free employment, advantageous for long-term stay',
        'F-4 (Overseas Korean)': 'For Korean-heritage foreigners - Almost no employment restrictions, free activities'
      },
      conversion_tips: ['D-2 → D-10: Apply within 30 days before graduation', 'D-10 → E-7: Employment contract + proof of relevant major or experience required', 'E-7 requirements strengthened: Must check salary, industry, education standards']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ Korean Labor Law Basics for Foreign Workers',
    category: 'Visa/Legal/Labor',
    description: 'Basic rights and obligations of foreign workers',
    details: {
      basic_rights: ['Minimum wage guarantee (2025 standard: ₩9,860/hour)', 'One paid holiday per week, 52-hour work week limit', 'Subject to 4 major insurances (National Pension, Health Insurance, Employment Insurance, Workers\' Compensation)', 'Can file complaint with Labor Office for unfair dismissal'],
      common_problems: ['Working without contract / Employment after illegal stay', 'Wage arrears', 'Non-payment of holiday/overtime allowances'],
      help_contacts: ['Ministry of Employment and Labor 1350 call center (multilingual support)', 'Foreign Worker Support Center or regional Labor Office']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 Employment Contract Checklist for Foreigners',
    category: 'Visa/Legal/Labor',
    description: 'Essential contract items for legal employment',
    details: {
      required_items: ['Workplace address', 'Job description', 'Working hours and break time', 'Wages (including payment date and method)', 'Holidays and annual leave', 'Severance pay and contract termination conditions'],
      precautions: ['Right to refuse if only verbal contract exists or contract not provided', 'Must keep copy of contract', 'Can request translation help if written only in Korean'],
      references: ['Ministry of Employment and Labor Foreign Employment Guidebook', 'HiKorea visa information portal']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 Job Fair Guide for International Students',
    category: 'Job Fair/Networking',
    description: 'Venues to directly obtain employment information and opportunities',
    details: {
      major_events: {
        'International Student Job Fair': 'Organized by: Ministry of Employment and Labor, Ministry of Trade, Industry and Energy / When: Usually September-October / Where: COEX, SETEC, etc.',
        'University Global Job Fairs': 'Korea University, Sungkyunkwan University, Yonsei University, etc. / Many foreign and domestic companies participate'
      },
      preparation: ['Korean/English resume and personal statement', 'Attire: Business formal', 'Basic Korean conversation preparation'],
      tips: ['Research companies of interest before visiting company booths', 'On-site interview opportunities available, so self-introduction practice essential']
    }
  },
  {
    id: 'networking',
    title: '🤝 5 Ways to Network in Korea',
    category: 'Job Fair/Networking',
    description: 'Building relationships in Korea, a network-centered society',
    details: {
      methods: ['School career center programs - Mentoring, corporate lectures, job clubs', 'International student groups - AIESEC, ISN, Buddy Program, etc.', 'LinkedIn utilization - Connect with company representatives, alumni', 'Korea-Foreign business exchange meetings - Korea Chamber of Commerce, KOTRA, Korea Investment Promotion Agency hosted', 'Embassy events of each country - Cultural events + corporate information provision combined'],
      networking_tips: ['Prepare self-introduction (Korean/English versions)', 'Bring business cards or contact cards', 'Follow-up contact (email, SNS) essential']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 Legal Part-time Job Conditions for International Students (D-2 Visa)',
    category: 'Part-time/Temporary Work',
    description: 'Part-time job conditions for D-2 visa international students',
    details: {
      requirements: ['Alien Registration Card issuance completed', 'University prior permission required (advisor or international affairs approval)', 'Apply for work permit at Immigration Office and obtain Permission Letter'],
      working_hours: ['During semester: Maximum 20 hours per week (excluding weekends, holidays)', 'During vacation: No time limit', 'Graduate students: Separate regulations may apply except for TA work'],
      allowed_jobs: ['Restaurant serving, convenience stores, cafes', 'Translation/interpretation assistance, foreign language teaching assistance', 'Mart cashier, office assistance and other simple service jobs'],
      prohibited: ['Entertainment establishments, karaoke, massage shops, gambling-related businesses, etc.']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 5 Ways for Students to Find Part-time Jobs',
    category: 'Part-time/Temporary Work',
    description: 'Part-time job search channels easily accessible to international students',
    details: {
      platforms: {
        'Albamon / Alba Heaven': 'Has foreign-only filters - https://www.albamon.com, https://www.alba.co.kr',
        'School International Affairs Board / SNS': 'Part-time job postings for international students frequently posted',
        'Foreign Communities': 'Facebook groups, KakaoTalk open chat, etc.',
        'Regional Part-time Job Apps': 'Carrot Alba, Zigbang Alba, etc.',
        'Referrals or Direct Inquiry': 'Discover hiring places by directly visiting nearby stores'
      },
      tips: ['Resume preparation: Include simple Korean self-introduction', 'Must possess Immigration Permission Letter before working']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ Precautions for International Students Working Part-time',
    category: 'Part-time/Temporary Work',
    description: 'Precautions to avoid problems with residency status while working part-time',
    details: {
      warnings: ['Working without immigration permit = Considered illegal stay', 'Can report if paid below minimum wage (2025 standard: ₩9,860/hour)', 'Disadvantageous if no employment contract during wage arrears', 'Employers may exploit foreign status → Always create written contract'],
      protection: ['Use Ministry of Employment and Labor 1350 call center (multilingual support)', 'Foreign Worker Support Center consultation', 'Report to school international affairs or request help'],
      checklist: ['Did you get immigration work permit?', 'Did you write an employment contract?', 'Are wage payment method and date clear?', 'Do you know your rights to weekly holiday pay, overtime pay, etc.?']
    }
  }
];

// 일본어 취업 콘텐츠
export const japaneseWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 韓国式履歴書作成ガイド',
    category: '履歴書/就職準備',
    description: '外国人留学生のための韓国式履歴書作成法',
    details: {
      basic_structure: ['個人情報（氏名、生年月日、連絡先）', '写真（証明写真必須、最近6ヶ月以内）', '学歴及び経歴', '語学能力（TOPIK、TOEIC、JLPT等）', '資格証', '受賞歴及び活動経歴'],
      writing_tips: ['WordまたはHangul文書で作成（PDF保存推奨）', '韓国式年度表記使用（例：2025.03～2025.08）', '不要な情報を減らし核心を強調（成果中心）'],
      reference_sites: ['サラミン履歴書様式：saramin.co.kr', 'ジョブコリアサンプル：jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 韓国式自己紹介書4項目構造',
    category: '履歴書/就職準備',
    description: '韓国企業自己紹介書作成の核心構造理解',
    details: {
      four_sections: {
        '成長過程': '背景説明＋性格形成過程（文化適応力強調可能）',
        '性格の長所と短所': '長所中心＋短所を補完しようとする努力',
        '志望動機及び入社後抱負': '会社/職務調査結果を基に具体的に作成',
        '経験及び活動事例': 'STAR技法活用（Situation、Task、Action、Result）'
      },
      writing_tips: ['あまりに抽象的な表現は避ける', '韓国語で直接作成後、校正支援を受ける（学校キャリアセンターまたは韓国人の友人）']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 外国人のための韓国就職面接準備戦略',
    category: '履歴書/就職準備',
    description: '韓国企業面接の文化的特性と準備要領',
    details: {
      interview_types: ['1次書類通過後人性面接（個別/パネル）', '2次実務面接またはPT面接', '一部企業はAI面接、集団討論含む'],
      common_questions: ['自己紹介（1分自己紹介＝「自己PR」）', '志望動機/長所短所', '葛藤解決経験', '韓国で働きたい理由'],
      foreigner_specific: ['韓国語能力水準', '韓国文化適応経験', 'ビザ/滞在関連状況説明'],
      tips: ['面接前模擬面接必須！', 'スーツ着用＋時間厳守＋敬語使用', '最後の質問：「おっしゃりたいことはありますか？」→短く肯定的な締めくくり']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 韓国就職ビザ種類整理（D-10、E-7、F-2等）',
    category: 'ビザ/法律/労働',
    description: '卒業後韓国就職のためのビザ転換ガイド',
    details: {
      visa_types: {
        'D-10（求職ビザ）': '卒業後求職活動中の外国人 - 最大6ヶ月、1回延長可能',
        'E-7（専門職ビザ）': '専門人力（IT、デザイン、貿易等） - 学歴＋経歴必要、雇用契約必須',
        'F-2-7（居住ビザ）': '一定点数以上優秀人材 - 自由就職可能、長期滞在に有利',
        'F-4（在外同胞）': '韓国系外国人 - 就職制限ほとんどなし、自由な活動可能'
      },
      conversion_tips: ['D-2→D-10：卒業前30日以内申請', 'D-10→E-7：雇用契約書＋関連専攻または経歴証明必要', 'E-7条件強化：年俸、業種、学歴基準確認必須']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ 外国人勤労者のための韓国労働法基礎',
    category: 'ビザ/法律/労働',
    description: '外国人勤労者の基本権利と義務',
    details: {
      basic_rights: ['最低賃金保障（2025年基準：₩9,860/時間）', '週1回有給休日、週52時間勤務制限', '4大保険加入対象（国民年金、健康保険、雇用保険、産災保険）', '不当解雇時労働庁陳情可能'],
      common_problems: ['無契約勤労/不法滞在後就職', '賃金滞納', '休日/夜勤手当未支給'],
      help_contacts: ['雇用労働部1350コールセンター（多言語支援）', '外国人力支援センターまたは地域労働庁']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 外国人のための勤労契約書チェックリスト',
    category: 'ビザ/法律/労働',
    description: '合法的な勤労のための契約書必須事項',
    details: {
      required_items: ['勤務地住所', '業務内容', '勤労時間及び休憩時間', '賃金（支給日、方式含む）', '休日及び年次', '退職金及び契約終了条件'],
      precautions: ['口頭契約のみ存在または契約書未提供時拒否権利あり', '契約書コピー必ず保管', '韓国語のみで作成された場合、翻訳支援要請可能'],
      references: ['雇用労働部外国人雇用ガイドブック', 'HiKoreaビザ情報ポータル']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 外国人留学生のための就職博覧会案内',
    category: 'ジョブフェア/ネットワーキング',
    description: '就職情報と機会を直接得ることができる現場',
    details: {
      major_events: {
        '外国人留学生採用博覧会': '主催：雇用労働部、産業通商資源部/時期：通常9～10月/場所：COEX、SETEC等',
        '大学別グローバルジョブフェア': '高麗大、成均館大、延世大等/外資系/国内企業多数参加'
      },
      preparation: ['韓/英文履歴書、自己紹介書', '服装：ビジネススーツ', '基本韓国語会話準備'],
      tips: ['企業別ブース訪問前関心企業調査', '現場面接機会があるため自己紹介練習必須']
    }
  },
  {
    id: 'networking',
    title: '🤝 韓国でネットワーキングする5つの方法',
    category: 'ジョブフェア/ネットワーキング',
    description: 'ネットワーク中心社会である韓国での関係形成法',
    details: {
      methods: ['学校キャリアセンタープログラム - メンタリング、企業特講、就職サークル', '国際学生集まり - AIESEC、ISN、Buddy Program等', 'LinkedIn活用 - 企業担当者、同窓生連結', '韓-外国人企業交流会 - 大韓商工会議所、KOTRA、外国人投資庁主催', '各国大使館行事 - 文化行事＋企業情報提供並行'],
      networking_tips: ['自己紹介準備（韓/英バージョン）', '名刺または連絡先カード持参', '後続連絡（メール、SNS）必須']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 外国人留学生の合法的アルバイト条件（D-2ビザ）',
    category: 'アルバイト/パートタイム',
    description: 'D-2ビザ留学生のアルバイト可能条件',
    details: {
      requirements: ['外国人登録証発給完了', '大学の事前許可必要（指導教授または国際処承認）', '出入国管理事務所に勤労許可申請後許可証（Permission Letter) 発給'],
      working_hours: ['学期中：週当20時間以下（週末、祝日除く）', '休暇中：時間制限なし', '大学院生：助教勤務外別途規定適用可能'],
      allowed_jobs: ['飲食店サービング、コンビニ、カフェ', '通・翻訳補助、外国語講師補助', 'マート計算、事務補助等単純サービス業'],
      prohibited: ['遊興業所、カラオケ、マッサージショップ、ギャンブル関連業種等']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 留学生アルバイトを探す方法5つ',
    category: 'アルバイト/パートタイム',
    description: '外国人留学生が簡単にアクセスできるアルバイト求職経路',
    details: {
      platforms: {
        'アルバモン/アルバ天国': '有外国人専用フィルターあり - https://www.albamon.com、https://www.alba.co.kr',
        '学校国際処掲示板/SNS': '留学生対象校内アルバイト公告頻繁に掲示',
        '外国人コミュニティ': 'Facebookグループ、カカオオープンチャット等',
        '地域基盤アルバイト情報アプリ': 'ニンジンアルバ、チクパンアルバ等',
        '知人推薦または訪問問い合わせ': '周辺店舗直接訪問時採用中の所発見可能'
      },
      tips: ['履歴書準備：包含簡単な韓国語自己紹介含む', '出入国許可証（Permission Letter）必ず所持後勤務']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ 外国人留学生がアルバイトする時注意する点',
    category: 'アルバイト/パートタイム',
    description: 'アルバイト時滞在に問題にならないようにする注意事項',
    details: {
      warnings: ['出入国許可なしに勤務＝不法滞在見なし', '最低賃金未満支給時申告可能（2025年基準：₩9,860/時間）', '賃金滞納時勤労契約書がなければ不利', '雇用主が外国人身分悪用可能性→常に契約書書面作成'],
      protection: ['雇用労働部1350コールセンター利用（多言語支援）', '外国人力支援センター相談', '学校国際処申告または支援要請'],
      checklist: ['出入国勤労許可を受けたか？', '勤労契約書を書いたか？', '給与支給方式と日付は明確か？', '週休手当、夜勤手当等受けることができる権利は知っているか？']
    }
  }
];

// 중국어 취업 콘텐츠
export const chineseWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 韩式简历撰写指南',
    category: '简历/求职准备',
    description: '面向外国留学生的韩式简历撰写方法',
    details: {
      basic_structure: ['个人信息（姓名、出生日期、联系方式）', '照片（证件照必须，6个月内）', '学历及经历', '语言能力（TOPIK、TOEIC、JLPT等）', '资格证', '获奖经历及活动经历'],
      writing_tips: ['用Word或韩文文档撰写（推荐PDF保存）', '使用韩式年度标记（例：2025.03～2025.08）', '减少不必要信息，强调核心（以成果为中心）'],
      reference_sites: ['Saramin简历格式：saramin.co.kr', 'JobKorea样本：jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 韩式自我介绍书4项结构',
    category: '简历/求职准备',
    description: '理解韩国企业自我介绍书撰写的核心结构',
    details: {
      four_sections: {
        '成长过程': '背景说明＋性格形成过程（可强调文化适应力）',
        '性格的优缺点': '以优点为中心＋努力补完缺点',
        '申请动机及入职后抱负': '基于公司/职务调查结果具体撰写',
        '经验及活动事例': '活用STAR技法（Situation、Task、Action、Result）'
      },
      writing_tips: ['避免过于抽象的表达', '直接用韩语撰写后，获得校正帮助（学校就业中心或韩国朋友）']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 外国人韩国就业面试准备策略',
    category: '简历/求职准备',
    description: '韩国企业面试的文化特性和准备要领',
    details: {
      interview_types: ['一轮书面通过后人性面试（个人/小组）', '二轮实务面试或PT面试', '部分企业包含AI面试、集体讨论'],
      common_questions: ['自我介绍（1分钟自我介绍＝"自我PR"）', '申请动机/优缺点', '冲突解决经验', '想在韩国工作的理由'],
      foreigner_specific: ['韩语能力水平', '韩国文化适应经验', '签证/居留相关情况说明'],
      tips: ['面试前模拟面试必须！', '穿正装＋守时＋使用敬语', '最后问题："您还有什么要说的吗？"→简短积极的结尾']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 韩国就业签证种类整理（D-10、E-7、F-2等）',
    category: '签证/法律/劳动',
    description: '毕业后韩国就业签证转换指南',
    details: {
      visa_types: {
        'D-10（求职签证）': '毕业后求职活动中的外国人 - 最长6个月，可延长1次',
        'E-7（专业职签证）': '专业人力（IT、设计、贸易等） - 需要学历＋经历，雇佣合同必须',
        'F-2-7（居住签证）': '一定分数以上优秀人才 - 可自由就业，长期居留有利',
        'F-4（在外同胞）': '韩裔外国人 - 就业限制几乎没有，可自由活动'
      },
      conversion_tips: ['D-2→D-10：毕业前30天内申请', 'D-10→E-7：需要雇佣合同书＋相关专业或经历证明', 'E-7条件强化：必须确认年薪、业种、学历标准']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ 外国劳动者韩国劳动法基础',
    category: '签证/法律/劳动',
    description: '外国劳动者的基本权利和义务',
    details: {
      basic_rights: ['最低工资保障（2025年标准：₩9,860/小时）', '每周1次带薪休假，每周52小时工作限制', '4大保险加入对象（国民年金、健康保险、雇佣保险、工伤保险）', '不当解雇时可向劳动厅申诉'],
      common_problems: ['无合同劳动/非法居留后就业', '工资拖欠', '休假/加班费未支付'],
      help_contacts: ['雇佣劳动部1350呼叫中心（多语言支持）', '外国人力支援中心或地区劳动厅']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 外国人劳动合同书检查清单',
    category: '签证/法律/劳动',
    description: '合法劳动的合同书必须事项',
    details: {
      required_items: ['工作地址', '工作内容', '劳动时间及休息时间', '工资（包括支付日期、方式）', '休假及年假', '退职金及合同终止条件'],
      precautions: ['仅有口头合同或未提供合同书时有拒绝权利', 'Conservar copia contrato', 'Puede solicitar ayuda traducción si escrito solo en coreano'],
      references: ['雇用劳动部外国人雇佣指南手册', 'HiKorea签证信息门户']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 外国留学生就业博览会指南',
    category: '就业博览会/人脉',
    description: '可直接获得就业信息和机会的现场',
    details: {
      major_events: {
        '外国留学生招聘博览会': '主办：雇佣劳动部、产业通商资源部/时间：通常9-10月/地点：COEX, SETEC等',
        '大学全球就业博览会': '高丽大、成均馆大、延世大等/外资/国内企业多数参与'
      },
      preparation: ['韩/英文简历、自我介绍书', '着装：商务正装', '基本韩语会话准备'],
      tips: ['访问企业展台前调查感兴趣的企业', '有现场面试机会，必须练习自我介绍']
    }
  },
  {
    id: 'networking',
    title: '🤝 在韩国建立人脉的5种方法',
    category: '就业博览会/人脉',
    description: '在以人脉为中心的韩国社会中建立关系的方法',
    details: {
      methods: ['学校就业中心项目 - 导师制、企业特讲、就业社团', '国际学生聚会 - AIESEC、ISN、Buddy Program等', 'LinkedIn利用 - 连接企业负责人、校友', '韩-外国人企业交流会 - 大韩商工会议所、KOTRA、外国人投资厅主办', '各国大使馆活动 - 文化活动＋企业信息提供并行'],
      networking_tips: ['准备自我介绍（韩/英版本）', '携带名片或联系卡', '后续联系（email, SNS）必须']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 外国留学生合法兼职条件（D-2签证）',
    category: '兼职/临时工',
    description: 'D-2签证留学生的兼职可能条件',
    details: {
      requirements: ['外国人登录证发放完成', '大学事先许可必要（指导教授或国际处批准）', '向出入境管理事务所申请劳动许可后发放许可证（Permission Letter）'],
      working_hours: ['学期中：每周20小时以下（除周末、节假日）', '放假中：无时间限制', '研究生：除助教工作外可适用别的规定'],
      allowed_jobs: ['餐厅服务、便利店、咖啡厅', '翻译辅助、外语讲师辅助', '超市收银、事务辅助等简单服务业'],
      prohibited: ['娱乐场所、KTV、按摩店、赌博相关行业等']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 留学生寻找兼职的5种方法',
    category: '兼职/临时工',
    description: '外国留学生容易接触的兼职求职途径',
    details: {
      platforms: {
        'Albamon/Alba天国': '有外国人专用过滤器 - https://www.albamon.com、https://www.alba.co.kr',
        '学校国际处告示板/SNS': '经常发布面向留学生的校内兼职公告',
        '外国人社区': 'Facebook群组、KakaoTalk开放聊天等',
        '地区基础兼职信息应用': 'Carrot Alba, Zigbang Alba等',
        '熟人推荐或访问咨询': '发现招聘地点，直接访问附近商店'
      },
      tips: ['简历准备：包含简单的韩语自我介绍', '必须持有出入境许可证（Permission Letter）后工作']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ 外国留学生兼职时的注意事项',
    category: '兼职/临时工',
    description: '兼职时不对居留造成问题的注意事项',
    details: {
      warnings: ['无出入境许可工作＝视为非法居留', '低于最低工资支付时可举报（2025年标准：₩9,860/小时）', '工资拖欠时没有劳动合同书则不利', '雇主可能恶用外国人身份→始终书面制作合同书'],
      protection: ['利用雇佣劳动部1350呼叫中心（多语言支持）', '外国人力支援中心咨询', '向学校国际处举报或请求帮助'],
      checklist: ['获得了出入境劳动许可吗？', '写了劳动合同书吗？', '工资支付方式和日期明确吗？', '知道可以接受周休津贴、加班费等的权利吗？']
    }
  }
];

// 스페인어 취업 콘텐츠  
export const spanishWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 Guía de redacción de currículum coreano',
    category: 'Currículum/Preparación empleo',
    description: 'Cómo escribir un currículum de estilo coreano para estudiantes internacionales',
    details: {
      basic_structure: ['Información personal (Nombre, Fecha de nacimiento, Contacto)', 'Foto (Foto de identificación requerida, dentro de 6 meses)', 'Educación y experiencia', 'Habilidades lingüísticas (TOPIK, TOEIC, JLPT, etc.)', 'Certificaciones', 'Premios y actividades'],
      writing_tips: ['Escribir en documentos Word o Hangul (guardar PDF recomendado)', 'Usar formato de fecha coreano (ej: 2025.03 ~ 2025.08)', 'Reducir información innecesaria y enfatizar puntos clave (enfocado en logros)'],
      reference_sites: ['Шаблон резюме Saramin: saramin.co.kr', 'Образцы JobKorea: jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 Estructura de 4 secciones de carta de presentación coreana',
    category: 'Currículum/Preparación empleo',
    description: 'Entender la estructura central de cartas de presentación de empresas coreanas',
    details: {
      four_sections: {
        'Proceso de crecimiento': 'Explicación de antecedentes + proceso de formación de personalidad (puede enfatizar adaptabilidad cultural)',
        'Fortalezas y debilidades': 'Foco en fortalezas + esfuerzos para superar debilidades',
        'Motivación de aplicación y objetivos futuros': 'Escribir específicamente basado en resultados de investigación empresa/puesto',
        'Casos de experiencia y actividades': 'Usar método STAR (Situation, Task, Action, Result)'
      },
      writing_tips: ['Evitar expresiones demasiado abstractas', 'Escribir directamente en coreano, luego obtener ayuda con correcciones (centro de carrera escolar o amigos coreanos)']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 Estrategia de preparación para entrevista de trabajo coreana para extranjeros',
    category: 'Currículum/Preparación empleo',
    description: 'Características culturales y consejos de preparación para entrevistas de empresas coreanas',
    details: {
      interview_types: ['1ra ronda entrevista de personalidad después de selección de documentos (individual/panel)', '2da ronda entrevista práctica o entrevista PT', 'Algunas empresas incluyen AI-entrevistas, discusiones grupales'],
      common_questions: ['Auto-presentación (1-minuto auto-presentación = "auto-PR")', 'Motivación aplicación / Fortalezas y debilidades', 'Experiencia resolución conflictos', 'Razones para querer trabajar en Corea'],
      foreigner_specific: ['Nivel de competencia en coreano', 'Experiencia adaptación cultural coreana', 'Explicación estado visa/residencia'],
      tips: ['Entrevista simulada antes de entrevista real esencial!', 'Vestimenta formal + puntualidad + usar formas honoríficas', 'Última pregunta: "¿Tienes algo que decir?" → Cierre corto y positivo']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 Resumen tipos de visa de trabajo coreanos (D-10, E-7, F-2, etc.)',
    category: 'Visa/Legal/Trabajo',
    description: 'Guía de conversión de visa para empleo en Corea después de graduación',
    details: {
      visa_types: {
        'D-10 (Visa búsqueda empleo)': 'Para extranjeros buscando empleo después de graduación - Máximo 6 meses, renovable una vez',
        'E-7 (Visa profesional)': 'Para profesionales (IT, diseño, comercio, etc.) - Educación + experiencia requerida, contrato empleo esencial',
        'F-2-7 (Visa residencia)': 'Para personas talentosas con cierto puntaje o superior - Empleo libre, ventajoso para estadía largo plazo',
        'F-4 (Coreanos ultramar)': 'Para extranjeros de herencia coreana - Casi sin restricciones empleo, libre actividad'
      },
      conversion_tips: ['D-2 → D-10: Aplicar dentro 30 días antes graduación', 'D-10 → E-7: Contrato empleo + prueba especialización relevante o experiencia requerida', 'Requisitos E-7 reforzados: Verificar salario, industria, estándares educación']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ Fundamentos ley laboral coreana para trabajadores extranjeros',
    category: 'Visa/Legal/Trabajo',
    description: 'Derechos y obligaciones básicos de trabajadores extranjeros',
    details: {
      basic_rights: ['Garantía salario mínimo (estándar 2025: ₩9,860/hora)', 'Un día feriado pagado por semana, límite 52 horas trabajo por semana', 'Sujeto a 4 seguros principales (Pensión Nacional, Seguro Salud, Seguro Empleo, Compensación Trabajadores)', 'Puede presentar queja en Oficina Trabajo por despido injusto'],
      common_problems: ['Trabajo sin contrato / Empleo después estadía ilegal', 'Atrasos salariales', 'No pago de subsidios vacaciones/horas extra'],
      help_contacts: ['Koll-centro 1350 Ministerio Empleo y Trabajo (soporte multilingüe)', 'Centro Apoyo Trabajadores Extranjeros u Oficina Trabajo regional']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 Lista verificación contrato empleo para extranjeros',
    category: 'Visa/Legal/Trabajo',
    description: 'Artículos esenciales contrato para empleo legal',
    details: {
      required_items: ['Dirección lugar trabajo', 'Descripción trabajo', 'Horas trabajo y tiempo descanso', 'Salarios (incluyendo fecha y método pago)', 'Vacaciones y licencia anual', 'Indemnización despido y condiciones terminación contrato'],
      precautions: ['Derecho rechazar si solo existe contrato verbal o contrato no proporcionado', 'Conservar copia contrato', 'Puede solicitar ayuda traducción si escrito solo en coreano'],
      references: ['Manual Empleo Extranjeros Ministerio Empleo y Trabajo', 'Portal información visa HiKorea']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 Guía feria empleo para estudiantes internacionales',
    category: 'Feria empleo/Networking',
    description: 'Lugares para obtener directamente información y oportunidades empleo',
    details: {
      major_events: {
        'Feria Empleo Estudiantes Internacionales': 'Organizado por: Ministerio Empleo y Trabajo, Ministerio Comercio, Industria y Energía / Cuándo: Usualmente septiembre-octubre / Dónde: COEX, SETEC, etc.',
        'Ferias Empleo Globales Universitarias': 'Korea University, Sungkyunkwan University, Yonsei University y t.d. / Muchas empresas extranjeras y nacionales participan'
      },
      preparation: ['Currículum y carta presentación coreano/inglés', 'Vestimenta: Delegado negocios', 'Preparación conversación básica coreana'],
      tips: ['Investigar empresas de interés antes visitar stands empresas', 'Oportunidades entrevista en sitio disponibles, por lo tanto práctica auto-presentación esencial']
    }
  },
  {
    id: 'networking',
    title: '🤝 5 formas de hacer networking en Corea',
    category: 'Feria empleo/Networking',
    description: 'Construir relaciones en Corea, una sociedad centrada en redes',
    details: {
      methods: ['Programas centro carrera escolar - Mentoría, conferencias empresas, clubs empleo', 'Grupos estudiantes internacionales - AIESEC, ISN, Buddy Program, etc.', 'Utilización LinkedIn - Conectar con representantes empresas, ex-alumnos', 'Reuniones intercambio empresarial Corea-extranjeros - Organizadas Torcedoría Corea, KOTRA, Agencia Promoción Inversión Corea', 'Eventos embajadas cada país - Eventos culturales + provisión información empresas combinados'],
      networking_tips: ['Preparar auto-presentación (coreano/inglés versiones)', 'Llevar tarjetas negocio o tarjetas contacto', 'Contacto seguimiento (email, SNS) esencial']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 Condiciones trabajo tiempo parcial legal para estudiantes internacionales (Visa D-2)',
    category: 'Tiempo parcial/Trabajo temporal',
    description: 'Condiciones trabajo tiempo parcial para estudiantes internacionales visa D-2',
    details: {
      requirements: ['Tarjeta Registro Extranjero emitida', 'Permiso previo universitario requerido (aprobación asesor o asuntos internacionales)', 'Aplicar permiso trabajo en Oficina Inmigración y obtener Permission Letter'],
      working_hours: ['Durante semestre: Máximo 20 horas por semana (excluyendo fines semana, días feriados)', 'Durante vacaciones: Sin límite tiempo', 'Estudiantes graduados: Regulaciones separadas pueden aplicar excepto trabajo asistente enseñanza'],
      allowed_jobs: ['Servicio restaurante, tiendas conveniencia, cafés', 'Asistencia traducción/interpretación, asistencia enseñanza idioma extranjero', 'Cajero mercado, asistencia oficina y otros trabajos servicio simples'],
      prohibited: ['Establecimientos entretenimiento, karaoke, salones masaje, negocios relacionados juegos azar, etc.']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 5 formas para estudiantes encontrar trabajos tiempo parcial',
    category: 'Tiempo parcial/Trabajo temporal',
    description: 'Canales búsqueda trabajo tiempo parcial fácilmente accesibles para estudiantes internacionales',
    details: {
      platforms: {
        'Albamon / Alba Heaven': 'Tiene filtros solo extranjeros - https://www.albamon.com, https://www.alba.co.kr',
        'Tablero Asuntos Internacionales Escuela / SNS': 'Anuncios trabajo tiempo parcial para estudiantes internacionales frecuentemente publicados',
        'Comunidades Extranjeros': 'Grupos Facebook, chat abierto KakaoTalk, etc.',
        'Regionales aplicaciones información trabajo tiempo parcial': 'Carrot Alba, Zigbang Alba, etc.',
        'Recomendaciones o consulta directa': 'Descubrir lugares contratación visitando directamente tiendas cercanas'
      },
      tips: ['Preparación currículum: Incluir simple auto-presentación coreana', 'Poseer Permission Letter inmigración antes trabajar']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ Precauciones para estudiantes internacionales trabajando tiempo parcial',
    category: 'Tiempo parcial/Trabajo temporal',
    description: 'Midas de precaución para evitar problemas con estado residencia al trabajar tiempo parcial',
    details: {
      warnings: ['Trabajar sin permiso inmigración = Criterio estadía ilegal', 'Puede reportar si payé bajo salario mínimo (estándar 2025: ₩9,860/hora)', 'Desventajoso si no hay contrato emplo durante atrasos salariales', 'Empleadores pueden explotar estado extranjero → Siempre crear contrato escrito'],
      protection: ['Usar koll-centro 1350 Ministerio Empleo y Trabajo (soporte multilingüe)', 'Consultar Centro Apoyo Trabajadores Extranjeros', 'Reportar a asuntos internacionales escuela o pedir ayuda'],
      checklist: ['¿Recibió permiso trabajo inmigración?', '¿Escribió contrato empleo?', '¿Son claros método y fecha pago salario?', '¿Conoce sus derechos a pago vacaciones semanales, pago horas extra, etc.?']
    }
  }
];

// 러시아어 취업 콘텐츠
export const russianWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 Руководство по написанию корейского резюме',
    category: 'Резюме/Подготовка к работе',
    description: 'Как написать резюме в корейском стиле для иностранных студентов',
    details: {
      basic_structure: ['Личная информация (Имя, Дата рождения, Контакт)', 'Фото (Удостоверение личности обязательно, в течение 6 месяцев)', 'Образование и опыт', 'Языковые навыки (TOPIK, TOEIC, JLPT и т.д.)', 'Сертификаты', 'Награды и деятельность'],
      writing_tips: ['Писать в документах Word или Hangul (рекомендуется сохранение PDF)', 'Использовать корейский формат даты (например: 2025.03 ~ 2025.08)', 'Сократить ненужную информацию и подчеркнуть ключевые моменты (ориентированно на достижения)'],
      reference_sites: ['Шаблон резюме Saramin: saramin.co.kr', 'Образцы JobKorea: jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 Корейская структура сопроводительного письма из 4 разделов',
    category: 'Резюме/Подготовка к работе',
    description: 'Понимание основной структуры сопроводительных писем корейских компаний',
    details: {
      four_sections: {
        'Процесс роста': 'Объяснение предыстории + процесс формирования личности (может подчеркнуть культурную адаптивность)',
        'Сильные и слабые стороны': 'Фокус на сильных сторонах + усилия по преодолению слабостей',
        'Мотивация заявления и будущие цели': 'Писать конкретно на основе результатов исследования компании/должности',
        'Случаи опыта и деятельности': 'Использовать метод STAR (Situation, Task, Action, Result)'
      },
      writing_tips: ['Избегать слишком абстрактных выражений', 'Писать непосредственно на корейском, затем получить помощь с исправлениями (школьный карьерный центр или корейские друзья)']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 Стратегия подготовки к корейскому собеседованию для иностранцев',
    category: 'Резюме/Подготовка к работе',
    description: 'Культурные особенности и советы по подготовке к собеседованиям в корейских компаниях',
    details: {
      interview_types: ['1-й тур собеседование личности после отбора документов (индивидуальное/панель)', '2-й тур практическое собеседование или PT-собеседование', 'Некоторые компании включают AI-собеседования, групповые дискуссии'],
      common_questions: ['Самопрезентация (1-минутная самопрезентация = "само-PR")', 'Мотивация заявления / Сильные и слабые стороны', 'Опыт разрешения конфликтов', 'Причины желания работать в Корее'],
      foreigner_specific: ['Уровень владения корейским языком', 'Опыт адаптации к корейской культуре', 'Объяснение статуса визы/проживания'],
      tips: ['Пробное собеседование перед настоящим обязательно!', 'Формальная одежда + пунктуальность + использование вежливых форм', 'Последний вопрос: "Есть что сказать?" → Короткое и позитивное завершение']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 Обзор типов корейских рабочих виз (D-10, E-7, F-2, etc.)',
    category: 'Виза/Юридические/Труд',
    description: 'Руководство по конверсии визы для трудоустройства в Корее после окончания',
    details: {
      visa_types: {
        'D-10 (Visa búsqueda empleo)': 'Для иностранцев, ищущих работу после окончания - Максимум 6 месяцев, renovable una vez',
        'E-7 (Visa profesional)': 'Для профессионалов (IT, дизайн, торговля и т.д.) - Образование + опыт требуются, трудовой договор обязателен',
        'F-2-7 (Visa residencia)': 'Для талантливых людей с определенным баллом или выше - Свободное трудоустройство, выгодно для долгосрочного пребывания',
        'F-4 (Coreanos ultramar)': 'Для иностранцев корейского происхождения - Почти никаких ограничений трудоустройства, свободная деятельность'
      },
      conversion_tips: ['D-2 → D-10: Подавать в течение 30 дней до окончания', 'D-10 → E-7: Трудовой договор + доказательство соответствующей специализации или опыта требуется', 'Требования E-7 reforzados: Проверить зарплату, отрасль, образовательные стандарты']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ Основы корейского трудового права для иностранных рабочих',
    category: 'Виза/Юридические/Труд',
    description: 'Основные права и обязанности иностранных рабочих',
    details: {
      basic_rights: ['Гарантия минимальной заработной платы (стандарт 2025: ₩9,860/час)', 'Один оплачиваемый выходной в неделю, лимит 52 часа работы в неделю', 'Подлежат 4 основным страховкам (Национальная пенсия, Медицинское страхование, Страхование занятости, Компенсация работникам)', 'Может подать жалобу в Трудовое управление за несправедливое увольнение'],
      common_problems: ['Работа без договора / Трудоустройство после незаконного пребывания', 'Задолженность по зарплате', 'Неуплата пособий на выходные/сверхурочные'],
      help_contacts: ['Колл-центр 1350 Министерства занятости и труда (многоязычная поддержка)', 'Центр поддержки иностранных рабочих или региональное Трудовое управление']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 Контрольный список трудового договора для иностранцев',
    category: 'Виза/Юридические/Труд',
    description: 'Основные пункты договора для законного трудоустройства',
    details: {
      required_items: ['Адрес рабочего места', 'Описание работы', 'Рабочие часы и время перерыва', 'Зарплаты (включая дату и способ выплаты)', 'Vacaciones y licencia anual', 'Indemnización despido y condiciones terminación contrato'],
      precautions: ['Derecho отказаться, если существует только устный договор или договор не предоставлен', 'Сохранить копию договора', 'Может запросить помощь с переводом, если написан только на корейском'],
      references: ['Manual Empleo Extranjeros Ministerio Empleo y Trabajo', 'Portal información visa HiKorea']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 Руководство по ярмарке вакансий для международных студентов',
    category: 'Ярмарка вакансий/Нетворкинг',
    description: 'Места для прямого получения информации о трудоустройстве и возможностях',
    details: {
      major_events: {
        'Ярмарка вакансий для международных студентов': 'Организовано: Министерство занятости и труда, Министерство торговли, промышленности и энергетики / Когда: Обычно сентябрь-октябрь / Где: COEX, SETEC, etc.',
        'Университетские глобальные ярмарки вакансий': 'Korea University, Sungkyunkwan University, Yonsei University, etc. / Участвуют многие зарубежные и национальные компании'
      },
      preparation: ['Резюме и сопроводительное письмо на корейском/английском', 'Одежда: Деловой костюм', 'Подготовка базового корейского разговора'],
      tips: ['Исследовать интересующие компании перед посещением стендов компаний', 'Доступны возможности собеседования на месте, поэтому практика самопрезентации обязательна']
    }
  },
  {
    id: 'networking',
    title: '🤝 5 способов создания сетей в Корее',
    category: 'Ярмарка вакансий/Нетворкинг',
    description: 'Построение отношений в Корее, одной сетевой социальной системе',
    details: {
      methods: ['Программы школьного карьерного центра - Наставничество, корпоративные лекции, клубы трудоустройства', 'Группы международных студентов - AIESEC, ISN, Buddy Program, etc.', 'Использование LinkedIn - Соединиться с представителями компаний, выпускниками', 'Встречи бизнес-обмена Корея-иностранцы - Организованные Торговой палатой Кореи, KOTRA, Агентством содействия инвестициям Кореи', 'События посольств каждой страны - Культурные события + предоставление корпоративной информации в комбинации'],
      networking_tips: ['Подготовить самопрезентацию (корейская/английская версии)', 'Принести визитки или контактные карты', 'Последующий контакт (email, SNS) обязателен']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 Законные условия работы на полставки для международных студентов (Виза D-2)',
    category: 'Полставки/Временная работа',
    description: 'Условия работы на полставки для международных студентов с визой D-2',
    details: {
      requirements: ['Карта регистрации иностранца выдана', 'Требуется предварительное разрешение университета (одобрение научного руководителя или международных дел)', 'Подать заявление на разрешение на работу в Иммиграционном управлении и получить Permission Letter'],
      working_hours: ['Во время семестра: Максимум 20 часов в неделю (исключая выходные, праздники)', 'Во время каникул: Без ограничения времени', 'Аспиранты: Могут применяться отдельные правила, кроме работы ассистентом преподавателя'],
      allowed_jobs: ['Обслуживание в ресторане, магазины удобства, кафе', 'Помощь в переводе/устном переводе, помощь в преподавании иностранного языка', 'Кассир в магазине, офисная помощь и другие простые сервисные работы'],
      prohibited: ['Развлекательные заведения, караоке, массажные салоны, предприятия, связанные с азартными играми и т.д.']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 5 способов для студентов найти работу на полставки',
    category: 'Полставки/Временная работа',
    description: 'Каналы поиска работы на полставки, легко доступные для международных студентов',
    details: {
      platforms: {
        'Albamon / Alba Heaven': 'Есть фильтры только для иностранцев - https://www.albamon.com, https://www.alba.co.kr',
        'Доска международных дел школы / SNS': 'Объявления о работе на полставки для международных студентов часто публикуются',
        'Сообщества иностранцев': 'Группы Facebook, открытый чат KakaoTalk и т.д.',
        'Региональные приложения информации о работе на полставки': 'Carrot Alba, Zigbang Alba и т.д.',
        'Рекомендации или прямой запрос': 'Обнаружить места найма путем прямого посещения близлежащих магазинов'
      },
      tips: ['Подготовка резюме: Включить простую самопрезентацию на корейском', 'Иметь Permission Letter иммиграции перед работой']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ Меры предосторожности для международных студентов, работающих на полставки',
    category: 'Полставки/Временная работа',
    description: 'Меры предосторожности для избежания проблем со статусом проживания при работе на полставки',
    details: {
      warnings: ['Работа без разрешения иммиграции = Считается незаконным пребыванием', 'Может сообщить, если платят ниже минимальной зарплаты (стандарт 2025: ₩9,860/час)', 'Невыгодно, если нет трудового договора во время задолженности по зарплате', 'Работодатели могут эксплуатировать иностранный статус → Всегда создавать письменный договор'],
      protection: ['Использовать колл-центр 1350 Министерства занятости и труда (многоязычная поддержка)', 'Консультация Центра поддержки иностранных рабочих', 'Сообщить в международные дела школы или попросить помощи'],
      checklist: ['Получили разрешение на работу от иммиграции?', 'Написали трудовой договор?', 'Ясны ли способ и дата выплаты зарплаты?', 'Знаете ли вы свои права на еженедельную оплату выходных, оплату сверхурочных и т.д.?']
    }
  }
]; 

// 독일어 취업 콘텐츠
export const germanWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 Koreanischer Lebenslauf-Leitfaden',
    category: 'Lebenslauf/Jobvorbereitung',
    description: 'Wie man einen koreanischen Lebenslauf für internationale Studenten schreibt',
    details: {
      basic_structure: ['Persönliche Daten (Name, Geburtsdatum, Kontakt)', 'Foto (Passfoto erforderlich, innerhalb 6 Monate)', 'Bildung und Erfahrung', 'Sprachkenntnisse (TOPIK, TOEIC, JLPT usw.)', 'Zertifikate', 'Auszeichnungen und Aktivitäten'],
      writing_tips: ['In Word oder Hangul-Dokumenten schreiben (PDF-Speicherung empfohlen)', 'Koreanisches Datumsformat verwenden (z.B. 2025.03 ~ 2025.08)', 'Unnötige Informationen reduzieren und Kernpunkte betonen (leistungsorientiert)'],
      reference_sites: ['Saramin Lebenslauf-Vorlage: saramin.co.kr', 'JobKorea Beispiele: jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 Koreanisches Anschreiben mit 4-Abschnitt-Struktur',
    category: 'Lebenslauf/Jobvorbereitung',
    description: 'Die Kernstruktur von Anschreiben koreanischer Unternehmen verstehen',
    details: {
      four_sections: {
        'Wachstumsprozess': 'Hintergrunderklärung + Persönlichkeitsbildungsprozess (kann kulturelle Anpassungsfähigkeit betonen)',
        'Stärken und Schwächen': 'Fokus auf Stärken + Bemühungen zur Überwindung von Schwächen',
        'Bewerbungsmotivation und Zukunftsziele': 'Spezifisch basierend auf Unternehmens-/Stellenrecherche schreiben',
        'Erfahrungs- und Aktivitätsfälle': 'STAR-Methode verwenden (Situation, Task, Action, Result)'
      },
      writing_tips: ['Zu abstrakte Ausdrücke vermeiden', 'Direkt auf Koreanisch schreiben, dann Hilfe bei Korrekturen erhalten (Schulkarrierezentrum oder koreanische Freunde)']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 Koreanische Jobinterview-Vorbereitungsstrategie für Ausländer',
    category: 'Lebenslauf/Jobvorbereitung',
    description: 'Kulturelle Eigenschaften und Vorbereitungstipps für koreanische Unternehmensinterviews',
    details: {
      interview_types: ['1. Runde Persönlichkeitsinterview nach Dokumentenauswahl (individuell/Panel)', '2. Runde praktisches Interview oder PT-Interview', 'Einige Unternehmen beinhalten KI-Interviews, Gruppendiskussionen'],
      common_questions: ['Selbstvorstellung (1-Minuten-Selbstvorstellung = "Selbst-PR")', 'Bewerbungsmotivation / Stärken und Schwächen', 'Konfliktsolvierungserfahrung', 'Gründe für Arbeitswunsch in Korea'],
      foreigner_specific: ['Koreanische Sprachkompetenz', 'Koreanische Kulturanpassungserfahrung', 'Visa-/Aufenthaltsstatus-Erklärung'],
      tips: ['Probeinterview vor echtem Interview unerlässlich!', 'Formelle Kleidung + Pünktlichkeit + Höflichkeitsformen verwenden', 'Letzte Frage: "Haben Sie etwas zu sagen?" → Kurzer und positiver Abschluss']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 Übersicht koreanischer Arbeitsvisa-Typen (D-10, E-7, F-2, etc.)',
    category: 'Visa/Rechtliches/Arbeit',
    description: 'Visa-Umwandlungsführer für Beschäftigung in Korea nach Abschluss',
    details: {
      visa_types: {
        'D-10 (Jobsuchvisa)': 'Für Ausländer, die nach Abschluss einen Job suchen - Maximum 6 Monate, einmal verlängerbar',
        'E-7 (Berufsvisa)': 'Für Fachkräfte (IT, Design, Handel usw.) - Bildung + Erfahrung erforderlich, Arbeitsvertrag wesentlich',
        'F-2-7 (Aufenthaltsvisa)': 'Für talentierte Personen mit bestimmter Punktzahl oder höher - Freie Beschäftigung, vorteilhaft für langfristigen Aufenthalt',
        'F-4 (Auslandskoreaner)': 'Für Ausländer koreanischer Herkunft - Fast keine Beschäftigungsbeschränkungen, freie Aktivitäten'
      },
      conversion_tips: ['D-2 → D-10: Innerhalb 30 Tage vor Abschluss beantragen', 'D-10 → E-7: Arbeitsvertrag + Nachweis relevanter Spezialisierung oder Erfahrung erforderlich', 'E-7-Anforderungen verstärkt: Gehalt, Branche, Bildungsstandards überprüfen']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ Grundlagen des koreanischen Arbeitsrechts für ausländische Arbeitnehmer',
    category: 'Visa/Rechtliches/Arbeit',
    description: 'Grundrechte und -pflichten ausländischer Arbeitnehmer',
    details: {
      basic_rights: ['Mindestlohngarantie (Standard 2025: ₩9,860/Stunde)', 'Ein bezahlter Feiertag pro Woche, 52-Stunden-Arbeitswochenlimit', 'Unterliegt 4 Hauptversicherungen (Nationale Rente, Krankenversicherung, Arbeitslosenversicherung, Arbeiterentschädigung)', 'Kann Beschwerde beim Arbeitsamt wegen unrechtmäßiger Entlassung einreichen'],
      common_problems: ['Arbeit ohne Vertrag / Beschäftigung nach illegalem Aufenthalt', 'Lohnrückstände', 'Nichtzahlung von Feiertags-/Überstundenzulagen'],
      help_contacts: ['Callcenter 1350 des Ministeriums für Beschäftigung und Arbeit (mehrsprachige Unterstützung)', 'Ausländische Arbeitnehmerunterstützungszentrum oder regionales Arbeitsamt']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 Arbeitsvertrag-Checkliste für Ausländer',
    category: 'Visa/Rechtliches/Arbeit',
    description: 'Wesentliche Vertragspunkte für legale Beschäftigung',
    details: {
      required_items: ['Arbeitsplatzadresse', 'Stellenbeschreibung', 'Arbeitszeiten und Pausenzeit', 'Löhne (einschließlich Zahlungsdatum und -methode)', 'Feiertage und Jahresurlaub', 'Abfindung und Vertragsbeendigungsbedingungen'],
      precautions: ['Recht zur Ablehnung, wenn nur mündlicher Vertrag existiert oder Vertrag nicht bereitgestellt wird', 'Vertragskopie aufbewahren', 'Kann Übersetzungshilfe anfordern, wenn nur auf Koreanisch geschrieben'],
      references: ['Ministerium für Beschäftigung und Arbeit Ausländerbeschäftigungshandbuch', 'HiKorea Visa-Informationsportal']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 Jobmesse-Führer für internationale Studenten',
    category: 'Jobmesse/Networking',
    description: 'Orte, um direkt Beschäftigungsinformationen und -möglichkeiten zu erhalten',
    details: {
      major_events: {
        'Internationale Studenten-Jobmesse': 'Organisiert von: Ministerium für Beschäftigung und Arbeit, Ministerium für Handel, Industrie und Energie / Wann: Normalerweise September-Oktober / Wo: COEX, SETEC usw.',
        'Universitäts-Globale Jobmessen': 'Korea University, Sungkyunkwan University, Yonsei University usw. / Viele ausländische und inländische Unternehmen nehmen teil'
      },
      preparation: ['Koreanischer/englischer Lebenslauf und Anschreiben', 'Kleidung: Business-formal', 'Grundlegende koreanische Konversationsvorbereitung'],
      tips: ['Interessante Unternehmen vor Besuch der Unternehmensstände recherchieren', 'Vor-Ort-Interview-Möglichkeiten verfügbar, daher Selbstvorstellungspraxis unerlässlich']
    }
  },
  {
    id: 'networking',
    title: '🤝 5 Wege zum Networking in Korea',
    category: 'Jobmesse/Networking',
    description: 'Beziehungsaufbau in Korea, einer netzwerkzentrierten Gesellschaft',
    details: {
      methods: ['Schulkarrierezentrum-Programme - Mentoring, Unternehmensvorträge, Jobclubs', 'Internationale Studentengruppen - AIESEC, ISN, Buddy Program usw.', 'LinkedIn-Nutzung - Mit Unternehmensvertretern, Alumni verbinden', 'Korea-Ausländer Geschäftsaustauschtreffen - Veranstaltet von der Koreanischen Handelskammer, KOTRA, Korea Investment Promotion Agency', 'Botschaftsveranstaltungen jedes Landes - Kulturveranstaltungen + Unternehmensinformationsbereitstellung kombiniert'],
      networking_tips: ['Selbstvorstellung vorbereiten (koreanische/englische Versionen)', 'Visitenkarten oder Kontaktkarten mitbringen', 'Nachfolge-Kontakt (E-Mail, SNS) unerlässlich']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 Legale Teilzeitarbeitsbedingungen für internationale Studenten (D-2 Visa)',
    category: 'Teilzeit/Zeitarbeit',
    description: 'Teilzeitarbeitsbedingungen für internationale Studenten mit D-2 Visa',
    details: {
      requirements: ['Ausländerregistrierungskarte ausgestellt', 'Universitäts-Vorabgenehmigung erforderlich (Berater- oder internationale Angelegenheiten-Genehmigung)', 'Arbeitserlaubnis beim Einwanderungsamt beantragen und Permission Letter erhalten'],
      working_hours: ['Während des Semesters: Maximum 20 Stunden pro Woche (ausgenommen Wochenenden, Feiertage)', 'Während der Ferien: Keine Zeitbegrenzung', 'Graduierte Studenten: Separate Bestimmungen können außer Lehrassistentenarbeit gelten'],
      allowed_jobs: ['Restaurantservice, Convenience-Stores, Cafés', 'Übersetzungs-/Dolmetschassistenz, Fremdsprachenlehrassistenz', 'Marktkassierer, Büroassistenz und andere einfache Servicejobs'],
      prohibited: ['Unterhaltungseinrichtungen, Karaoke, Massagesalons, glücksspielbezogende Geschäfte usw.']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 5 Wege für Studenten, Teilzeitjobs zu finden',
    category: 'Teilzeit/Zeitarbeit',
    description: 'Teilzeitjob-Suchkanäle, die für internationale Studenten leicht zugänglich sind',
    details: {
      platforms: {
        'Albamon / Alba Heaven': 'Hat Nur-Ausländer-Filter - https://www.albamon.com, https://www.alba.co.kr',
        'Schul-Internationale Angelegenheiten Board / SNS': 'Teilzeitjob-Anzeigen für internationale Studenten häufig gepostet',
        'Ausländer-Communities': 'Facebook-Gruppen, KakaoTalk offener Chat usw.',
        'Regionale Teilzeitjob-Info-Apps': 'Carrot Alba, Zigbang Alba usw.',
        'Empfehlungen oder direkte Anfrage': 'Einstellungsplätze durch direkten Besuch nahegelegener Geschäfte entdecken'
      },
      tips: ['Lebenslaufvorbereitung: Einfache koreanische Selbstvorstellung einschließen', 'Einwanderungs-Permission Letter vor Arbeit besitzen']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ Vorsichtsmaßnahmen für internationale Studenten bei Teilzeitarbeit',
    category: 'Teilzeit/Zeitarbeit',
    description: 'Vorsichtsmaßnahmen zur Vermeidung von Problemen mit dem Aufenthaltsstatus bei Teilzeitarbeit',
    details: {
      warnings: ['Arbeit ohne Einwanderungserlaubnis = Als illegaler Aufenthalt betrachtet', 'Kann melden, wenn unter Mindestlohn bezahlt (Standard 2025: ₩9,860/Stunde)', 'Nachteilig, wenn kein Arbeitsvertrag während Lohnrückständen', 'Arbeitgeber können ausländischen Status ausnutzen → Immer schriftlichen Vertrag erstellen'],
      protection: ['Callcenter 1350 des Ministeriums für Beschäftigung und Arbeit nutzen (mehrsprachige Unterstützung)', 'Ausländische Arbeitnehmerunterstützungszentrum-Beratung', 'An Schul-Internationale Angelegenheiten melden oder Hilfe anfordern'],
      checklist: ['Einwanderungsarbeitserlaubnis erhalten?', 'Arbeitsvertrag geschrieben?', 'Sind Lohnzahlungsmethode und -datum klar?', 'Kennen Sie Ihre Rechte auf wöchentlichen Feiertagslohn, Überstundenlohn usw.?']
    }
  }
];

// 프랑스어 취업 콘텐츠
export const frenchWorkContent: FloatingBallContent[] = [
  {
    id: 'korean-resume',
    title: '📄 Guide de rédaction de CV coréen',
    category: 'CV/Préparation emploi',
    description: 'Comment rédiger un CV de style coréen pour les étudiants internationaux',
    details: {
      basic_structure: ['Informations personnelles (Nom, Date de naissance, Contact)', 'Photo (Photo d\'identité requise, dans les 6 mois)', 'Éducation et expérience', 'Compétences linguistiques (TOPIK, TOEIC, JLPT, etc.)', 'Certifications', 'Prix et activités'],
      writing_tips: ['Écrire dans des documents Word ou Hangul (sauvegarde PDF recommandée)', 'Utiliser le format de date coréen (ex: 2025.03 ~ 2025.08)', 'Réduire les informations inutiles et mettre l\'accent sur les points clés (axé sur les réalisations)'],
      reference_sites: ['Modèle de CV Saramin: saramin.co.kr', 'Échantillons JobKorea: jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 Structure de lettre de motivation coréenne en 4 sections',
    category: 'CV/Préparation emploi',
    description: 'Comprendre la structure centrale des lettres de motivation des entreprises coréennes',
    details: {
      four_sections: {
        'Processus de croissance': 'Explication du contexte + processus de formation de la personnalité (peut souligner l\'adaptabilité culturelle)',
        'Forces et faiblesses': 'Focus sur les forces + efforts pour surmonter les faiblesses',
        'Motivation de candidature et objectifs futurs': 'Écrire spécifiquement basé sur les résultats de recherche entreprise/poste',
        'Cas d\'expérience et d\'activités': 'Utiliser la méthode STAR (Situation, Task, Action, Result)'
      },
      writing_tips: ['Éviter les expressions trop abstraites', 'Écrire directement en coréen, puis obtenir de l\'aide pour les corrections (centre de carrière scolaire ou amis coréens)']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 Stratégie de préparation d\'entretien d\'embauche coréen pour étrangers',
    category: 'CV/Préparation emploi',
    description: 'Caractéristiques culturelles et conseils de préparation pour les entretiens d\'entreprises coréennes',
    details: {
      interview_types: ['1er tour entretien de personnalité après sélection de documents (individuel/panel)', '2e tour entretien pratique ou entretien PT', 'Certaines entreprises incluent des entretiens IA, discussions de groupe'],
      common_questions: ['Auto-présentation (auto-présentation de 1 minute = "auto-PR")', 'Motivation de candidature / Forces et faiblesses', 'Expérience de résolution de conflits', 'Raisons de vouloir travailler en Corée'],
      foreigner_specific: ['Niveau de compétence en coréen', 'Expérience d\'adaptation culturelle coréenne', 'Explication du statut visa/résidence'],
      tips: ['Entretien simulé avant vrai entretien essentiel!', 'Tenue formelle + ponctualité + utiliser formes honorifiques', 'Dernière question: "Avez-vous quelque chose à dire?" → Conclusion courte et positive']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 Aperçu des types de visa de travail coréens (D-10, E-7, F-2, etc.)',
    category: 'Visa/Juridique/Travail',
    description: 'Guide de conversion de visa pour l\'emploi en Corée après l\'obtention du diplôme',
    details: {
      visa_types: {
        'D-10 (Visa recherche emploi)': 'Pour étrangers cherchant emploi après obtention diplôme - Maximum 6 mois, renouvelable une fois',
        'E-7 (Visa professionnel)': 'Pour professionnels (IT, design, commerce, etc.) - Éducation + expérience requises, contrat emploi essentiel',
        'F-2-7 (Visa résidence)': 'Pour personnes talentueuses avec certain score ou plus - Emploi libre, avantageux pour séjour long terme',
        'F-4 (Coréens outre-mer)': 'Pour étrangers d\'origine coréenne - Presque aucune restriction emploi, activités libres'
      },
      conversion_tips: ['D-2 → D-10: Postuler dans les 30 jours avant obtention diplôme', 'D-10 → E-7: Contrat emploi + preuve spécialisation pertinente ou expérience requise', 'Exigences E-7 renforcées: Vérifier salaire, industrie, standards éducation']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ Bases du droit du travail coréen pour travailleurs étrangers',
    category: 'Visa/Juridique/Travail',
    description: 'Droits et obligations de base des travailleurs étrangers',
    details: {
      basic_rights: ['Garantie salaire minimum (standard 2025: ₩9,860/heure)', 'Un jour férié payé par semaine, limite 52 heures travail par semaine', 'Soumis aux 4 assurances principales (Pension Nationale, Assurance Santé, Assurance Emploi, Compensation Travailleurs)', 'Peut déposer plainte au Bureau du Travail pour licenciement injuste'],
      common_problems: ['Travail sans contrat / Emploi après séjour illégal', 'Arriérés salariaux', 'Non-paiement allocations vacances/heures supplémentaires'],
      help_contacts: ['Centre d\'appel 1350 Ministère Emploi et Travail (support multilingue)', 'Centre Support Travailleurs Étrangers ou Bureau Travail régional']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 Liste de vérification contrat emploi pour étrangers',
    category: 'Visa/Juridique/Travail',
    description: 'Articles essentiels contrat pour emploi légal',
    details: {
      required_items: ['Adresse lieu travail', 'Description emploi', 'Heures travail et temps pause', 'Salaires (incluant date et méthode paiement)', 'Vacances et congé annuel', 'Indemnité licenciement et conditions fin contrat'],
      precautions: ['Droit refuser si seul contrat verbal existe ou contrat non fourni', 'Conserver copie contrat', 'Peut demander aide traduction si écrit seulement en coréen'],
      references: ['Manuel Emploi Étrangers Ministère Emploi et Travail', 'Portail information visa HiKorea']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 Guide salon emploi pour étudiants internationaux',
    category: 'Salon emploi/Réseautage',
    description: 'Lieux pour obtenir directement informations emploi et opportunités',
    details: {
      major_events: {
        'Salon Emploi Étudiants Internationaux': 'Organisé par: Ministère Emploi et Travail, Ministère Commerce, Industrie et Énergie / Quand: Habituellement septembre-octobre / Où: COEX, SETEC, etc.',
        'Salons Emploi Globaux Universitaires': 'Korea University, Sungkyunkwan University, Yonsei University, etc. / Beaucoup entreprises étrangères et nationales participent'
      },
      preparation: ['CV et lettre motivation coréen/anglais', 'Tenue: Costume affaires', 'Préparation conversation coréenne de base'],
      tips: ['Rechercher entreprises intérêt avant visiter stands entreprises', 'Opportunités entretien sur place disponibles, donc pratique auto-présentation essentielle']
    }
  },
  {
    id: 'networking',
    title: '🤝 5 façons de réseauter en Corée',
    category: 'Salon emploi/Réseautage',
    description: 'Construire relations en Corée, société centrée sur réseaux',
    details: {
      methods: ['Programmes centre carrière école - Mentorat, conférences entreprises, clubs emploi', 'Groupes étudiants internationaux - AIESEC, ISN, Buddy Program, etc.', 'Utilisation LinkedIn - Se connecter avec représentants entreprises, anciens', 'Rencontres échange affaires Corée-étrangers - Organisées Chambre Commerce Corée, KOTRA, Agence Promotion Investissement Corée', 'Événements ambassades chaque pays - Événements culturels + fourniture informations entreprises combinés'],
      networking_tips: ['Préparer auto-présentation (versions coréenne/anglaise)', 'Apporter cartes visite ou cartes contact', 'Contact suivi (email, SNS) essentiel']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 Conditions travail temps partiel légal pour étudiants internationaux (Visa D-2)',
    category: 'Temps partiel/Travail temporaire',
    description: 'Conditions travail temps partiel pour étudiants internationaux visa D-2',
    details: {
      requirements: ['Carte Enregistrement Étranger délivrée', 'Permission préalable université requise (approbation conseiller ou affaires internationales)', 'Demander permis travail au Bureau Immigration et obtenir Permission Letter'],
      working_hours: ['Pendant semestre: Maximum 20 heures par semaine (excluant week-ends, jours fériés)', 'Pendant vacances: Aucune limite temps', 'Étudiants diplômés: Règlements séparés peuvent s\'appliquer sauf travail assistant enseignement'],
      allowed_jobs: ['Service restaurant, dépanneurs, cafés', 'Assistance traduction/interprétation, assistance enseignement langue étrangère', 'Caissier marché, assistance bureau et autres emplois service simples'],
      prohibited: ['Établissements divertissement, karaoké, salons massage, affaires liées jeux hasard, etc.']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 5 façons pour étudiants trouver emplois temps partiel',
    category: 'Temps partiel/Travail temporaire',
    description: 'Canaux recherche emploi temps partiel facilement accessibles aux étudiants internationaux',
    details: {
      platforms: {
        'Albamon / Alba Heaven': 'A filtres étrangers seulement - https://www.albamon.com, https://www.alba.co.kr',
        'Tableau Affaires Internationales École / SNS': 'Annonces emploi temps partiel pour étudiants internationaux fréquemment postées',
        'Communautés Étrangers': 'Groupes Facebook, chat ouvert KakaoTalk, etc.',
        'Apps info emploi temps partiel régionales': 'Carrot Alba, Zigbang Alba, etc.',
        'Recommandations ou demande directe': 'Découvrir lieux embauche en visitant directement magasins proches'
      },
      tips: ['Préparation CV: Inclure simple auto-présentation coréenne', 'Posséder Permission Letter immigration avant travailler']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ Précautions pour étudiants internationaux travaillant temps partiel',
    category: 'Temps partiel/Travail temporaire',
    description: 'Précautions pour éviter problèmes avec statut résidence en travaillant temps partiel',
    details: {
      warnings: ['Travailler sans permission immigration = Considéré séjour illégal', 'Peut signaler si payé sous salaire minimum (standard 2025: ₩9,860/heure)', 'Désavantageux si pas contrat emploi pendant arriérés salariaux', 'Employeurs peuvent exploiter statut étranger → Toujours créer contrat écrit'],
      protection: ['Utiliser centre appel 1350 Ministère Emploi et Travail (support multilingue)', 'Consultation Centre Support Travailleurs Étrangers', 'Signaler aux affaires internationales école ou demander aide'],
      checklist: ['Avez-vous reçu permission travail immigration?', 'Avez-vous écrit contrat emploi?', 'Méthode et date paiement salaire sont-elles claires?', 'Connaissez-vous vos droits au paiement vacances hebdomadaires, paiement heures supplémentaires, etc.?']
    }
  }
];