import React, { useState, useEffect, useContext } from "react";

import useStyles from "./ManageEbay.style";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { firestore } from "../../firebase";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MaterialTable from "material-table";
import { UserContext } from "../../providors/UserProvider";

//TODO: does not add old data when switching from 30 to 90 day view
//doesnt use refresh token when logging in-not checking tokens
export default function ManageEbay(props) {
  const user = useContext(UserContext);

  const classes = useStyles();

  //All sale ID's from the Firestore
  const [ids, setIds] = useState(null);
  //npm run serve
  const [orderData, setOrderData] = useState([]);
  const [dateRange, setDateRange] = useState(30);
  const [offset, setOffset] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);

  //-1 => has not been set. 0 => date range changed, do not use.
  const [lastAddedToFirebase, setLastAddedToFirebase] = useState(-1);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Sold Price", field: "soldPrice", type: "currency" },
    { title: "Your Cost", field: "cost", type: "currency" },
    { title: "Revenue", field: "revenue", type: "currency" },
    { title: "After Fees", field: "afterFees", type: "currency" },
    { title: "Shipping Cost", field: "shippingCost", type: "currency" },
    { title: "Profit", field: "profit", type: "currency" },
  ];

  useEffect(() => {
    let orderIdList = [];

    var date = new Date();
    //date range in milisecond ticks
    var currentDate = date.getTime();
    var tickOffset = currentDate - dateRange * 86400000;

    //check firestore for orders within the time range
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
      .where("soldDate", ">=", tickOffset)
      .orderBy("soldDate", "desc")
      .get()
      .then((data) => {
        if (data.docs.length > 0) {
          if(lastAddedToFirebase == -1){
            setLastAddedToFirebase(data.docs[0].data().soldDate);
          }
          //setFirstAddedToFirebase(data.docs[data.docs.length-1].data().soldDate);
          console.log(data.docs[0].data().itemName);
          data.forEach((doc) => {
            if (doc.data().orderId) {
              orderIdList.push(doc.data().orderId);
            }
            let order = {
              name: doc.data().itemName,
              revenue: doc.data().revenue,
              shippingReceived: doc.data().buyerShipping,
              shippingCost: doc.data().shippingCost,
              soldPrice: doc.data().soldCost,
              afterFees: doc.data().afterFees,
              orderId: doc.data().orderId,
              date: doc.data().soldDate,
              cost: doc.data().itemCost,
              profit: doc.data().profit,
            };
            setTableLoading(false);
            setOrderData((prevState) => [...prevState, order]);
          });
        }
        else{
          setTableLoading(false)
        }
      })
      .then(() => {
        console.log(lastAddedToFirebase)
        console.log(orderIdList);
        setIds(orderIdList);
      });
  }, [dateRange]);

  useEffect(() => {
    console.log(props);
    if (ids == null) {
      console.log("still loading");
    } else {
      console.log(ids);
      var currentDate = new Date();

      //if no firestore tokens, or all expired
      if (props.location.state) {
        //if there are tokens in the state
        if (props.location.state.accessToken) {
          var expDate = new Date(props.location.state.time);
          var currentTime = new Date();
          expDate.setSeconds(
            expDate.getSeconds() + props.location.state.expires_in
          );

          //send tokens to firestore
          firestore
            .collection("Users")
            .doc(user.uid)
            .collection("Tokens")
            .doc("ebayToken")
            .set({
              accessToken: props.location.state.accessToken,
              expires_in: props.location.state.expires_in * 100,
              refresh_token: props.location.state.refresh_token,
              refresh_token_expires_in:
                props.location.state.refresh_token_expires_in * 100,
              access_mint_time: currentDate.getTime(),
              refresh_mint_time: currentDate.getTime(),
            })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef);
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });

          if (currentTime > expDate) {
            console.log("Expired");
            //refresh token request
          } else {
            console.log("Not Expired");
            setAccessToken(props.location.state.accessToken);
          }
        }
        //no tokens in state, check if in firestore
        else {
          //get tokens from firestore
          firestore
            .collection("Users")
            .doc(user.uid)
            .collection("Tokens")
            .get()
            .then((data) => {
              data.forEach((doc) => {
                //token not expired
                if (
                  doc.data().access_mint_time + doc.data().expires_in >
                  currentDate.getTime()
                ) {
                  setAccessToken(doc.data().accessToken);
                  console.log("TOKEN FROM FIRESTORE");
                } else {
                  //access token expired, refresh is not expired
                  if (
                    doc.data().refresh_mint_time +
                      doc.data().refresh_token_expires_in >
                    currentDate.getTime()
                  ) {
                    refreshToken(doc.data().refresh_token);
                    console.log("REFRESH FROM FIRESTORE");
                  } else {
                    //both tokens expired. User needs to reauthorize
                  }
                }
              });
            });
        }
      }
    }
  }, [ids, offset]);

  //Use access token to access orders
  function setAccessToken(accessToken) {
    console.log(lastAddedToFirebase);
    var startDate;
    if (lastAddedToFirebase < 1) {
      var date = new Date();
      startDate = new Date();
      startDate.setDate(date.getDate() - dateRange);
    } else {
      startDate = new Date(lastAddedToFirebase);
      console.log(lastAddedToFirebase);
    }
    console.log(startDate.toISOString());

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
        if (result.orders.length > 0) {
          parseJson(result);
        } else {
          console.log("no new orders");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  function refreshToken(token) {
    fetch(
      "http://localhost:3001/api/refresh?token=" + encodeURIComponent(token),
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.access_token);
        var currentDate = new Date();
        //send tokens to firestore
        firestore
          .collection("Users")
          .doc(user.uid)
          .collection("Tokens")
          .doc("ebayToken")
          .update({
            accessToken: result.access_token,
            expires_in: result.expires_in * 100,
            access_mint_time: currentDate.getTime(),
          })
          .then(function (docRef) {
            console.log("Document updated");
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });

        setAccessToken(result.access_token);
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
      //if order is not in firestore
      if (ids.indexOf(item.orderId) == -1) {
        console.log("NOT IN FIRESTORE", ids);

        //convert date to ticks
        var date = new Date(item.creationDate);

        //add order data to object
        let order = {
          name: item.lineItems[0].title,
          revenue: item.lineItems[0].total.value,
          shippingReceived: item.lineItems[0].deliveryCost.shippingCost.value,
          shippingCost: item.lineItems[0].deliveryCost.shippingCost.value,
          soldPrice: item.lineItems[0].lineItemCost.value,
          afterFees: item.paymentSummary.totalDueSeller.value,
          orderId: item.orderId,
          date: date.getTime(),
          cost: 0,
          profit: (
            item.paymentSummary.totalDueSeller.value -
            item.lineItems[0].deliveryCost.shippingCost.value
          ).toFixed(2),
        };

        //Add sold item to firestore
        firestore
          .collection("Users")
          .doc(user.uid)
          .collection("Items")
          .doc(order.orderId)
          .set({
            Sold: true,
            itemCost: order.cost || 0,
            itemName: order.name,
            revenue: order.revenue,
            buyerShipping: order.shippingReceived,
            shippingCost: order.shippingCost,
            soldCost: order.soldPrice,
            afterFees: order.afterFees,
            orderId: order.orderId,
            soldDate: order.date,
            soldPlatform: "Ebay",
            profit: order.profit,
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", order.orderId);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
        setTableLoading(false);
        setOrderData((prevState) => [...prevState, order]);
      }
    });
    if (data.next) {
      setOffset(offset + 50);
    }
  }

  function updateDate(data) {
    //Update data in local state
    var index = orderData.findIndex((order) => order.orderId == data.orderId);
    //Only updating data the user can change
    orderData[index].name = data.name;
    orderData[index].shippingCost = data.shippingCost;
    orderData[index].soldPrice = data.soldPrice;
    orderData[index].afterFees = data.afterFees;
    orderData[index].profit = data.profit;
    orderData[index].cost = data.cost;
    orderData[index].afterFees = data.afterFees;

    //Update data in firestore
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
      .doc(data.orderId)
      .update({
        itemName: data.name,
        revenue: data.revenue,
        buyerShipping: data.shippingReceived,
        shippingCost: data.shippingCost,
        soldCost: data.soldPrice,
        afterFees: data.afterFees,
        orderId: data.orderId,
        soldDate: data.date,
        itemCost: data.cost,
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
                    setTableLoading(true);
                    setLastAddedToFirebase(0);
                    setOffset(0);
                  }}
                >
                  <option value={1}>1 Day</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={89}>90 Days</option>
                </Select>
              </FormControl>
            </CardContent>
          </Paper>
        </Grid>
        <Paper>
          <MaterialTable
            title="All Items"
            columns={columns}
            data={[...orderData].sort((a,b) => b.soldDate - a.soldDate)}
            isLoading={tableLoading}
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
                      dataUpdate[index].shippingCost
                    ).toFixed(2);
                    //setOrderData([...dataUpdate]);
                    updateDate(dataUpdate[index]);
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
