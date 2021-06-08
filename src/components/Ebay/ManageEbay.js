import React, { useState, useEffect, useContext } from "react";

import useStyles from "./ManageEbay.style";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Profit, ROI } from "../../functions/CalculateHomepage";
import { MonthlyProfit, SoldPie, RevenuePie } from "../../functions/Graphs";
import { firestore } from "../../firebase";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MaterialTable from "material-table";
import { UserContext } from "../../providors/UserProvider";

//TODO: Figure out decimal, make update changes perseist(Send to firestore), renew with refresh token
//Change to load in from fire instead of API
export default function ManageEbay(props) {
  const user = useContext(UserContext);

  const classes = useStyles();

  //All sale ID's from the Firestore
  const [ids, setIds] = useState([]);

  const [orders, setOrders] = useState("no orders");
  const [orderData, setOrderData] = useState([]);
  const [dateRange, setDateRange] = useState(7);
  const [offset, setOffset] = useState(0);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Sold Price", field: "soldPrice", type: "currency" },
    { title: "Cost", field: "cost", type: "currency" },
    { title: "Revenue", field: "revenue", type: "currency" },
    { title: "After Fees", field: "afterFees", type: "currency" },
    { title: "Shipping Cost", field: "shippingReceived", type: "currency" },
    { title: "Profit", field: "profit", type: "currency" },
  ];

  useEffect(() => {
      //Add order ID's to list to determine if there have been any new sales.
      firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
      .get()
      .then((data) => {
        let orderIdList = [];
        data.forEach((doc) => {
          if(doc.data().orderId){
            orderIdList.push(doc.data().orderId)
            //console.log(doc.data().orderId)
          }
        });
        setIds(orderIdList);
      });
  }, []);



  useEffect(() => {
    console.log(props);

    if (props.location.state) {
      if (props.location.state.accessToken) {
        var expDate = new Date(props.location.state.time);
        var mintDate = new Date(props.location.state.time);
        var currentTime = new Date()
        expDate.setSeconds(
          expDate.getSeconds() + props.location.state.expires_in
        );
        console.log(expDate, mintDate);
        if (currentTime > expDate) {
          console.log("Expired");
          //refresh token request
        } else {
          console.log("Not Expired");
          setAccessToken(props.location.state.accessToken);
        }
      }
    }
  }, [dateRange, offset]);

  //Use access token to access orders
  function setAccessToken(accessToken) {
    var date = new Date();
    let startDate = new Date();
    startDate.setDate(date.getDate() - dateRange);

    fetch(
      "http://localhost:3001/api/getOrders?auth=" +
        encodeURIComponent(accessToken) +
        "&date=" +
        encodeURIComponent(startDate.toISOString()) +
        "&offset=" +
        offset,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOrders(result);
        parseJson(result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  //parse order data
  function parseJson(data) {
    // let parse = JSON.parse(data)
    var sales = data.orders;
    console.log(sales);
    sales.map((item) => {
      //console.log(item);
      let order = {
        name: item.lineItems[0].title,
        revenue: item.lineItems[0].total.value,
        shippingReceived: item.lineItems[0].deliveryCost.shippingCost.value,
        soldPrice: item.lineItems[0].lineItemCost.value,
        afterFees: item.paymentSummary.totalDueSeller.value,
        orderId: item.orderId,
        date: item.creationDate,
        cost: 0,
        profit: (
          item.paymentSummary.totalDueSeller.value -
          item.lineItems[0].deliveryCost.shippingCost.value
        ).toFixed(2),
      };

      //if order is not in firestore
      if(ids.indexOf(item.orderId) == -1){
         console.log("NOT IN FIRESTORE", order.name)
        //Add sold item to firestore
        firestore
          .collection("Users")
          .doc(user.uid)
          .collection("Items").
          doc(order.orderId)
          .set({
            Sold: true,
            cost: order.cost || 0,
            name: order.name,
            revenue: order.revenue,
            shippingReceived: order.shippingReceived,
            soldPrice: order.soldPrice,
            afterFees: order.afterFees,
            orderId: order.orderId,
            orderDate: order.date,
            profit: order.profit

          })
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            order = {...order, fireID: docRef.id}
            console.log(order)
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      }
      
      setOrderData((prevState) => [...prevState, order]);
    });
    if (data.next) {
      setOffset(offset + 50);
    }
  }

  function updateDate(data) {
    console.log(data)
    firestore
          .collection("Users")
          .doc(user.uid)
          .collection("Items")
          .doc(data.orderId)
          .update({
            name: data.name,
            revenue: data.revenue,
            shippingReceived: data.shippingReceived,
            soldPrice: data.soldPrice,
            afterFees: data.afterFees,
            orderId: data.orderId,
            date: data.date,
            cost: data.cost,
            profit: data.profit,

          })
          .then(function (docRef) {
            console.log("Document successfuly updated");
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });

  }
  return (
    <div>
      <div>
        <Grid item xs={12} sm={6} md={6} xl={6}>
          <Paper className={classes.paper}>
            <CardContent>
              <FormControl
                className={classes.formControl}
                autoFocus
                margin="dense"
              >
                <InputLabel htmlFor="age-native-simple">Range</InputLabel>
                <Select
                  native
                  value={dateRange}
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    setOrderData([]);
                    setOffset(0);
                  }}
                >
                  <option value={1}>1 Day</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                </Select>
              </FormControl>
            </CardContent>
          </Paper>
        </Grid>
        <Paper>
          <MaterialTable
            title="All Items"
            columns={columns}
            data={orderData}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...orderData];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    dataUpdate[index].profit = (
                      dataUpdate[index].afterFees -
                      dataUpdate[index].cost -
                      dataUpdate[index].shippingReceived
                    ).toFixed(2);
                    //setOrderData([...dataUpdate]);
                    updateDate(dataUpdate[index])
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </Paper>
        <h4>Trouble Connecting to eBay?</h4>
        <a
          target="_self"
          href="
https://auth.ebay.com/oauth2/authorize?client_id=VanceVes-itemTrac-PRD-323495a50-601a5cd9&response_type=code&redirect_uri=Vance_Vescogni-VanceVes-itemTr-mdfozt&scope=https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/commerce.identity.readonly"
        >
          Reauthorize
        </a>
      </div>
    </div>
  );
}
