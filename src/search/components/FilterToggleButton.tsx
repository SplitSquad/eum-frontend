import React from 'react';
import { IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export interface FilterToggleButtonProps {
  active: boolean;
  onClick: () => void;
}

const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({ active, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      bgcolor: active ? '#FFAAA5' : 'rgba(255, 255, 255, 0.9)',
      color: active ? 'white' : '#666',
      '&:hover': { bgcolor: active ? '#FF9999' : '#FFF5F5' },
    }}
  >
    <FilterListIcon />
  </IconButton>
);

export default FilterToggleButton;
