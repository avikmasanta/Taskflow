import { useContext, useMemo } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const AnimatedBackground = () => {
  const { darkMode } = useContext(ThemeContext);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 15,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <div className="animated-bg">
      <div className="orb" />
      <div className="orb" />
      <div className="orb" />
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: darkMode ? 'rgba(139,92,246,0.6)' : 'rgba(99,102,241,0.4)',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
