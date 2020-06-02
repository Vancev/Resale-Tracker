import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import avatar from "assets/img/faces/marc.jpg";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import fire from "../../fire";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchSelect from "react-select";
import CreatableSelect from "react-select/lib/Creatable";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
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
    //Add data from firestore to local state
    fire
      .firestore()
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
    fire
    .firestore()
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


  function setNewPlatform(newPlatform){
    if (newPlatform !== "") {
      //Add new item to firestore
      fire
        .firestore()
        .collection("SoldLocation")
        .add({
          location: newPlatform,
        })
        .then(function(docRef) {
          //TODO: Use this ID to delete documents. Find out where to store ID.
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    }
    setAddedPlatform(true)
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
      fire
        .firestore()
        .collection("Items")
        .add({
          Sold: soldBool,
          boughtFrom: boughgtFrom,
          itemCost: cost,
          itemName: name,
        })
        .then(function(docRef) {
          //TODO: Use this ID to delete documents. Find out where to store ID.
          console.log("Document written with ID: ", docRef.id);
          toast.success("Item was added");
          resetItem();
        })
        .catch(function(error) {
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
      fire
        .firestore()
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
        .then(function(docRef) {
          //TODO: Use this ID to delete documents. Find out where to store ID.
          console.log("Document written with ID: ", docRef.id);
          toast.success("Item was added");
          resetItem();
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          toast.error("Error adding document: ", error);
        });
    }
  }

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Add New Item</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <TextField
                    type="itemName"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <TextField
                    type="Cost"
                    label="Cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    type="boughtFrom"
                    label="Buy Location"
                    value={boughgtFrom}
                    onChange={(e) => setBoughtFrom(e.target.value)}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
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
                </GridItem>
              </GridContainer>
              <div>
                {sold === "true" ? (
                  <div>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        type="soldCost"
                        label="Sold Cost"
                        value={soldCost}
                        onChange={(e) => setSoldCost(e.target.value)}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        type="buyerShipping"
                        label="Shipping Paid By Buyer"
                        value={buyerShipping}
                        onChange={(e) => setBuyerShipping(e.target.value)}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        type="shippingCost"
                        label="Shipping Cost"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(e.target.value)}
                      />
                    </GridItem>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <CreatableSelect
                          options={soldPlatforms}
                          placeholder="Selling Platform"
                          isClearable
                          onChange={(opt, meta) => {
                            setSoldPlatform(opt.value)
                             if (meta.action === "create-option"){
                               setNewPlatform(opt.value)
                               console.log(opt)
                             }
                             console.log(opt)
                            }}
                        />
                      </GridItem>
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
                    </GridContainer>
                  </div>
                ) : null}
              </div>
            </CardBody>
            <CardFooter>
              <Button
                color="primary"
                onClick={() => {
                  addItem();
                }}
              >
                Add Item
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <ToastContainer />
    </div>
  );
}
