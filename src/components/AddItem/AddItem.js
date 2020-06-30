import React, { useState, useEffect, useContext } from "react";
// @material-ui/core components
import InputLabel from "@material-ui/core/InputLabel";
// core components
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { FormControl } from "@material-ui/core";
import { firestore } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlatformSelect from "react-select";
import useStyles from "./AddItem.style";
import { UserContext } from "../../providors/UserProvider";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { CalculateProfit } from "../../functions/CalculateProfit";

export function AddItem(itemAdded) {
  const [cost, setCost] = useState("");
  const [boughtFrom, setBoughtFrom] = useState("");
  const [sold, setSold] = useState("false");
  const [name, setName] = useState("");
  const [soldCost, setSoldCost] = useState("");
  const [buyerShipping, setBuyerShipping] = useState("");
  const [shippingCost, setShippingCost] = useState("");

  const [costError, setCostError] = useState();
  const [nameError, setNameError] = useState();
  const [soldCostError, setSoldCostError] = useState();

  //Single platform chosen
  const [soldPlatform, setSoldPlatform] = useState({});
  const [profit, setProfit] = React.useState(0);

  const [ebayCategories, setEbayCategories] = React.useState();
  const [ebayCategory, setEbayCategory] = React.useState("");
  const [ebayOther, setEbayOther] = React.useState({
    store: false,
    topRated: false,
    managedPayment: false,
    internationalPayment: false,
    promotedListing: false,
  });
  const [adRate, setAdRate] = React.useState("");

  const user = useContext(UserContext);
  function resetItem() {
    setCost("");
    setBoughtFrom("");
    setSold("false");
    setName("");
    setSoldCost("");
    setBuyerShipping("");
    setShippingCost("");
    setSoldPlatform({});
    setProfit(0);
    setCostError();
    setNameError();
    setSoldCostError();
  }

  //Array of all possible selling platforms
  const [soldPlatforms, setSoldPlatforms] = React.useState([]);
  const [addedPlatform, setAddedPlatform] = React.useState(false);

  useEffect(() => {
    //Add platforms from firestore to local state
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
            });
            setEbayCategories(tempCategories);
          }
        });
        setSoldPlatforms(tempItems);
      });
  }, []);

  function addItem(e) {
    let soldBool = null;
    if (sold === "true") {
      soldBool = true;
    } else if (sold === "false") {
      soldBool = false;
    } else {
      soldBool = null;
    }
    let inputError = false;

    if (name == "") {
      setNameError("Can not be empty");
      inputError = true;
    }
    if (soldBool && soldCost == "") {
      setSoldCostError("Can not be empty");
      inputError = true;
    }
    let sellingPlatform = soldPlatform;

    //if "Sold Platform" field was left empty
    if (Object.keys(soldPlatform).length === 0) {
      sellingPlatform = "Not Specified";
    }

    //if No unput errors detected
    if (!inputError) {
      /* Send the item to Firebase */
      if (sold === "false") {
        firestore
          .collection("Users")
          .doc(user.uid)
          .collection("Items")
          .add({
            Sold: soldBool,
            boughtFrom: boughtFrom,
            itemCost: cost || 0,
            itemName: name,
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            itemAdded.itemAdded(docRef.id);
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
        let fees = soldPlatforms.find(({ value }) => value === sellingPlatform);
        profit = CalculateProfit(
          sellingPlatform,
          fees,
          soldCost,
          cost,
          shippingCost,
          buyerShipping,
          ebayCategory,
          ebayOther,
          adRate
        );
        let today = new Date();
        let date = new Date().setDate(today.getDate());
        if (sellingPlatform === "Ebay") {
          firestore
            .collection("Users")
            .doc(user.uid)
            .collection("Items")
            .add({
              Sold: soldBool,
              boughtFrom: boughtFrom,
              itemCost: cost || 0,
              itemName: name,
              soldCost: soldCost,
              shippingCost: shippingCost || 0,
              buyerShipping: buyerShipping || 0,
              soldPlatform: sellingPlatform,
              ebayCategory: ebayCategory,
              ebayOther: ebayOther,
              adRate: adRate || "",
              soldDate: date,
              profit: profit,
            })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
              itemAdded.itemAdded(docRef.id);
              toast.success("Item was added");
              resetItem();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
              toast.error("Error adding document: ", error);
            });
        } else {
          firestore
            .collection("Users")
            .doc(user.uid)
            .collection("Items")
            .add({
              Sold: soldBool,
              boughtFrom: boughtFrom,
              itemCost: cost || 0,
              itemName: name,
              soldCost: soldCost,
              shippingCost: shippingCost || 0,
              buyerShipping: buyerShipping || 0,
              soldPlatform: sellingPlatform,
              soldDate: date,
              profit: profit,
            })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
              itemAdded.itemAdded(docRef.id);
              toast.success("Item was added");
              resetItem();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
              toast.error("Error adding document: ", error);
            });
        }
      }
    }
  }

  const handelCheckedChange = (event) => {
    setEbayOther({ ...ebayOther, [event.target.name]: event.target.checked });
  };

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
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameError}
                    type="itemName"
                    label="Name"
                  />
                </div>
                <div>
                  <TextField
                    type="Cost"
                    label="Cost"
                    value={cost}
                    onChange={(e) => {
                      var rgx = /^[0-9]*\.?[0-9]*$/;
                      if (e.target.value === "" || rgx.test(e.target.value)) {
                        setCost(e.target.value);
                      }

                      if (!rgx.test(e.target.value)) {
                        setCostError("Must be numberic value");
                      }
                    }}
                    error={costError}
                    helperText={costError}
                  />
                </div>
              </div>
              <div>
                <div>
                  <TextField
                    type="boughtFrom"
                    label="Buy Location"
                    value={boughtFrom}
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
                      required
                      value={sold}
                      onChange={(e) => {
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
                        required
                        type="soldCost"
                        label="Sold Cost"
                        value={soldCost}
                        onChange={(e) => {
                          var rgx = /^[0-9]*\.?[0-9]*$/;
                          if (
                            e.target.value === "" ||
                            rgx.test(e.target.value)
                          ) {
                            setSoldCost(e.target.value);
                          }

                          if (!rgx.test(e.target.value)) {
                            setSoldCostError("Must be numberic value");
                          }
                        }}
                        error={soldCostError}
                        helperText={soldCostError}
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
                        {/* <CreatableSelect to allow creation */}
                        <PlatformSelect
                          options={soldPlatforms}
                          placeholder="Selling Platform"
                          onChange={(opt, meta) => {
                            setSoldPlatform(opt.value);
                          }}
                        />
                      </div>
                    </div>
                    <div></div>
                    {soldPlatform === "Ebay" ? (
                      <div>
                        <PlatformSelect
                          options={ebayCategories}
                          placeholder={ebayCategory || "Ebay Item Category"}
                          //isClearable
                          onChange={(opt, meta) => {
                            setEbayCategory(opt.value);
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
                                  checked={ebayOther.store}
                                  onChange={handelCheckedChange}
                                  name="store"
                                />
                              }
                              label="eBay Store (Basic or above)"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={ebayOther.topRated}
                                  onChange={handelCheckedChange}
                                  name="topRated"
                                />
                              }
                              label="Top Rated Seller"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={ebayOther.managedPayment}
                                  onChange={handelCheckedChange}
                                  name="managedPayment"
                                />
                              }
                              label="Ebay Managed Payment"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={ebayOther.internationalPayment}
                                  onChange={handelCheckedChange}
                                  name="internationalPayment"
                                />
                              }
                              label="International payment"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={ebayOther.promotedListing}
                                  onChange={handelCheckedChange}
                                  name="promotedListing"
                                />
                              }
                              label="Promoted Listing"
                            />
                          </FormGroup>
                        </FormControl>

                        {ebayOther.promotedListing === true ? (
                          <TextField
                            autoFocus
                            type="number"
                            margin="dense"
                            id="adRate"
                            label="Promotion Ad Rate"
                            value={adRate}
                            onChange={(e) => {
                              setAdRate(e.target.value);
                            }}
                            type="adRate"
                            fullWidth
                          />
                        ) : null}
                      </div>
                    ) : null}
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
