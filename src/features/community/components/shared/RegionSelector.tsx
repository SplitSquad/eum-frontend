import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from '../../../../shared/i18n';
import { useRegionStore } from '../../store/regionStore';
import { regionTree } from '@/constants/regionTree';

interface RegionSelectorProps {
  // 선택이 바뀔 때 콜백 (optional)
  onChange?: (city: string | null, district: string | null, neighborhood: string | null) => void;
  // 비활성화 여부 (optional)
  disabled?: boolean;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ onChange, disabled = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    selectedCity,
    selectedDistrict,
    selectedNeighborhood,
    districts,
    neighborhoods,
    setCity,
    setDistrict,
    setNeighborhood,
    resetRegion,
  } = useRegionStore();

  // 현재 선택된 시/도 노드
  const cityNode = regionTree.find(node => node.value === selectedCity);
  // 현재 선택된 구/군 노드
  const districtNode = cityNode?.children?.find(child => child.value === selectedDistrict);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#666' }}>
        {t('community.regions.regionSelection')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
        {/* 시/도 선택 */}
        <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
          <InputLabel id="city-label">{t('community.regions.cityProvince')}</InputLabel>
          <Select
            labelId="city-label"
            value={selectedCity || ''}
            label={t('community.regions.cityProvince')}
            disabled={disabled}
            onChange={e => {
              setCity(e.target.value);
              if (onChange) onChange(e.target.value, null, null);
            }}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD7D7',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFAAA5',
              },
            }}
          >
            <MenuItem value="">{t('community.regions.all')}</MenuItem>
            {regionTree.map(city => (
              <MenuItem key={city.value} value={city.value}>
                {city.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 구/군 선택 (시/도 선택 시) */}
        {selectedCity && (
          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id="district-label">{t('community.regions.districtCounty')}</InputLabel>
            <Select
              labelId="district-label"
              value={selectedDistrict || ''}
              label={t('community.regions.districtCounty')}
              disabled={disabled}
              onChange={e => {
                setDistrict(e.target.value);
                if (onChange) onChange(selectedCity, e.target.value, null);
              }}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD7D7',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFAAA5',
                },
              }}
            >
              <MenuItem value="">{t('community.regions.all')}</MenuItem>
              {districts.map(district => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* 동/읍/면 선택 (구/군 선택 시) */}
        {selectedCity && selectedDistrict && neighborhoods.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id="neighborhood-label">
              {t('community.regions.neighborhoodTownship')}
            </InputLabel>
            <Select
              labelId="neighborhood-label"
              value={selectedNeighborhood || ''}
              label={t('community.regions.neighborhoodTownship')}
              disabled={disabled}
              onChange={e => {
                setNeighborhood(e.target.value);
                if (onChange) onChange(selectedCity, selectedDistrict, e.target.value);
              }}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD7D7',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFAAA5',
                },
              }}
            >
              <MenuItem value="">{t('community.regions.all')}</MenuItem>
              {neighborhoods.map(neighborhood => (
                <MenuItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* 현재 선택된 지역 표시 */}
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Chip
          label={
            !selectedCity
              ? t('community.regions.nationwide')
              : !selectedDistrict
                ? selectedCity
                : !selectedNeighborhood
                  ? `${selectedCity} ${selectedDistrict}`
                  : `${selectedCity} ${selectedDistrict} ${selectedNeighborhood}`
          }
          size="small"
          sx={{
            bgcolor: '#FFAAA5',
            color: 'white',
            fontWeight: 600,
          }}
        />
        {(selectedCity || selectedDistrict || selectedNeighborhood) && !disabled && (
          <Chip
            label={t('community.regions.reset')}
            size="small"
            onClick={resetRegion}
            sx={{ bgcolor: '#FFD7D7', color: '#FF7777', fontWeight: 600, cursor: 'pointer' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default RegionSelector;
