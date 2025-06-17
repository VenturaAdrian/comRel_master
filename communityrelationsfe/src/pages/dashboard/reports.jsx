import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "config";
import Chart from "react-apexcharts";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function Reports() {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState("request_status");
  const [chartData, setChartData] = useState({
    options: { chart: { id: "request-summary" }, xaxis: { categories: [] } },
    series: [],
  });

  const groupData = (groupKey) => {
    const grouped = {};

    data.forEach((item) => {
      const date = new Date(item.date_Time).toLocaleDateString(); // normalize date
      const subGroup = item[groupKey] || "Unknown";

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][subGroup]) grouped[date][subGroup] = 0;

      grouped[date][subGroup]++;
    });

    const categories = Object.keys(grouped); // x-axis = dates
    const subGroupKeys = new Set();

    // collect all unique subgroup keys
    Object.values(grouped).forEach((subGroupObj) => {
      Object.keys(subGroupObj).forEach((key) => subGroupKeys.add(key));
    });

    const series = Array.from(subGroupKeys).map((key) => ({
      name: key,
      data: categories.map((date) => grouped[date][key] || 0),
    }));

    setChartData({
      options: {
        chart: { id: "request-summary", stacked: true },
        xaxis: { categories },
        title: {
          text: `Requests by ${groupKey.replace("_", " ")} per Date`,
          align: "center",
        },
      },
      series,
    });
  };

  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/history`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      groupData(sortBy);
    }
  }, [data, sortBy]);

  const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
  };
  const tdStyle = { border: "1px solid #ddd", padding: "8px" };

  const handleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/dashboard`);
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" mb={3}>
        <button onClick={handleBack} style={{ marginRight: '20px' }}>Back</button>
        Reports
      </Typography>

      {/* Sort/Group Filter */}
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Group By</InputLabel>
        <Select
          value={sortBy}
          label="Group By"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <MenuItem value="request_status">Status</MenuItem>
          <MenuItem value="comm_Act">Activity</MenuItem>
          <MenuItem value="comm_Venue">Venue</MenuItem>
        </Select>
      </FormControl>

      {/* Chart */}
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />

      {/* Table */}
      <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "30px" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Activity</th>
            <th style={thStyle}>Venue</th>
            <th style={thStyle}>Date/Time</th>
            <th style={thStyle}>Area</th>
            <th style={thStyle}>Guest</th>
            <th style={thStyle}>Docs</th>
            <th style={thStyle}>Emps</th>
            <th style={thStyle}>Beneficiaries</th>
            <th style={thStyle}>Created By</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={tdStyle}>{row.request_id}</td>
              <td style={tdStyle}>{row.request_status}</td>
              <td style={tdStyle}>{row.comm_Act}</td>
              <td style={tdStyle}>{row.comm_Venue}</td>
              <td style={tdStyle}>{row.date_Time}</td>
              <td style={tdStyle}>{row.comm_Area}</td>
              <td style={tdStyle}>{row.comm_Guest}</td>
              <td style={tdStyle}>{row.comm_Docs}</td>
              <td style={tdStyle}>{row.comm_Emps}</td>
              <td style={tdStyle}>{row.comm_Benef}</td>
              <td style={tdStyle}>{row.created_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
