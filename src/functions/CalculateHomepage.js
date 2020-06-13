import React, { useState, useEffect, useContext } from "react";
import { firestore } from "../firebase";
import { UserContext } from "../providors/UserProvider";

export function Profit(items, expenses, startDate, endDate) {
  const user = useContext(UserContext);

  var date = new Date();
  let toDate = new Date().setDate(date.getDate() - endDate);
  var fromDate = new Date().setDate(date.getDate() - startDate);

  let profit = 0;
  items.map((item) => {
    if (toDate > item.soldDate && item.soldDate > fromDate) {
      profit = profit + parseFloat(item.profit);
    }
  });

  let costs = 0;
  expenses.map((expense) => {
      if (toDate > expense.Date && expense.Date > fromDate) {
          costs = costs + parseFloat(expense.Value)
      }
  })
  return profit - costs;
}

export function ROI(items, expenses, startDate, endDate) {
  var date = new Date();
  let toDate = new Date().setDate(date.getDate() - endDate);
  var fromDate = new Date().setDate(date.getDate() - startDate);

  let profit = Profit(items, expenses, startDate, endDate)

  let costs = 0;
  items.map((item) => {
    if (toDate > item.soldDate && item.soldDate > fromDate) {
      console.log(item)
      costs = costs + (parseFloat(item.itemCost) || 0);
      costs = costs + (parseFloat(item.shippingCost) || 0);
      costs = costs + (parseFloat(item.sellingFee) || 0);
    }
  });


  let expense = 0;
  expenses.map((expenseValue) => {
      if (toDate > expenseValue.Date && expenseValue.Date > fromDate) {
        expense = expense + parseFloat(expenseValue.Value)
      }
  })

  console.log(profit, costs, expense)
  return (profit/(costs+expense)) * 100;
}