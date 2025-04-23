import React from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  width?: number | string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  placeholder = '검색...',
  onChange,
  onSearch,
  width = 240,
}) => (
  <TextField
    placeholder={placeholder}
    variant="outlined"
    size="small"
    value={value}
    onChange={e => onChange(e.target.value)}
    onKeyPress={e => e.key === 'Enter' && onSearch()}
    sx={{
      width,
      '& .MuiOutlinedInput-root': {
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        '& fieldset': { borderColor: '#FFD7D7' },
        '&:hover fieldset': { borderColor: '#FFAAA5' },
        '&.Mui-focused fieldset': { borderColor: '#FF9999' },
      },
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton size="small" onClick={onSearch}>
            <SearchIcon fontSize="small" sx={{ color: '#FF9999' }} />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

export default SearchBar;
