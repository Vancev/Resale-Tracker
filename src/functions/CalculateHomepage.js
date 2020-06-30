import React, { useState, useEffect, useContext } from "react";
import { firestore } from "../firebase";

export function Profit(items, expenses, startDate, endDate) {
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
      costs = costs + parseFloat(expense.Value);
    }
  });
  return (profit - costs).toFixed(2);
}

export function ROI(items, expenses, startDate, endDate) {
  var date = new Date();
  let toDate = new Date().setDate(date.getDate() - endDate);
  var fromDate = new Date().setDate(date.getDate() - startDate);

  let profit = Profit(items, expenses, startDate, endDate);

  let costs = 0;
  items.map((item) => {
    if (toDate > item.soldDate && item.soldDate > fromDate) {
      costs = costs + (parseFloat(item.itemCost) || 0);
      costs = costs + (parseFloat(item.shippingCost) || 0);
      costs = costs + (parseFloat(item.sellingFee) || 0);
    }
  });

  let expense = 0;
  expenses.map((expenseValue) => {
    if (toDate > expenseValue.Date && expenseValue.Date > fromDate) {
      expense = expense + parseFloat(expenseValue.Value);
    }
  });

  return ((profit / (costs + expense)) * 100).toFixed(2);
}
