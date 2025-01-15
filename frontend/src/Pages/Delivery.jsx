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

const Delivery = () => {
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
      const response = await axios.get('http://localhost:5000/filters');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchChartData = async (client = '') => {
    try {
      const fppResponse = await axios.get('http://localhost:5000/data', {
        params: { client, stage: '01_FPP' },
      });
      const finalsResponse = await axios.get('http://localhost:5000/data', {
        params: { client, stage: '03_Finals' },
      });

      const revisesResponse = await axios.get('http://localhost:5000/data', {
        params: { client, stage: '02_Revises-1' },
      });

       const otherDeliveriesResponse = await axios.get('http://localhost:5000/data', {
          params: { client, stage: '04_Other Deliveries' },
       });


      setChartsData({ FPP: fppResponse.data, Finals: finalsResponse.data, Revises: revisesResponse.data, OtherDeliveries: otherDeliveriesResponse.data });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

    const handleClientClick = (client) => {
         setSelectedClient(client);
  };


    const renderChart = (data, title, dataKey1, name1, dataKey2, name2, yAxisLabel1, yAxisLabel2) => {
        if (!data || data.length === 0) {
            return <div className="col-md-12 mb-3 border bg-light p-3">No data available for {title}</div>;
        }

          const maxValue1 = Math.max(...data.map((item) => Number(item[dataKey1])), 0);
          const yAxisMax1 = Math.ceil(maxValue1 * 1.2);

            const maxValue2 = Math.max(...data.map((item) => Number(item[dataKey2])), 0);
            const yAxisMax2 = Math.ceil(maxValue2 * 1.2);

        return (
            <div className="col-md-12 mb-3 border p-3  bg-light">
                <h5 className="text-center">{title}</h5>
                <ResponsiveContainer width="100%" height={250}>
    <BarChart
        data={data}
        margin={{ top: 50, right: 30, left: 20, bottom: 40 }}
    >
        <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -40 }}
            angle={0}
            textAnchor="end"
        />
        <YAxis
            yAxisId="left"
            label={{ value: yAxisLabel1, angle: -90, position: 'insideLeft', offset: -5 }}
            domain={[0, yAxisMax1]}
        />
        <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: yAxisLabel2, angle: 90, position: 'insideRight', offset: -5 }}
            domain={[0, yAxisMax2]}
        />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey={dataKey1} fill="#8884d8" name={name1} >
            <LabelList dataKey={dataKey1} position="top" />
        </Bar>
        <Bar yAxisId="right" dataKey={dataKey2} fill="#82ca9d" name={name2}>
           <LabelList dataKey={dataKey2} position="top" />
        </Bar>
    </BarChart>
</ResponsiveContainer>
            </div>
        );
    };


    return (
        <div className="container mt-1">
            <h2 className="text-center mb-2">Monthly Report</h2>
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
                    {renderChart(
                        chartsData.FPP,
                        `FPP Stage - ${selectedClient || 'All Clients'}`,
                        'title_count',
                        'Number of Titles',
                        'sum_pages',
                        'Sum of Pages',
                        'No. of Titles',
                        'Pages'
                    )}
                </div>
                <div className="col-md-12">
                    {renderChart(
                        chartsData.Finals,
                        `Finals Stage - ${selectedClient || 'All Clients'}`,
                        'title_count',
                        'Number of Titles',
                        '',
                        '',
                        'No. of Titles',
                        ''
                    )}
                </div>
                <div className="col-md-12">
                    {renderChart(
                        chartsData.Revises,
                        `Revises-1 Stage - ${selectedClient || 'All Clients'}`,
                        'title_count',
                        'Number of Titles',
                        'sum_corrections',
                        'Sum of Corrections',
                       'No. of Titles',
                        'Corrections'
                    )}
                </div>
                <div className="col-md-12">
                    {renderChart(
                        chartsData.OtherDeliveries,
                        `Other Deliveries Stage - ${selectedClient || 'All Clients'}`,
                         'title_count',
                         'Number of Titles',
                        'sum_corrections',
                         'Sum of Corrections',
                        'No. of Titles',
                        'Corrections'
                    )}
                </div>
            </div>
        </div>
    );
};

export default Delivery;