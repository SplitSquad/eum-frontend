import React from 'react';

interface CountryData {
  countryCode: string;
  countryName: string;
  count: number;
  percentage: number;
}

interface CountryStatsProps {
  countries: CountryData[];
  totalParticipants?: number;
  className?: string;
}

const CountryStats: React.FC<CountryStatsProps> = ({
  countries,
  totalParticipants,
  className = ''
}) => {
  // 참여자 총인원 계산
  const total = totalParticipants || countries.reduce((sum, country) => sum + country.count, 0);
  
  // 데이터가 없는 경우 렌더링하지 않음
  if (countries.length === 0) {
    return null;
  }

  // 색상 배열 (차트용)
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-gray-500'
  ];

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-medium mb-3">국가별 참여 현황</h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* 차트 영역 */}
        <div className="flex-1">
          {/* 가로 막대 차트 */}
          <div className="space-y-2">
            {countries.map((country, index) => (
              <div key={country.countryCode} className="flex items-center">
                <span className="w-20 text-sm">{country.countryName}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]}`}
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
                <span className="ml-2 text-sm w-16 text-right">
                  {country.percentage}% ({country.count})
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 원형 차트 (실제로는 차트 라이브러리를 사용하는 것이 좋음, 여기서는 간단한 예시로 작성) */}
        <div className="w-40 h-40 relative mx-auto md:mx-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold">{total}</div>
              <div className="text-sm text-gray-500">총 참여자</div>
            </div>
          </div>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* 원형 차트 세그먼트 - 실제로는 계산을 통해 그려야 함 */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#eee"
              strokeWidth="20"
            />
            {/* 실제 차트는 여기에 계산된 패스를 그려야 함 */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="20"
              strokeDasharray={`${Math.PI * 80 * 0.7} ${Math.PI * 80 * 0.3}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CountryStats; 