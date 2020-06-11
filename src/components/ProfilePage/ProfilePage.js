import React, { useContext } from "react";
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
import {Profit} from "../../functions/CalculateHomepage"

const ProfilePage = () => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const { photoURL, displayName, email } = user;
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Total Profit (30 days)
                </Typography>
                <Typography variant="h5" component="h2">
                  {Profit(30)}
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Total Profit (30 days)
                </Typography>
                <Typography variant="h5" component="h2">
                  {Profit(30)}
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};
export default ProfilePage;
