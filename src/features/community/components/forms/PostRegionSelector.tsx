import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { usePostFormStore } from '@/features/community/store/postFormStore';
import { regionTree } from '@/constants/regionTree';

const PostRegionSelector = () => {
  const { city, district, neighborhood, setCity, setDistrict, setNeighborhood } =
    usePostFormStore();

  const cities = regionTree.map(node => node.value);
  const selectedCity = regionTree.find(p => p.value === city);
  const districts = selectedCity?.children?.map(c => c.value) ?? [];

  const selectedDistrict = selectedCity?.children?.find(c => c.value === district);
  const neighborhoods = selectedDistrict?.children?.map(t => t.value) ?? [];

  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="city-label">시/도</InputLabel>
        <Select
          labelId="city-label"
          value={city}
          onChange={e => setCity(e.target.value)}
          label="시/도"
        >
          {cities.map(c => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!city}>
        <InputLabel id="district-label">시/군/구</InputLabel>
        <Select
          labelId="district-label"
          value={district}
          onChange={e => setDistrict(e.target.value)}
          label="시/군/구"
        >
          {districts.map(d => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth disabled={!district}>
        <InputLabel id="neighborhood-label">읍/면/동</InputLabel>
        <Select
          labelId="neighborhood-label"
          value={neighborhood}
          onChange={e => setNeighborhood(e.target.value)}
          label="읍/면/동"
        >
          {neighborhoods.map(n => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
export default PostRegionSelector;
