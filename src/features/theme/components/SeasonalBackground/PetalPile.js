import { jsx as _jsx } from "react/jsx-runtime";
const PetalPile = ({ petals }) => (_jsx("div", { style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px', // footer 갈색 영역 높이만큼
        pointerEvents: 'none',
        zIndex: 1100, // footer 위에
        display: 'block',
    }, children: petals.map(petal => (_jsx("img", { src: petal.svg, style: {
            position: 'absolute',
            left: `${petal.left}%`,
            bottom: `${Math.random() * 20}px`,
            width: `${petal.size}px`,
            opacity: 0.8,
            transform: `rotate(${petal.rotate}deg)`,
        }, alt: "petal", draggable: false }, petal.id))) }));
export default PetalPile;
