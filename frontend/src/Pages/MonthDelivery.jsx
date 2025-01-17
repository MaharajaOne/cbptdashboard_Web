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

const MonthDelivery = () => {
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        return localStorage.getItem('selectedMonth') || '';
    });
    const [chartsData, setChartsData] = useState({
        FPP: [],
        Finals: [],
        Revises: [],
        OtherDeliveries: [],
    });

    useEffect(() => {
        fetchMonths();
        if (selectedMonth) {
            fetchChartData(selectedMonth);
        } else {
             fetchChartData();
        }
    }, [selectedMonth]);

    useEffect(() => {
        localStorage.setItem('selectedMonth', selectedMonth);
    }, [selectedMonth]);

    const fetchMonths = async () => {
        try {
            const response = await axios.get('http://localhost:5000/month-delivery-data-filters');
           
            setMonths(response.data.months);
        } catch (error) {
            console.error('Error fetching months:', error);
        }
    };

    const fetchChartData = async (month = '') => {
        try {
            const fppResponse = await axios.get('http://localhost:5000/month-delivery-data', {
                params: { month, stage: '01_FPP' },
            });
            const finalsResponse = await axios.get('http://localhost:5000/month-delivery-data', {
                params: { month, stage: '03_Finals' },
            });

            const revisesResponse = await axios.get('http://localhost:5000/month-delivery-data', {
                params: { month, stage: '02_Revises-1' },
            });

            const otherDeliveriesResponse = await axios.get('http://localhost:5000/month-delivery-data', {
                params: { month, stage: '04_Other Deliveries' },
            });


            setChartsData({ FPP: fppResponse.data, Finals: finalsResponse.data, Revises: revisesResponse.data, OtherDeliveries: otherDeliveriesResponse.data });
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const handleMonthClick = (month) => {
        setSelectedMonth(month);
    };


 const renderChart = (data, title, dataKey1, name1, dataKey2, name2, yAxisLabel1, yAxisLabel2) => {
    if (!data || data.length === 0) {
      return <div className="col-md-12 mb-3 border bg-light p-3">No data available for {title}</div>;
    }

    // Sort the data array in descending order based on dataKey1
    const sortedData = [...data].sort((a, b) => b[dataKey1] - a[dataKey1]);

    const maxValue1 = Math.max(...sortedData.map((item) => Number(item[dataKey1])), 0);
    const yAxisMax1 = Math.ceil(maxValue1 * 1.2);

    const maxValue2 = Math.max(...sortedData.map((item) => Number(item[dataKey2])), 0);
    const yAxisMax2 = Math.ceil(maxValue2 * 1.2);


    return (
      <div className="col-md-12 mb-3 border p-3  bg-light">
        <h5 className="text-center">{title}</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={sortedData}
            margin={{ top: 50, right: 30, left: 20, bottom: 40 }}
          >
            <XAxis
              dataKey="client"
              label={{ value: 'Client', position: 'insideBottom', offset: -40 }}
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
            <h2 className="text-center mb-2">Monthwise Delivery Report</h2>
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="d-flex flex-wrap">
                        {months.map((month) => (
                            <button
                                key={month}
                                style={{ fontSize: '.60rem' }}
                                className={`btn btn-outline-primary m-1 ${selectedMonth === month ? 'active' : ''
                                    }`}
                                onClick={() => handleMonthClick(month)}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {selectedMonth && (
                <div className="row">
                    <div className="col-md-12 text-center mb-4">
                        <h6>Selected Month: {selectedMonth}</h6>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-md-12">
                    {renderChart(
                        chartsData.FPP,
                        `FPP Stage - ${selectedMonth || 'All Months'}`,
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
                        `Finals Stage - ${selectedMonth || 'All Months'}`,
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
                        `Revises-1 Stage - ${selectedMonth || 'All Months'}`,
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
                        `Other Deliveries Stage - ${selectedMonth || 'All Months'}`,
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

export default MonthDelivery;