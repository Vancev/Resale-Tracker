import React, { useState, useEffect, useContext } from "react";
import { firestore } from "../firebase";
import { UserContext } from "../providors/UserProvider";

export function Profit(length) {
  const user = useContext(UserContext);

  const [items, setItems] = useState([]);
  useEffect(() => {
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
      .get()
      .then((data) => {
        let tempItems = [];
        data.forEach((doc) => {
          let item = doc.data();
          item["id"] = doc.id;
          tempItems.push(item);
        });
        setItems(tempItems);
      });
  }, []);

  console.log(items);
  var date = new Date();
  let currentDate = new Date().setDate(date.getDate());
  var priorDate = new Date().setDate(date.getDate() - length);

  let profit = 0;
  items.map((item) => {
    if (item.soldDate > priorDate) {
      profit = profit + parseFloat(item.profit);
    }
  });
  console.log(profit);
  return profit;
}
