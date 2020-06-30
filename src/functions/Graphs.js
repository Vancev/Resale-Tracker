import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { Chart } from "react-google-charts";
import { Profit, ROI } from "./CalculateHomepage";

export function MonthlyProfit(items, expenses) {
  //const [monthValues, setMonthValues] = useState([]);
  //const [profitItems, setProfitItems] = useState(items);
  //const [profitExpenses, setProfitExpenses] = useState(expenses);

  //   //useEffect(() => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let tempValue = [];
  const date = new Date();
  let startDate = 30;
  let earlyDate = 30;
  let lateDate = 0;
  let data = [];
  for (var i = 1; i < 5; i++) {
    date.setMonth(date.getMonth() - 1);
    let monthName = monthNames[date.getMonth()] + ", " + date.getFullYear();
    tempValue = [
      monthName,
      parseFloat(Profit(items, expenses, earlyDate, lateDate)),
    ];
    data.push(tempValue);
    //setMonthValues((monthValues) => [...monthValues, tempValue]);
    lateDate = earlyDate;
    earlyDate = startDate * (i + 1);
  }
  data.push(["Month", "Profit"]);
  data.reverse();
  //setMonthValues(data);
  //}, []);

  //console.log((date.setMonth(date.getMonth() - 3)), monthNames[date.getMonth()-1], monthNames[date.getMonth()-2], monthNames[date.getMonth()]-7)
  return (
    <div className={"my-pretty-chart-container"}>
      <Chart
        height={"300px"}
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          // Material design options
          chart: {
            title: "Total Monthly Profit",
          },
          legend: { position: "none" },
          vAxis: {
            minValue: 0,
            gridlines: {
              color: "#f3f3f3",
              count: 3,
            },
          },
        }}
      />
    </div>
  );
}

// if (change.type === "removed" && change.doc.id === toDelete) {
//     const item = items.filter((item) => item.id !== change.doc.id);
//     setItems(item);
//   }
//{"name": "that"}

export function RevenuePie(items, startDate) {
  var date = new Date();
  const fromDate = new Date().setDate(date.getDate() - startDate);

  let platformData = [];
  platformData.push(["Platform", "Count"])

  //Filter to only have items within the date range
  let dateFilteredItems = items.filter((platform) => platform.soldDate > fromDate);

console.log(dateFilteredItems)
  //Filter to get each unique platform
  let platforms = dateFilteredItems.map(data => data.soldPlatform).filter((platformType, index, array) => array.indexOf(platformType) === index)
  let tempData = []
  let sum = 0;
  platforms.map(platform => {
    dateFilteredItems.filter(item => item.soldPlatform == platform).map((item) => sum+=  parseFloat(item.profit))
    tempData = [platform, sum]
    platformData.push(tempData)
    sum = 0;
  })

  return (
    <Chart
    width={'768'}
    height={'460'}
    // width={'500px'}
    // height={'300px'}
    chartType="PieChart"
    loader={<div>Loading Chart</div>}
    data={platformData}
    options={{
      title: 'Revenue per Platform',
    }}
  />
  )
}
export function SoldPie(items, startDate) {
  var date = new Date();
  const fromDate = new Date().setDate(date.getDate() - startDate);

  let platformData = [];
  platformData.push(["Platform", "Count"])

  //Filter to onnly have items within the date range
  let dateFilteredItems = items.filter((platform) => platform.soldDate > fromDate);


  let platforms = dateFilteredItems.map(data => data.soldPlatform).filter((platformType, index, array) => array.indexOf(platformType) === index)

  let tempData = []
  platforms.map(platform => {
    tempData = [platform, dateFilteredItems.filter(item => item.soldPlatform == platform).length]
    
    platformData.push(tempData)
  })

  return (
    <Chart
    width={'768'}
    height={'460'}
    // width={'500px'}
    // height={'300px'}
    chartType="PieChart"
    loader={<div>Loading Chart</div>}
    data={platformData}
    options={{
      title: 'Sales per Platform',
    }}
  />
  )
}
