import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const MonthOntime = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return localStorage.getItem("selectedMonth") || "";
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchMonths();
    if (selectedMonth) {
      fetchChartData(selectedMonth);
    } else {
      fetchChartData();
    }
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem("selectedMonth", selectedMonth);
  }, [selectedMonth]);

  const fetchMonths = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/month-ontime-data-filters"
      );
      setMonths(response.data.months);
    } catch (error) {
      console.error("Error fetching months:", error);
    }
  };

  const fetchChartData = async (month = "") => {
    try {
      const response = await axios.get("http://localhost:5000/month-ontime-data", {
        params: { month },
      });
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  const transformChartData = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const client = item.client;

      if (!groupedData[client]) {
        groupedData[client] = {
          client,
          late_titles: 0,
          met_revised_titles: 0,
          met_original_titles: 0,
        };
      }

      // Ensure all values are numbers
      groupedData[client].late_titles += Number(item.late_titles); // Convert to number
      groupedData[client].met_revised_titles += Number(item.met_revised_titles); // Convert to number
      groupedData[client].met_original_titles += Number(item.met_original_titles); // Convert to number
    });

    const sortedData = Object.values(groupedData).sort((a, b) => {
      const totalA =
        a.late_titles + a.met_revised_titles + a.met_original_titles;
      const totalB =
        b.late_titles + b.met_revised_titles + b.met_original_titles;
      return totalB - totalA; // Sort in descending order
    });

    return sortedData;
  };

  const renderChart = (stageData, title) => {
    if (!stageData || stageData.length === 0) {
      return (
        <div className="col-md-12 mb-3 border bg-light p-3">
          No data available for {title}
        </div>
      );
    }

    const transformedData = transformChartData(stageData);

    const maxYValue = Math.max(
      ...transformedData.map(
        (item) =>
          Math.max(
            item.late_titles,
            item.met_revised_titles,
            item.met_original_titles
          ) || 0
      )
    );

    const yAxisMax = Math.ceil(maxYValue * 1.2);

    return (
      <div className="col-md-12 mb-3 border p-3 bg-light">
        <h5 className="text-center">{title}</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={transformedData}
            margin={{ top: 50, right: 30, left: 20, bottom: 40 }}
          >
            <XAxis
              dataKey="client"
              label={{
                value: "Clients",
                position: "insideBottom",
                offset: -40,
              }}
            />
            <YAxis
              label={{
                value: "No of Titles",
                angle: -90,
                position: "insideLeft",
              }}
              domain={[0, yAxisMax]}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="late_titles"
              fill="#d65555"
              name="No of titles Delivered Late"
            >
              <LabelList dataKey="late_titles" position="top" />
            </Bar>
            <Bar
              dataKey="met_revised_titles"
              fill="#54c57a"
              name="No of titles Met revised date"
            >
              <LabelList dataKey="met_revised_titles" position="top" />
            </Bar>
            <Bar
              dataKey="met_original_titles"
              fill="#1274d6"
              name="No of titles Met original Date"
            >
              <LabelList dataKey="met_original_titles" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="container mt-1">
      <h2 className="text-center mb-2">Monthwise Ontime Report</h2>
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex flex-wrap">
            {months.map((month) => (
              <button
                key={month}
                style={{ fontSize: ".60rem" }}
                className={`btn btn-outline-primary m-1 ${
                  selectedMonth === month ? "active" : ""
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
            chartData.filter((item) => item.normalized_stage === "01_FPP"),
            `FPP Stage - ${selectedMonth || "All Months"}`
          )}
        </div>
        <div className="col-md-12">
          {renderChart(
            chartData.filter((item) => item.normalized_stage === "03_Finals"),
            `Finals Stage - ${selectedMonth || "All Months"}`
          )}
        </div>
        <div className="col-md-12">
          {renderChart(
            chartData.filter((item) => item.normalized_stage === "02_Revises-1"),
            `Revises-1 Stage - ${selectedMonth || "All Months"}`
          )}
        </div>
        <div className="col-md-12">
          {renderChart(
            chartData.filter(
              (item) => item.normalized_stage === "04_Other Deliveries"
            ),
            `Other Deliveries Stage - ${selectedMonth || "All Months"}`
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthOntime;
