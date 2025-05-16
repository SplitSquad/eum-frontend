import React from 'react';

export interface Petal {
  id: number;
  left: number; // 0~100 (% of width)
  size: number;
  rotate: number;
  svg: string;
}

const PetalPile: React.FC<{ petals: Petal[] }> = ({ petals }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '60px', // footer 갈색 영역 높이만큼
      pointerEvents: 'none',
      zIndex: 1100, // footer 위에
      display: 'block',
    }}
  >
    {petals.map(petal => (
      <img
        key={petal.id}
        src={petal.svg}
        style={{
          position: 'absolute',
          left: `${petal.left}%`,
          bottom: `${Math.random() * 20}px`,
          width: `${petal.size}px`,
          opacity: 0.8,
          transform: `rotate(${petal.rotate}deg)`,
        }}
        alt="petal"
        draggable={false}
      />
    ))}
  </div>
);

export default PetalPile;
