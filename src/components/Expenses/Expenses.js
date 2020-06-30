import React, { useState, useEffect, useContext } from "react";
// core components
import TextField from "@material-ui/core/TextField";
import { firestore } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./Expenses.style";
import { UserContext } from "../../providors/UserProvider";
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

  const [soldCostError, setSoldCostError] = useState();
  const [expenseError, setExpenseError] = useState();

  const [state, setState] = React.useState({
    columns: [
      { title: "Name", field: "Expense" },
      { title: "Expense Value", field: "Value", type: "numeric" },
      { title: "Date", field: "Date" },
    ],
  });

  //Load expenes from firestore
  useEffect(() => {
    setExpenseAdded(false);
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
    setDelete("");
  }, [expenseAdded, toDelete]);

  let today = new Date();
  const date = new Date().setDate(today.getDate());

  //format date into format "MONTH DD, YYYY" format
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

  //add expense to firestore
  function addExpense() {
    let inputError = false;
    if (expense == "") {
      setExpenseError("Expense Name can not be empty");
      inputError = true;
    }
    if (expenseValue == "") {
      setSoldCostError("Expense Value can not be empty");
      inputError = true;
    }
    if (!inputError) {
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
          setExpenseAdded(true);
          resetItem();
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          toast.error("Error adding document: ", error);
        });
    }
  }

  function resetItem() {
    setExpense("");
    setExpenseValue("");
  }

  //Delete expense from firestore
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
        <Grid item xs={12} sm={9} md={9} xl={10}>
          <Paper className={classes.paper}>
            <div>
              <h4 className={classes.cardTitleWhite}>Add New Expense</h4>
            </div>
            <div>
              <TextField
                required
                type="Expense"
                label="Expense Name"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                error={expenseError}
                helperText={expenseError}
              />
              <TextField
                required
                type="ExpenseValue"
                label="Expense Value"
                value={expenseValue}
                onChange={(e) => {
                  var rgx = /^[0-9]*\.?[0-9]*$/;
                  if (e.target.value === "" || rgx.test(e.target.value)) {
                    setExpenseValue(e.target.value);
                  }
                  if (!rgx.test(e.target.value)) {
                    setSoldCostError("Must be numberic value");
                  }
                }}
                error={soldCostError}
                helperText={soldCostError}
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
        <Grid item xs={12} sm={9} md={9} xl={10}>
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
