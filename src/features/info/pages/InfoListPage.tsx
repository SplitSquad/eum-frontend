import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../shared/i18n';
import { useInfoStore } from '@/features/info/store/infoStroe';
import {
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  Pagination,
  CircularProgress,
  Alert,
  Collapse,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { seasonalColors } from '@/components/layout/springTheme';
import { useThemeStore } from '@/features/theme/store/themeStore';
import SpringInfoList from './theme/SpringInfoList';
import HanjiInfoList from './theme/HanjiInfoList';
import ProInfoList from './theme/ProInfoList';

export default function InfoListPage() {
  const { season } = useThemeStore();
  return (
    <>
      {season === 'spring' && <SpringInfoList />}
      {season === 'hanji' && <HanjiInfoList />}
      {season === 'professional' && <ProInfoList />}
    </>
  );
}
