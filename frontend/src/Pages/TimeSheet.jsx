import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../components/Timer';
import Dropdown from '../components/Dropdown';
import WarningModal from '../components/WarningModal';

const TimeSheet = () => {
  const [publishers, setPublishers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stages, setStages] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [empId, setEmpId] = useState(1); // Assuming emp_id is from current login
  const [empName, setEmpName] = useState("John Doe"); // Assuming emp_name is from current login
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  useEffect(() => {
    // Fetching dropdown values
    const fetchData = async () => {
      const publishersData = await axios.get('http://localhost:5000/publishers');
      const tasksData = await axios.get('http://localhost:5000/tasks');
      const stagesData = await axios.get('http://localhost:5000/stages');
      const functionsData = await axios.get('http://localhost:5000/functions');
      setPublishers(publishersData.data);
      setTasks(tasksData.data);
      setStages(stagesData.data);
      setFunctions(functionsData.data);
    };
    fetchData();
  }, []);

  const handleStart = (startTime) => {
    // logic to start the time recording
  };

  const handlePause = (pauseTime) => {
    // logic to pause the time
  };

  const handleStop = (stopTime, duration) => {
    setIsWarningOpen(true);
    // logic to save the record after confirmation
  };

  return (
    <div>
      <h1>Time Recording</h1>
      <div>
        <Dropdown 
          label="Publisher" 
          data={publishers} 
          setSelected={setSelectedPublisher} 
          valueKey="publisher_id" 
          labelKey="publisher_name" 
        />
        <Dropdown 
          label="Task" 
          data={tasks} 
          setSelected={setSelectedTask} 
          valueKey="task_id" 
          labelKey="task_name" 
        />
        <Dropdown 
          label="Stage" 
          data={stages} 
          setSelected={setSelectedStage} 
          valueKey="stage_id" 
          labelKey="stage_name" 
        />
        <Dropdown 
          label="Function" 
          data={functions} 
          setSelected={setSelectedFunction} 
          valueKey="function_id" 
          labelKey="function_name" 
        />
      </div>
      <div>
        <h3>Employee: {empName}</h3>
        <Timer
          handleStart={handleStart}
          handlePause={handlePause}
          handleStop={handleStop}
        />
      </div>
      <WarningModal isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)} />
    </div>
  );
};

export default TimeSheet;
