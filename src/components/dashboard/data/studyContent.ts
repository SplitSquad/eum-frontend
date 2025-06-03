import { FloatingBallContent } from './floatingBallsData';

// Korean version (한국어)
export const koreanStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 한국 대학 학사 과정 입학 가이드',
      
      category: '학사/캠퍼스',
      description: '외국인 유학생을 위한 단계별 입학 절차',
      details: {
        main_procedures: [
          '대학 및 전공 선택 - 국립/사립대학교 선택, 전공에 따른 특성 확인',
          '지원 서류 준비 - 고등학교 졸업 증명서 (공증 필요), 성적 증명서, 자기소개서 및 학업계획서',
          '한국어 능력 시험(TOPIK) 또는 영어 성적 (학교에 따라 다름)',
          '입학 일정 확인 - 대부분의 대학은 봄학기(3월), 가을학기(9월) 입학'
        ],
        university_examples: [
          '서울대(연구 중심)',
          '한양대(공학 특화)',
          '이화여대(여성 전용)'
        ],
        references: [
          'Study in Korea',
          '각 대학교 국제처 홈페이지'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 한국 대학교 캠퍼스 생활 A to Z',
      
      category: '학사/캠퍼스',
      description: '외국인 학생들이 자주 묻는 캠퍼스 라이프 팁',
      details: {
        dining: [
          '대학 내 학생식당 이용 가능 (₩3,000~₩6,000)',
          '근처 편의점, 카페 다수'
        ],
        dormitory: [
          '대부분의 대학교는 유학생을 위한 기숙사 제공',
          '월 비용: 약 ₩200,000~₩500,000',
          '신청 시기 주의: 입학 확정 후 바로 신청해야 자리 확보 가능'
        ],
        activities: [
          '외국인 전용 동아리 존재',
          '한국인 친구 사귀기 좋은 기회'
        ],
        facilities: [
          '캠퍼스 전역 무료 Wi-Fi 제공',
          '도서관, 헬스장, 스터디룸 무료 또는 저렴한 이용 가능'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ 외국인을 위한 한국어 강의 & 학사 병행 팁',
      
      category: '학사/캠퍼스',
      description: '한국어가 부족한 유학생을 위한 지원 시스템',
      details: {
        preparatory_course: [
          '한국 대학 부설 어학당에서 6개월~1년 수강',
          'TOPIK 3~4급 이상 취득 후 학사 진학 가능'
        ],
        language_options: [
          '일부 대학(연세대, POSTECH 등)은 영어 전용 강의 제공',
          '인문/사회계열은 한국어 강의가 더 많음 → 한국어 능력 필수'
        ],
        tips: [
          '한국어 어플 (e.g. Papago, Naver Dictionary) 적극 활용',
          '유학생 도우미 제도 활용 (튜터링 제공)'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 한국 대학의 학업 지원 서비스 안내',
      
      category: '학업지원/시설',
      description: '외국인 유학생을 위한 다양한 학업 지원 제도',
      details: {
        tutoring: [
          '교내 전공 튜터링: 한국 학생이 외국인 학생에게 과제, 시험 준비 등을 도와주는 프로그램',
          '대부분 무료 제공, 학기 초 신청 필수'
        ],
        language_support: [
          '한국어 튜터링, 회화 수업, 언어교화 프로그램 운영',
          'TOPIK 대비반 운영 (일부 학교 무료)'
        ],
        counseling: [
          '정기적인 학업 상담 가능',
          '교수님과의 미팅 통해 전공 이해도 상승 + 진로 조언 가능'
        ],
        learning_center: [
          '에세이 작성법, 프레젠테이션 기법, 논문 작성법 등 워크숍 진행'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 외국인 유학생을 위한 도서관 이용 가이드',
      
      category: '학업지원/시설',
      description: '유학생에게 최고의 공부 공간인 도서관 활용법',
      details: {
        operating_hours: [
          '일반적으로 09:00~22:00, 시험 기간엔 24시간 운영 가능',
          '자동 출입 시스템: 학생증 필요'
        ],
        services: [
          '개별 열람실, 그룹 스터디룸',
          '프린터/복사기 사용 가능 (소액 결제)',
          '전공별 자료, 전자책, 논문 데이터베이스 제공'
        ],
        digital_resources: [
          '교내 와이파이 또는 학교 VPN 접속 후 이용',
          'RISS, DBpia, KISS 등 한국 논문 검색 사이트 사용 가능'
        ],
        tips: [
          '조용히 해야 하므로 음성 통화, 음식 반입은 금지',
          '시험기간에는 좌석 부족하니 미리 예약'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ IT & 학습 시설 총정리',
      
      category: '학업지원/시설',
      description: '한국 대학의 우수한 디지털 학습 환경',
      details: {
        computer_lab: [
          '교내 대부분의 건물에 컴퓨터실 완비',
          '무료 이용, 출력 기능 포함',
          'MS Office, 통계 프로그램(R, SPSS) 설치되어 있음'
        ],
        e_learning: [
          '대부분의 대학은 자체 온라인 학습 플랫폼(LMS) 운영',
          '과제 제출, 출석 확인, 강의 다시 보기 가능',
          '예시: 블랙보드, 이클래스, 아이캠퍼스 등'
        ],
        printing: [
          '도서관, 학생회관, 공용 공간에 프린터 배치',
          '교내 카드 또는 학생증으로 결제 가능'
        ],
        tech_support: [
          '교내 IT 서비스 센터에서 Wi-Fi 문제, 계정 오류, 장비 문제 해결'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 한국 유학 비자(D-2) 신청 가이드',
      
      category: '행정/비자/서류',
      description: '한국에서 정규 대학 과정 이수를 위한 D-2 비자',
      details: {
        procedures: [
          '입학 허가서 수령 (대학교로부터)',
          '비자 신청서 작성',
          '관할 한국 대사관/영사관에 접수'
        ],
        required_docs: [
          '입학허가서',
          '표준입학허가서 (Standard Admission Letter)',
          '최종학력 졸업증명서 및 성적증명서 (공증 번역본)',
          '재정증명서 (예치금 10,000 USD 이상 권장)',
          '여권 원본 + 사본',
          '여권용 사진 1매'
        ],
        notes: [
          '일부 국가는 건강검진서 필요',
          '발급 소요: 약 2~4주',
          '학기 시작 2~3달 전 신청 권장'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 외국인 등록증 (ARC) 발급 안내',
      
      category: '행정/비자/서류',
      description: '입국 후 90일 이내 필수 절차',
      details: {
        application_place: [
          '출입국·외국인청 또는 온라인 신청 (HiKorea)'
        ],
        required_docs: [
          '여권',
          '비자 (D-2 등)',
          '입학허가서 또는 재학증명서',
          '주민등록사진 (3.5 x 4.5cm)',
          '수수료: 약 ₩30,000'
        ],
        processing_time: [
          '보통 3~4주 소요',
          '외국인등록증 발급 전에는 출국 자제'
        ],
        tips: [
          '학교에서 단체 신청을 도와주는 경우도 있음 (신입생 오리엔테이션 참고)'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 학업 중 필요한 행정 서류 총정리',
      
      category: '행정/비자/서류',
      description: '유학생활 중 자주 필요한 서류와 발급 방법',
      details: {
        common_docs: {
          재학증명서: '비자 연장, 외국인등록 - 학교 행정실 / 포털',
          성적증명서: '편입, 장학금 신청 - 학교 포털 / 방문 신청',
          출입국사실증명서: '통장 개설, 각종 행정 업무 - 주민센터 or 정부24',
          주소지변경신고: '외국인 등록 정보 변경 - 출입국청 / 정부24',
          비자연장신청서: '장기 체류 연장 - HiKorea 웹사이트'
        },
        online_tips: [
          '대부분의 학교는 포털사이트에서 PDF 형식 서류 발급 가능',
          '정부24, 민원24 통해 공공기관 서류도 신청 가능 (공동인증서 필요)'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 한국 대학 기숙사 완벽 가이드',
      
      category: '기숙사/주거',
      description: '처음 한국에 오는 유학생에게 가장 안전하고 편리한 선택',
      details: {
        features: [
          '2인실 또는 3인실 위주 / 일부 학교는 1인실 제공',
          '기본 제공: 침대, 책상, 옷장, 에어컨, 와이파이',
          '공용 시설: 세탁실, 샤워실, 식당, 편의점 등'
        ],
        cost: [
          '월 ₩200,000 ~ ₩500,000 수준 (학교 및 방 종류에 따라 다름)',
          '보증금 없음, 관리비 포함'
        ],
        application: [
          '입학 확정 후 국제처 홈페이지 또는 포털을 통해 온라인 신청',
          '조기 마감 주의! → 신청 시기 확인 필수'
        ],
        living_tips: [
          '남녀 분리형이 대부분',
          '외부 음식 제한, 출입 시간 제한이 있는 학교도 있음',
          '공용공간 예절 중요 (청결 유지, 소음 주의)'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 유학생을 위한 외부 거주 형태 비교',
      
      category: '기숙사/주거',
      description: '예산과 라이프스타일에 따른 다양한 거주 옵션',
      details: {
        housing_types: {
          '원룸': '독립된 공간 (화장실/주방 포함) - ₩500,000~₩800,000 - 프라이버시 확보 vs 보증금 높음',
          '고시원': '좁은 개인 방 + 공용 공간 - ₩300,000~₩500,000 - 저렴함, 계약 간단 vs 좁고 방음 취약',
          '하숙/홈스테이': '집주인과 거주 + 식사 제공 - ₩400,000~₩600,000 - 문화 교류 가능 vs 자유도 낮음',
          '쉐어하우스': '여러 명과 공동 생활 - ₩400,000~₩600,000 - 친구 사귀기 쉬움 vs 갈등 발생 가능'
        },
        precautions: [
          '보증금(보통 ₩5,000,000 이상) 요구 가능 → 계약서 꼭 확인!',
          '한국어 계약서가 대부분 → 통역 도움 필요',
          '공과금 별도인지 확인'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 유학생을 위한 집 계약 & 행정 절차 안내',
      
      category: '기숙사/주거',
      description: '외부 거주 시 정식 계약 및 주소 등록의 중요성',
      details: {
        contract_checklist: [
          '계약서 유무 (전입신고용 필요)',
          '보증금 및 월세 조건',
          '퇴실 시 환급 조건',
          '관리비 포함 여부'
        ],
        address_registration: [
          '계약 후 2주 이내, 가까운 주민센터에서 전입신고',
          '외국인등록증 주소 변경과도 연결됨'
        ],
        safety_tips: [
          '부동산 중개소 이용 권장 (불법 중개 피해 예방)',
          '계약서 사본은 꼭 보관',
          '계약 전에 집 상태(곰팡이, 누수 등) 확인'
        ]
      }
    }
  ];
  
  
  
  // English version
  export const englishStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 Guide to Undergraduate Admission at Korean Universities',
      
      category: 'Academic/Campus',
      description: 'Step-by-step admission procedures for international students',
      details: {
        main_procedures: [
          'Selecting university and major - Choose national or private university, check characteristics by major',
          'Prepare application documents - high school diploma (notarization required), transcript, personal statement and study plan',
          'Korean language proficiency test (TOPIK) or English score (depends on university)',
          'Check admission schedule - most universities admit in spring semester (March) and fall semester (September)'
        ],
        university_examples: [
          'Seoul National University (research-focused)',
          'Hanyang University (engineering specialized)',
          'Ewha Womans University (women only)'
        ],
        references: [
          'Study in Korea',
          'International Office websites of each university'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 Campus Life A to Z at Korean Universities',
      
      category: 'Academic/Campus',
      description: 'Campus life tips frequently asked by international students',
      details: {
        dining: [
          'Use student cafeterias on campus (₩3,000~₩6,000)',
          'Many convenience stores and cafes nearby'
        ],
        dormitory: [
          'Most universities offer dormitories for international students',
          'Monthly cost: about ₩200,000~₩500,000',
          'Pay attention to application timing: must apply immediately after admission confirmation to secure a spot'
        ],
        activities: [
          'Clubs exclusively for international students exist',
          'Great opportunity to make Korean friends'
        ],
        facilities: [
          'Free Wi-Fi is available throughout the campus',
          'Library, gym, study rooms available for free or at low cost'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ Korean Language Courses & Tips for Balancing with Academic Studies',
      
      category: 'Academic/Campus',
      description: 'Support systems for international students who lack Korean proficiency',
      details: {
        preparatory_course: [
          'Take a 6-month to 1-year course at university-affiliated language institutes',
          'Eligible for undergraduate admission after obtaining TOPIK level 3~4'
        ],
        language_options: [
          'Some universities (Yonsei, POSTECH, etc.) offer English-taught classes',
          'Humanities and social sciences have more Korean-taught classes → Korean proficiency essential'
        ],
        tips: [
          'Actively use Korean apps (e.g. Papago, Naver Dictionary)',
          'Use the international student helper system (tutoring provided)'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 Academic Support Services at Korean Universities',
      
      category: 'Academic Support/Facilities',
      description: 'Various academic support systems for international students',
      details: {
        tutoring: [
          'On-campus major tutoring: Korean students help international students with assignments, exam preparation, etc.',
          'Mostly free, must apply at the beginning of the semester'
        ],
        language_support: [
          'Korean tutoring, conversation classes, language exchange programs available',
          'TOPIK prep classes offered (free at some schools)'
        ],
        counseling: [
          'Regular academic counseling available',
          'Meetings with professors to improve major understanding + career advice available'
        ],
        learning_center: [
          'Workshops on essay writing, presentation skills, thesis writing, etc.'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 Library Use Guide for International Students',
      
      category: 'Academic Support/Facilities',
      description: 'How to use the library, the best study space for international students',
      details: {
        operating_hours: [
          'Typically 09:00~22:00, 24-hour operation during exam periods',
          'Automatic access system: student ID required'
        ],
        services: [
          'Individual reading rooms, group study rooms',
          'Printer/copier available (small payment)',
          'Major-specific resources, e-books, academic databases provided'
        ],
        digital_resources: [
          'Accessible through campus Wi-Fi or university VPN',
          'Access to Korean research sites like RISS, DBpia, KISS'
        ],
        tips: [
          'Silent environment required, voice calls and food are prohibited',
          'Seats fill up during exam periods, so reserve in advance'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ Overview of IT & Learning Facilities',
      
      category: 'Academic Support/Facilities',
      description: 'Excellent digital learning environment at Korean universities',
      details: {
        computer_lab: [
          'Most campus buildings have computer labs equipped',
          'Free use, printing functions included',
          'MS Office, statistical programs (R, SPSS) installed'
        ],
        e_learning: [
          'Most universities operate their own online learning platforms (LMS)',
          'Allows assignment submissions, attendance checks, lecture playback',
          'Examples: Blackboard, eClass, iCampus, etc.'
        ],
        printing: [
          'Printers are placed in library, student union building, common areas',
          'Payment via campus card or student ID'
        ],
        tech_support: [
          'Campus IT service center resolves Wi-Fi issues, account errors, equipment problems'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 Guide to Applying for Korean Student Visa (D-2)',
      
      category: 'Administration/Visa/Documents',
      description: 'D-2 visa for pursuing a full-degree program in Korea',
      details: {
        procedures: [
          'Receive admission letter (from university)',
          'Fill out visa application form',
          'Submit to Korean embassy/consulate with jurisdiction'
        ],
        required_docs: [
          'Admission letter',
          'Standard Admission Letter',
          'Notarized translations of diploma and transcripts',
          'Financial proof (recommend deposit $10,000 USD or more)',
          'Original passport + copy',
          'One passport-sized photo'
        ],
        notes: [
          'Some countries require a health certificate',
          'Processing time: about 2~4 weeks',
          'Apply 2~3 months before the start of semester'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 Guide to Issuing Foreign Registration Card (ARC)',
      
      category: 'Administration/Visa/Documents',
      description: 'Mandatory procedure within 90 days of entry',
      details: {
        application_place: [
          'Immigration Office or apply online (HiKorea)'
        ],
        required_docs: [
          'Passport',
          'Visa (e.g. D-2)',
          'Admission letter or certificate of enrollment',
          'Passport photo (3.5 x 4.5cm)',
          'Fee: about ₩30,000'
        ],
        processing_time: [
          'Usually takes 3~4 weeks',
          'Avoid leaving Korea before ARC is issued'
        ],
        tips: [
          'Some schools assist with group applications (check orientation for freshmen)'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 All Administrative Documents Needed During Studies',
      
      category: 'Administration/Visa/Documents',
      description: 'Frequently required documents and how to obtain them',
      details: {
        common_docs: {
          Enrollment_Certificate: 'For visa extension, foreign registration - school admin office / portal',
          Transcript: 'For transfers, scholarship applications - school portal / in-person application',
          Entry_Exit_Certificate: 'Bank account setup, various administrative tasks - resident center or Government24',
          Address_Change_Notification: 'Change foreign registration info - Immigration Office / Government24',
          Visa_Extension_Application: 'Extend long-term stay - HiKorea website'
        },
        online_tips: [
          'Most schools allow PDF document issuance via portal',
          'Use Government24, Minwon24 to request public documents (requires authentication)'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 Comprehensive Guide to University Dormitories in Korea',
      
      category: 'Dormitory/Housing',
      description: 'The safest and most convenient option for international students coming to Korea for the first time',
      details: {
        features: [
          'Mostly double or triple rooms / some schools offer single rooms',
          'Provided: bed, desk, wardrobe, air conditioner, Wi-Fi',
          'Shared facilities: laundry room, shower room, cafeteria, convenience store, etc.'
        ],
        cost: [
          'Around ₩200,000 ~ ₩500,000 per month (varies by school and room type)',
          'No deposit, utilities included'
        ],
        application: [
          'After admission is confirmed, apply online via the international office website or portal',
          'Be careful of early closing! → Check application period'
        ],
        living_tips: [
          'Mostly gender-separated',
          'Some schools restrict outside food, have curfews',
          'Etiquette in shared spaces is important (keep clean, mindful of noise)'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 Comparison of External Housing Options for International Students',
      
      category: 'Dormitory/Housing',
      description: 'Various housing options according to budget and lifestyle',
      details: {
        housing_types: {
          Studio: 'Independent space (with bathroom/kitchen) - ₩500,000~₩800,000 - privacy vs high deposit',
          Goshitel: 'Small private room + common spaces - ₩300,000~₩500,000 - cheap, simple contract vs cramped and poor soundproofing',
          Homestay: 'Living with a host family + meals provided - ₩400,000~₩600,000 - cultural exchange possible vs less freedom',
          Sharehouse: 'Living with multiple people - ₩400,000~₩600,000 - easy to make friends vs potential conflicts'
        },
        precautions: [
          'Deposit (usually ₩5,000,000 or more) may be required → Check contract carefully!',
          'Most contracts are in Korean → need translation assistance',
          'Check if utilities are separate'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 Guide to Housing Contracts & Administrative Procedures for International Students',
      
      category: 'Dormitory/Housing',
      description: 'Importance of formal contracts and address registration when living off-campus',
      details: {
        contract_checklist: [
          'Existence of contract (needed for address registration)',
          'Deposit and monthly rent conditions',
          'Refund conditions at move-out',
          'Whether utilities are included'
        ],
        address_registration: [
          'Within 2 weeks of contract, register address at nearest resident center',
          'Also tied to changing address on ARC'
        ],
        safety_tips: [
          'Recommend using real estate agencies to prevent illegal brokerage scams',
          'Keep a copy of the contract',
          'Check house condition (mold, leaks, etc.) before contract'
        ]
      }
    }
  ];
  
  
  
  // Japanese version (日本語)
  export const japaneseStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 韓国大学学士課程入学ガイド',
      
      category: '学士/キャンパス',
      description: '外国人留学生向けの段階的入学手続き',
      details: {
        main_procedures: [
          '大学および専攻選び - 国立/私立大学を選び、専攻ごとの特徴を確認',
          '出願書類準備 - 高校卒業証明書（公証が必要）、成績証明書、志望理由書および学習計画書',
          '韓国語能力試験（TOPIK）または英語の成績（大学による）',
          '入学スケジュール確認 - 多くの大学は春学期（3月）、秋学期（9月）入学'
        ],
        university_examples: [
          'ソウル大学（研究重視）',
          '漢陽大学（工学特化）',
          '梨花女子大学（女子限定）'
        ],
        references: [
          'Study in Korea',
          '各大学国際部ウェブサイト'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 韓国大学キャンパスライフA to Z',
      
      category: '学士/キャンパス',
      description: '外国人学生がよく尋ねるキャンパスライフのコツ',
      details: {
        dining: [
          '学内の学生食堂利用可能（₩3,000~₩6,000）',
          '近くにコンビニやカフェ多数'
        ],
        dormitory: [
          'ほとんどの大学が留学生向けに寮を提供',
          '月額費用：約₩200,000~₩500,000',
          '申請時期に注意：入学確定後すぐに申し込まないと空きがなくなる'
        ],
        activities: [
          '外国人専用のクラブあり',
          '韓国人の友達を作る良い機会'
        ],
        facilities: [
          'キャンパス全域で無料Wi-Fi提供',
          '図書館、ジム、スタディルームが無料または低価格で利用可能'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ 外国人向け韓国語講座＆学業両立のコツ',
      
      category: '学士/キャンパス',
      description: '韓国語が不足している留学生向けサポートシステム',
      details: {
        preparatory_course: [
          '韓国大学付属語学堂で6ヶ月～1年コースを受講',
          'TOPIK3～4級以上取得後に学士課程へ進学可能'
        ],
        language_options: [
          '一部の大学（延世大学、POSTECHなど）は英語専用講義を提供',
          '人文/社会系は韓国語講義が多い → 韓国語能力必須'
        ],
        tips: [
          '韓国語アプリ（例：Papago、Naver Dictionary）を積極的に活用',
          '留学生ヘルパー制度を利用（チュータリング提供）'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 韓国大学の学業サポートサービス案内',
      
      category: '学業サポート/施設',
      description: '外国人留学生向けのさまざまな学業サポート制度',
      details: {
        tutoring: [
          '学内の専攻別チュータリング：韓国人学生が外国人学生の課題や試験準備をサポート',
          'ほとんど無料提供、学期初めに申請必須'
        ],
        language_support: [
          '韓国語チュータリング、会話クラス、語学交流プログラムを運営',
          'TOPIK対策クラスを実施（一部大学では無料）'
        ],
        counseling: [
          '定期的な学業カウンセリング可能',
          '教授との面談を通じて専攻理解度向上＋キャリアアドバイスが得られる'
        ],
        learning_center: [
          'エッセイの書き方、プレゼンテーション技法、論文執筆法などのワークショップを開催'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 留学生のための図書館利用ガイド',
      
      category: '学業サポート/施設',
      description: '留学生にとって最適な勉強スペースである図書館の活用法',
      details: {
        operating_hours: [
          '通常は09:00～22:00、試験期間中は24時間利用可能',
          '自動入退室システム：学生証が必要'
        ],
        services: [
          '個別閲覧室、グループスタディルーム',
          'プリンター/コピー機利用可能（小額支払い）',
          '専攻別資料、電子書籍、論文データベースを提供'
        ],
        digital_resources: [
          '学内Wi-Fiまたは大学VPN経由で利用可能',
          'RISS、DBpia、KISSなどの韓国論文検索サイトを利用可能'
        ],
        tips: [
          '静かにする必要があるため、音声通話や飲食は禁止',
          '試験期間は席が不足するため、事前予約を推奨'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ IT & 学習施設まとめ',
      
      category: '学業サポート/施設',
      description: '韓国大学の優れたデジタル学習環境',
      details: {
        computer_lab: [
          '学内のほとんどの建物にコンピュータ室完備',
          '無料利用、印刷機能含む',
          'MS Office、統計プログラム（R、SPSS）インストール済み'
        ],
        e_learning: [
          'ほとんどの大学が独自のオンライン学習プラットフォーム（LMS）を運営',
          '課題提出、出席確認、講義再視聴が可能',
          '例：Blackboard、eClass、iCampusなど'
        ],
        printing: [
          '図書館、学生会館、共用スペースにプリンター設置',
          '学内カードまたは学生証で決済可能'
        ],
        tech_support: [
          '学内ITサービスセンターがWi-Fi問題、アカウントエラー、機器トラブルを解決'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 韓国留学ビザ（D-2）申請ガイド',
      
      category: '行政/ビザ/書類',
      description: '韓国で正規大学課程を履修するためのD-2ビザ',
      details: {
        procedures: [
          '入学許可書の受領（大学より）',
          'ビザ申請書の記入',
          '管轄の大使館/領事館に提出'
        ],
        required_docs: [
          '入学許可書',
          'スタンダード入学許可書（Standard Admission Letter）',
          '最終学歴卒業証明書および成績証明書（公証翻訳済）',
          '財政証明書（預金10,000 USD以上推奨）',
          'パスポート原本＋コピー',
          'パスポート用写真1枚'
        ],
        notes: [
          '一部の国では健康診断書の提出が必要',
          '発給に要する期間：約2～4週間',
          '学期開始の2～3か月前に申請を推奨'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 外国人登録証（ARC）発行ガイド',
      
      category: '行政/ビザ/書類',
      description: '入国後90日以内に必須の手続き',
      details: {
        application_place: [
          '出入国・外国人庁またはオンライン申請（HiKorea）'
        ],
        required_docs: [
          'パスポート',
          'ビザ（D-2など）',
          '入学許可書または在学証明書',
          '証明写真（3.5 x 4.5cm）',
          '手数料：約₩30,000'
        ],
        processing_time: [
          '通常3～4週間かかる',
          '外国人登録証発行前の出国は控えること'
        ],
        tips: [
          '大学によっては団体申請をサポートすることがある（新入生オリエンテーションを確認）'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 学業中に必要な行政書類まとめ',
      
      category: '行政/ビザ/書類',
      description: '留学中に頻繁に必要となる書類とその取得方法',
      details: {
        common_docs: {
          在学証明書: 'ビザ延長、外国人登録 - 大学事務室／ポータル',
          成績証明書: '編入、奨学金申請 - 大学ポータル／窓口申請',
          出入国事実証明書: '銀行口座開設、各種行政手続き - 住民センターまたは政府24',
          住所変更届: '外国人登録情報変更 - 出入国・外国人庁／政府24',
          ビザ延長申請書: '長期滞在延長 - HiKoreaウェブサイト'
        },
        online_tips: [
          'ほとんどの大学でポータルサイトからPDF形式で書類が発行可能',
          '政府24、民願24を利用して公的機関の書類も申請可能（認証が必要）'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 韓国大学寮完璧ガイド',
      
      category: '寮/住居',
      description: '初めて韓国に来る留学生にとって最も安全で便利な選択肢',
      details: {
        features: [
          '2人部屋または3人部屋が中心／一部の大学では1人部屋も提供',
          '基本設備：ベッド、机、クローゼット、エアコン、Wi-Fi',
          '共用施設：ランドリー室、シャワールーム、食堂、コンビニなど'
        ],
        cost: [
          '月₩200,000～₩500,000程度（大学および部屋の種類により異なる）',
          '保証金なし、管理費込み'
        ],
        application: [
          '入学確定後、国際部ウェブサイトまたはポータルからオンライン申請',
          '早期締切に注意！ → 申請時期を必ず確認'
        ],
        living_tips: [
          '男女別棟が多い',
          '外部食品持ち込み制限、門限がある大学もある',
          '共用スペースではマナーを守る（清掃、騒音に注意）'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 留学生向け外部居住形態比較',
      
      category: '寮/住居',
      description: '予算とライフスタイルに応じたさまざまな居住オプション',
      details: {
        housing_types: {
          ワンルーム: '独立した空間（バスルーム/キッチン付き）- ₩500,000～₩800,000 - プライバシー確保 vs 保証金高額',
          コシウォン: '狭い個室＋共用スペース - ₩300,000～₩500,000 - 低価格、契約簡単 vs 狭く、防音性が低い',
          ホームステイ: '家主と同居＋食事提供 - ₩400,000～₩600,000 - 文化交流が可能 vs 自由度低い',
          シェアハウス: '複数人と共同生活 - ₩400,000～₩600,000 - 友達ができやすい vs トラブル発生の可能性あり'
        },
        precautions: [
          '保証金（通常₩5,000,000以上）が求められることがある → 契約書を必ず確認！',
          '契約書はほとんど韓国語 → 翻訳サポートが必要',
          '公共料金が別払いかどうかを確認'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 留学生のための住宅契約＆行政手続きガイド',
      
      category: '寮/住居',
      description: '外部居住時の正式な契約および住所登録の重要性',
      details: {
        contract_checklist: [
          '契約書の有無（転入届提出に必要）',
          '保証金および月々の家賃条件',
          '退去時の返金条件',
          '管理費含むかどうか'
        ],
        address_registration: [
          '契約後2週間以内に近くの住民センターで転入届を提出',
          '外国人登録証の住所変更とも連動'
        ],
        safety_tips: [
          '不動産仲介所の利用を推奨（違法仲介による被害を防止）',
          '契約書のコピーは必ず保管',
          '契約前に建物の状態（カビ、漏水など）を確認'
        ]
      }
    }
  ];
  
  
  
  // Chinese version (简体中文)
  export const chineseStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 韩国大学学士课程入学指南',
      
      category: '学士/校园',
      description: '面向外国留学生的分阶段入学流程',
      details: {
        main_procedures: [
          '选择大学和专业 - 选择国立/私立大学，并了解各专业特点',
          '准备申请材料 - 高中毕业证明（需公证）、成绩单、个人陈述和学习计划',
          '韩国语能力测试（TOPIK）或英语成绩（视大学而定）',
          '确认入学时间表 - 大多数大学春季学期（3月）、秋季学期（9月）入学'
        ],
        university_examples: [
          '首尔大学（研究型）',
          '汉阳大学（工科特色）',
          '梨花女子大学（女性专用）'
        ],
        references: [
          'Study in Korea',
          '各大学国际处官网'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 韩国大学校园生活 A to Z',
      
      category: '学士/校园',
      description: '外国学生常问的校园生活小贴士',
      details: {
        dining: [
          '可使用校内学生食堂（₩3,000~₩6,000）',
          '附近有许多便利店和咖啡厅'
        ],
        dormitory: [
          '大多数大学为留学生提供宿舍',
          '月费用：约₩200,000~₩500,000',
          '申请时机要注意：入学确认后需尽快申请以确保名额'
        ],
        activities: [
          '有专门为外国学生设立的社团',
          '与韩国人交朋友的好机会'
        ],
        facilities: [
          '校园全范围免费提供 Wi-Fi',
          '图书馆、健身房、自习室免费或低价使用'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ 面向外国人的韩语课程 & 学业并行技巧',
      
      category: '学士/校园',
      description: '为韩语能力不足的留学生提供的支持系统',
      details: {
        preparatory_course: [
          '在韩国大学附属语言学院学习6个月~1年',
          '通过TOPIK3~4级后可申请学士课程'
        ],
        language_options: [
          '部分大学（延世大学、POSTECH等）提供英文授课',
          '人文/社会学科以韩语授课为主 → 韩语能力必备'
        ],
        tips: [
          '积极使用韩语应用（例如：Papago、Naver Dictionary）',
          '利用留学生助理制度（提供辅导）'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 韩国大学学业支持服务指南',
      
      category: '学业支持/设施',
      description: '为外国留学生提供的多种学业支持制度',
      details: {
        tutoring: [
          '校内专业辅导：韩国学生帮助外国学生完成作业、备考等',
          '大多数免费提供，学期初需要申请'
        ],
        language_support: [
          '提供韩语辅导、会话课、语言交换项目',
          '开设TOPIK备考班（部分学校免费）'
        ],
        counseling: [
          '可定期进行学业咨询',
          '与教授会面以提高专业理解度 + 提供职业规划建议'
        ],
        learning_center: [
          '举办论文写作、演讲技巧、学术论文撰写等工作坊'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 外国留学生图书馆使用指南',
      
      category: '学业支持/设施',
      description: '图书馆是留学生最好的学习空间，教你如何利用',
      details: {
        operating_hours: [
          '通常为09:00~22:00，考试期间可24小时开放',
          '自动出入系统：需要学生证'
        ],
        services: [
          '个人阅览室、团体自习室',
          '可使用打印机/复印机（需少量付款）',
          '提供按专业分类的资料、电子书、期刊数据库'
        ],
        digital_resources: [
          '通过校内Wi-Fi或学校VPN访问',
          '可使用RISS、DBpia、KISS等韩国学术论文检索网站'
        ],
        tips: [
          '需保持安静，禁止通话和饮食',
          '考试期间座位紧张，请提前预约'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ IT & 学习设施全览',
      
      category: '学业支持/设施',
      description: '韩国大学优秀的数字化学习环境',
      details: {
        computer_lab: [
          '校内大多数教学楼都配备计算机实验室',
          '免费使用，包含打印功能',
          '内置MS Office、统计软件（R、SPSS）'
        ],
        e_learning: [
          '大多数大学运营自主在线学习平台（LMS）',
          '支持作业提交、考勤检查、录像回放',
          '示例：Blackboard、eClass、iCampus等'
        ],
        printing: [
          '图书馆、学生活动中心、公共区域都设有打印机',
          '可使用校园卡或学生证支付'
        ],
        tech_support: [
          '校内IT服务中心可解决Wi-Fi故障、账号错误、设备问题'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 韩国留学签证（D-2）申请指南',
      
      category: '行政/签证/文件',
      description: '在韩国攻读正规大学课程的D-2签证',
      details: {
        procedures: [
          '收到入学许可函（来自大学）',
          '填写签证申请表',
          '提交至管辖的大韩民国大使馆/领事馆'
        ],
        required_docs: [
          '入学许可函',
          '标准入学许可函（Standard Admission Letter）',
          '最高学历毕业证书及成绩单（公证翻译版）',
          '财力证明（建议存款10,000 USD以上）',
          '护照原件+复印件',
          '护照规格照片1张'
        ],
        notes: [
          '部分国家需提交体检证明',
          '签证审核时间：约2~4周',
          '建议在学期开始前2~3个月申请'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 外国人登记证（ARC）办理指南',
      
      category: '行政/签证/文件',
      description: '入境后90天内必办手续',
      details: {
        application_place: [
          '出入境·外国人厅或线上申请（HiKorea）'
        ],
        required_docs: [
          '护照',
          '签证（如D-2）',
          '入学许可函或在学证明',
          '护照照片（3.5 x 4.5cm）',
          '手续费：约₩30,000'
        ],
        processing_time: [
          '通常需要3~4周',
          '在外国人登记证发放前，避免出境'
        ],
        tips: [
          '部分学校可协助集体办理（参照新生迎新）'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 学习期间需要的行政文件一览',
      
      category: '行政/签证/文件',
      description: '留学期间经常需要的文件及获取方式',
      details: {
        common_docs: {
          在学证明: '签证续签、外国人登记 - 学校行政办公室/门户',
          成绩单: '转学、奖学金申请 - 学校门户/现场申请',
          出入境记录证明: '开户、各类行政事务 - 居民中心或政府24',
          地址变更申报: '修改外国人登记信息 - 出入境厅/政府24',
          签证延期申请书: '延长长期居留 - HiKorea网站'
        },
        online_tips: [
          '大多数大学可以通过门户网站以PDF格式开具文件',
          '可通过政府24、民愿24申请公共机构文件（需共享认证）'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 韩国大学宿舍完全指南',
      
      category: '宿舍/住宿',
      description: '对初次来韩留学生来说最安全、最便捷的选择',
      details: {
        features: [
          '以双人间或三人间为主／部分学校提供单人间',
          '配备：床、书桌、衣柜、空调、Wi-Fi',
          '公共设施：洗衣房、淋浴间、餐厅、便利店等'
        ],
        cost: [
          '每月约₩200,000 ~ ₩500,000（视学校和房型而定）',
          '无押金，包含管理费'
        ],
        application: [
          '入学确认后，通过国际处官网或门户在线申请',
          '注意提前截止时间！ → 必须确认申请时间'
        ],
        living_tips: [
          '大多数为男女分区',
          '部分学校限制外卖、设有宵禁',
          '公共空间礼仪很重要（保持清洁、注意噪音）'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 留学生外部居住类型比较',
      
      category: '宿舍/住宿',
      description: '根据预算和生活方式提供多种居住选项',
      details: {
        housing_types: [
          '寄宿: 与房东同住+提供餐食 - ₩400,000~₩600,000 - 可进行文化交流 vs 自由度低',
          'Sharehouse: 多人共同生活 - ₩400,000~₩600,000 - 容易交朋友 vs 可能产生冲突'
        ],
        precautions: [
          '可能要求押金（通常₩5,000,000以上）→ 必须仔细检查合同！',
          '大多数合同为韩文 → 需要翻译帮助',
          '确认水电费是否另算'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 留学生房屋合同及行政手续指南',
      
      category: '宿舍/住宿',
      description: '校外居住时正式合同及地址登记的重要性',
      details: {
        contract_checklist: [
          '合同是否存在（用于地址登记）',
          '押金及月租条款',
          '退房时退款条件',
          '是否包含管理费'
        ],
        address_registration: [
          '合同后2周内，在最近的居民中心进行迁入登记',
          '与外国人登记证地址变更相关联'
        ],
        safety_tips: [
          '建议使用正规房产中介（防范非法中介欺诈）',
          '务必保留合同副本',
          '签约前务必检查房屋状况（发霉、渗漏等）'
        ]
      }
    }
  ];
  
  
  
  // French version (Français)
  export const frenchStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 Guide d’admission au cycle de licence dans les universités coréennes',
      
      category: 'Licence/Campus',
      description: 'Procédures d’admission étape par étape pour les étudiants internationaux',
      details: {
        main_procedures: [
          'Choix de l’université et du programme – sélectionner une université nationale ou privée et vérifier les particularités du programme',
          'Préparation des documents de candidature – diplôme de fin d’études secondaires (nécessite une traduction assermentée), relevé de notes, lettre de motivation et plan d’études',
          'Test de compétence en coréen (TOPIK) ou score en anglais (variable selon l’université)',
          'Vérification du calendrier d’admission – la plupart des universités recrutent au semestre de printemps (mars) et au semestre d’automne (septembre)'
        ],
        university_examples: [
          'Université nationale de Séoul (axée sur la recherche)',
          'Université Hanyang (spécialisée en ingénierie)',
          'Université féminine d’Ewha (réservée aux femmes)'
        ],
        references: [
          'Study in Korea',
          'Sites Web des bureaux internationaux de chaque université'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 Vie sur le campus des universités coréennes A à Z',
      
      category: 'Licence/Campus',
      description: 'Conseils sur la vie sur le campus fréquemment demandés par les étudiants internationaux',
      details: {
        dining: [
          'Utilisez les cafétérias étudiantes sur le campus (₩3,000~₩6,000)',
          'Nombreux dépanneurs et cafés à proximité'
        ],
        dormitory: [
          'La plupart des universités proposent des dortoirs pour les étudiants étrangers',
          'Coût mensuel : environ ₩200,000~₩500,000',
          'Attention aux dates de candidature : postuler immédiatement après la confirmation d’admission pour garantir une place'
        ],
        activities: [
          'Existence de clubs exclusivement réservés aux étudiants étrangers',
          'Excellente opportunité de se faire des amis coréens'
        ],
        facilities: [
          'Wi-Fi gratuit disponible sur l’ensemble du campus',
          'Bibliothèque, salle de sport, salles d’étude disponibles gratuitement ou à faible coût'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ Cours de coréen pour étrangers & conseils pour concilier études universitaires',
      
      category: 'Licence/Campus',
      description: 'Systèmes de soutien pour les étudiants internationaux manquant de compétences en coréen',
      details: {
        preparatory_course: [
          'Suivre un cours de 6 mois à 1 an dans une académie de langue affiliée à une université',
          'Possible d’intégrer un programme de licence après avoir obtenu TOPIK niveau 3~4'
        ],
        language_options: [
          'Certaines universités (Yonsei, POSTECH, etc.) proposent des cours exclusivement en anglais',
          'Les sciences humaines et sociales comptent davantage de cours en coréen → la maîtrise du coréen est essentielle'
        ],
        tips: [
          'Utiliser activement les applications coréennes (par ex. Papago, Naver Dictionary)',
          'Profiter du système de tuteurs pour étudiants étrangers (tutorat fourni)'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 Services de soutien académique dans les universités coréennes',
      
      category: 'Soutien académique/Installations',
      description: 'Divers systèmes de soutien académique pour les étudiants étrangers',
      details: {
        tutoring: [
          'Tutorat spécialisé sur campus : des étudiants coréens aident les étudiants étrangers pour les devoirs, la préparation aux examens, etc.',
          'La plupart des services sont gratuits, inscription obligatoire en début de semestre'
        ],
        language_support: [
          'Cours de coréen, cours de conversation, programmes d’échange linguistique disponibles',
          'Cours de préparation au TOPIK proposés (certains établissements gratuits)'
        ],
        counseling: [
          'Conseils académiques réguliers disponibles',
          'Rencontres avec les professeurs pour améliorer la compréhension du programme + conseils de carrière'
        ],
        learning_center: [
          'Ateliers sur la rédaction d’essais, les techniques de présentation, la rédaction de mémoires, etc.'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 Guide d’utilisation de la bibliothèque pour les étudiants étrangers',
      
      category: 'Soutien académique/Installations',
      description: 'Comment utiliser la bibliothèque, le meilleur espace de travail pour les étudiants étrangers',
      details: {
        operating_hours: [
          'En général de 09:00 à 22:00, ouvert 24 h/24 pendant les périodes d’examen',
          'Système d’accès automatique : carte étudiante requise'
        ],
        services: [
          'Salles de lecture individuelles, salles d’étude de groupe',
          'Imprimante/copieur disponibles (paiement à la pièce)',
          'Ressources spécialisées par domaine, livres électroniques, bases de données de revues offertes'
        ],
        digital_resources: [
          'Accessible via le Wi-Fi du campus ou le VPN de l’université',
          'Accès possible à RISS, DBpia, KISS et autres sites coréens de recherche académique'
        ],
        tips: [
          'Il faut rester silencieux, les appels vocaux et la nourriture sont interdits',
          'Les places sont limitées pendant les examens, réservez à l’avance'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ Vue d’ensemble des installations informatiques et académiques',
      
      category: 'Soutien académique/Installations',
      description: 'Excellente infrastructure d’apprentissage numérique dans les universités coréennes',
      details: {
        computer_lab: [
          'La plupart des bâtiments du campus disposent de salles informatiques',
          'Utilisation gratuite, fonctions d’impression incluses',
          'MS Office, programmes statistiques (R, SPSS) installés'
        ],
        e_learning: [
          'La plupart des universités exploitent leur propre plateforme d’apprentissage en ligne (LMS)',
          'Permet de soumettre des devoirs, vérifier la présence, revoir les cours',
          'Exemples : Blackboard, eClass, iCampus, etc.'
        ],
        printing: [
          'Imprimantes installées dans la bibliothèque, le bâtiment des étudiants et les espaces communs',
          'Paiement possible avec la carte du campus ou la carte étudiante'
        ],
        tech_support: [
          'Le centre de services informatiques du campus résout les problèmes de Wi-Fi, les erreurs de compte et les pannes d’équipement'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 Guide de demande de visa étudiant coréen (D-2)',
      
      category: 'Administration/Visa/Documents',
      description: 'Visa D-2 pour suivre un programme universitaire complet en Corée',
      details: {
        procedures: [
          'Recevoir la lettre d’admission (de l’université)',
          'Remplir le formulaire de demande de visa',
          'Soumettre au consulat/ambassade coréenne compétente'
        ],
        required_docs: [
          'Lettre d’admission',
          'Lettre d’admission standard (Standard Admission Letter)',
          'Diplôme de fin d’études secondaires et relevé de notes (traductions assermentées)',
          'Preuve financière (dépôt recommandé de 10 000 USD ou plus)',
          'Passeport original + copie',
          'Une photo d’identité'
        ],
        notes: [
          'Certains pays exigent un certificat médical',
          'Délai de traitement : environ 2 à 4 semaines',
          'Il est recommandé de postuler 2 à 3 mois avant le début du semestre'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 Guide d’émission de la carte de séjour pour étrangers (ARC)',
      
      category: 'Administration/Visa/Documents',
      description: 'Procédure obligatoire dans les 90 jours suivant l’entrée',
      details: {
        application_place: [
          'Bureau de l’immigration ou demande en ligne (HiKorea)'
        ],
        required_docs: [
          'Passeport',
          'Visa (ex : D-2)',
          'Lettre d’admission ou certificat de scolarité',
          'Photo d’identité (3,5 x 4,5 cm)',
          'Frais : environ ₩30,000'
        ],
        processing_time: [
          'Généralement 3 à 4 semaines',
          'Éviter de quitter la Corée avant réception de la carte ARC'
        ],
        tips: [
          'Certaines universités proposent une aide pour les demandes groupées (voir orientation des nouveaux étudiants)'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 Tous les documents administratifs nécessaires pendant les études',
      
      category: 'Administration/Visa/Documents',
      description: 'Documents fréquemment requis pendant la vie étudiante et comment les obtenir',
      details: {
        common_docs: {
          Certificate_of_Enrollment: 'Pour la prolongation de visa, enregistrement étranger – bureau administratif de l’université / portail',
          Transcript: 'Pour les transferts, candidatures aux bourses – portail universitaire / demande en personne',
          Entry_Exit_Certificate: 'Ouverture de compte bancaire, diverses démarches administratives – centre résidentiel ou Government24',
          Address_Change_Notification: 'Modification des informations d’enregistrement étranger – Bureau de l’immigration / Government24',
          Visa_Extension_Application: 'Extension de séjour de longue durée – site HiKorea'
        },
        online_tips: [
          'La plupart des universités permettent l’émission de documents en PDF via le portail',
          'Utiliser Government24, Minwon24 pour demander des documents publics (identification requise)'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 Guide complet des dortoirs universitaires en Corée',
      
      category: 'Dortoir/Logement',
      description: 'Choix le plus sûr et le plus pratique pour les étudiants internationaux arrivant en Corée pour la première fois',
      details: {
        features: [
          'Principalement des chambres doubles ou triples / certaines universités offrent des chambres individuelles',
          'Équipements inclus : lit, bureau, armoire, climatisation, Wi-Fi',
          'Installations communes : buanderie, douches, cafétéria, supérette, etc.'
        ],
        cost: [
          'Environ ₩200,000 ~ ₩500,000 par mois (varie selon l’université et le type de chambre)',
          'Pas de dépôt, charges comprises'
        ],
        application: [
          'Après confirmation d’admission, postuler en ligne via le site du bureau international ou le portail',
          'Attention aux dates de clôture anticipée ! → Vérifier impérativement la période de candidature'
        ],
        living_tips: [
          'Majoritairement séparé hommes/femmes',
          'Certaines universités restreignent les aliments extérieurs ou imposent un couvre-feu',
          'Le respect des règles dans les espaces communs est crucial (propreté, respect du calme)'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 Comparatif des options de logement externe pour étudiants internationaux',
      
      category: 'Dortoir/Logement',
      description: 'Diverses options de logement selon le budget et le style de vie',
      details: {
        housing_types: {
          Studio: 'Espace indépendant (avec salle de bain/cuisine) - ₩500,000~₩800,000 - intimité vs dépôt élevé',
          Goshitel: 'Petite chambre individuelle + espaces communs - ₩300,000~₩500,000 - peu coûteux, contrat simple vs exigu et mauvaise isolation phonique',
          Homestay: 'Vivre avec une famille d’accueil + repas fournis - ₩400,000~₩600,000 - échange culturel possible vs liberté limitée',
          Sharehouse: 'Vie en colocation - ₩400,000~₩600,000 - facile de se faire des amis vs conflits possibles'
        },
        precautions: [
          'Le dépôt peut être élevé (habituellement ₩5,000,000 ou plus) → Vérifier soigneusement le contrat !',
          'La plupart des contrats sont en coréen → assistance en traduction nécessaire',
          'Vérifier si les charges sont séparées'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 Guide des contrats de logement & procédures administratives pour étudiants internationaux',
      
      category: 'Dortoir/Logement',
      description: 'Importance des contrats officiels et de l’enregistrement d’adresse en résidence externe',
      details: {
        contract_checklist: [
          'Existence d’un contrat (nécessaire pour l’enregistrement d’adresse)',
          'Conditions de dépôt et de loyer mensuel',
          'Conditions de remboursement au départ',
          'Charges incluses ou non'
        ],
        address_registration: [
          'Dans les 2 semaines suivant le contrat, effectuer la déclaration de résidence au centre résidentiel le plus proche',
          'Lié aussi à la modification d’adresse sur la carte ARC'
        ],
        safety_tips: [
          'Recommander l’utilisation d’agences immobilières pour éviter les fraudes illégales',
          'Conserver une copie du contrat',
          'Vérifier l’état du logement (moisissure, fuites, etc.) avant de signer'
        ]
      }
    }
  ];
  
  
  
  // German version (Deutsch)
  export const germanStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 Leitfaden zur Zulassung zum Bachelorstudium an koreanischen Universitäten',
      
      category: 'Bachelor/Campus',
      description: 'Schrittweise Zulassungsverfahren für internationale Studierende',
      details: {
        main_procedures: [
          'Auswahl von Universität und Studienfach – nationale oder private Universität wählen und Besonderheiten des Studienfachs prüfen',
          'Vorbereitung der Bewerbungsunterlagen – Abiturzeugnis (notariell beglaubigt erforderlich), Zeugnisse, Motivationsschreiben und Studienplan',
          'Test der Koreanischkenntnisse (TOPIK) oder Englisch-Score (je nach Universität)',
          'Überprüfung des Zulassungszeitplans – die meisten Universitäten nehmen im Frühjahrssemester (März) und Herbstsemester (September) auf'
        ],
        university_examples: [
          'Seoul National University (forschungsorientiert)',
          'Hanyang University (Ingenieurwissenschaften spezialisiert)',
          'Ewha Womans University (nur für Frauen)'
        ],
        references: [
          'Study in Korea',
          'Websites der International Offices jeder Universität'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 Campusleben an koreanischen Universitäten A bis Z',
      
      category: 'Bachelor/Campus',
      description: 'Tipps zum Campusleben, die internationale Studierende häufig fragen',
      details: {
        dining: [
          'Nutzung der Mensa auf dem Campus möglich (₩3,000~₩6,000)',
          'Viele Convenience Stores und Cafés in der Nähe'
        ],
        dormitory: [
          'Die meisten Universitäten bieten Wohnheime für internationale Studierende an',
          'Monatliche Kosten: ca. ₩200,000~₩500,000',
          'Auf Bewerbungsfristen achten: direkt nach der Zulassung bewerben, um einen Platz zu sichern'
        ],
        activities: [
          'Es gibt Clubs nur für internationale Studierende',
          'Gute Gelegenheit, koreanische Freundschaften zu schließen'
        ],
        facilities: [
          'Kostenloses WLAN auf dem gesamten Campus',
          'Bibliothek, Fitnessstudio, Lernräume kostenlos oder zu geringen Kosten nutzbar'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ Koreanischkurse für Ausländer & Tipps zur Vereinbarkeit mit dem Studium',
      
      category: 'Bachelor/Campus',
      description: 'Unterstützungssysteme für Studierende mit geringen Koreanischkenntnissen',
      details: {
        preparatory_course: [
          '6-monatiger bis 1-jähriger Kurs an universitätseigenen Sprachinstituten belegen',
          'Nach TOPIK-Level 3~4 ist die Zulassung zum Bachelorstudium möglich'
        ],
        language_options: [
          'Einige Universitäten (Yonsei, POSTECH etc.) bieten englischsprachige Lehrveranstaltungen an',
          'Geistes- und Sozialwissenschaften haben mehr koreanischsprachige Kurse → Koreanischkenntnisse erforderlich'
        ],
        tips: [
          'Aktive Nutzung koreanischer Apps (z. B. Papago, Naver Dictionary)',
          'Nutzung des Tutoren-Systems für internationale Studierende (Nachhilfe möglich)'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 Akademische Unterstützungsdienste an koreanischen Universitäten',
      
      category: 'Akademische Unterstützung/Einrichtungen',
      description: 'Verschiedene akademische Unterstützungsangebote für internationale Studierende',
      details: {
        tutoring: [
          'Fachbezogenes Tutoring auf dem Campus: Koreanische Studierende helfen internationalen Studierenden bei Hausaufgaben, Prüfungsvorbereitung usw.',
          'Meist kostenfrei, Anmeldung zu Semesterbeginn erforderlich'
        ],
        language_support: [
          'Angebot von Koreanisch-Tutoring, Konversationskursen, Sprachförderprogrammen',
          'TOPIK-Vorbereitungskurse werden angeboten (an manchen Universitäten kostenlos)'
        ],
        counseling: [
          'Regelmäßige akademische Beratung möglich',
          'Treffen mit Professoren zur Verbesserung des Fachverständnisses + Karriereberatung'
        ],
        learning_center: [
          'Workshops zu Essay-Schreiben, Präsentationstechniken, wissenschaftlichem Arbeiten usw. werden durchgeführt'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 Bibliotheksnutzungsguide für internationale Studierende',
      
      category: 'Akademische Unterstützung/Einrichtungen',
      description: 'Wie man die Bibliothek nutzt – der beste Lernort für internationale Studierende',
      details: {
        operating_hours: [
          'Meistens 09:00~22:00, während der Prüfungszeiten oft 24 Stunden geöffnet',
          'Automatisches Zutrittssystem: Studierendenausweis erforderlich'
        ],
        services: [
          'Einzelarbeitsplätze, Gruppenarbeitsräume',
          'Drucker/Kopierer verfügbar (kleine Gebühr)',
          'Bereitstellung fachspezifischer Materialien, E-Books, akademischer Datenbanken'
        ],
        digital_resources: [
          'Zugänglich über Campus-WLAN oder Universitäts-VPN',
          'Zugriff auf koreanische Forschungsportale wie RISS, DBpia, KISS'
        ],
        tips: [
          'Stille einhalten, Telefonate und Essen sind verboten',
          'Während der Prüfungszeiten sind Sitzplätze knapp, daher frühzeitig reservieren'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ Übersicht über IT- & Lern-Einrichtungen',
      
      category: 'Akademische Unterstützung/Einrichtungen',
      description: 'Ausgezeichnete digitale Lernumgebung an koreanischen Universitäten',
      details: {
        computer_lab: [
          'Die meisten Gebäude auf dem Campus verfügen über Computerlabore',
          'Kostenlose Nutzung, Druckfunktion inklusive',
          'MS Office und Statistik-Programme (R, SPSS) sind installiert'
        ],
        e_learning: [
          'Die meisten Universitäten betreiben eigene Lernplattformen (LMS)',
          'Unterstützt Einreichen von Aufgaben, Anwesenheitskontrolle, Vorlesungs-Wiedergabe',
          'Beispiele: Blackboard, eClass, iCampus usw.'
        ],
        printing: [
          'Drucker befinden sich in Bibliothek, Studentenhaus und anderen öffentlichen Bereichen',
          'Bezahlung mit Campuskarte oder Studierendenausweis möglich'
        ],
        tech_support: [
          'IT-Service-Center auf dem Campus behebt WLAN-Probleme, Konto-Fehler, Geräteprobleme'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 Leitfaden zur Beantragung eines koreanischen Studentenvisums (D-2)',
      
      category: 'Verwaltung/Visum/Dokumente',
      description: 'D-2-Visum für ein reguläres Hochschulstudium in Korea',
      details: {
        procedures: [
          'Admit Letter (Zulassungsschreiben) von der Universität erhalten',
          'Ausfüllen des Visumantragsformulars',
          'Einreichen bei der zuständigen südkoreanischen Botschaft bzw. dem Konsulat'
        ],
        required_docs: [
          'Zulassungsschreiben',
          'Standard Admission Letter',
          'Notarielle beglaubigte Übersetzung von Abschlusszeugnis und Transcript',
          'Finanznachweis (Empfehlung: Mindesteinlage 10,000 USD)',
          'Reisepass (Original + Kopie)',
          'Ein Passfoto'
        ],
        notes: [
          'In einigen Ländern ist ein Gesundheitszeugnis erforderlich',
          'Bearbeitungszeit: ca. 2–4 Wochen',
          'Bewerben Sie sich 2–3 Monate vor Semesterbeginn'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 Anleitung zur Ausstellung der Ausländerausweis (ARC)',
      
      category: 'Verwaltung/Visum/Dokumente',
      description: 'Erforderliche Prozedur innerhalb von 90 Tagen nach Einreise',
      details: {
        application_place: [
          'Einwanderungsbehörde oder Online-Antrag (HiKorea)'
        ],
        required_docs: [
          'Reisepass',
          'Visum (z. B. D-2)',
          'Zulassungsschreiben oder Immatrikulationsbescheinigung',
          'Passfoto (3,5 x 4,5 cm)',
          'Gebühr: ca. ₩30,000'
        ],
        processing_time: [
          'In der Regel 3–4 Wochen',
          'Reisen Sie nicht aus Korea, bevor Ihr ARC ausgestellt ist'
        ],
        tips: [
          'Einige Universitäten unterstützen Sammelanträge (siehe Einführungsveranstaltung für Erstsemester)'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 Alle während des Studiums benötigten administrativen Unterlagen',
      
      category: 'Verwaltung/Visum/Dokumente',
      description: 'Häufig benötigte Unterlagen während des Studiums und deren Beschaffung',
      details: {
        common_docs: [
          'Adressänderung: Änderung der Ausländerregistrierungsdaten – Einwanderungsbehörde / Government24',
          'Visumsverlängerungsantrag: Verlängerung des Langzeitaufenthalts – HiKorea-Website'
        ],
        online_tips: [
          'Die meisten Hochschulen ermöglichen das Herunterladen von Dokumenten im PDF-Format über das Portal',
          'Verwenden Sie Government24, Minwon24, um öffentliche Unterlagen zu beantragen (Authentifizierung erforderlich)'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 Umfassender Leitfaden für Universitätswohnheime in Korea',
      
      category: 'Wohnheim/Wohnen',
      description: 'Die sicherste und bequemste Option für internationale Studierende, die erstmals nach Korea kommen',
      details: {
        features: [
          'Hauptsächlich Doppel- oder Dreibettzimmer / einige Universitäten bieten Einzelzimmer',
          'Bereitgestellt: Bett, Schreibtisch, Kleiderschrank, Klimaanlage, WLAN',
          'Gemeinschaftseinrichtungen: Waschraum, Duschräume, Cafeteria, Convenience Store usw.'
        ],
        cost: [
          'Etwa ₩200,000 – ₩500,000 pro Monat (je nach Universität und Zimmertyp)',
          'Keine Kaution, Nebenkosten inklusive'
        ],
        application: [
          'Nach Zulassungsbestätigung online über die Website des International Office oder Portal bewerben',
          'Achten Sie auf frühzeitige Fristabläufe ! → Bewerbungszeitraum unbedingt prüfen'
        ],
        living_tips: [
          'Meist geschlechtergetrennt',
          'An einigen Universitäten sind externe Speisen eingeschränkt, und es gibt Ausgangssperren',
          'Höflichkeit in Gemeinschaftsbereichen ist wichtig (Sauberkeit wahren, Geräuschpegel beachten)'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 Vergleich externer Wohnoptionen für internationale Studierende',
      
      category: 'Wohnheim/Wohnen',
      description: 'Verschiedene Wohnmöglichkeiten je nach Budget und Lebensstil',
      details: {
        housing_types: {
          Studio: 'Eigenständiger Raum (mit Bad/Küche) - ₩500,000 – ₩800,000 - Privatsphäre vs hohe Kaution',
          Gosiwon: 'Kleines Einzelzimmer + Gemeinschaftsbereich - ₩300,000 – ₩500,000 - günstig, einfacher Vertrag vs beengt und schlechte Schalldämmung',
          Homestay: 'Wohnen bei Gastfamilie + Verpflegung - ₩400,000 – ₩600,000 - kultureller Austausch möglich vs weniger Freiheit',
          Sharehouse: 'Wohnen mit mehreren Personen - ₩400,000 – ₩600,000 - leicht Freunde finden vs potenzielle Konflikte'
        },
        precautions: [
          'Kaution kann hoch sein (normalerweise ₩5,000,000 oder mehr) → Vertrag sorgfältig prüfen!',
          'Die meisten Verträge sind auf Koreanisch → Übersetzungshilfe erforderlich',
          'Überprüfen, ob Nebenkosten separat sind'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 Leitfaden zu Mietverträgen & Verwaltungsverfahren für internationale Studierende',
      category: 'Wohnheim/Wohnen',
      description: 'Bedeutung formeller Verträge und der Adressregistrierung bei Wohnen außerhalb des Campus',
      details: {
        contract_checklist: [
          'Vorhandensein eines Vertrags (für Adressregistrierung erforderlich)',
          'Kautions- und Monatsmietbedingungen',
          'Rückerstattungsbedingungen beim Auszug',
          'Ob Nebenkosten enthalten sind'
        ],
        address_registration: [
          'Innerhalb von 2 Wochen nach Vertragsabschluss die Adresse beim nächstgelegenen Bewohnerbüro registrieren',
          'Auch verbunden mit der Adressänderung auf der ARC'
        ],
        safety_tips: [
          'Empfehlung, Immobilienmakler zu nutzen, um Betrug durch illegale Makler zu vermeiden',
          'Kopie des Vertrags aufbewahren',
          'Vor der Unterzeichnung Zustand der Wohnung (Schimmel, Lecks usw.) überprüfen'
        ]
      }
    }
  ];
  
  
  
  // Spanish version (Español)
  export const spanishStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 Guía de admisión a programas de pregrado en universidades coreanas',
      
      category: 'Grado/Campus',
      description: 'Procedimientos de admisión paso a paso para estudiantes internacionales',
      details: {
        main_procedures: [
          'Selección de universidad y carrera – elegir universidad pública o privada y verificar características según la carrera',
          'Preparar documentos de solicitud – certificado de graduación de secundaria (requerida notarización), expediente académico, carta de presentación y plan de estudios',
          'Examen de competencia en coreano (TOPIK) o puntaje de inglés (depende de la universidad)',
          'Consultar el calendario de admisión – la mayoría de universidades admiten en semestre de primavera (marzo) y otoño (septiembre)'
        ],
        university_examples: [
          'Universidad Nacional de Seúl (enfoque en investigación)',
          'Universidad Hanyang (especializada en ingeniería)',
          'Universidad de Mujeres Ewha (solo para mujeres)'
        ],
        references: [
          'Study in Korea',
          'Sitios web de las oficinas internacionales de cada universidad'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 Vida en el campus en universidades coreanas A a Z',
      
      category: 'Grado/Campus',
      description: 'Consejos sobre la vida en el campus que suelen preguntar los estudiantes internacionales',
      details: {
        dining: [
          'Usa las cafeterías estudiantiles en el campus (₩3,000~₩6,000)',
          'Muchos minimercados y cafeterías cercanas'
        ],
        dormitory: [
          'La mayoría de las universidades ofrecen dormitorios para estudiantes extranjeros',
          'Costo mensual: alrededor de ₩200,000~₩500,000',
          'Atención al momento de la solicitud: debes postular inmediatamente tras la confirmación de admisión para asegurar un lugar'
        ],
        activities: [
          'Existen clubes exclusivamente para estudiantes extranjeros',
          'Gran oportunidad para hacer amigos coreanos'
        ],
        facilities: [
          'Wi-Fi gratis disponible en todo el campus',
          'Biblioteca, gimnasio, salas de estudio disponibles gratis o a bajo costo'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ Cursos de coreano para extranjeros y consejos para compaginar con los estudios',
      
      category: 'Grado/Campus',
      description: 'Sistemas de apoyo para estudiantes extranjeros con habilidades limitadas en coreano',
      details: {
        preparatory_course: [
          'Tomar un curso de 6 meses a 1 año en academias de idiomas afiliadas a la universidad',
          'Elegible para estudios de grado tras obtener TOPIK nivel 3~4'
        ],
        language_options: [
          'Algunas universidades (Yonsei, POSTECH, etc.) ofrecen clases exclusivamente en inglés',
          'En ciencias sociales y humanidades hay más clases en coreano → dominio del coreano es esencial'
        ],
        tips: [
          'Usa activamente aplicaciones de coreano (p. ej. Papago, Naver Dictionary)',
          'Aprovecha el sistema de tutores para estudiantes internacionales (tutoría disponible)'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 Servicios de apoyo académico en universidades coreanas',
      
      category: 'Apoyo Académico/Instalaciones',
      description: 'Diversos sistemas de apoyo académico para estudiantes extranjeros',
      details: {
        tutoring: [
          'Tutoría en el campus por especialidad: estudiantes coreanos ayudan a estudiantes extranjeros con tareas y preparación de exámenes',
          'Mayormente gratuito, inscripción a inicio de semestre obligatoria'
        ],
        language_support: [
          'Disponibles tutoría de coreano, clases de conversación, programas de intercambio lingüístico',
          'Cursos de preparación TOPIK (en algunas universidades gratis)'
        ],
        counseling: [
          'Consultas académicas periódicas disponibles',
          'Reuniones con profesores para mejorar la comprensión de la carrera + asesoramiento de carrera'
        ],
        learning_center: [
          'Talleres sobre redacción de ensayos, técnicas de presentación, redacción de tesis, etc.'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 Guía de uso de la biblioteca para estudiantes extranjeros',
      
      category: 'Apoyo Académico/Instalaciones',
      description: 'Cómo usar la biblioteca, el mejor espacio de estudio para estudiantes extranjeros',
      details: {
        operating_hours: [
          'Normalmente de 09:00 a 22:00, 24 horas durante períodos de examen',
          'Sistema de acceso automático: se requiere tarjeta de estudiante'
        ],
        services: [
          'Salas de lectura individuales, salas de estudio en grupo',
          'Impresora/fotocopiadora disponible (pago pequeño)',
          'Recursos por especialidad, libros electrónicos, bases de datos académicas disponibles'
        ],
        digital_resources: [
          'Accesible mediante Wi-Fi del campus o VPN de la universidad',
          'Acceso a sitios de investigación coreanos como RISS, DBpia, KISS'
        ],
        tips: [
          'Se requiere silencio, llamadas de voz y comida están prohibidas',
          'Durante exámenes faltan asientos, reserva con anticipación'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ Resumen de instalaciones de TI y aprendizaje',
      
      category: 'Apoyo Académico/Instalaciones',
      description: 'Excelente entorno de aprendizaje digital en universidades coreanas',
      details: {
        computer_lab: [
          'La mayoría de los edificios del campus tienen laboratorios de computación',
          'Uso gratuito, funciones de impresión incluidas',
          'MS Office, programas estadísticos (R, SPSS) instalados'
        ],
        e_learning: [
          'La mayoría de las universidades tienen plataformas de aprendizaje en línea propias (LMS)',
          'Permite envío de tareas, verificación de asistencia, reproducción de clases',
          'Ejemplos: Blackboard, eClass, iCampus, etc.'
        ],
        printing: [
          'Impresoras ubicadas en la biblioteca, centro estudiantil y espacios comunes',
          'Pago posible con tarjeta del campus o tarjeta de estudiante'
        ],
        tech_support: [
          'Centro de servicios de TI del campus resuelve problemas de Wi-Fi, errores de cuenta, fallos de equipo'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 Guía para solicitar visa de estudiante en Corea (D-2)',
      
      category: 'Administración/Visa/Documentos',
      description: 'Visa D-2 para cursar un programa universitario completo en Corea',
      details: {
        procedures: [
          'Recibir carta de admisión (de la universidad)',
          'Rellenar formulario de solicitud de visa',
          'Presentar en la embajada/consulado coreano correspondiente'
        ],
        required_docs: [
          'Carta de admisión',
          'Standard Admission Letter',
          'Certificado de graduación de último grado y expediente académico (traducciones notariadas)',
          'Prueba de fondos (se recomienda depósito de 10,000 USD o más)',
          'Pasaporte original + copia',
          'Una foto tamaño pasaporte'
        ],
        notes: [
          'En algunos países se requiere certificado médico',
          'Tiempo de trámite: aprox. 2~4 semanas',
          'Aplicar 2~3 meses antes del inicio del semestre'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 Guía para obtener la tarjeta de registro de extranjero (ARC)',
      
      category: 'Administración/Visa/Documentos',
      description: 'Procedimiento obligatorio en los 90 días posteriores a la entrada',
      details: {
        application_place: [
          'Oficina de Inmigración o solicitud en línea (HiKorea)'
        ],
        required_docs: [
          'Pasaporte',
          'Visa (por ej. D-2)',
          'Carta de admisión o certificado de estudios',
          'Foto de pasaporte (3.5 x 4.5 cm)',
          'Tarifa: aprox. ₩30,000'
        ],
        processing_time: [
          'Generalmente 3~4 semanas',
          'Evitar salir de Corea antes de recibir la ARC'
        ],
        tips: [
          'Algunas universidades ayudan con solicitudes grupales (ver orientación para nuevos estudiantes)'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 Todos los documentos administrativos necesarios durante los estudios',
      
      category: 'Administración/Visa/Documentos',
      description: 'Documentos frecuentemente requeridos durante la vida estudiantil y cómo obtenerlos',
      details: {
        common_docs: {
          Certificado_de_Matricula: 'Para extensión de visa, registro de extranjeros – oficina administrativa de la universidad / portal',
          Expediente_Académico: 'Para transferencias, solicitudes de beca – portal universitario / solicitud presencial',
          Certificado_de_Entrada_Salida: 'Para abrir cuenta bancaria, trámites administrativos – centro de residentes o Government24',
          Notificación_de_Cambio_de_Dirección: 'Cambio de información de registro de extranjeros – Oficina de Inmigración / Government24',
          Solicitud_de_Extensión_de_Visa: 'Extensión de estancia a largo plazo – sitio web HiKorea'
        },
        online_tips: [
          'La mayoría de universidades permiten obtener PDF de documentos vía portal',
          'Usar Government24, Minwon24 para solicitar documentos estatales (se requiere autenticación)'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 Guía completa de los dormitorios universitarios en Corea',
      
      category: 'Dormitorio/Vivienda',
      description: 'La opción más segura y conveniente para estudiantes internacionales que llegan por primera vez a Corea',
      details: {
        features: [
          'Principalmente habitaciones dobles o triples / algunas universidades ofrecen habitaciones individuales',
          'Incluye: cama, escritorio, armario, aire acondicionado, Wi-Fi',
          'Instalaciones comunes: cuarto de lavandería, duchas, comedor, tienda de conveniencia, etc.'
        ],
        cost: [
          'Alrededor de ₩200,000 – ₩500,000 por mes (varía según la universidad y el tipo de habitación)',
          'Sin depósito, servicios incluidos'
        ],
        application: [
          'Después de la confirmación de admisión, inscribirse en línea a través del sitio web de la oficina internacional o el portal',
          '¡Atención a los cierres anticipados de convocatoria! → Verificar el período de solicitud'
        ],
        living_tips: [
          'Principalmente separado por género',
          'Algunas universidades restringen comida externa y tienen horario de entrada',
          'Es importante respetar las normas en áreas comunes (mantener limpieza, cuidar ruido)'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 Comparativa de opciones de alojamiento externo para estudiantes internacionales',
      
      category: 'Dormitorio/Vivienda',
      description: 'Varias opciones de alojamiento según el presupuesto y estilo de vida',
      details: {
        housing_types: {
          Estudio: 'Espacio independiente (con baño/cocina) - ₩500,000 – ₩800,000 - privacidad vs depósito alto',
          Gosiwon: 'Pequeña habitación privada + espacios compartidos - ₩300,000 – ₩500,000 - barato, contrato sencillo vs estrecho y poca insonorización',
          Homestay: 'Vivir con familia anfitriona + comidas incluidas - ₩400,000 – ₩600,000 - intercambio cultural posible vs menor libertad',
          Sharehouse: 'Vivienda compartida con varias personas - ₩400,000 – ₩600,000 - fácil hacer amigos vs posibles conflictos'
        },
        precautions: [
          'El depósito puede ser alto (normalmente ₩5,000,000 o más) → ¡Verificar el contrato cuidadosamente!',
          'La mayoría de los contratos están en coreano → se necesita ayuda de traducción',
          'Verificar si los servicios están incluidos o se pagan aparte'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 Guía de contratos de vivienda y trámites administrativos para estudiantes internacionales',
      
      category: 'Dormitorio/Vivienda',
      description: 'Importancia de contratos formales y registro de dirección cuando se vive fuera del campus',
      details: {
        contract_checklist: [
          'Existencia de contrato (necesario para el registro de dirección)',
          'Condiciones del depósito y la renta mensual',
          'Condiciones de reembolso al desocupar',
          'Si los servicios (utilities) están incluidos'
        ],
        address_registration: [
          'Dentro de las 2 semanas posteriores al contrato, registrar la dirección en el centro de residentes más cercano',
          'Está vinculado al cambio de dirección en la ARC'
        ],
        safety_tips: [
          'Se recomienda usar agencias inmobiliarias para prevenir estafas de corredores ilegales',
          'Conservar una copia del contrato',
          'Verificar el estado de la vivienda (moho, filtraciones, etc.) antes del contrato'
        ]
      }
    }
  ];
  
  
  
  // Russian version (Русский)
  export const russianStudyContent: FloatingBallContent[] = [
    {
      id: 'university-admission',
      title: '📚 Руководство по поступлению на бакалавриат в корейские университеты',
      
      category: 'Бакалавриат/Кампус',
      description: 'Пошаговая процедура поступления для иностранных студентов',
      details: {
        main_procedures: [
          'Выбор университета и специальности – выбрать государственный или частный университет, изучить особенности специальности',
          'Подготовка документов – аттестат об окончании средней школы (требуется нотариальное заверение), выписка оценок, мотивационное письмо и план обучения',
          'Тест на знание корейского языка (TOPIK) или оценка по английскому (в зависимости от университета)',
          'Проверка графика поступления – большинство университетов набирают на весенний семестр (март) и осенний семестр (сентябрь)'
        ],
        university_examples: [
          'Сеульский национальный университет (ориентирован на исследования)',
          'Университет Ханян (специализация на инженерных науках)',
          'Университет для женщин Ихва (только для женщин)'
        ],
        references: [
          'Study in Korea',
          'Сайты международных отделов каждого университета'
        ]
      }
    },
    {
      id: 'campus-life',
      title: '🏫 Жизнь в кампусе корейских университетов A до Z',
      
      category: 'Бакалавриат/Кампус',
      description: 'Советы по жизни в кампусе, часто задаваемые иностранными студентами',
      details: {
        dining: [
          'Использовать студенческие столовые на кампусе (₩3,000~₩6,000)',
          'Множество удобных магазинов и кафе поблизости'
        ],
        dormitory: [
          'Большинство университетов предоставляет общежития для иностранных студентов',
          'Ежемесячная стоимость: около ₩200,000~₩500,000',
          'Обратите внимание на сроки подачи заявки: подавайте сразу после подтверждения поступления, чтобы гарантировать место'
        ],
        activities: [
          'Есть клубы, предназначенные только для иностранных студентов',
          'Отличная возможность завести корейских друзей'
        ],
        facilities: [
          'На кампусе доступен бесплатный Wi-Fi',
          'Библиотека, спортзал, комнаты для учебы доступны бесплатно или за небольшую плату'
        ]
      }
    },
    {
      id: 'korean-language-support',
      title: '🗣️ Курсы корейского языка для иностранцев и советы по совмещению с учебой',
      
      category: 'Бакалавриат/Кампус',
      description: 'Системы поддержки для иностранных студентов с недостаточным знанием корейского',
      details: {
        preparatory_course: [
          'Пройти курс на 6 месяцев – 1 год в языковых центрах при университете',
          'После получения TOPIK уровня 3~4 можно поступить на бакалавриат'
        ],
        language_options: [
          'Некоторые университеты (Yonsei, POSTECH и др.) предлагают курсы полностью на английском',
          'Гуманитарные и социальные специальности преимущественно на корейском → знание корейского обязательно'
        ],
        tips: [
          'Активно используйте корейские приложения (например, Papago, Naver Dictionary)',
          'Воспользуйтесь системой кураторов для иностранных студентов (предоставляется репетиторство)'
        ]
      }
    },
    {
      id: 'academic-support',
      title: '🏫 Академические службы поддержки в корейских университетах',
      
      category: 'Академическая поддержка/Удобства',
      description: 'Различные системы академической поддержки для иностранных студентов',
      details: {
        tutoring: [
          'Внутриуниверситетское тьюторство по специальности: корейские студенты помогают иностранным с заданиями и подготовкой к экзаменам',
          'Чаще всего бесплатно, обязательная регистрация в начале семестра'
        ],
        language_support: [
          'Работают курсы корейского, разговорные занятия, языковые программы',
          'Проводятся подготовительные курсы TOPIK (в некоторых вузах бесплатно)'
        ],
        counseling: [
          'Доступны регулярные академические консультации',
          'Встречи с профессорами для повышения понимания предмета + консультации по карьере'
        ],
        learning_center: [
          'Проводятся семинары по написанию эссе, технике презентаций, составлению научных работ и т. д.'
        ]
      }
    },
    {
      id: 'library-guide',
      title: '📖 Гид по использованию библиотеки для иностранных студентов',
      
      category: 'Академическая поддержка/Удобства',
      description: 'Как пользоваться библиотекой – лучшим местом для учебы для иностранных студентов',
      details: {
        operating_hours: [
          'Обычно с 09:00 до 22:00, во время экзаменов работает круглосуточно',
          'Автоматическая система доступа: требуется студенческий билет'
        ],
        services: [
          'Индивидуальные читальные залы, комнаты для группового обучения',
          'Доступны принтер/копир (платная услуга)',
          'Предоставляются материалы по специальностям, электронные книги, академические базы данных'
        ],
        digital_resources: [
          'Доступно через Wi-Fi кампуса или университетский VPN',
          'Доступ к корейским сайтам научных публикаций RISS, DBpia, KISS'
        ],
        tips: [
          'Необходимо сохранять тишину, голосовые звонки и еда запрещены',
          'Во время экзаменов места быстро заканчиваются, бронируйте заранее'
        ]
      }
    },
    {
      id: 'it-facilities',
      title: '🖥️ Обзор ИТ- и учебных удобств',
      
      category: 'Академическая поддержка/Удобства',
      description: 'Отличная цифровая учебная среда в корейских университетах',
      details: {
        computer_lab: [
          'В большинстве зданий кампуса есть компьютерные классы',
          'Бесплатное использование, включая печать',
          'Установлены MS Office и статистические программы (R, SPSS)'
        ],
        e_learning: [
          'Большинство университетов используют собственные онлайн-платформы (LMS)',
          'Позволяет сдавать задания, проверять посещаемость, повторно просматривать лекции',
          'Примеры: Blackboard, eClass, iCampus и др.'
        ],
        printing: [
          'Принтеры установлены в библиотеке, студенческом центре и общественных зонах',
          'Оплата с помощью студенческой карты или ID'
        ],
        tech_support: [
          'ИТ-служба кампуса решает проблемы с Wi-Fi, ошибки учетных записей, поломки оборудования'
        ]
      }
    },
    {
      id: 'student-visa',
      title: '🛂 Руководство по подаче заявки на студенческую визу в Корею (D-2)',
      
      category: 'Администрация/Виза/Документы',
      description: 'Виза D-2 для обучения по программе бакалавриата в Корее',
      details: {
        procedures: [
          'Получить письмо о приеме (от университета)',
          'Заполнить форму заявления на визу',
          'Подать документы в соответствующее посольство/консульство Республики Корея'
        ],
        required_docs: [
          'Письмо о приеме',
          'Standard Admission Letter',
          'Нотариально заверенные переводы диплома и выписки оценок',
          'Подтверждение финансовых средств (рекомендуется депозит от 10,000 USD)',
          'Оригинал паспорта + копия',
          'Одно фото паспортного формата'
        ],
        notes: [
          'В некоторых странах требуется медицинская справка',
          'Срок обработки: примерно 2 – 4 недели',
          'Рекомендуется подавать заявку за 2 – 3 месяца до начала семестра'
        ]
      }
    },
    {
      id: 'alien-registration',
      title: '📝 Пошаговая инструкция по получению удостоверения иностранца (ARC)',
      
      category: 'Администрация/Виза/Документы',
      description: 'Обязательная процедура в течение 90 дней после въезда',
      details: {
        application_place: [
          'Бюро по делам иммиграции или онлайн (HiKorea)'
        ],
        required_docs: [
          'Паспорт',
          'Виза (например, D-2)',
          'Письмо о приеме или справка о зачислении',
          'Фото паспортного формата (3,5 x 4,5 см)',
          'Плата: около ₩30,000'
        ],
        processing_time: [
          'Обычно занимает 3 – 4 недели',
          'Избегайте выезда из Кореи до выдачи ARC'
        ],
        tips: [
          'Некоторые университеты помогают с групповыми заявками (смотри ориентацию для первокурсников)'
        ]
      }
    },
    {
      id: 'academic-documents',
      title: '📁 Все административные документы, необходимые во время учебы',
      
      category: 'Администрация/Виза/Документы',
      description: 'Документы, часто требуемые во время учебы, и способы их получения',
      details: {
        common_docs: {
          Сертификат_о_поступлении: 'Для продления визы, регистрации иностранца – администрация университета / портал',
          Выписка_о_оценках: 'Для перевода, подачи на стипендию – университетский портал / личное заявление',
          Справка_о_пересечении_границы: 'Для открытия банковского счета, различных административных операций – центр граждан или Government24',
          Уведомление_об_изменении_адреса: 'Изменение сведений в регистрации иностранца – управление иммиграции / Government24',
          Заявление_на_продление_визы: 'Продление долгосрочного пребывания – сайт HiKorea'
        },
        online_tips: [
          'Большинство университетов позволяет скачивать документы в формате PDF через портал',
          'Используйте Government24, Minwon24 для заказа государственных документов (требуется электронная подпись)'
        ]
      }
    },
    {
      id: 'dormitory-guide',
      title: '🏢 Полный гид по университетским общежитиям в Корее',
      
      category: 'Общежитие/Жильё',
      description: 'Самый безопасный и удобный вариант для иностранных студентов, приезжающих в Корею впервые',
      details: {
        features: [
          'В основном двухместные или трехместные комнаты / некоторые университеты предлагают одноместные',
          'Предоставляется: кровать, стол, шкаф, кондиционер, Wi-Fi',
          'Общие удобства: прачечная, душевые, столовая, магазин и пр.'
        ],
        cost: [
          'Примерно ₩200,000 – ₩500,000 в месяц (зависит от университета и типа комнаты)',
          'Без залога, коммунальные услуги включены'
        ],
        application: [
          'После подтверждения зачисления подать заявку онлайн через сайт международного офиса или портал',
          'Будьте внимательны к ранним срокам закрытия подачи! → Обязательно проверить даты подачи'
        ],
        living_tips: [
          'В основном отдельно для мужчин и женщин',
          'Некоторые университеты ограничивают внешнюю еду и устанавливают комендантский час',
          'Правила поведения в общих зонах очень важны (соблюдать чистоту, избегать шума)'
        ]
      }
    },
    {
      id: 'housing-options',
      title: '🏠 Сравнение внешних вариантов проживания для иностранных студентов',
      
      category: 'Общежитие/Жильё',
      description: 'Различные варианты жилья в зависимости от бюджета и образа жизни',
      details: {
        housing_types: {
          Студия: 'Отдельное пространство (с ванной/кухней) - ₩500,000 – ₩800,000 - приватность vs высокий залог',
          Goshiwon: 'Небольшая личная комната + общие зоны - ₩300,000 – ₩500,000 - недорого, простой договор vs теснота и плохая звукоизоляция',
          Homestay: 'Проживание с принимающей семьей + питание - ₩400,000 – ₩600,000 - возможен культурный обмен vs меньше свободы',
          Sharehouse: 'Жилье совместно с несколькими людьми - ₩400,000 – ₩600,000 - легко найти друзей vs возможные конфликты'
        },
        precautions: [
          'Может потребоваться высокий залог (обычно ₩5,000,000 или более) → внимательно проверяйте договор!',
          'Большинство договоров на корейском → нужна помощь с переводом',
          'Проверьте, оплачиваются ли коммунальные услуги отдельно'
        ]
      }
    },
    {
      id: 'housing-contract',
      title: '🧾 Руководство по заключению договора аренды и административным процедурам для иностранных студентов',
      
      category: 'Общежитие/Жильё',
      description: 'Важность официальных договоров и регистрации адреса при проживании вне кампуса',
      details: {
        contract_checklist: [
          'Наличие договора (необходимо для регистрации адреса)',
          'Условия залога и ежемесячной арендной платы',
          'Условия возврата при выезде',
          'Включены ли коммунальные платежи'
        ],
        address_registration: [
          'В течение 2 недель после заключения договора зарегистрировать адрес в ближайшем центре для жителей',
          'Связано с изменением адреса в ARC'
        ],
        safety_tips: [
          'Рекомендуется пользоваться услугами агентств недвижимости для предотвращения мошеннических схем',
          'Обязательно храните копию договора',
          'Проверьте состояние жилья (плесень, протечки и т. д.) до заключения договора'
        ]
      }
    }
  ];
  
