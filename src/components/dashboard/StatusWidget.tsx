import React from 'react';
import { Paper, Box, Typography, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

const StatusWidget: React.FC = () => {
  // 샘플 데이터 - 업무 처리 현황
  const taskStatus = [
    { id: 0, value: 35, label: '완료', color: '#4caf50' },
    { id: 1, value: 45, label: '진행중', color: '#2196f3' },
    { id: 2, value: 20, label: '지연', color: '#ff5722' },
  ];

  // 샘플 데이터 - 업무 유형별 분포
  const taskTypes = [
    { id: 0, value: 40, label: '회의', color: '#9c27b0' },
    { id: 1, value: 30, label: '보고서', color: '#ff9800' },
    { id: 2, value: 30, label: '개발', color: '#03a9f4' },
  ];

  // 샘플 데이터 - 주간 업무량
  const weeklyData = [
    { day: '월', value: 8 },
    { day: '화', value: 10 },
    { day: '수', value: 7 },
    { day: '목', value: 12 },
    { day: '금', value: 6 },
  ];

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        업무 현황
      </Typography>

      <Grid container spacing={2}>
        {/* 첫 번째 차트 행 */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 1, borderRadius: 1 }}>
            <Typography variant="body2" align="center" sx={{ mb: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
              업무 처리 현황
            </Typography>
            <PieChart
              series={[
                {
                  data: taskStatus,
                  innerRadius: 30,
                  outerRadius: 70,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  startAngle: -90,
                  endAngle: 270,
                  cx: 80,
                  cy: 80,
                }
              ]}
              width={160}
              height={160}
              slotProps={{
                legend: { hidden: true }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              {taskStatus.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: item.color, mr: 0.5 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {item.label} {item.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        
        {/* 두 번째 차트 */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 1, borderRadius: 1 }}>
            <Typography variant="body2" align="center" sx={{ mb: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
              업무 유형별 분포
            </Typography>
            <PieChart
              series={[
                {
                  data: taskTypes,
                  innerRadius: 30,
                  outerRadius: 70,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  startAngle: -90,
                  endAngle: 270,
                  cx: 80,
                  cy: 80,
                }
              ]}
              width={160}
              height={160}
              slotProps={{
                legend: { hidden: true }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              {taskTypes.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: item.color, mr: 0.5 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {item.label} {item.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        
        {/* 세 번째 차트 - 막대 그래프 */}
        <Grid item xs={12}>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 1, borderRadius: 1, mt: 1 }}>
            <Typography variant="body2" align="center" sx={{ mb: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
              주간 업무량
            </Typography>
            <BarChart
              series={[
                {
                  data: weeklyData.map(d => d.value),
                  color: '#2196f3',
                  label: '업무량',
                },
              ]}
              xAxis={[
                {
                  data: weeklyData.map(d => d.day),
                  scaleType: 'band',
                },
              ]}
              height={150}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              slotProps={{
                legend: { hidden: true }
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StatusWidget; 