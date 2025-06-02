import React, { useState, useMemo } from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
  Divider,
  ListSubheader,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import {
  COUNTRIES,
  POPULAR_COUNTRIES,
  COUNTRIES_BY_REGION,
  searchCountries,
  getCountryByCode,
  getCountryByName,
  type Country,
} from '../utils/countryUtils';

interface CountrySelectorProps {
  value: string;
  onChange: (countryCode: string, countryName: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  showSearch?: boolean;
  showRegions?: boolean;
  showPopular?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  label = '국가 선택',
  required = false,
  error = false,
  helperText,
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  showSearch = true,
  showRegions = true,
  showPopular = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 현재 선택된 국가 정보
  const selectedCountry = useMemo(() => {
    if (!value) return null;

    // 국가 코드로 먼저 찾기
    let country = getCountryByCode(value);

    // 국가명으로 찾기
    if (!country) {
      country = getCountryByName(value);
    }

    return country;
  }, [value]);

  // 검색된 국가 목록
  const filteredCountries = useMemo(() => {
    return searchCountries(searchQuery);
  }, [searchQuery]);

  // 표시할 국가 목록 구성
  const displayCountries = useMemo(() => {
    const countries = filteredCountries;

    if (!showRegions && !showPopular) {
      return countries;
    }

    const result: Array<Country | { type: 'header' | 'divider'; label?: string }> = [];

    // 인기 국가 섹션
    if (showPopular && searchQuery === '') {
      result.push({ type: 'header', label: '인기 국가' });
      POPULAR_COUNTRIES.forEach(country => {
        if (countries.includes(country)) {
          result.push(country);
        }
      });
      result.push({ type: 'divider' });
    }

    // 지역별 국가 섹션
    if (showRegions) {
      Object.entries(COUNTRIES_BY_REGION).forEach(([region, regionCountries]) => {
        const availableCountries = regionCountries.filter(country => countries.includes(country));

        if (availableCountries.length > 0) {
          result.push({ type: 'header', label: region });
          availableCountries.forEach(country => {
            result.push(country);
          });
        }
      });
    } else {
      // 지역별 표시 안 할 경우 전체 목록
      if (searchQuery !== '' || !showPopular) {
        result.push({ type: 'header', label: '전체 국가' });
        countries.forEach(country => {
          if (!showPopular || !POPULAR_COUNTRIES.includes(country)) {
            result.push(country);
          }
        });
      }
    }

    return result;
  }, [filteredCountries, searchQuery, showRegions, showPopular]);

  const handleCountrySelect = (country: Country) => {
    onChange(country.code, country.name);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <TextField
      select
      label={label}
      value={selectedCountry ? selectedCountry.code : ''}
      onChange={() => {}} // 실제 변경은 MenuItem에서 처리
      fullWidth={fullWidth}
      required={required}
      error={error}
      helperText={helperText}
      variant={variant}
      size={size}
      SelectProps={{
        displayEmpty: true,
        open: isOpen,
        onOpen: () => setIsOpen(true),
        onClose: () => {
          setIsOpen(false);
          setSearchQuery('');
        },
        renderValue: selected => {
          if (!selected || !selectedCountry) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <PublicIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              </Box>
            );
          }
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8, fontSize: '1.2rem' }}>{selectedCountry.flag}</span>
              {selectedCountry.name}
            </Box>
          );
        },
        MenuProps: {
          PaperProps: {
            sx: {
              maxHeight: 400,
              '& .MuiMenuItem-root': {
                py: 1,
              },
            },
          },
        },
      }}
      InputProps={{
        startAdornment: selectedCountry ? (
          <InputAdornment position="start">
            <span style={{ fontSize: '1.2rem' }}>{selectedCountry.flag}</span>
          </InputAdornment>
        ) : (
          <InputAdornment position="start"></InputAdornment>
        ),
      }}
    >
      {/* 검색 필드 */}
      {showSearch && (
        <Box sx={{ p: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
          <TextField
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onClick={e => e.stopPropagation()}
          />
        </Box>
      )}

      {/* 국가 목록 */}
      {displayCountries.map((item, index) => {
        if ('type' in item) {
          if (item.type === 'header') {
            return (
              <ListSubheader key={`header-${index}`} sx={{ bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
              </ListSubheader>
            );
          } else if (item.type === 'divider') {
            return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
          }
        } else {
          const country = item as Country;
          const isSelected = selectedCountry?.code === country.code;

          return (
            <MenuItem
              key={country.code}
              value={country.code}
              onClick={() => handleCountrySelect(country)}
              selected={isSelected}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                },
              }}
            >
              <span style={{ fontSize: '1.2rem', minWidth: '24px' }}>{country.flag}</span>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400 }}>
                  {country.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {country.englishName} ({country.code})
                </Typography>
              </Box>
              {POPULAR_COUNTRIES.includes(country) && (
                <Chip
                  label="인기"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: '20px' }}
                />
              )}
            </MenuItem>
          );
        }
        return null;
      })}

      {/* 검색 결과 없음 */}
      {filteredCountries.length === 0 && searchQuery && (
        <MenuItem disabled>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', width: '100%' }}
          >
            '{searchQuery}'에 대한 검색 결과가 없습니다.
          </Typography>
        </MenuItem>
      )}
    </TextField>
  );
};

export default CountrySelector;
