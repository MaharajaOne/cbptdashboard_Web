import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { LabelList } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientOntime = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(() => {
    return localStorage.getItem('selectedClient') || '';
  });
  const [chartsData, setChartsData] = useState({
    FPP: [],
    Finals: [],
    Revises: [],
    OtherDeliveries: [],
  });

  useEffect(() => {
    fetchClients();
    // Load data only if there's a selected client in local storage
    if (selectedClient) {
      fetchChartData(selectedClient);
    } else {
      fetchChartData(); // If no client stored load the all client data
    }
  }, [selectedClient]);

  useEffect(() => {
    localStorage.setItem('selectedClient', selectedClient);
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/client-ontime-data-filters');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchChartData = async (client = '') => {
    try {
      const fppResponse = await axios.get('http://localhost:5000/client-ontime-data', {
        params: { client, stage: '01_FPP' },
      });
      const finalsResponse = await axios.get('http://localhost:5000/client-ontime-data', {
        params: { client, stage: '03_Finals' },
      });

      const revisesResponse = await axios.get('http://localhost:5000/client-ontime-data', {
        params: { client, stage: '02_Revises-1' },
      });

      const otherDeliveriesResponse = await axios.get('http://localhost:5000/client-ontime-data', {
        params: { client, stage: '04_Other Deliveries' },
      });


      setChartsData({
        FPP: fppResponse.data,
        Finals: finalsResponse.data,
        Revises: revisesResponse.data,
        OtherDeliveries: otherDeliveriesResponse.data,
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };


  const handleClientClick = (client) => {
    setSelectedClient(client);

  };
  
  const hexToRgba = (hex, opacity) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
  };


  const renderChartWithTable = (data, title) => {
    if (!data || data.length === 0) {
      return <div className="col-12 mb-3 border bg-light p-3">No data available for {title}</div>;
    }

    const maxYValue = Math.max(
        ...data.map((item) => Math.max(
          Number(item.late_titles),
          Number(item.met_revised_titles),
          Number(item.met_original_titles),
        )
      ),0)
    const yAxisMax = Math.ceil(maxYValue* 1.2);


      const tableStyle = {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
        };
        const thStyle = {
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'center',
        };
         const tdStyle = {
            border: '1px solid #ddd',
             padding: '8px',
             textAlign:'center',
        };

         const barColor1 = "#e57373";
         const barColor2 = "#82ca9d";
         const barColor3 = "#8884d8";
  
    const enhancedData = data.map(item => {
        const totalTitles = Number(item.late_titles) + Number(item.met_revised_titles) + Number(item.met_original_titles);
        const delayPercentage = totalTitles === 0 ? 0 : ((Number(item.late_titles) / totalTitles) * 100).toFixed(2);
        return {
            ...item,
            total_titles: totalTitles,
            delay_percentage: delayPercentage,
        };
    });


    return (
      <div className="row mb-4">
        {/* Chart Section */}
        <div className="col-8 border p-3 bg-light">
          <h5 className="text-center">{title}</h5>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={enhancedData}
              margin={{ top: 50, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis
                dataKey="month"
                label={{ value: 'Month', position: 'insideBottom', offset: -40 }}
                angle={0}
                textAnchor="end"
              />
              <YAxis
                label={{ value: 'No of Titles', angle: -90, position: 'insideLeft', offset: -5 }}
                domain={[0, yAxisMax]}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="late_titles" fill={barColor1} name="No of titles Delivered Late" >
                <LabelList dataKey="late_titles" position="top" />
              </Bar>
              <Bar dataKey="met_revised_titles" fill={barColor2} name="No of titles Met revised date">
                <LabelList dataKey="met_revised_titles" position="top" />
              </Bar>
              <Bar dataKey="met_original_titles" fill={barColor3} name="No of titles Met original Date">
                <LabelList dataKey="met_original_titles" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table Section */}
        <div className="col-4 border p-3 bg-light">
          <h6 className="text-center">Data Table</h6>
           <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Month</th>
                                <th style={thStyle}>Late Titles</th>
                                <th style={thStyle}>Met Revised</th>
                                <th style={thStyle}>Met Original</th>
                                <th style={thStyle}>Total Titles</th>
                                 <th style={thStyle}>Delay Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                         {enhancedData.map((row, index) => (
                            <tr
                              key={index}
                             style={{ backgroundColor: index % 2 === 0 ? 'transparent' :  hexToRgba(barColor2, 0.1) }}
                            >
                              <td style={tdStyle}>{row.month}</td>
                              <td style={tdStyle}>{row.late_titles}</td>
                              <td style={tdStyle}>{row.met_revised_titles}</td>
                              <td style={tdStyle}>{row.met_original_titles}</td>
                              <td style={tdStyle}>{row.total_titles}</td>
                               <td style={tdStyle}>{row.delay_percentage} %</td>
                           </tr>
                          ))}
                       </tbody>
                    </table>
        </div>
      </div>
    );
  };


  return (
    <div className="container mt-1">
      <h2 className="text-center mb-2">Clientwise Ontime Report</h2>
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex flex-wrap">
            {clients.map((client) => (
              <button
                key={client}
                style={{ fontSize: '.60rem' }}
                className={`btn btn-outline-primary m-1 ${selectedClient === client ? 'active' : ''
                  }`}
                onClick={() => handleClientClick(client)}
              >
                {client}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedClient && (
        <div className="row">
          <div className="col-md-12 text-center mb-4">
            <h6>Selected Client: {selectedClient}</h6>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-12">
          {renderChartWithTable(
            chartsData.FPP,
            `FPP Stage - ${selectedClient || 'All Clients'}`
          )}
        </div>
        <div className="col-md-12">
          {renderChartWithTable(
            chartsData.Finals,
            `Finals Stage - ${selectedClient || 'All Clients'}`
          )}
        </div>
        <div className="col-md-12">
          {renderChartWithTable(
            chartsData.Revises,
            `Revises-1 Stage - ${selectedClient || 'All Clients'}`
          )}
        </div>
        <div className="col-md-12">
          {renderChartWithTable(
            chartsData.OtherDeliveries,
            `Other Deliveries Stage - ${selectedClient || 'All Clients'}`
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientOntime;