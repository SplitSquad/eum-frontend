import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Modal,
  Backdrop,
  Button,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import DirectionsIcon from '@mui/icons-material/Directions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import BusinessIcon from '@mui/icons-material/Business';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TransportIcon from '@mui/icons-material/DirectionsTransit';
import HotelIcon from '@mui/icons-material/Hotel';
import {
  loadKakaoMapScript,
  getAddressFromCoords,
  getKakaoMapDirectionsUrl,
  createKakaoMap,
} from '../../config/kakaoMap';
import { env } from '../../config/env';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';
import { useMypageStore } from '../../features/mypage/store/mypageStore';
import { setUserLocation as saveUserLocation } from '@/shared/utils/Agentic_state';

declare global {
  interface Window {
    kakao: any;
    kakaoMapDirections: (placeId: string) => void;
  }
}

interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  place_url?: string;
}

// 사용자 목적 타입
type UserPurpose = 'travel' | 'work' | 'residence' | 'study';

// 목적별 카테고리 정의
const PURPOSE_CATEGORIES = {
  travel: [
    {
      id: 'tourist',
      name: '관광명소',
      icon: <TravelExploreIcon fontSize="small" />,
      keyword: '관광',
      color: '#2196F3',
    },
    {
      id: 'restaurant',
      name: '맛집',
      icon: <RestaurantIcon fontSize="small" />,
      keyword: '맛집',
      color: '#FF5722',
    },
    {
      id: 'cafe',
      name: '카페',
      icon: <LocalCafeIcon fontSize="small" />,
      keyword: '카페',
      color: '#795548',
    },
    {
      id: 'culture',
      name: '문화시설',
      icon: <TheaterComedyIcon fontSize="small" />,
      keyword: '박물관',
      color: '#9C27B0',
    },
    {
      id: 'transport',
      name: '교통',
      icon: <TransportIcon fontSize="small" />,
      keyword: '지하철역',
      color: '#4CAF50',
    },
    {
      id: 'hotel',
      name: '숙박',
      icon: <HotelIcon fontSize="small" />,
      keyword: '호텔',
      color: '#FF9800',
    },
  ],
  work: [
    {
      id: 'business',
      name: '사무공간',
      icon: <BusinessIcon fontSize="small" />,
      keyword: '사무실',
      color: '#3F51B5',
    },
    {
      id: 'bank',
      name: '은행',
      icon: <AccountBalanceIcon fontSize="small" />,
      keyword: '은행',
      color: '#607D8B',
    },
    {
      id: 'restaurant',
      name: '식당',
      icon: <RestaurantIcon fontSize="small" />,
      keyword: '식당',
      color: '#FF5722',
    },
    {
      id: 'cafe',
      name: '카페',
      icon: <LocalCafeIcon fontSize="small" />,
      keyword: '카페',
      color: '#795548',
    },
    {
      id: 'transport',
      name: '교통',
      icon: <TransportIcon fontSize="small" />,
      keyword: '지하철역',
      color: '#4CAF50',
    },
    {
      id: 'government',
      name: '관공서',
      icon: <AccountBalanceIcon fontSize="small" />,
      keyword: '구청',
      color: '#009688',
    },
  ],
  residence: [
    {
      id: 'market',
      name: '마트/시장',
      icon: <BusinessIcon fontSize="small" />,
      keyword: '마트',
      color: '#4CAF50',
    },
    {
      id: 'hospital',
      name: '병원',
      icon: <LocalHospitalIcon fontSize="small" />,
      keyword: '병원',
      color: '#F44336',
    },
    {
      id: 'bank',
      name: '은행',
      icon: <AccountBalanceIcon fontSize="small" />,
      keyword: '은행',
      color: '#607D8B',
    },
    {
      id: 'restaurant',
      name: '식당',
      icon: <RestaurantIcon fontSize="small" />,
      keyword: '식당',
      color: '#FF5722',
    },
    {
      id: 'transport',
      name: '교통',
      icon: <TransportIcon fontSize="small" />,
      keyword: '지하철역',
      color: '#4CAF50',
    },
    {
      id: 'government',
      name: '관공서',
      icon: <AccountBalanceIcon fontSize="small" />,
      keyword: '주민센터',
      color: '#009688',
    },
  ],
  study: [
    {
      id: 'university',
      name: '대학교',
      icon: <SchoolIcon fontSize="small" />,
      keyword: '대학교',
      color: '#673AB7',
    },
    {
      id: 'library',
      name: '도서관',
      icon: <SchoolIcon fontSize="small" />,
      keyword: '도서관',
      color: '#009688',
    },
    {
      id: 'cafe',
      name: '스터디카페',
      icon: <LocalCafeIcon fontSize="small" />,
      keyword: '스터디카페',
      color: '#795548',
    },
    {
      id: 'restaurant',
      name: '식당',
      icon: <RestaurantIcon fontSize="small" />,
      keyword: '식당',
      color: '#FF5722',
    },
    {
      id: 'transport',
      name: '교통',
      icon: <TransportIcon fontSize="small" />,
      keyword: '지하철역',
      color: '#4CAF50',
    },
    {
      id: 'language',
      name: '학원',
      icon: <SchoolIcon fontSize="small" />,
      keyword: '어학원',
      color: '#FF9800',
    },
  ],
};

const PURPOSE_INFO = {
  travel: { icon: <TravelExploreIcon />, color: '#2196F3', label: '여행', defaultSearch: '관광' },
  work: { icon: <WorkIcon />, color: '#FF9800', label: '취업', defaultSearch: '사무실' },
  residence: { icon: <HomeIcon />, color: '#4CAF50', label: '거주', defaultSearch: '마트' },
  study: { icon: <SchoolIcon />, color: '#9C27B0', label: '유학', defaultSearch: '대학교' },
};

// 목적 매핑 함수 추가
const mapVisitPurposeToUserPurpose = (visitPurpose?: string): UserPurpose => {
  if (!visitPurpose) return 'travel';

  const purposeMap: Record<string, UserPurpose> = {
    Travel: 'travel',
    Study: 'study',
    Work: 'work',
    Living: 'residence',
    travel: 'travel',
    study: 'study',
    work: 'work',
    living: 'residence',
    residence: 'residence',
    job: 'work',
  };

  return purposeMap[visitPurpose] || 'travel';
};

const KakaoMapWidget: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fullMapContainerRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [fullMap, setFullMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userMarker, setUserMarker] = useState<any>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // 선택된 장소 상태
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // 주변장소 모달 상태 추가
  const [isPlacesModalOpen, setIsPlacesModalOpen] = useState<boolean>(false);

  // 현재 검색 카테고리 상태 추가
  const [currentSearchCategory, setCurrentSearchCategory] = useState<string>('');

  // 마이페이지 스토어에서 프로필 정보 가져오기
  const { profile, fetchProfile } = useMypageStore();

  // 사용자 목적 상태 - 마이페이지 프로필에서 가져오기
  const [userPurpose, setUserPurpose] = useState<UserPurpose | null>(null);

  // 프로필에서 실제 목적 가져오기
  useEffect(() => {
    if (profile?.role) {
      const mappedPurpose = mapVisitPurposeToUserPurpose(profile.role);
      setUserPurpose(mappedPurpose);
      console.log('사용자 목적 설정:', profile.role, '->', mappedPurpose);
    }
  }, [profile?.role]);

  // 프로필이 없으면 가져오기
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // 현재 카테고리들 - 사용자 목적이 설정된 경우에만
  const currentCategories = userPurpose
    ? PURPOSE_CATEGORIES[userPurpose]
    : PURPOSE_CATEGORIES.travel;
  const purposeInfo = userPurpose ? PURPOSE_INFO[userPurpose] : PURPOSE_INFO.travel;

  // 지도 초기화 상태 추가
  const [initState, setInitState] = useState<'pending' | 'loading' | 'success' | 'error'>(
    'pending'
  );
  const initAttemptRef = useRef<number>(0); // 초기화 시도 횟수 추적
  const mapInitializedRef = useRef<boolean>(false); // 지도 초기화 완료 여부

  // 사용자 목적이 변경될 때 자동으로 다시 검색
  useEffect(() => {
    if (userPurpose && map && userLocation && window.kakao && window.kakao.maps) {
      console.log('사용자 목적 변경으로 인한 재검색:', userPurpose);
      setTimeout(() => {
        // searchNearbyPlaces를 직접 호출하는 대신 필요한 경우에만 호출하도록 수정
        if (typeof searchNearbyPlaces === 'function') {
          searchNearbyPlaces(
            map,
            window.kakao.maps,
            userLocation.latitude,
            userLocation.longitude,
            ''
          );
        }
      }, 500);
    }
  }, [userPurpose, map, userLocation]);

  // 사용자 위치가 설정되면 지도 중심 재조정
  useEffect(() => {
    if (map && userLocation && window.kakao && window.kakao.maps) {
      console.log('사용자 위치 변경으로 인한 지도 중심 재조정:', userLocation);
      const userLatLng = new window.kakao.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );

      // 지도 중심 이동
      map.setCenter(userLatLng);
      map.setLevel(5);

      // 지연 후 재조정 (지도 렌더링 완료 후)
      setTimeout(() => {
        map.setCenter(userLatLng);
        map.setLevel(5);
      }, 500);
    }
  }, [map, userLocation]);

  // 장소 클릭 핸들러 함수 추가
  const handlePlaceClick = useCallback(
    (place: Place) => {
      // 선택된 장소 설정
      setSelectedPlace(place);

      // 지도가 있는 경우 지도 중심 이동
      if (map) {
        const position = new window.kakao.maps.LatLng(
          place.latitude || userLocation?.latitude || 0,
          place.longitude || userLocation?.longitude || 0
        );
        map.setCenter(position);

        // 지도 확대 레벨 조정 (더 확대)
        map.setLevel(3);
      }

      // 전체 화면 지도가 있는 경우에도 동일하게 적용
      if (fullMap) {
        const position = new window.kakao.maps.LatLng(
          place.latitude || userLocation?.latitude || 0,
          place.longitude || userLocation?.longitude || 0
        );
        fullMap.setCenter(position);
        fullMap.setLevel(3);
      }

      // 장소 URL이 있는 경우 링크 정보 표시
      if (place.place_url) {
        // 선택적으로 URL 열기 대신 별도 버튼으로 대체
        // openPlaceUrl(place.place_url);
      }
    },
    [map, fullMap, userLocation]
  );

  // 카카오맵 초기화 - 이전 함수를 useCallback으로 교체하여 최적화
  const initializeMap = useCallback(async () => {
    try {
      // 이미 초기화 됐으면 실행하지 않음
      if (mapInitializedRef.current) {
        console.log('지도가 이미 초기화되었습니다.');
        return;
      }

      setLoading(true);
      setError(null);
      setInitState('loading');

      console.log(`지도 초기화 시작 (시도: ${initAttemptRef.current + 1})`);
      initAttemptRef.current += 1;

      // API 키 확인
      const kakaoApiKey = env.KAKAO_MAP_API_KEY;
      if (!kakaoApiKey) {
        throw new Error('카카오맵 API 키가 설정되지 않았습니다.');
      }

      // 컨테이너 확인
      if (!mapContainerRef.current) {
        throw new Error('지도 컨테이너가 DOM에 존재하지 않습니다.');
      }

      // 컨테이너 크기가 0이면 최소 크기 설정
      if (mapContainerRef.current.clientWidth === 0 || mapContainerRef.current.clientHeight === 0) {
        console.warn('지도 컨테이너의 크기가 0입니다. 최소 크기 설정.');
        mapContainerRef.current.style.width = '100%';
        mapContainerRef.current.style.minHeight = '300px'; // 최소 높이를 450px에서 300px로 감소
        // 리플로우 유도
        mapContainerRef.current.getBoundingClientRect();

        // 크기 설정 후 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(
        '컨테이너 크기:',
        mapContainerRef.current.clientWidth,
        'x',
        mapContainerRef.current.clientHeight
      );

      // createKakaoMap 함수 사용 (kakaoMap.ts에서 개선된 함수)
      const mapInstance = await createKakaoMap(mapContainerRef.current, {
        center: { latitude: 37.5665, longitude: 126.978 },
        level: 5, // 레벨을 4에서 5로 조정하여 더 넓은 영역을 보여줌
      });

      console.log('지도 인스턴스 생성 성공');
      setMap(mapInstance);
      mapInitializedRef.current = true;

      // 사용자 위치 요청
      if (window.kakao && window.kakao.maps) {
        getUserLocation(mapInstance, window.kakao.maps);

        // 지도 타일 로드 완료 후 중심 위치 재조정
        window.kakao.maps.event.addListener(mapInstance, 'tilesloaded', () => {
          console.log('지도 타일 로드 완료 - 중심 위치 재조정');
          if (userLocation) {
            const userLatLng = new window.kakao.maps.LatLng(
              userLocation.latitude,
              userLocation.longitude
            );
            mapInstance.setCenter(userLatLng);
          }
        });
      } else {
        throw new Error('카카오맵 객체가 초기화되지 않았습니다.');
      }

      // 지도 스타일 적용 (지연 적용)
      setTimeout(() => {
        try {
          applyCustomMapStyle(mapInstance);
        } catch (styleError) {
          console.warn('지도 스타일 적용 실패:', styleError);
        }
      }, 1000); // 1초 후 스타일 적용

      setInitState('success');
      setLoading(false);
    } catch (error) {
      console.error('카카오맵 초기화 실패:', error);
      setError(
        `지도를 불러오는데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
      setInitState('error');
      setLoading(false);

      // 최대 3번까지 재시도
      if (initAttemptRef.current < 3) {
        console.log(`${initAttemptRef.current}번째 재시도 예정...`);
        setTimeout(() => {
          initializeMap();
        }, 1500); // 1.5초 후 재시도
      }
    }
  }, []);

  // 카카오맵 초기화 - 마운트 시 실행
  useEffect(() => {
    // 컴포넌트 마운트 시 지도 초기화 전 약간의 지연
    const initTimer = setTimeout(() => {
      initializeMap();
    }, 800); // 800ms 지연

    // 컴포넌트 언마운트 시 정리
    return () => {
      clearTimeout(initTimer);

      // 검색 타이머 정리
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // 마커 정리
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
      }
      if (userMarker) {
        userMarker.setMap(null);
      }

      // 이벤트 리스너 제거 (메모리 누수 방지)
      if (map && window.kakao && window.kakao.maps) {
        try {
          window.kakao.maps.event.removeListener(map, 'tilesloaded');
          window.kakao.maps.event.removeListener(map, 'idle');
        } catch (error) {
          console.warn('이벤트 리스너 제거 실패:', error);
        }
      }
    };
  }, [initializeMap]);

  // 전체화면 지도 초기화 (개선된 로직)
  useEffect(() => {
    if (!isMapModalOpen) return;

    let fullMapInitTimer: number;

    const initFullMap = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('전체화면 지도 초기화 시작');

        // 컨테이너 확인
        if (!fullMapContainerRef.current) {
          throw new Error('전체화면 지도 컨테이너가 존재하지 않습니다.');
        }

        // 컨테이너 크기 확인 및 설정
        const { clientWidth, clientHeight } = fullMapContainerRef.current;
        if (clientWidth === 0 || clientHeight === 0) {
          console.warn('전체화면 지도 컨테이너의 크기가 0입니다. 최소 크기 설정.');
          fullMapContainerRef.current.style.width = '100%';
          fullMapContainerRef.current.style.minHeight = '400px';
          // 리플로우 유도
          fullMapContainerRef.current.getBoundingClientRect();
        }

        // 모달이 완전히 렌더링될 때까지 짧게 대기
        await new Promise(resolve => setTimeout(resolve, 300));

        // 좌표 설정 (사용자 위치 또는 기본값)
        const center = userLocation
          ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
          : { latitude: 37.5665, longitude: 126.978 }; // 서울 중심

        // createKakaoMap 함수 사용 (kakaoMap.ts에서 개선된 함수)
        const mapInstance = await createKakaoMap(fullMapContainerRef.current, {
          center,
          level: 3,
        });

        console.log('전체화면 지도 인스턴스 생성 성공');
        setFullMap(mapInstance);

        // 사용자 위치 마커
        if (userLocation && window.kakao && window.kakao.maps) {
          createUserMarker(
            mapInstance,
            window.kakao.maps,
            userLocation.latitude,
            userLocation.longitude
          );
        }

        // 장소 마커
        if (places.length > 0 && window.kakao && window.kakao.maps) {
          createPlaceMarkersForFullMap(mapInstance, window.kakao.maps, places);
        }

        // 컨트롤 추가
        if (window.kakao && window.kakao.maps) {
          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          mapInstance.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

          const zoomControl = new window.kakao.maps.ZoomControl();
          mapInstance.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        }

        // 길찾기 함수 설정
        window.kakaoMapDirections = (placeId: string) => {
          const place = places.find(p => p.id === placeId);
          if (!place || !place.latitude || !place.longitude || !userLocation) return;

          // 직접 길찾기 페이지로 이동
          const url = getKakaoMapDirectionsUrl(
            '내 위치',
            userLocation.latitude,
            userLocation.longitude,
            place.name,
            place.latitude,
            place.longitude
          );
          window.open(url, '_blank', 'noopener,noreferrer');
        };

        // 스타일 적용 (지연 적용)
        setTimeout(() => {
          try {
            applyCustomMapStyle(mapInstance);
            applyEnhancedMapStyle(mapInstance);
          } catch (styleError) {
            console.warn('지도 스타일 적용 실패:', styleError);
          }
        }, 1500); // 1.5초 후 스타일 적용

        setLoading(false);
      } catch (error: any) {
        console.error('전체화면 지도 초기화 실패:', error);
        setError(
          '전체화면 지도를 불러오는데 실패했습니다. ' + (error.message || '알 수 없는 오류')
        );
        setLoading(false);
      }
    };

    // 약간의 지연 후 초기화
    fullMapInitTimer = window.setTimeout(() => {
      initFullMap();
    }, 500);

    // 모달이 닫힐 때 정리
    return () => {
      window.clearTimeout(fullMapInitTimer);

      if (fullMap && window.kakao && window.kakao.maps) {
        try {
          // 이벤트 리스너 제거
          window.kakao.maps.event.removeListener(fullMap, 'click');
          window.kakao.maps.event.removeListener(fullMap, 'zoom_changed');
          window.kakao.maps.event.removeListener(fullMap, 'dragstart');
          window.kakao.maps.event.removeListener(fullMap, 'tilesloaded');
          window.kakao.maps.event.removeListener(fullMap, 'idle');

          // 선택된 장소 초기화
          setSelectedPlace(null);
        } catch (error) {
          console.error('이벤트 리스너 제거 실패:', error);
        }
      }
    };
  }, [isMapModalOpen, userLocation, places]);

  // 선택된 장소가 변경될 때 지도 중심 이동
  useEffect(() => {
    if (!selectedPlace || !fullMap) return;

    if (selectedPlace.latitude && selectedPlace.longitude) {
      const position = new window.kakao.maps.LatLng(
        selectedPlace.latitude,
        selectedPlace.longitude
      );
      fullMap.setCenter(position);
      fullMap.setLevel(3);
    }
  }, [selectedPlace, fullMap]);

  // 새로고침 버튼 핸들러 추가
  const handleRefresh = useCallback(() => {
    // 지도 재초기화
    mapInitializedRef.current = false;
    initAttemptRef.current = 0;

    // 기존 지도 정리
    if (map) {
      map.setMap?.(null);
      setMap(null);
    }

    setInitState('pending');
    setError(null);

    // 잠시 후 재초기화
    setTimeout(() => {
      initializeMap();
    }, 500);
  }, [initializeMap, map]);

  // 사용자 위치 가져오기
  const getUserLocation = (mapInstance: any, kakaoMaps: any) => {
    console.log('사용자 위치 정보 요청 시작');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          console.log('사용자 위치 확인됨:', latitude, longitude);
          // 🧠 상태 저장
          saveUserLocation({ latitude, longitude });

          setUserLocation({ latitude, longitude });

          try {
            // 지도 중심 이동
            const userLatLng = new kakaoMaps.LatLng(latitude, longitude);
            mapInstance.setCenter(userLatLng);

            // 지도 레벨 설정 (더 넓은 시야로 조정)
            mapInstance.setLevel(5);

            // 약간의 지연 후 중심점 재설정 (확실한 이동)
            setTimeout(() => {
              mapInstance.setCenter(userLatLng);
              mapInstance.setLevel(5);

              // 지도가 완전히 로드된 후 한 번 더 중심점 보정
              setTimeout(() => {
                mapInstance.setCenter(userLatLng);
              }, 500);
            }, 300);

            // 사용자 위치 마커 생성
            createUserMarker(mapInstance, kakaoMaps, latitude, longitude);

            // 주변 장소 검색 (지연 실행으로 API 호출 분산)
            setTimeout(() => {
              searchNearbyPlaces(mapInstance, kakaoMaps, latitude, longitude, '');
            }, 1000);

            // 주소 가져오기
            try {
              const address = await getAddressFromCoords(mapInstance, latitude, longitude);
              console.log('현재 위치 주소:', address);
            } catch (error) {
              console.error('주소 변환 실패:', error);
            }
          } catch (error) {
            console.error('사용자 위치 처리 중 오류:', error);
          }
        },
        error => {
          console.error('위치 정보 가져오기 실패:', error.code, error.message);
          setError(`위치 정보를 가져오는데 실패했습니다 (코드: ${error.code})`);

          // 위치 정보를 가져올 수 없는 경우 서울 중심으로 설정
          setUserLocation({ latitude: 37.5665, longitude: 126.978 });
          setTimeout(() => {
            searchNearbyPlaces(mapInstance, kakaoMaps, 37.5665, 126.978, '');
          }, 1000);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('브라우저가 위치 정보를 지원하지 않습니다');
      setError('브라우저가 위치 정보를 지원하지 않습니다');

      // 기본 위치 설정
      setUserLocation({ latitude: 37.5665, longitude: 126.978 });
      setTimeout(() => {
        searchNearbyPlaces(mapInstance, kakaoMaps, 37.5665, 126.978, '');
      }, 1000);
    }
  };

  // 사용자 위치 마커 생성
  const createUserMarker = (
    mapInstance: any,
    kakaoMaps: any,
    latitude: number,
    longitude: number
  ) => {
    try {
      console.log('사용자 위치 마커 생성 시작');

      // 기존 마커 제거
      if (userMarker) {
        userMarker.setMap(null);
      }

      // 마커 이미지 생성
      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      const imageSize = new kakaoMaps.Size(24, 35);
      const imageOption = { offset: new kakaoMaps.Point(12, 35) };

      try {
        const markerImage = new kakaoMaps.MarkerImage(imageSrc, imageSize, imageOption);

        // 커스텀 마커 생성
        const userLatLng = new kakaoMaps.LatLng(latitude, longitude);
        const userMarkerInstance = new kakaoMaps.Marker({
          position: userLatLng,
          map: mapInstance,
          image: markerImage,
          zIndex: 10, // 다른 마커보다 앞에 표시
        });

        // 원형 오버레이 추가 (사용자 위치 강조)
        try {
          const circle = new kakaoMaps.Circle({
            center: userLatLng,
            radius: 50, // 미터 단위
            strokeWeight: 2,
            strokeColor: '#0078ff',
            strokeOpacity: 0.8,
            fillColor: '#4dabff',
            fillOpacity: 0.3,
            zIndex: 1,
          });
          circle.setMap(mapInstance);
        } catch (circleError) {
          console.warn('원형 오버레이 생성 실패:', circleError);
        }

        // 사용자 위치 인포윈도우 표시
        try {
          const infowindow = new kakaoMaps.InfoWindow({
            content:
              '<div style="padding:5px;font-size:12px;color:#0078ff;font-weight:bold;">내 위치</div>',
            zIndex: 11,
          });
          infowindow.open(mapInstance, userMarkerInstance);

          // 5초 후 인포윈도우 닫기
          setTimeout(() => infowindow.close(), 5000);
        } catch (infoError) {
          console.warn('인포윈도우 생성 실패:', infoError);
        }

        // 유저 마커 상태 저장
        setUserMarker(userMarkerInstance);
        console.log('사용자 위치 마커 생성 완료');
      } catch (markerError) {
        console.error('마커 이미지 또는 마커 생성 실패:', markerError);
      }
    } catch (error) {
      console.error('사용자 위치 마커 생성 실패:', error);
    }
  };

  // 장소 마커 생성
  const createPlaceMarkers = (mapInstance: any, kakaoMaps: any, placeList: Place[]) => {
    const newMarkers: any[] = [];

    placeList.forEach(place => {
      if (place.latitude && place.longitude) {
        const marker = new kakaoMaps.Marker({
          map: mapInstance,
          position: new kakaoMaps.LatLng(place.latitude, place.longitude),
        });

        // 마커 클릭 이벤트
        kakaoMaps.event.addListener(marker, 'click', function () {
          // 인포윈도우 생성
          const infowindow = new kakaoMaps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${place.name}</div>`,
          });
          infowindow.open(mapInstance, marker);

          // 3초 후 인포윈도우 닫기
          setTimeout(() => infowindow.close(), 3000);
        });

        newMarkers.push(marker);
      }
    });

    return newMarkers;
  };

  // API 호출 디바운싱을 위한 ref 추가
  const searchTimeoutRef = useRef<number | null>(null);
  const lastSearchTimeRef = useRef<number>(0);

  // 주변 장소 검색 (디바운싱 및 재시도 로직 추가)
  const searchNearbyPlaces = (
    mapInstance: any,
    kakaoMaps: any,
    lat: number,
    lng: number,
    keyword: string = '',
    retryCount: number = 0
  ) => {
    // 사용자 목적이 아직 설정되지 않은 경우 검색 연기
    if (!userPurpose && !keyword) {
      console.log('사용자 목적이 아직 설정되지 않아 검색을 연기합니다.');
      setTimeout(() => {
        searchNearbyPlaces(mapInstance, kakaoMaps, lat, lng, keyword, retryCount);
      }, 1000);
      return;
    }

    // 이전 검색 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // API 호출 간격 제한 (최소 500ms)
    const now = Date.now();
    const timeSinceLastSearch = now - lastSearchTimeRef.current;
    const minInterval = 500;

    if (timeSinceLastSearch < minInterval) {
      // 너무 빠른 연속 호출 방지
      searchTimeoutRef.current = window.setTimeout(() => {
        searchNearbyPlaces(mapInstance, kakaoMaps, lat, lng, keyword, retryCount);
      }, minInterval - timeSinceLastSearch);
      return;
    }

    lastSearchTimeRef.current = now;

    // 이전 마커 제거
    if (markers.length > 0) {
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);
    }

    // 장소 검색 객체 생성
    const placesService = new kakaoMaps.services.Places();

    // 검색 콜백 (에러 핸들링 강화)
    const placesSearchCB = (result: any, status: any) => {
      if (status === kakaoMaps.services.Status.OK) {
        console.log('검색 결과:', result);

        // 결과 처리 및 마커 표시
        const newPlaces: Place[] = result.map((place: any, index: number) => {
          // 마커 생성
          const marker = new kakaoMaps.Marker({
            map: mapInstance,
            position: new kakaoMaps.LatLng(place.y, place.x),
          });

          // 마커 클릭 이벤트
          kakaoMaps.event.addListener(marker, 'click', function () {
            // 인포윈도우 생성
            const infowindow = new kakaoMaps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
            });
            infowindow.open(mapInstance, marker);

            // 3초 후 인포윈도우 닫기
            setTimeout(() => infowindow.close(), 3000);
          });

          // 마커 배열에 추가
          setMarkers(prev => [...prev, marker]);

          // 카테고리 추정
          let category = 'etc';
          if (place.category_name.includes('카페')) category = 'cafe';
          else if (
            place.category_name.includes('음식점') ||
            place.category_name.includes('레스토랑')
          )
            category = 'restaurant';
          else if (
            place.category_name.includes('문화시설') ||
            place.category_name.includes('공연장')
          )
            category = 'culture';
          else if (place.category_name.includes('관광') || place.category_name.includes('여행'))
            category = 'tourist';

          return {
            id: index.toString(),
            name: place.place_name,
            category,
            rating: (Math.random() * 2 + 3).toFixed(1),
            distance: `${(place.distance / 1000).toFixed(1)}km`,
            latitude: place.y,
            longitude: place.x,
            address: place.address_name,
            place_url: place.place_url,
          };
        });

        setPlaces(newPlaces);
      } else {
        console.error('장소 검색 실패:', status, '재시도 횟수:', retryCount);

        // 401 에러 또는 기타 일시적 오류인 경우 재시도
        if (retryCount < 2 && (status === kakaoMaps.services.Status.ERROR || !status)) {
          console.log(`장소 검색 재시도 중... (${retryCount + 1}/3)`);
          setTimeout(
            () => {
              searchNearbyPlaces(mapInstance, kakaoMaps, lat, lng, keyword, retryCount + 1);
            },
            1000 * (retryCount + 1)
          ); // 1초, 2초, 3초 간격으로 재시도
          return;
        }

        setError(`주변 장소를 검색하는데 실패했습니다 (상태: ${status})`);
        setPlaces([]);
      }
    };

    // 검색 실행
    if (keyword) {
      // 키워드 검색
      setCurrentSearchCategory(`"${keyword}" 검색 결과`);
      placesService.keywordSearch(keyword, placesSearchCB, {
        location: new kakaoMaps.LatLng(lat, lng),
        radius: 5000,
        sort: kakaoMaps.services.SortBy.DISTANCE,
      });
    } else {
      // 목적별 기본 카테고리 검색
      const defaultCategory = currentCategories[0]; // 첫 번째 카테고리를 기본으로 사용
      console.log(
        '사용자 목적:',
        userPurpose,
        '기본 카테고리:',
        defaultCategory.id,
        defaultCategory.name
      );

      // 현재 검색 카테고리 설정
      setCurrentSearchCategory(`${purposeInfo.label} > ${defaultCategory.name}`);

      let categoryCode = '';

      // 카테고리 ID에 따른 카카오맵 코드 매핑
      switch (defaultCategory.id) {
        case 'cafe':
          categoryCode = 'CE7'; // 카페
          break;
        case 'restaurant':
          categoryCode = 'FD6'; // 음식점
          break;
        case 'tourist':
          // 관광명소는 키워드 검색이 더 정확함
          placesService.keywordSearch('관광', placesSearchCB, {
            location: new kakaoMaps.LatLng(lat, lng),
            radius: 5000,
            sort: kakaoMaps.services.SortBy.DISTANCE,
          });
          return;
        case 'culture':
          categoryCode = 'CT1'; // 문화시설
          break;
        case 'transport':
          categoryCode = 'SW8'; // 지하철
          break;
        case 'hotel':
          categoryCode = 'AD5'; // 숙박
          break;
        case 'business':
          // 사무공간은 키워드 검색이 더 정확함
          placesService.keywordSearch('사무실', placesSearchCB, {
            location: new kakaoMaps.LatLng(lat, lng),
            radius: 5000,
            sort: kakaoMaps.services.SortBy.DISTANCE,
          });
          return;
        case 'bank':
          categoryCode = 'BK9'; // 은행
          break;
        case 'government':
          categoryCode = 'PO3'; // 공공기관
          break;
        case 'university':
          categoryCode = 'SC4'; // 학교
          break;
        case 'hospital':
          categoryCode = 'HP8'; // 병원
          break;
        case 'market':
          categoryCode = 'MT1'; // 마트
          break;
        case 'library':
          categoryCode = 'CT1'; // 도서관 (문화시설)
          break;
        case 'language':
          categoryCode = 'AC5'; // 학원
          break;
        default:
          categoryCode = 'FD6'; // 기본값은 음식점
      }

      placesService.categorySearch(categoryCode, placesSearchCB, {
        location: new kakaoMaps.LatLng(lat, lng),
        radius: 3000,
        sort: kakaoMaps.services.SortBy.DISTANCE,
      });
    }
  };

  // 검색어 핸들러
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  // 검색 실행
  const handleSearch = () => {
    if (!map || !userLocation) return;

    const kakaoMaps = window.kakao.maps;
    searchNearbyPlaces(
      map,
      kakaoMaps,
      userLocation.latitude,
      userLocation.longitude,
      searchKeyword
    );
  };

  // 카테고리 검색 함수 (재시도 로직 포함)
  const searchByCategory = (categoryCode: string, categoryId: string, retryCount: number = 0) => {
    if (!map || !userLocation) return;

    const kakaoMaps = window.kakao.maps;

    // API 호출 간격 제한
    const now = Date.now();
    const timeSinceLastSearch = now - lastSearchTimeRef.current;
    const minInterval = 500;

    if (timeSinceLastSearch < minInterval) {
      setTimeout(() => {
        searchByCategory(categoryCode, categoryId, retryCount);
      }, minInterval - timeSinceLastSearch);
      return;
    }

    lastSearchTimeRef.current = now;

    // 이전 마커 제거
    if (markers.length > 0) {
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);
    }

    // 장소 검색 객체 생성
    const placesService = new kakaoMaps.services.Places();

    // 카테고리 검색
    placesService.categorySearch(
      categoryCode,
      (result: any, status: any) => {
        if (status === kakaoMaps.services.Status.OK) {
          // 결과 처리 및 마커 표시
          const newPlaces: Place[] = result.map((place: any, index: number) => {
            // 마커 생성
            const marker = new kakaoMaps.Marker({
              map: map,
              position: new kakaoMaps.LatLng(place.y, place.x),
            });

            // 마커 클릭 이벤트
            kakaoMaps.event.addListener(marker, 'click', function () {
              // 인포윈도우 생성
              const infowindow = new kakaoMaps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
              });
              infowindow.open(map, marker);

              // 3초 후 인포윈도우 닫기
              setTimeout(() => infowindow.close(), 3000);
            });

            // 마커 배열에 추가
            setMarkers(prev => [...prev, marker]);

            return {
              id: index.toString(),
              name: place.place_name,
              category: categoryId,
              rating: (Math.random() * 2 + 3).toFixed(1),
              distance: `${(place.distance / 1000).toFixed(1)}km`,
              latitude: place.y,
              longitude: place.x,
              address: place.address_name,
              place_url: place.place_url,
            };
          });

          setPlaces(newPlaces);
        } else {
          console.error('카테고리 검색 실패:', status, '재시도 횟수:', retryCount);

          // 401 에러 또는 기타 일시적 오류인 경우 재시도
          if (retryCount < 2 && (status === kakaoMaps.services.Status.ERROR || !status)) {
            console.log(`카테고리 검색 재시도 중... (${retryCount + 1}/3)`);
            setTimeout(
              () => {
                searchByCategory(categoryCode, categoryId, retryCount + 1);
              },
              1000 * (retryCount + 1)
            ); // 1초, 2초, 3초 간격으로 재시도
            return;
          }

          setError(`카테고리 검색에 실패했습니다 (상태: ${status})`);
          setPlaces([]);
        }
      },
      {
        location: new kakaoMaps.LatLng(userLocation.latitude, userLocation.longitude),
        radius: 5000,
        sort: kakaoMaps.services.SortBy.DISTANCE,
      }
    );
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    // 현재 목적의 카테고리에서 찾기
    const category = currentCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    // 현재 검색 카테고리 설정
    setCurrentSearchCategory(`${purposeInfo.label} > ${category.name}`);

    // 카테고리별 카카오맵 코드 매핑
    let categoryCode = '';
    switch (categoryId) {
      case 'cafe':
        categoryCode = 'CE7'; // 카페
        break;
      case 'restaurant':
        categoryCode = 'FD6'; // 음식점
        break;
      case 'culture':
        categoryCode = 'CT1'; // 문화시설
        break;
      case 'tourist':
        categoryCode = 'AT4'; // 관광명소
        break;
      case 'bank':
        categoryCode = 'BK9'; // 은행
        break;
      case 'hospital':
        categoryCode = 'HP8'; // 병원
        break;
      case 'market':
        categoryCode = 'MT1'; // 마트
        break;
      case 'transport':
        categoryCode = 'SW8'; // 지하철
        break;
      case 'hotel':
        categoryCode = 'AD5'; // 숙박
        break;
      case 'government':
        categoryCode = 'PO3'; // 공공기관
        break;
      case 'university':
        categoryCode = 'SC4'; // 학교
        break;
      case 'library':
        categoryCode = 'CT1'; // 도서관 (문화시설)
        break;
      case 'language':
        categoryCode = 'AC5'; // 학원
        break;
      default:
        // 키워드 검색으로 대체
        if (userLocation && map) {
          searchNearbyPlaces(
            map,
            window.kakao.maps,
            userLocation.latitude,
            userLocation.longitude,
            category.keyword
          );
        }
        return;
    }

    if (categoryCode) {
      searchByCategory(categoryCode, categoryId);
    }
  };

  // 내 위치로 이동
  const handleMoveToMyLocation = () => {
    if (!map || !userLocation) return;

    const kakaoMaps = window.kakao.maps;
    const userLatLng = new kakaoMaps.LatLng(userLocation.latitude, userLocation.longitude);
    map.setCenter(userLatLng);
    map.setLevel(5);

    // 약간의 지연 후 중심점 재설정 (확실한 이동)
    setTimeout(() => {
      map.setCenter(userLatLng);
      map.setLevel(5);
    }, 300);
  };

  // 지도 모달 열기
  const openMapModal = () => {
    setIsMapModalOpen(true);
  };

  // 지도 모달 닫기
  const closeMapModal = () => {
    // 선택된 장소 초기화
    setSelectedPlace(null);

    // 모달 닫기
    setIsMapModalOpen(false);
  };

  // 장소 URL로 이동
  const openPlaceUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // 전체화면용 장소 마커 생성 (길찾기 기능 포함)
  const createPlaceMarkersForFullMap = (mapInstance: any, kakaoMaps: any, placeList: Place[]) => {
    const newMarkers: any[] = [];

    placeList.forEach(place => {
      if (place.latitude && place.longitude) {
        const marker = new kakaoMaps.Marker({
          map: mapInstance,
          position: new kakaoMaps.LatLng(place.latitude, place.longitude),
        });

        // 마커 클릭 이벤트 - 길찾기 기능이 포함된 인포윈도우
        kakaoMaps.event.addListener(marker, 'click', function () {
          // 길찾기 버튼이 포함된 인포윈도우 컨텐츠 생성
          const contentStr = `
            <div style="padding:8px;width:220px;font-size:12px;">
              <div style="font-weight:bold;margin-bottom:4px;">${place.name}</div>
              <div style="font-size:11px;color:#666;margin-bottom:6px;">${place.address || ''}</div>
              <div style="display:flex;gap:4px;">
                <a href="javascript:void(0);" onclick="window.kakaoMapDirections('${place.id}');" 
                   style="display:flex;align-items:center;justify-content:center;padding:4px 6px;background:#1976d2;color:#fff;border-radius:4px;text-decoration:none;font-size:11px;">
                  <span style="margin-right:2px;">길찾기</span>
                </a>
                <a href="${place.place_url}" target="_blank" 
                   style="display:flex;align-items:center;justify-content:center;padding:4px 6px;background:#f5f5f5;color:#333;border-radius:4px;text-decoration:none;font-size:11px;">
                  <span>자세히 보기</span>
                </a>
              </div>
            </div>
          `;

          // 인포윈도우 생성
          const infowindow = new kakaoMaps.InfoWindow({
            content: contentStr,
            removable: true,
          });

          // 인포윈도우 표시
          infowindow.open(mapInstance, marker);
        });

        newMarkers.push(marker);
      }
    });

    return newMarkers;
  };

  // 간단한 길찾기 링크 생성 함수
  const handleDirections = (place: Place) => {
    if (userLocation && place.latitude && place.longitude) {
      const url = getKakaoMapDirectionsUrl(
        '내 위치',
        userLocation.latitude,
        userLocation.longitude,
        place.name,
        place.latitude,
        place.longitude
      );
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...widgetPaperBase,
        background: widgetGradients.green,
        p: 2,
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: `${purposeInfo.color}20`,
              color: purposeInfo.color,
              width: 28,
              height: 28,
              mr: 1,
            }}
          >
            {purposeInfo.icon}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={600}>
            {purposeInfo.label} 맞춤 장소
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 주변장소 보기 버튼 */}
          <IconButton
            size="small"
            onClick={() => setIsPlacesModalOpen(true)}
            sx={{
              bgcolor: '#f0f0f0',
              '&:hover': { bgcolor: '#e0e0e0' },
              position: 'relative',
            }}
            title="주변 장소 보기"
          >
            <CategoryIcon fontSize="small" color="primary" />
            {places.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                }}
              >
                {places.length}
              </Box>
            )}
          </IconButton>
          {userLocation && (
            <IconButton
              size="small"
              onClick={handleMoveToMyLocation}
              sx={{ bgcolor: '#f0f0f0', '&:hover': { bgcolor: '#e0e0e0' } }}
            >
              <MyLocationIcon fontSize="small" color="primary" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* 검색 입력란과 카테고리 필터 */}
      <Box sx={{ mb: 2 }}>
        {/* 검색 입력란 */}
        <TextField
          placeholder="장소 검색"
          variant="outlined"
          size="small"
          fullWidth
          value={searchKeyword}
          onChange={handleSearchChange}
          sx={{ mb: 1.5 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* 카테고리 선택 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {currentCategories.map(category => (
            <Chip
              key={category.id}
              icon={category.icon}
              label={category.name}
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                bgcolor: '#f5f5f5',
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 지도 영역 - 전체 공간 사용 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {/* 범례 정보 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          {/* 현재 검색 카테고리 표시 */}
          {currentSearchCategory && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
              }}
            >
              📍 {currentSearchCategory}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: '#4dabff',
                  borderRadius: '50%',
                  border: '1px solid #0078ff',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                내 위치
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: '#fff',
                  borderRadius: '50%',
                  border: '1px solid #333',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                장소
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 지도 컨테이너 */}
        <Box
          ref={mapContainerRef}
          sx={{
            flex: 1,
            width: '100%',
            bgcolor: '#e9ecef',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 300, md: 'auto' }, // 모바일에서는 최소 높이 300px, 데스크톱에서는 자동
            height: '100%',
            maxHeight: { xs: 400, md: '100%' }, // 모바일에서 최대 높이 제한
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 10,
              }}
            >
              <CircularProgress size={36} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {initState === 'pending'
                  ? '준비 중...'
                  : initState === 'loading'
                    ? '지도를 불러오는 중...'
                    : '지도 로딩 중...'}
              </Typography>
            </Box>
          )}

          {error && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 10,
                p: 2,
              }}
            >
              <Typography color="error" align="center" sx={{ mb: 1 }}>
                {error}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
                sx={{ mt: 1 }}
              >
                새로고침
              </Button>
            </Box>
          )}

          {/* 확대 아이콘 */}
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(255,255,255,0.8)',
              zIndex: 5,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
            onClick={openMapModal}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* 전체화면 지도 모달 */}
      <Modal
        open={isMapModalOpen}
        onClose={closeMapModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            height: '80%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6">지도 보기</Typography>
            <IconButton onClick={closeMapModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {error && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              action={
                selectedPlace &&
                userLocation &&
                selectedPlace.latitude &&
                selectedPlace.longitude && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      if (
                        selectedPlace &&
                        userLocation &&
                        selectedPlace.latitude &&
                        selectedPlace.longitude
                      ) {
                        const url = getKakaoMapDirectionsUrl(
                          '내 위치',
                          userLocation.latitude,
                          userLocation.longitude,
                          selectedPlace.name,
                          selectedPlace.latitude,
                          selectedPlace.longitude
                        );
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    길찾기
                  </Button>
                )
              }
            >
              {error}
            </Alert>
          )}

          <Box
            ref={fullMapContainerRef}
            sx={{
              flex: 1,
              width: '100%',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          />
        </Box>
      </Modal>

      {/* 주변장소 모달 */}
      <Modal
        open={isPlacesModalOpen}
        onClose={() => setIsPlacesModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isPlacesModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '600px' },
              maxHeight: '80%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ mr: 1 }} />
                {places.length > 0 ? `주변 장소 (${places.length})` : '추천 장소'}
              </Typography>
              <IconButton onClick={() => setIsPlacesModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* 현재 검색 카테고리 표시 */}
            {currentSearchCategory && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: 'block',
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.9rem',
                }}
              >
                📍 {currentSearchCategory}
              </Typography>
            )}

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                pr: 1,
                // 스크롤바 스타일 개선
                '&::-webkit-scrollbar': {
                  width: '8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#bdbdbd',
                  borderRadius: '4px',
                },
              }}
            >
              {places.length > 0 ? (
                places.map(place => (
                  <Box
                    key={place.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      },
                      transition: 'all 0.2s',
                    }}
                    onClick={() => {
                      handlePlaceClick(place);
                      setIsPlacesModalOpen(false);
                    }}
                  >
                    <PlaceIcon
                      sx={{ color: getCategoryColor(place.category), mr: 2, fontSize: '2rem' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                        {place.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                      >
                        <DirectionsIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        {place.distance}
                      </Typography>
                      {place.address && (
                        <Typography variant="caption" color="text.secondary">
                          {place.address}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={getCategoryName(place.category)}
                        size="medium"
                        sx={{
                          height: 28,
                          fontSize: '0.8rem',
                          bgcolor: getCategoryBgColor(place.category),
                          color: getCategoryColor(place.category),
                        }}
                      />
                      <IconButton
                        size="medium"
                        onClick={e => {
                          e.stopPropagation();
                          handleDirections(place);
                        }}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                        title="길찾기"
                      >
                        <DirectionsIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 6,
                    textAlign: 'center',
                  }}
                >
                  <SearchIcon sx={{ fontSize: '3rem', color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {loading ? '장소를 검색중입니다...' : '검색 결과가 없습니다'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loading ? '잠시만 기다려주세요' : '다른 카테고리를 선택해보세요'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};

// 카테고리별 색상 및 이름
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'cafe':
      return '#795548';
    case 'restaurant':
      return '#e53935';
    case 'culture':
      return '#9c27b0';
    case 'tourist':
      return '#1976d2';
    default:
      return '#757575';
  }
};

const getCategoryBgColor = (category: string): string => {
  switch (category) {
    case 'cafe':
      return '#efebe9';
    case 'restaurant':
      return '#ffebee';
    case 'culture':
      return '#f3e5f5';
    case 'tourist':
      return '#e3f2fd';
    default:
      return '#f5f5f5';
  }
};

const getCategoryName = (category: string): string => {
  switch (category) {
    case 'cafe':
      return '카페';
    case 'restaurant':
      return '맛집';
    case 'culture':
      return '문화';
    case 'tourist':
      return '관광';
    default:
      return '';
  }
};

// 커스텀 지도 스타일 적용 함수
const applyCustomMapStyle = (mapInstance: any) => {
  try {
    // 지도 인스턴스 유효성 검사
    if (!mapInstance || typeof mapInstance.getContainer !== 'function') {
      console.warn('지도 인스턴스가 완전히 초기화되지 않았습니다. 스타일 적용을 건너뜁니다.');
      return;
    }

    // 기본 타일 스타일 개선
    const mapContainer = mapInstance.getContainer();
    if (!mapContainer) {
      console.warn('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }

    const mapCanvas = mapContainer.querySelector('.map_canvas') || mapContainer;

    // 약간의 필터 효과 추가로 더 현대적인 느낌 부여
    if (mapCanvas) {
      mapCanvas.style.filter = 'saturate(1.1) contrast(1.05)';
    }
  } catch (error) {
    console.error('지도 스타일 적용 실패:', error);
  }
};

// 향상된 지도 스타일 적용 (야간 모드 스타일)
const applyEnhancedMapStyle = (mapInstance: any) => {
  try {
    // 지도 인스턴스 유효성 검사
    if (!mapInstance || typeof mapInstance.getContainer !== 'function') {
      console.warn(
        '지도 인스턴스가 완전히 초기화되지 않았습니다. 향상된 스타일 적용을 건너뜁니다.'
      );
      return;
    }

    // 확장된 스타일 적용
    const mapContainer = mapInstance.getContainer();
    if (!mapContainer) {
      console.warn('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }

    // 기존 오버레이 제거 (중복 방지)
    const existingOverlays = mapContainer.querySelectorAll(
      '.map-style-overlay, .map-shadow-overlay'
    );
    existingOverlays.forEach(overlay => overlay.remove());

    // 전체 지도에 스타일 오버레이 추가
    const styleOverlay = document.createElement('div');
    styleOverlay.className = 'map-style-overlay';
    styleOverlay.style.position = 'absolute';
    styleOverlay.style.top = '0';
    styleOverlay.style.left = '0';
    styleOverlay.style.width = '100%';
    styleOverlay.style.height = '100%';
    styleOverlay.style.pointerEvents = 'none';
    styleOverlay.style.zIndex = '1';
    styleOverlay.style.backdropFilter = 'brightness(1.05) contrast(1.1) saturate(1.2)';
    styleOverlay.style.boxShadow = 'inset 0 0 50px rgba(0,100,255,0.1)';
    styleOverlay.style.background =
      'linear-gradient(135deg, rgba(0,50,120,0.05) 0%, rgba(0,0,0,0) 100%)';
    mapContainer.appendChild(styleOverlay);

    // 3D 효과를 위한 그림자 오버레이
    const shadowOverlay = document.createElement('div');
    shadowOverlay.className = 'map-shadow-overlay';
    shadowOverlay.style.position = 'absolute';
    shadowOverlay.style.top = '0';
    shadowOverlay.style.left = '0';
    shadowOverlay.style.width = '100%';
    shadowOverlay.style.height = '100%';
    shadowOverlay.style.pointerEvents = 'none';
    shadowOverlay.style.zIndex = '0';
    shadowOverlay.style.boxShadow = 'inset 0 0 100px rgba(0,0,0,0.2)';
    mapContainer.appendChild(shadowOverlay);
  } catch (error) {
    console.error('향상된 지도 스타일 적용 실패:', error);
  }
};

export default KakaoMapWidget;
