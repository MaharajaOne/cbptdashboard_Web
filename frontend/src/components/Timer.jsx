import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Timer = ({ taskId, userId, handleStart, handlePause, handleStop }) => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiUrl = "http://localhost:5000";


  useEffect(() => {
      const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/tasks/${taskId}/timer`, {params: { userId: userId }});
            setStartTime(response.data.startTime);
            setElapsedTime(response.data.elapsedTime);
            setIsRunning(response.data.isRunning);
        } catch (error) {
            console.error("Error fetching timer data:", error);
        } finally {
           setLoading(false);
        }

    }

     if (taskId && userId) {
         console.log('Fetching timer data with taskId:', taskId, 'userId:', userId); // Debug
         fetchData();
      } else {
         console.log('taskId or userId is undefined');
       }
  }, [taskId, userId, apiUrl]);


  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`${apiUrl}/tasks/${taskId}/timer`, {params: { userId: userId }});
          setElapsedTime(response.data.elapsedTime);
          if(!response.data.isRunning)
             setIsRunning(false);
        } catch (error) {
          console.error("Error fetching updated time:", error);
          setIsRunning(false);
        }
      }, 1000);
  }

      return () => {
          if(interval)
              clearInterval(interval);
      };
    }, [isRunning, taskId, userId, apiUrl]);

  const handleStartClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/tasks/${taskId}/start`, { userId: userId });
      setStartTime(response.data.startTime);
      setIsRunning(true);
      handleStart && handleStart(new Date());
    } catch (error) {
      console.error("Error starting timer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/tasks/${taskId}/pause`, { userId: userId });
      setIsRunning(false);
      handlePause && handlePause(new Date());
    } catch (error) {
      console.error("Error pausing timer:", error);
    } finally {
      setLoading(false);
    }
  };

    const handleStopClick = async () => {
      try {
        setLoading(true);
          const response = await axios.post(`${apiUrl}/tasks/${taskId}/stop`, { userId: userId });
          setIsRunning(false);
          setStartTime(null);
          setElapsedTime(0);
          handleStop && handleStop(new Date(), response.data.elapsedTime);
      } catch (error) {
         console.error("Error stopping timer:", error);
      } finally {
         setLoading(false);
     }
  };

  const formatTime = (time) => {
      if(!time) return "0h 0m 0s";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

    if(loading){
      return <div>Loading...</div>
  }


    return (
        <div>
            <h3>Timer: {formatTime(elapsedTime)}</h3>
            <button onClick={handleStartClick} disabled={isRunning}>
                Start
            </button>
            <button onClick={handlePauseClick} disabled={!isRunning}>
                Pause
            </button>
            <button onClick={handleStopClick}>
                Stop
            </button>
        </div>
    );
};

export default Timer;