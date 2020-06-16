import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providors/UserProvider";
import { auth } from "../../firebase";
import useStyles from "./ProfilePage.style";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Profit, ROI } from "../../functions/CalculateHomepage";
import { MonthlyProfit, SoldPie, RevenuePie } from "../../functions/Graphs";
import { firestore } from "../../firebase";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const ProfilePage = () => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const { photoURL, displayName, email } = user;

  const [items, setItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profitDate, setProfitDate] = useState(30);
  const [salesPieDate, setsalesPieDate] = useState(30);
  const [revenuePieDate, setrevenuePieDate] = useState(30);
  const [ROIDate, setROIDate] = useState(30);

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
    firestore
      .collection("Users")
      .doc(user.uid)
      .collection("Expenses")
      .get()
      .then((data) => {
        let tempItems = [];
        data.forEach((doc) => {
          let item = doc.data();
          item["id"] = doc.id;
          tempItems.push(item);
        });
        setExpenses(tempItems);
      });
  }, []);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
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
                    value={profitDate}
                    onChange={(e) => {
                      setProfitDate(e.target.value);
                    }}
                  >
                    <option value={1}>1 Day</option>
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={90}>90 Days</option>
                    <option value={365}>1 Year</option>
                    <option value={999999}>All Time</option>
                  </Select>
                </FormControl>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Total Profit
                </Typography>
                <Typography variant="h5" component="h2">
                  ${Profit(items, expenses, profitDate, 0)}
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          <Grid item xs={6}>
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
                    value={ROIDate}
                    onChange={(e) => {
                      setROIDate(e.target.value);
                    }}
                  >
                    <option value={1}>1 Day</option>
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={90}>90 Days</option>
                    <option value={365}>1 Year</option>
                    <option value={999999}>All Time</option>
                  </Select>
                </FormControl>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  ROI
                </Typography>
                <Typography variant="h5" component="h2">
                  {ROI(items, expenses, ROIDate, 0)}%
                  {/* <Graphs items={items} expenses={expenses} /> */}
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>{MonthlyProfit(items, expenses)}</Paper>
          </Grid>
        <Grid item xs = {6}>
        <FormControl
                  className={classes.formControl}
                  autoFocus
                  margin="dense"
                >
                  <InputLabel htmlFor="age-native-simple">Range</InputLabel>
                  <Select
                    native
                    value={salesPieDate}
                    onChange={(e) => {
                       setsalesPieDate(e.target.value);
                    }}
                  >
                    <option value={1}>1 Day</option>
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={90}>90 Days</option>
                    <option value={365}>1 Year</option>
                    <option value={999999}>All Time</option>
                  </Select>
                </FormControl>
        </Grid>
        <Grid item xs = {6}>
        <FormControl
                  className={classes.formControl}
                  autoFocus
                  margin="dense"
                >
                  <InputLabel htmlFor="age-native-simple">Range</InputLabel>
                  <Select
                    native
                    value={revenuePieDate}
                    onChange={(e) => {
                      setrevenuePieDate(e.target.value);
                    }}
                  >
                    <option value={1}>1 Day</option>
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={90}>90 Days</option>
                    <option value={365}>1 Year</option>
                    <option value={999999}>All Time</option>
                  </Select>
                </FormControl>
        </Grid>
        <Grid item xs = {6}>
        <Paper className={classes.pie}>
          {SoldPie(items, salesPieDate)}</Paper>
        </Grid>
        <Grid item xs = {6}>
        <Paper className={classes.pie}>{RevenuePie(items, revenuePieDate)}</Paper>
        </Grid>
        </Grid>
      </Card>
    </div>
  );
};
export default ProfilePage;
