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
import {
  loadKakaoMapScript,
  getAddressFromCoords,
  getKakaoMapDirectionsUrl,
  createKakaoMap,
} from '../../config/kakaoMap';
import { env } from '../../config/env';
import { widgetPaperBase, widgetGradients } from './theme/dashboardWidgetTheme';

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

  // 길찾기 관련 상태 추가
  const [isRouteMode, setIsRouteMode] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routePolyline, setRoutePolyline] = useState<any>(null);
  const [travelMode, setTravelMode] = useState<'TRANSIT' | 'WALKING'>('TRANSIT');

  // 관심 장소 카테고리
  const categories = [
    { id: 'cafe', name: '카페', icon: <LocalCafeIcon fontSize="small" /> },
    { id: 'restaurant', name: '맛집', icon: <RestaurantIcon fontSize="small" /> },
    { id: 'culture', name: '문화', icon: <TheaterComedyIcon fontSize="small" /> },
    { id: 'tourist', name: '관광', icon: <AirplanemodeActiveIcon fontSize="small" /> },
  ];

  // 지도 초기화 상태 추가
  const [initState, setInitState] = useState<'pending' | 'loading' | 'success' | 'error'>(
    'pending'
  );
  const initAttemptRef = useRef<number>(0); // 초기화 시도 횟수 추적
  const mapInitializedRef = useRef<boolean>(false); // 지도 초기화 완료 여부

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
        mapContainerRef.current.style.minHeight = '250px';
        // 리플로우 유도
        mapContainerRef.current.getBoundingClientRect();
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
        level: 3,
      });

      console.log('지도 인스턴스 생성 성공');
      setMap(mapInstance);
      mapInitializedRef.current = true;

      // 사용자 위치 요청
      if (window.kakao && window.kakao.maps) {
        getUserLocation(mapInstance, window.kakao.maps);
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
          if (!place || !place.latitude || !place.longitude) return;

          setSelectedPlace(place);
          setIsRouteMode(true);
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

          // 경로 폴리라인 제거
          if (routePolyline) {
            routePolyline.setMap(null);
          }

          // 길찾기 모드 초기화
          setIsRouteMode(false);
          setSelectedPlace(null);
          setRouteInfo(null);
          setRouteError(null);
        } catch (error) {
          console.error('이벤트 리스너 제거 실패:', error);
        }
      }
    };
  }, [isMapModalOpen, userLocation, places]);

  // 길찾기 모드가 변경될 때마다 실행
  useEffect(() => {
    if (!isRouteMode || !selectedPlace || !fullMap || !userLocation) return;

    // 길찾기 실행
    drawRoute(
      fullMap,
      { lat: userLocation.latitude, lng: userLocation.longitude },
      { lat: selectedPlace.latitude || 0, lng: selectedPlace.longitude || 0 },
      selectedPlace.name
    );
  }, [isRouteMode, selectedPlace, fullMap, userLocation, travelMode]);

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

          setUserLocation({ latitude, longitude });

          try {
            // 지도 중심 이동
            const userLatLng = new kakaoMaps.LatLng(latitude, longitude);
            mapInstance.setCenter(userLatLng);

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
          setTimeout(() => {
            searchNearbyPlaces(mapInstance, kakaoMaps, lat, lng, keyword, retryCount + 1);
          }, 1000 * (retryCount + 1)); // 1초, 2초, 3초 간격으로 재시도
          return;
        }
        
        setError(`주변 장소를 검색하는데 실패했습니다 (상태: ${status})`);
        setPlaces([]);
      }
    };

    // 검색 실행
    if (keyword) {
      // 키워드 검색
      placesService.keywordSearch(keyword, placesSearchCB, {
        location: new kakaoMaps.LatLng(lat, lng),
        radius: 5000,
        sort: kakaoMaps.services.SortBy.DISTANCE,
      });
    } else {
      // 카테고리 기반 검색 (주변 맛집)
      placesService.categorySearch('FD6', placesSearchCB, {
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
            setTimeout(() => {
              searchByCategory(categoryCode, categoryId, retryCount + 1);
            }, 1000 * (retryCount + 1)); // 1초, 2초, 3초 간격으로 재시도
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
    let categoryCode = '';

    // 카테고리 코드 변환
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
      default:
        categoryCode = '';
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
    map.setLevel(3);
  };

  // 지도 모달 열기
  const openMapModal = () => {
    setIsMapModalOpen(true);
  };

  // 지도 모달 닫기
  const closeMapModal = () => {
    // 길찾기 모드 종료
    handleExitRouteMode();

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

  // 길찾기 경로 그리기 함수
  const drawRoute = (
    mapInstance: any,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    destinationName: string
  ) => {
    if (!mapInstance || !window.kakao) return;

    const kakaoMaps = window.kakao.maps;

    // 기존 경로 제거
    if (routePolyline) {
      routePolyline.setMap(null);
    }

    setRouteError(null);
    setRouteInfo(null);

    try {
      // Directions 서비스 사용 전 검증
      if (!kakaoMaps.services || !kakaoMaps.services.Directions) {
        throw new Error(
          '카카오맵 Directions API를 사용할 수 없습니다. 라이브러리가 로드되지 않았습니다.'
        );
      }

      // 지도 레벨 조정
      mapInstance.setLevel(5);

      // 출발지와 도착지 좌표
      const startPoint = new kakaoMaps.LatLng(origin.lat, origin.lng);
      const endPoint = new kakaoMaps.LatLng(destination.lat, destination.lng);

      // 지도 중심 위치 업데이트 (출발지와 도착지 중간 지점)
      const bounds = new kakaoMaps.LatLngBounds();
      bounds.extend(startPoint);
      bounds.extend(endPoint);
      mapInstance.setBounds(bounds);

      // 직선 거리 계산 (백업용)
      const distanceInMeters = kakaoMaps.geometry.getDistance(startPoint, endPoint);
      const directDistance = (distanceInMeters / 1000).toFixed(1);

      try {
        // 경로 서비스 객체 생성
        const directions = new kakaoMaps.services.Directions();

        // 경로 옵션 (대중교통/보행자)
        const directionOptions = {
          origin: {
            x: origin.lng,
            y: origin.lat,
          },
          destination: {
            x: destination.lng,
            y: destination.lat,
          },
          // 이동수단 모드 설정 (travelMode 상태에 따라 결정)
          waypoints: [],
          priority: 'RECOMMEND', // 추천 경로
          // 도보 또는 대중교통 모드 사용
          // TRANSIT: 대중교통, WALKING: 도보
          mode: travelMode,
        };

        // 경로 검색 요청
        directions.route(directionOptions, (result: any, status: any) => {
          console.log('경로 검색 결과 상태:', status);
          console.log('경로 검색 결과:', result);

          if (
            status === kakaoMaps.services.Status.OK &&
            result &&
            result.routes &&
            result.routes.length > 0
          ) {
            const firstRoute = result.routes[0];

            // 경로 정보 표시
            const totalDistance = (firstRoute.summary.distance / 1000).toFixed(1); // km 단위로 변환
            const totalDuration = Math.round(firstRoute.summary.duration / 60); // 분 단위로 변환

            setRouteInfo({
              distance: `${totalDistance}km`,
              duration: `${totalDuration}분`,
            });

            // 경로 그리기
            const path: any[] = [];
            firstRoute.sections.forEach((section: any) => {
              section.roads.forEach((road: any) => {
                road.vertexes.forEach((vertex: number, index: number) => {
                  if (index % 2 === 0) {
                    const lat = road.vertexes[index + 1];
                    const lng = vertex;
                    path.push(new kakaoMaps.LatLng(lat, lng));
                  }
                });
              });
            });

            // 폴리라인 그리기
            const polyline = new kakaoMaps.Polyline({
              path: path,
              strokeWeight: 5,
              strokeColor: '#1976d2',
              strokeStyle: 'solid',
              strokeOpacity: 0.7,
            });

            polyline.setMap(mapInstance);
            setRoutePolyline(polyline);
          } else {
            console.error('길찾기 실패:', status);
            setRouteError('경로를 찾을 수 없습니다. 직선 거리를 표시합니다.');

            // 대체 방법: 직선 경로 표시
            const polyline = new kakaoMaps.Polyline({
              path: [
                new kakaoMaps.LatLng(origin.lat, origin.lng),
                new kakaoMaps.LatLng(destination.lat, destination.lng),
              ],
              strokeWeight: 5,
              strokeColor: '#ff6b6b',
              strokeStyle: 'dashed',
              strokeOpacity: 0.7,
            });

            polyline.setMap(mapInstance);
            setRoutePolyline(polyline);

            // 거리 직접 계산 (직선 거리)
            setRouteInfo({
              distance: `약 ${directDistance}km (직선 거리)`,
              duration: '예상 불가',
            });
          }
        });
      } catch (dirError) {
        console.error('Directions API 호출 오류:', dirError);
        setRouteError('경로 서비스 호출 실패. 직선 거리를 표시합니다.');

        // 오류 발생 시 직선 경로로 대체
        const polyline = new kakaoMaps.Polyline({
          path: [
            new kakaoMaps.LatLng(origin.lat, origin.lng),
            new kakaoMaps.LatLng(destination.lat, destination.lng),
          ],
          strokeWeight: 5,
          strokeColor: '#ff6b6b',
          strokeStyle: 'dashed',
          strokeOpacity: 0.7,
        });

        polyline.setMap(mapInstance);
        setRoutePolyline(polyline);

        // 직선 거리 표시
        setRouteInfo({
          distance: `약 ${directDistance}km (직선 거리)`,
          duration: '예상 불가',
        });
      }
    } catch (error) {
      console.error('길찾기 경로 그리기 실패:', error);
      setRouteError('경로를 그리는데 실패했습니다.');
    }
  };

  // 길찾기 모드 종료
  const handleExitRouteMode = () => {
    // 경로 제거
    if (routePolyline && fullMap) {
      routePolyline.setMap(null);
    }

    // 상태 초기화
    setRoutePolyline(null);
    setIsRouteMode(false);
    setSelectedPlace(null);
    setRouteInfo(null);
    setRouteError(null);
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
        <Typography variant="subtitle1" fontWeight={600}>
          내 주변 추천 장소
        </Typography>

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
          {categories.map(category => (
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

      {/* 지도와 장소 목록을 나란히 배치하는 컨테이너 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          flex: 1,
          minHeight: 0, // flex 자식 요소가 부모 컨테이너를 넘지 않도록 설정
        }}
      >
        {/* 지도 영역 - 새로고침 버튼 강화 */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', sm: '3 1 0' },
            minHeight: { xs: 250, sm: 'auto' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 범례 정보 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
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
              minHeight: 250,
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

        {/* 추천 장소 목록 - 별도 영역으로 분리 */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', sm: '2 1 0' },
            minHeight: { xs: 200, sm: 'auto' },
            maxHeight: { xs: 300, sm: 'none' },
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
          >
            <CategoryIcon fontSize="small" sx={{ mr: 0.5 }} />
            {places.length > 0 ? `주변 장소 (${places.length})` : '추천 장소'}
          </Typography>

          <Divider sx={{ mb: 1.5 }} />

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
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor:
                      selectedPlace?.id === place.id
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'background.paper',
                    border: '1px solid',
                    borderColor: selectedPlace?.id === place.id ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    },
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handlePlaceClick(place)}
                >
                  <PlaceIcon sx={{ color: getCategoryColor(place.category), mr: 1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {place.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <DirectionsIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                      {place.distance}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 0.5,
                    }}
                  >
                    <Chip
                      label={getCategoryName(place.category)}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        bgcolor: getCategoryBgColor(place.category),
                        color: getCategoryColor(place.category),
                      }}
                    />
                    {selectedPlace?.id === place.id && (
                      <IconButton
                        size="small"
                        onClick={e => {
                          e.stopPropagation();
                          setIsRouteMode(true);
                        }}
                        sx={{
                          p: 0.5,
                          bgcolor: 'primary.light',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.main' },
                        }}
                      >
                        <DirectionsIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                {loading ? '장소를 검색중입니다...' : '검색 결과가 없습니다'}
              </Typography>
            )}
          </Box>
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
            {isRouteMode ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" onClick={handleExitRouteMode}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h6">{selectedPlace?.name || '장소'} 길찾기</Typography>
                </Box>

                {/* 도보/대중교통 선택 버튼 그룹 추가 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto', ml: 2 }}>
                  <Button
                    variant={travelMode === 'WALKING' ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<DirectionsWalkIcon fontSize="small" />}
                    onClick={() => {
                      setTravelMode('WALKING');
                      // 도보 모드로 경로 다시 그리기
                      if (
                        userLocation &&
                        selectedPlace &&
                        selectedPlace.latitude &&
                        selectedPlace.longitude
                      ) {
                        drawRoute(
                          fullMap,
                          { lat: userLocation.latitude, lng: userLocation.longitude },
                          { lat: selectedPlace.latitude, lng: selectedPlace.longitude },
                          selectedPlace.name
                        );
                      }
                    }}
                    sx={{
                      borderRadius: '4px 0 0 4px',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      height: 32,
                      px: 1,
                    }}
                  >
                    도보
                  </Button>
                  <Button
                    variant={travelMode === 'TRANSIT' ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<DirectionsCarIcon fontSize="small" />}
                    onClick={() => {
                      setTravelMode('TRANSIT');
                      // 대중교통 모드로 경로 다시 그리기
                      if (
                        userLocation &&
                        selectedPlace &&
                        selectedPlace.latitude &&
                        selectedPlace.longitude
                      ) {
                        drawRoute(
                          fullMap,
                          { lat: userLocation.latitude, lng: userLocation.longitude },
                          { lat: selectedPlace.latitude, lng: selectedPlace.longitude },
                          selectedPlace.name
                        );
                      }
                    }}
                    sx={{
                      borderRadius: '0 4px 4px 0',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      height: 32,
                      px: 1,
                    }}
                  >
                    차량/대중교통
                  </Button>
                </Box>

                {routeInfo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">
                      <DirectionsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      거리: {routeInfo.distance} (예상 시간: {routeInfo.duration})
                    </Typography>

                    {/* 카카오맵 길찾기 버튼 추가 */}
                    {selectedPlace && userLocation && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        startIcon={<OpenInNewIcon fontSize="small" />}
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
                        sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: '0.8rem' }}
                      >
                        카카오맵에서 길찾기
                      </Button>
                    )}
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="h6">지도 보기</Typography>
            )}
            <IconButton onClick={closeMapModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {routeError && (
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
                    카카오맵에서 열기
                  </Button>
                )
              }
            >
              {routeError}
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
      console.warn('지도 인스턴스가 완전히 초기화되지 않았습니다. 향상된 스타일 적용을 건너뜁니다.');
      return;
    }

    // 확장된 스타일 적용
    const mapContainer = mapInstance.getContainer();
    if (!mapContainer) {
      console.warn('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }

    // 기존 오버레이 제거 (중복 방지)
    const existingOverlays = mapContainer.querySelectorAll('.map-style-overlay, .map-shadow-overlay');
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
