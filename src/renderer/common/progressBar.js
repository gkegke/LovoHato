import React, { useState, useEffect, useRef } from 'react';

const ProgressBar = ({ timeoutId, speed }) => {
  const [progress, setProgress] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    let animationFrameId;

    if (timeoutId) {
      const intervalDuration = (speed || 3) * 1000; // Default to 3 seconds if speed is not provided

      const animate = (timestamp) => {
        if (!startTime.current) {
          startTime.current = timestamp;
        }

        const elapsedTime = timestamp - startTime.current;
        const newProgress = (elapsedTime / intervalDuration) * 100;

        if (newProgress >= 100) {
          setProgress(100);
        } else {
          setProgress(newProgress);
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    } else {
      setProgress(0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      startTime.current = null;
    };
  }, [timeoutId, speed]);

  return (
    <div
      style={{
        width: '100%',
        height: '3px',
        backgroundColor: '#c9c9c9',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '10000'
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#fff',
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
