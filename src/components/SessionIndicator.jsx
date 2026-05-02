import React from 'react';

const SessionIndicator = ({ completedSessions, sessionType }) => {
  // Show 4 dots representing the current pomodoro cycle
  const currentCyclePosition = completedSessions % 4;

  return (
    <div className="session-indicator">
      <div className="session-dots">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`session-dot ${
              i < currentCyclePosition
                ? 'session-dot-completed'
                : i === currentCyclePosition && sessionType === 'Work'
                ? 'session-dot-active'
                : ''
            }`}
          />
        ))}
      </div>
      <span className="session-count">
        {completedSessions} {completedSessions === 1 ? 'session' : 'sessions'} completed
      </span>
    </div>
  );
};

export default SessionIndicator;
