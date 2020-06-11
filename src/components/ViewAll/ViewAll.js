import React, { useState, useEffect, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components

import { firestore } from "../../firebase";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import CreatableSelect from "react-select/lib/Creatable";
import { UserContext } from "../../providors/UserProvider";
import PlatformSelect from "react-select";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { CalculateProfit } from "../../functions/CalculateProfit";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const user = useContext(UserContext);

  //All items directly from the Firestore
  const [items, setItems] = useState([]);
  //Item to be deleted
  const [toDelete, setDelete] = useState("");
  //Set the item to open or closed to display more information
  const [open, setOpen] = React.useState(false);

  const [modified, setModified] = React.useState(false);

  //Information changed from the clicked item
  //Followed by bool if the item has been changed
  const [cost, setCost] = useState(["", false]);
  const [boughtFrom, setBoughtFrom] = useState(["", false]);
  const [sold, setSold] = useState(["false", "false"]);
  const [name, setName] = useState(["", false]);
  const [soldCost, setSoldCost] = useState(["", false]);
  const [buyerShipping, setBuyerShipping] = useState(["", false]);
  const [shippingCost, setShippingCost] = useState(["", false]);
  const [soldPlatform, setSoldPlatform] = useState(["", false]);
  const [id, setID] = useState("");
  const [soldDate, setSoldDate] = useState("")
  const [profit, setProfit] = React.useState([0, false]);

  //Platforms to display in the "Platform" dropdown
  const [soldPlatforms, setSoldPlatforms] = React.useState();
  const [addedPlatform, setAddedPlatform] = React.useState(false);

  const [ebayCategory, setEbayCategory] = React.useState(["", false]);
  const [ebayCategories, setEbayCategories] = React.useState();
  const [ebayOther, setEbayOther] = React.useState([
    {
      store: false,
      topRated: false,
      managedPayment: false,
      internationalPayment: false,
      promotedListing: false,
    },
    false,
  ]);
  const [adRate, setAdRate] = React.useState(["", false]);

  //Columns to display
  const [state, setState] = React.useState({
    columns: [
      { title: "Name", field: "itemName" },
      { title: "Bought From", field: "boughtFrom" },
      { title: "Cost", field: "itemCost", type: "numeric" },
      { title: "Sold", field: "Sold", type: "boolean" },
      { title: "Profit", field: "profit", type: "numeric" },
    ],
  });

  //Delete item from firestore
  //State is not updated here
  function deleteItem(oldData, e) {
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
      .doc(oldData.id)
      .delete()
      .then(function () {
        console.log("Document Deleted");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }

  useEffect(() => {
    //Add data from firestore to local state
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
      .get()
      .then((data) => {
        let tempItems = [];
        data.forEach((doc) => {
          console.log(doc.data());
          let item = doc.data();
          item["id"] = doc.id;
          console.log(item);
          //   let item = {
          //     name: doc.data().itemName,
          //     bought: doc.data().boughtFrom,
          //     cost: doc.data().itemCost,
          //     sold: doc.data().Sold,
          //     profit: doc.data().profit,
          //     soldPlatform: doc.data().soldPlatform,
          //     soldCost: doc.data().soldCost,
          //     shippingCost: doc.data().shippingCost,
          //     buyerShipping: doc.data().buyerShipping,
          //     id: doc.id,
          //   };
          tempItems.push(item);
        });
        setItems(tempItems);
      });

    firestore
      .collection("SoldPlatforms")
      .get()
      .then((data) => {
        let tempItems = [];
        data.forEach((doc) => {
          let item = {
            label: doc.data().platform,
            value: doc.data().platform,
            fee: doc.data(),
          };
          tempItems.push(item);
          if (doc.data().platform == "Ebay") {
            let tempCategories = [];
            doc.data().ebayCategory.map((category) => {
              let tempCategory = {
                label: category.CategoryName,
                value: category.CategoryName,
                categoryFee: category.CategoryFee,
                maxFee: category.MaxFee,
              };
              tempCategories.push(tempCategory);
              console.log(category.CategoryName);
            });
            setEbayCategories(tempCategories);
            console.log(tempCategories);
          }
        });
        console.log(tempItems);
        setSoldPlatforms(tempItems);
      });
  }, []);

  //   useEffect(() => {
  //     firestore
  //       .collection("Users")
  //       .doc(user.uid)
  //       .collection("SoldLocation")
  //       .get()
  //       .then((data) => {
  //         let tempItems = [];
  //         data.forEach((doc) => {
  //           let item = {
  //             label: doc.data().location,
  //             value: doc.data().location,
  //           };
  //           tempItems.push(item);
  //         });
  //         console.log(tempItems);
  //         setSoldPlatforms(tempItems);
  //       });
  //   }, [addedPlatform]);

  //Update state after an item has been deleted or modified
  useEffect(() => {
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Items")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed" && change.doc.id === toDelete) {
            const item = items.filter((item) => item.id !== change.doc.id);
            setItems(item);
          }
          if (change.type === "modified" && change.doc.id === id) {
            let tempItems = [];
            items.forEach((item) => {
              if (item.id == id) {
                let tempItem = {};
                if (sold[0] === false) {
                  tempItem = {
                    itemName: name[0],
                    boughtFrom: boughtFrom[0],
                    itemCost: cost[0],
                    Sold: sold[0],
                    id: id,
                  };
                } else {
                  if (soldPlatform[0] == "Ebay") {
                    tempItem = {
                      soldCost: soldCost[0],
                      buyerShipping: buyerShipping[0],
                      shippingCost: shippingCost[0],
                      soldPlatform: soldPlatform[0],
                      itemName: name[0],
                      boughtFrom: boughtFrom[0],
                      itemCost: cost[0],
                      Sold: sold[0],
                      profit: profit[0] || 0,
                      ebayCategory: ebayCategory[0],
                      soldDate: soldDate,
                      ebayOther: ebayOther[0],
                      adRate: adRate[0] || "",
                      id: id,
                    };
                  } else {
                    tempItem = {
                      soldCost: soldCost[0],
                      buyerShipping: buyerShipping[0],
                      shippingCost: shippingCost[0],
                      soldPlatform: soldPlatform[0],
                      itemName: name[0],
                      boughtFrom: boughtFrom[0],
                      itemCost: cost[0],
                      Sold: sold[0],
                      soldDate: soldDate,
                      profit: profit[0] || 0,
                      id: id,
                    };
                  }
                }
                tempItems.push(tempItem);
              } else {
                tempItems.push(item);
              }
            });
            setItems(tempItems);
          }
          //TODO: Update state if change is modified
        });
      });
    setDelete("");
  }, [toDelete, modified, profit]);

  //TODO: Allow manual changing of profit
  const handleClickOpen = (rowData) => {
    console.log(rowData);
    setName([rowData.itemName, false]);
    setCost([rowData.itemCost, false]);
    setBoughtFrom([rowData.boughtFrom, false]);
    setSold([rowData.Sold, false]);
    setSoldCost([rowData.soldCost, false]);
    setBuyerShipping([rowData.buyerShipping, false]);
    setShippingCost([rowData.shippingCost, false]);
    //SoldPlatform has data of just "Platform" and also has data of object of all fees. Fix to
    //have one or the other. Possibly make a new var for only platforma and another for fees
    setSoldPlatform([rowData.soldPlatform, false]);
    setProfit([rowData.profit, false]);
    setEbayOther([rowData.ebayOther, false]);
    setEbayCategory([rowData.ebayCategory, false]);
    setAdRate([rowData.adRate, false]);
    setSoldDate(rowData.soldDate)
    setID(rowData.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    //Check if any fields have been modified
    console.log(soldPlatform);
    if (
      cost[1] == false &&
      boughtFrom[1] == false &&
      sold[1] == false &&
      name[1] == false &&
      soldCost[1] == false &&
      buyerShipping[1] == false &&
      shippingCost[1] == false &&
      soldPlatform[1] == false &&
      profit[1] == false &&
      ebayOther[1] == false &&
      adRate[1] == false &&
      ebayCategory[1] == false
    ) {
      console.log("no changes made");
      setOpen(false);
    } else {
      //If item was changed from unsold to sold, update the sold date
      if(sold[1] == true){
        let today = new Date()
        let date = new Date().setDate(today.getDate())
        //let date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + (today.getFullYear());
        setSoldDate(date)
      }
      let soldBool = null;
      //converts sold from string to bool
      if (sold[0] === "true") {
        soldBool = true;
      } else if (sold[0] === "false") {
        soldBool = false;
      } else {
        soldBool = sold[0];
      }
      if (soldBool === false) {
        console.log(boughtFrom[0], cost[0], name[0], sold[0]);
        setModified(true);
        setProfit(["", false]);
        firestore
          .collection("Users")
          .doc(user.uid)
          .collection("Items")
          .doc(id)
          .update({
            Sold: soldBool,
            profit: "",
            boughtFrom: boughtFrom[0],
            itemCost: cost[0],
            itemName: name[0],
          })
          .then(function (docRef) {
            console.log("Document successfuly updated");
            //resetItem();
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
            //toast.error("Error adding document: ", error);
          });
      }
      console.log(soldPlatform[0]);
      if (soldBool === true) {
        let fees = soldPlatforms.find(({ value }) => value === soldPlatform[0]);
        let tempProfit;
        if (profit[1] === true) {
          tempProfit = profit[0];
        } else {
          tempProfit = CalculateProfit(
            soldPlatform[0],
            fees,
            soldCost[0],
            cost[0],
            shippingCost[0],
            buyerShipping[0],
            ebayCategory[0],
            ebayOther[0],
            soldDate,
            adRate[0]
          );

          setProfit([tempProfit, false]);
        }
        if (soldPlatform[0] === "Ebay") {
          firestore
            .collection("Users")
            .doc(user.uid)
            .collection("Items")
            .doc(id)
            .update({
              Sold: soldBool,
              boughtFrom: boughtFrom[0],
              itemCost: cost[0],
              itemName: name[0],
              soldCost: soldCost[0],
              shippingCost: shippingCost[0],
              buyerShipping: buyerShipping[0],
              soldPlatform: soldPlatform[0],
              ebayCategory: ebayCategory[0],
              ebayOther: ebayOther[0],
              soldDate,
              adRate: adRate[0] || "",
              profit: tempProfit,
            })
            .then(function (docRef) {
              console.log("Document updated");
              //toast.success("Item was added");
              //resetItem();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
              //toast.error("Error adding document: ", error);
            });
        } else {
          firestore
            .collection("Users")
            .doc(user.uid)
            .collection("Items")
            .doc(id)
            .update({
              Sold: soldBool,
              boughtFrom: boughtFrom[0],
              itemCost: cost[0],
              itemName: name[0],
              soldCost: soldCost[0],
              shippingCost: shippingCost[0],
              buyerShipping: buyerShipping[0],
              soldDate,
              soldPlatform: soldPlatform[0],
              profit: tempProfit,
            })
            .then(function (docRef) {
              console.log("Document updated");
              //toast.success("Item was added");
              //resetItem();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
              //toast.error("Error adding document: ", error);
            });
        }
      }
      setOpen(false);
    }
  };

  const handelCheckedChange = (event) => {
    setEbayOther([
      { ...ebayOther[0], [event.target.name]: event.target.checked },
      true,
    ]);
  };
  //   function setNewPlatform(newPlatform) {
  //     if (newPlatform !== "") {
  //       //Add new item to firestore
  //       firestore
  //         .collection("Users")
  //         .doc(user.uid)
  //         .collection("SoldLocation")
  //         .add({
  //           location: newPlatform,
  //         })
  //         .then(function (docRef) {
  //           //TODO: Use this ID to delete documents. Find out where to store ID.
  //           console.log("Document written with ID: ", docRef.id);
  //         })
  //         .catch(function (error) {
  //           console.error("Error adding document: ", error);
  //         });
  //     }
  //     setAddedPlatform(true);
  //   }

  const classes = useStyles();
  return (
    <div>
      <div>
        <MaterialTable
          title="All Items"
          columns={state.columns}
          data={items}
          onRowClick={(event, rowData) => handleClickOpen(rowData)}
          editable={{
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setDelete(oldData.id);
                  deleteItem(oldData);
                }, 600);
              }),
          }}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">View/Edit Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit or mark your item sold.</DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            defaultValue={name[0]}
            onChange={(e) => setName([e.target.value, true])}
            type="name"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="bought"
            label="Bought From"
            value={boughtFrom[0]}
            onChange={(e) => setBoughtFrom([e.target.value || "", true])}
            type="bought"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="cost"
            label="Your Cost"
            value={cost[0]}
            onChange={(e) => setCost([e.target.value || 0, true])}
            type="cost"
            fullWidth
          />
          <FormControl
            className={classes.formControl}
            autoFocus
            margin="dense"
            fullWidth
          >
            <InputLabel htmlFor="age-native-simple">Sold?</InputLabel>
            <Select
              native
              value={sold[0]}
              onChange={(e) => {
                if (e.target.value === "false") {
                  setSold([false, true]);
                }
                if (e.target.value === "true") {
                  setSold([true, true]);
                }
              }}
            >
              <option value={"false"}>False</option>
              <option value={"true"}>True</option>
            </Select>
          </FormControl>
          {sold[0] === "true" || sold[0] == true ? (
            <div>
              <PlatformSelect
                options={soldPlatforms}
                placeholder={soldPlatform[0] || "Selling Platform"}
                //isClearable
                onChange={(opt, meta) => {
                  console.log(opt);
                  setSoldPlatform([opt.value, true]);
                  // if (meta.action === "create-option") {
                  //   setNewPlatform(opt.value);
                  //   console.log(opt);
                  // }
                }}
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="soldcost"
                label="Sold Cost"
                value={soldCost[0]}
                onChange={(e) => setSoldCost([e.target.value, true])}
                type="soldcost"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="shipping"
                label="Your Shipping Cost"
                value={shippingCost[0]}
                onChange={(e) => setShippingCost([e.target.value || 0, true])}
                type="shipping"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="buyershipping"
                label="Shipping Paid by Buyer"
                value={buyerShipping[0]}
                onChange={(e) => setBuyerShipping([e.target.value || 0, true])}
                type="buyershipping"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="profit"
                label="Profit"
                value={profit[0]}
                onChange={(e) => setProfit([e.target.value, true])}
                type="profit"
                fullWidth
              />

              {soldPlatform[0] == "Ebay" ? (
                <div>
                  <PlatformSelect
                    options={ebayCategories}
                    placeholder={ebayCategory[0] || "Ebay Item Category"}
                    //isClearable
                    onChange={(opt, meta) => {
                      console.log(opt);
                      setEbayCategory([opt.value, true]);
                      // if (meta.action === "create-option") {
                      //   setNewPlatform(opt.value);
                      //   console.log(opt);
                      // }
                    }}
                  />
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormLabel component="legend">More Options</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ebayOther[0].store}
                            onChange={handelCheckedChange}
                            name="store"
                          />
                        }
                        label="eBay Store (Basic or above)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ebayOther[0].topRated}
                            onChange={handelCheckedChange}
                            name="topRated"
                          />
                        }
                        label="Top Rated Seller"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ebayOther[0].managedPayment}
                            onChange={handelCheckedChange}
                            name="managedPayment"
                          />
                        }
                        label="Ebay Managed Payment"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ebayOther[0].internationalPayment}
                            onChange={handelCheckedChange}
                            name="internationalPayment"
                          />
                        }
                        label="International payment"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ebayOther[0].promotedListing}
                            onChange={handelCheckedChange}
                            name="promotedListing"
                          />
                        }
                        label="Promoted Listing"
                      />
                    </FormGroup>
                  </FormControl>

                  {ebayOther[0].promotedListing === true ? (
                    <TextField
                      autoFocus
                      type="number"
                      margin="dense"
                      id="adRate"
                      label="Promotion Ad Rate"
                      value={adRate[0]}
                      onChange={(e) => {
                        setAdRate([e.target.value, true]);
                      }}
                      type="adRate"
                      fullWidth
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setModified(true);
                  handleSave();
                }, 600);
              });
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
