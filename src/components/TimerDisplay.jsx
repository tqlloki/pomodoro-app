import React from 'react';

const TimerDisplay = ({ timeLeft, progress, sessionType }) => {
  const radius = 120;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getSessionLabel = () => {
    switch (sessionType) {
      case 'Short Break': return 'Short Break';
      case 'Long Break': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  return (
    <div className="timer-display">
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="timer-svg"
      >
        {/* Background track */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={stroke}
        />
        {/* Progress ring */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="progress-ring"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div className="timer-content">
        <span className="session-label">{getSessionLabel()}</span>
        <span className="timer-digits">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default TimerDisplay;
