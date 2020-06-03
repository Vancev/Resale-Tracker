import React, { useState, useEffect, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { FormControl } from "@material-ui/core";
import { firestore } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/lib/Creatable";
import useStyles from "./AddItem.style";
import { UserContext } from "../../providors/UserProvider";

//TODO Add createable select to TableList
export default function AddItem() {
  const [cost, setCost] = useState("");
  const [boughgtFrom, setBoughtFrom] = useState("");
  const [sold, setSold] = useState("false");
  const [name, setName] = useState("");
  const [soldCost, setSoldCost] = useState("");
  const [buyerShipping, setBuyerShipping] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  //Single platform chosen
  const [soldPlatform, setSoldPlatform] = useState("");
  const [profit, setProfit] = React.useState(0);

  const user = useContext(UserContext);
  function resetItem() {
    setCost("");
    setBoughtFrom("");
    setSold("false");
    setName("");
    setSoldCost("");
    setBuyerShipping("");
    setShippingCost("");
    setSoldPlatform("");
    setProfit(0);
  }

  //Array of all possible selling platforms
  const [soldPlatforms, setSoldPlatforms] = React.useState([]);
  const [addedPlatform, setAddedPlatform] = React.useState(false);

  useEffect(() => {
    //Add platforms from firestore to local state
    firestore
    .collection("Users")
    .doc(user.uid)
    .collection("SoldLocation")
      .get()
      .then((data) => {
        let tempItems = [];
        data.forEach((doc) => {
          let item = {
            label: doc.data().location,
            value: doc.data().location,
          };
          tempItems.push(item);
        });
        console.log(tempItems);
        setSoldPlatforms(tempItems);
      });
  }, []);

  useEffect(() => {
    firestore
    .collection("Users")
    .doc(user.uid)
    .collection("SoldLocation")
      .get()
      .then((data) => {
        let tempItems = [];
        data.forEach((doc) => {
          let item = {
            label: doc.data().location,
            value: doc.data().location,
          };
          tempItems.push(item);
        });
        console.log(tempItems);
        setSoldPlatforms(tempItems);
      });
  }, [addedPlatform]);

  function setNewPlatform(newPlatform) {
    if (newPlatform !== "") {
      //Add new item to firestore
      firestore
      .collection("Users")
      .doc(user.uid)
      .collection("SoldLocation")
        .add({
          location: newPlatform,
        })
        .then(function (docRef) {
          //TODO: Use this ID to delete documents. Find out where to store ID.
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
    setAddedPlatform(true);
  }

  function addItem(e) {
    let soldBool = null;
    if (sold === "true") {
      soldBool = true;
    } else if (sold === "false") {
      soldBool = false;
    } else {
      soldBool = null;
    }
    /* Send the item to Firebase */
    if (sold === "false") {
      firestore
        .collection("Users")
        .doc(user.uid)
        .collection("Items")
        .add({
          Sold: soldBool,
          boughtFrom: boughgtFrom,
          itemCost: cost,
          itemName: name,
        })
        .then(function (docRef) {
          //TODO: Use this ID to delete documents. Find out where to store ID.
          console.log("Document written with ID: ", docRef.id);
          toast.success("Item was added");
          resetItem();
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          toast.error("Error adding document: ", error);
        });
    }
    if (sold === "true") {
      let profit;
      switch (soldPlatform) {
        case "Mecari":
          let fee = parseFloat(soldCost) * 0.1;
          profit =
            parseFloat(soldCost || 0) -
            parseFloat(cost || 0) -
            parseFloat(shippingCost || 0) +
            parseFloat(buyerShipping || 0) -
            parseFloat(fee || 0);
          console.log(profit);
          break;
        case "Ebay":
          break;
        case "Local":
          profit =
            parseFloat(soldCost || 0) -
            parseFloat(cost || 0) -
            parseFloat(shippingCost || 0) +
            parseFloat(buyerShipping || 0);
          break;
        default:
          profit =
            parseFloat(soldCost || 0) -
            parseFloat(cost || 0) -
            parseFloat(shippingCost || 0) +
            parseFloat(buyerShipping || 0);
          break;
      }
      console.log(profit);
      firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
        .add({
          Sold: soldBool,
          boughtFrom: boughgtFrom,
          itemCost: cost,
          itemName: name,
          soldCost: soldCost,
          shippingCost: shippingCost,
          buyerShipping: buyerShipping,
          soldPlatform: soldPlatform,
          profit: profit,
        })
        .then(function (docRef) {
          //TODO: Use this ID to delete documents. Find out where to store ID.
          console.log("Document written with ID: ", docRef.id);
          toast.success("Item was added");
          resetItem();
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          toast.error("Error adding document: ", error);
        });
    }
  }

  const classes = useStyles();
  return (
    <div>
      <div>
        <div>
          <div>
            <div>
              <h4 className={classes.cardTitleWhite}>Add New Item</h4>
            </div>
            <div>
              <div>
                <div>
                  <TextField
                    type="itemName"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <TextField
                    type="Cost"
                    label="Cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div>
                  <TextField
                    type="boughtFrom"
                    label="Buy Location"
                    value={boughgtFrom}
                    onChange={(e) => setBoughtFrom(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-native-simple">Sold?</InputLabel>
                    <Select
                      native
                      value={sold}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setSold(e.target.value);
                      }}
                    >
                      <option value={"false"}>False</option>
                      <option value={"true"}>True</option>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div>
                {sold === "true" ? (
                  <div>
                    <div>
                      <TextField
                        type="soldCost"
                        label="Sold Cost"
                        value={soldCost}
                        onChange={(e) => setSoldCost(e.target.value)}
                      />
                    </div>
                    <div xs={12} sm={12} md={6}>
                      <TextField
                        type="buyerShipping"
                        label="Shipping Paid By Buyer"
                        value={buyerShipping}
                        onChange={(e) => setBuyerShipping(e.target.value)}
                      />
                    </div>
                    <div>
                      <TextField
                        type="shippingCost"
                        label="Shipping Cost"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(e.target.value)}
                      />
                    </div>
                    <div>
                      <div>
                        <CreatableSelect
                          options={soldPlatforms}
                          placeholder="Selling Platform"
                          isClearable
                          onChange={(opt, meta) => {
                            setSoldPlatform(opt.value);
                            if (meta.action === "create-option") {
                              setNewPlatform(opt.value);
                              console.log(opt);
                            }
                            console.log(opt);
                          }}
                        />
                      </div>
                      {/* <GridItem xs={12} sm={12} md={6}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id="platform-select-label">
                            Platform
                          </InputLabel>
                          <Select
                            labelid="platform-select-label"
                            id="platform-select"
                            value={soldPlatform}
                            onChange={(e) => {
                              setSoldPlatform(e.target.value);
                            }}
                          >
                            <MenuItem value={"Mecari"}>Mecari</MenuItem>
                            <MenuItem value={"Ebay"}>Ebay</MenuItem>
                            <MenuItem value={"Local"}>Local</MenuItem>
                          </Select>
                        </FormControl>
                      </GridItem> */}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  addItem();
                }}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
