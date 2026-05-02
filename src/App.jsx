import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [settings, setSettings] = useState({ work: 25, shortBreak: 5, longBreak: 15 });
  const [timeLeft, setTimeLeft] = useState(settings.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerEnd = () => {
    audioRef.current?.play();
    if (sessionType === 'Work') {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      if (nextCount % 4 === 0) {
        setSessionType('Long Break');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setSessionType('Short Break');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setSessionType('Work');
      setTimeLeft(settings.work * 60);
    }
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-500 text-white transition-colors duration-500">
      <h1 className="text-4xl font-bold mb-8">Pomodoro Timer</h1>
      <div className="bg-white/20 p-10 rounded-3xl shadow-xl text-center w-80">
        <h2 className="text-2xl mb-4 font-semibold">{sessionType}</h2>
        <div className="text-7xl font-mono mb-8">{formatTime(timeLeft)}</div>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="bg-white text-red-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
          >
            {isRunning ? 'STOP' : 'START'}
          </button>
          <button 
            onClick={() => { setIsRunning(false); setTimeLeft(settings.work * 60); }}
            className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-bold hover:bg-white/10"
          >
            RESET
          </button>
        </div>
      </div>
      <div className="mt-8">Sessions Completed: {completedSessions}</div>
      <audio ref={audioRef} src="[https://actions.google.com/sounds/v1/alarms/beep_short.ogg](https://actions.google.com/sounds/v1/alarms/beep_short.ogg)" />
    </div>
  );
};

export default App;