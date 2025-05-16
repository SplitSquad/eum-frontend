import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip, useTheme, useMediaQuery, } from '@mui/material';
// 지역 데이터 - 수도권
const capitalRegions = [
    {
        region: '서울',
        subRegions: [
            '강남구',
            '강동구',
            '강북구',
            '강서구',
            '관악구',
            '광진구',
            '구로구',
            '금천구',
            '노원구',
            '도봉구',
            '동대문구',
            '동작구',
            '마포구',
            '서대문구',
            '서초구',
            '성동구',
            '성북구',
            '송파구',
            '양천구',
            '영등포구',
            '용산구',
            '은평구',
            '종로구',
            '중구',
            '중랑구',
        ],
    },
    {
        region: '경기',
        subRegions: [
            '고양시',
            '과천시',
            '광명시',
            '광주시',
            '구리시',
            '군포시',
            '김포시',
            '남양주시',
            '동두천시',
            '부천시',
            '성남시',
            '수원시',
            '시흥시',
            '안산시',
            '안성시',
            '안양시',
            '양주시',
            '오산시',
            '용인시',
            '의왕시',
            '의정부시',
            '이천시',
            '파주시',
            '평택시',
            '포천시',
            '하남시',
            '화성시',
        ],
    },
    {
        region: '인천',
        subRegions: ['계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구'],
    },
];
// 지역 데이터 - 그 외 지역
const otherRegions = [
    {
        region: '강원',
        subRegions: [
            '강릉시',
            '동해시',
            '삼척시',
            '속초시',
            '원주시',
            '춘천시',
            '태백시',
            '홍천군',
            '횡성군',
            '영월군',
            '평창군',
            '정선군',
            '철원군',
            '화천군',
            '양구군',
            '인제군',
            '고성군',
            '양양군',
        ],
    },
    {
        region: '충북',
        subRegions: [
            '청주시',
            '충주시',
            '제천시',
            '보은군',
            '옥천군',
            '영동군',
            '진천군',
            '괴산군',
            '음성군',
            '단양군',
        ],
    },
    {
        region: '충남',
        subRegions: [
            '천안시',
            '공주시',
            '보령시',
            '아산시',
            '서산시',
            '논산시',
            '계룡시',
            '당진시',
            '금산군',
            '부여군',
            '서천군',
            '청양군',
            '홍성군',
            '예산군',
            '태안군',
        ],
    },
    { region: '대전', subRegions: ['대덕구', '동구', '서구', '유성구', '중구'] },
    { region: '세종', subRegions: ['세종특별자치시'] },
    {
        region: '전북',
        subRegions: [
            '전주시',
            '군산시',
            '익산시',
            '정읍시',
            '남원시',
            '김제시',
            '완주군',
            '진안군',
            '무주군',
            '장수군',
            '임실군',
            '순창군',
            '고창군',
            '부안군',
        ],
    },
    {
        region: '전남',
        subRegions: [
            '목포시',
            '여수시',
            '순천시',
            '나주시',
            '광양시',
            '담양군',
            '곡성군',
            '구례군',
            '고흥군',
            '보성군',
            '화순군',
            '장흥군',
            '강진군',
            '해남군',
            '영암군',
            '무안군',
            '함평군',
            '영광군',
            '장성군',
            '완도군',
            '진도군',
            '신안군',
        ],
    },
    { region: '광주', subRegions: ['광산구', '남구', '동구', '북구', '서구'] },
    {
        region: '경북',
        subRegions: [
            '포항시',
            '경주시',
            '김천시',
            '안동시',
            '구미시',
            '영주시',
            '영천시',
            '상주시',
            '문경시',
            '경산시',
            '군위군',
            '의성군',
            '청송군',
            '영양군',
            '영덕군',
            '청도군',
            '고령군',
            '성주군',
            '칠곡군',
            '예천군',
            '봉화군',
            '울진군',
            '울릉군',
        ],
    },
    {
        region: '경남',
        subRegions: [
            '창원시',
            '진주시',
            '통영시',
            '사천시',
            '김해시',
            '밀양시',
            '거제시',
            '양산시',
            '의령군',
            '함안군',
            '창녕군',
            '고성군',
            '남해군',
            '하동군',
            '산청군',
            '함양군',
            '거창군',
            '합천군',
        ],
    },
    {
        region: '대구',
        subRegions: ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
    },
    {
        region: '부산',
        subRegions: [
            '강서구',
            '금정구',
            '남구',
            '동구',
            '동래구',
            '부산진구',
            '북구',
            '사상구',
            '사하구',
            '서구',
            '수영구',
            '연제구',
            '영도구',
            '중구',
            '해운대구',
            '기장군',
        ],
    },
    { region: '울산', subRegions: ['남구', '동구', '북구', '중구', '울주군'] },
    { region: '제주', subRegions: ['제주시', '서귀포시'] },
];
// 모든 지역 통합
const allRegions = [{ region: '전체', subRegions: ['전체'] }, ...capitalRegions, ...otherRegions];
/**
 * 지역 선택 컴포넌트
 */
const RegionSelector = ({ selectedRegion, onChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // 현재 선택된 지역으로부터 대분류와 소분류 분리
    const [mainRegion, subRegion] = selectedRegion.includes('-')
        ? selectedRegion.split('-')
        : [selectedRegion, '전체'];
    // 현재 선택된 대분류에 해당하는 소분류 목록 가져오기
    const currentSubRegions = allRegions.find(r => r.region === mainRegion)?.subRegions || [];
    // 대분류 지역 변경 핸들러
    const handleMainRegionChange = (event) => {
        const newMainRegion = event.target.value;
        onChange(newMainRegion === '전체' ? '전체' : `${newMainRegion}`);
    };
    // 소분류 지역 변경 핸들러
    const handleSubRegionChange = (event) => {
        const newSubRegion = event.target.value;
        onChange(newSubRegion === '전체' ? mainRegion : `${mainRegion}-${newSubRegion}`);
    };
    return (_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", sx: { mb: 1, fontWeight: 600, color: '#666' }, children: "\uC9C0\uC5ED \uC120\uD0DD" }), _jsxs(Box, { sx: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }, children: [_jsxs(FormControl, { size: "small", sx: { minWidth: 120, flex: 1 }, children: [_jsx(InputLabel, { id: "main-region-label", children: "\uC9C0\uC5ED" }), _jsx(Select, { labelId: "main-region-label", value: mainRegion, label: "\uC9C0\uC5ED", onChange: handleMainRegionChange, sx: {
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FFD7D7',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FFAAA5',
                                    },
                                }, children: allRegions.map(region => (_jsx(MenuItem, { value: region.region, children: region.region }, region.region))) })] }), mainRegion !== '전체' && (_jsxs(FormControl, { size: "small", sx: { minWidth: 120, flex: 1 }, children: [_jsx(InputLabel, { id: "sub-region-label", children: "\uC138\uBD80 \uC9C0\uC5ED" }), _jsxs(Select, { labelId: "sub-region-label", value: subRegion, label: "\uC138\uBD80 \uC9C0\uC5ED", onChange: handleSubRegionChange, sx: {
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FFD7D7',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FFAAA5',
                                    },
                                }, children: [_jsxs(MenuItem, { value: "\uC804\uCCB4", children: [mainRegion, " \uC120\uD0DD\uD558\uC138\uC694"] }), currentSubRegions.map(subRegion => (_jsx(MenuItem, { value: subRegion, children: subRegion }, subRegion)))] })] }))] }), _jsx(Box, { sx: { mt: 1 }, children: _jsx(Chip, { label: selectedRegion === '전체'
                        ? '전국'
                        : subRegion === '전체' || subRegion === ''
                            ? mainRegion
                            : `${mainRegion} ${subRegion}`, size: "small", sx: {
                        bgcolor: '#FFAAA5',
                        color: 'white',
                        fontWeight: 600,
                    } }) })] }));
};
export default RegionSelector;
