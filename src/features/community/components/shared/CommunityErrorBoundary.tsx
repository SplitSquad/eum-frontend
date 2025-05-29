import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CommunityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CommunityErrorBoundary] 에러 발생:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            minHeight: '400px',
            textAlign: 'center',
          }}
        >
          <Alert severity="error" sx={{ mb: 3, maxWidth: '500px' }}>
            <Typography variant="h6" gutterBottom>
              커뮤니티 기능에 오류가 발생했습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </Typography>
          </Alert>
          
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={this.handleRetry}
            sx={{
              bgcolor: '#FFAAA5',
              '&:hover': { bgcolor: '#FF8B8B' },
            }}
          >
            다시 시도
          </Button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, maxWidth: '600px' }}>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                {this.state.error.stack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
} 