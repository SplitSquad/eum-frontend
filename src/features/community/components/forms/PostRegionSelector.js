import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { usePostFormStore } from '@/features/community/store/postFormStore';
import { regionTree } from '@/constants/regionTree';
const PostRegionSelector = () => {
    const { city, district, neighborhood, setCity, setDistrict, setNeighborhood } = usePostFormStore();
    const cities = regionTree.map(node => node.value);
    const selectedCity = regionTree.find(p => p.value === city);
    const districts = selectedCity?.children?.map(c => c.value) ?? [];
    const selectedDistrict = selectedCity?.children?.find(c => c.value === district);
    const neighborhoods = selectedDistrict?.children?.map(t => t.value) ?? [];
    return (_jsxs(_Fragment, { children: [_jsxs(FormControl, { fullWidth: true, sx: { mb: 2 }, children: [_jsx(InputLabel, { id: "city-label", children: "\uC2DC/\uB3C4" }), _jsx(Select, { labelId: "city-label", value: city, onChange: e => setCity(e.target.value), label: "\uC2DC/\uB3C4", children: cities.map(c => (_jsx(MenuItem, { value: c, children: c }, c))) })] }), _jsxs(FormControl, { fullWidth: true, sx: { mb: 2 }, disabled: !city, children: [_jsx(InputLabel, { id: "district-label", children: "\uC2DC/\uAD70/\uAD6C" }), _jsx(Select, { labelId: "district-label", value: district, onChange: e => setDistrict(e.target.value), label: "\uC2DC/\uAD70/\uAD6C", children: districts.map(d => (_jsx(MenuItem, { value: d, children: d }, d))) })] }), _jsxs(FormControl, { fullWidth: true, disabled: !district, children: [_jsx(InputLabel, { id: "neighborhood-label", children: "\uC74D/\uBA74/\uB3D9" }), _jsx(Select, { labelId: "neighborhood-label", value: neighborhood, onChange: e => setNeighborhood(e.target.value), label: "\uC74D/\uBA74/\uB3D9", children: neighborhoods.map(n => (_jsx(MenuItem, { value: n, children: n }, n))) })] })] }));
};
export default PostRegionSelector;
