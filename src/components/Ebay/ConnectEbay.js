import React, { useState, useEffect, useContext } from "react";
// core components
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./Estimate.style";
import { UserContext } from "../../providors/UserProvider";


export default function ConnectEbay(props) {
  const user = useContext(UserContext);
  const [orders, setOrders] = useState("no orders");

  useEffect(() => {
    if (props.location) {
      let str = props.location.search;
      if (str !== "") {
        let token = str.substring(str.indexOf("=") + 1, str.lastIndexOf("&"));
        console.log(token);
        getAccessToken(token);
      }
    }
  }, []);

  //Exchange auth code for access token
  function getAccessToken(token) {
    var date = new Date()
    console.log(date.toLocaleString())
    fetch("http://localhost:3001/api/auth?auth=" + decodeURI(token), {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        props.navigate("/dashboard/manageebay", {
          state: {
            accessToken: result.access_token,
            expires_in: result.expires_in,
            refresh_token: result.refresh_token,
            refresh_token_expires_in: result.refresh_token_expires_in,
            time: date
          },
        });
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

  const classes = useStyles();
  return (
    <div>
      <div>
        <h4 className={classes.cardTitleWhite}>Connect to eBay</h4>
        <a
          target="_self"
          href="
https://auth.ebay.com/oauth2/authorize?client_id=VanceVes-itemTrac-PRD-323495a50-601a5cd9&response_type=code&redirect_uri=Vance_Vescogni-VanceVes-itemTr-mdfozt&scope=https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/commerce.identity.readonly"
        >
          Connect
        </a>
        <h3>{JSON.stringify(orders)}</h3>
      </div>
      <ToastContainer />
    </div>
  );
}
