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
import PlatformSelect from "react-select";
import useStyles from "./Expenses.style";
import { UserContext } from "../../providors/UserProvider";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { CalculateProfit } from "../../functions/CalculateProfit";
import MaterialTable from "material-table";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

export default function Expenses() {
  const user = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);

  const [expense, setExpense] = useState("");
  const [expenseAdded, setExpenseAdded] = useState(false);
  const [expenseValue, setExpenseValue] = useState("");
  const [toDelete, setDelete] = useState("");

  const [state, setState] = React.useState({
    columns: [
      { title: "Name", field: "Expense" },
      { title: "Expense Value", field: "Value", type: "numeric" },
      { title: "Date", field: "Date" },
    ],
  });

  useEffect(() => {
      setExpenseAdded(false)
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Expenses")
      .get()
      .then((data) => {
        let tempItems = [];
        data.forEach((doc) => {
          let item = {
            Expense: doc.data().Expense,
            Value: doc.data().Value,
            Date: formatDate(doc.data().Date),
          };
          item["id"] = doc.id;
          tempItems.push(item);
        });
        setExpenses(tempItems);
      });
  }, [expenseAdded, toDelete]);

  let today = new Date();
  const date = new Date().setDate(today.getDate());

  function formatDate(ticks) {
    var date = new Date(ticks);
    let today =
      date.toLocaleString("default", { month: "long" }) +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear();
    return today;
  }

  function addExpense() {
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Expenses")
      .add({
        Expense: expense,
        Value: expenseValue,
        Date: date,
      })
      .then(function (docRef) {
        //TODO: Use this ID to delete documents. Find out where to store ID.
        console.log("Document written with ID: ", docRef.id);
        toast.success("Item was added");
        setExpenseAdded(true)
        resetItem();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        toast.error("Error adding document: ", error);
      });
  }

  function resetItem() {
    setExpense("");
    setExpenseValue("");
  }


    //Delete item from firestore
  function deleteItem(oldData, e) {
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Expenses")
      .doc(oldData.id)
      .delete()
      .then(function () {
        console.log("Document Deleted");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }

  const classes = useStyles();
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <div>
              <h4 className={classes.cardTitleWhite}>Add New Expense</h4>
            </div>
            <div>
              <TextField
                type="Expense"
                label="Expense Name"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
              />
              <TextField
                type="ExpenseValue"
                label="Expense Value"
                value={expenseValue}
                onChange={(e) => setExpenseValue(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                addExpense();
              }}
            >
              Add Item
            </button>
          </Paper>
        </Grid>
        <ToastContainer />
        <Grid item xs={9}>
        <Paper className={classes.paper}>
          <MaterialTable
            title="All Items"
            columns={state.columns}
            data={expenses}
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
        </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
