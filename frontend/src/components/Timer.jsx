import React, { useState, useEffect } from 'react';

const Timer = ({ handleStart, handlePause, handleStop }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Retrieve timer state from localStorage
    const savedTime = localStorage.getItem('time');
    const savedIsRunning = localStorage.getItem('isRunning') === 'true';

    if (savedTime) {
      setTime(parseInt(savedTime, 10));
    }
    if (savedIsRunning) {
      setIsRunning(true);  // If the timer was running before, restart it
    }
  }, []);

  useEffect(() => {
    // Save the current state to localStorage whenever the time or running status changes
    localStorage.setItem('time', time);
    localStorage.setItem('isRunning', isRunning);
  }, [time, isRunning]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartClick = () => {
    setIsRunning(true);
    handleStart(new Date());
  };

  const handlePauseClick = () => {
    setIsRunning(false);
    handlePause(new Date());
  };

  const handleStopClick = () => {
    setIsRunning(false);
    handleStop(new Date(), time);
    localStorage.removeItem('time');  // Clear saved time when stopping the timer
    localStorage.removeItem('isRunning');  // Clear running status when stopping
  };

  return (
    <div>
      <h3>{`Time: ${time}s`}</h3>
      <button onClick={handleStartClick}>Start</button>
      <button onClick={handlePauseClick}>Pause</button>
      <button onClick={handleStopClick}>Stop</button>
    </div>
  );
};

export default Timer;
