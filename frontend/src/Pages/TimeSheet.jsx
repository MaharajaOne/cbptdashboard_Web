// TimeSheet.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Timer from '../components/Timer';
import Dropdown from '../components/Dropdown';
import WarningModal from '../components/WarningModal';

const TimeSheet = ({ empDetails }) => {
  const [publishers, setPublishers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stages, setStages] = useState([]);
  const [functions, setFunctions] = useState([]);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [isWarningOpen, setIsWarningOpen] = useState(false);


  useEffect(() => {
    // Fetching dropdown values
    const fetchDropdownData = async () => {
      try {
        const [publishersData, tasksData, stagesData, functionsData] = await Promise.all([
          axios.get('http://localhost:5000/publishers'),
          axios.get('http://localhost:5000/tasks'),
          axios.get('http://localhost:5000/stages'),
          axios.get('http://localhost:5000/functions'),
        ]);
        setPublishers(publishersData.data);
        setTasks(tasksData.data);
        setStages(stagesData.data);
        setFunctions(functionsData.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);



  return (
    <div>
      <h1>Time Recording</h1>
      <div>
            <label>Employee ID:</label>
             <input type="text" value={empDetails?.emp_id || ''} readOnly /><br/>
            <label>Employee Name:</label>
             <input type="text" value={empDetails?.name || ''} readOnly /><br/>
      </div>

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
          <WarningModal isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)} />
    </div>
  );
};

export default TimeSheet;