import React, { useContext } from "react";
import { Router, Redirect } from "@reach/router";
import SignIn from "../SignIn/SignIn";
import UserProvider from "../../providors/UserProvider";
import ProfilePage from "../ProfilePage/ProfilePage";
import { UserContext } from "../../providors/UserProvider";
import AddItem from "../AddItem/AddItem";
import ViewAll from "../ViewAll/ViewAll";
import Expenses from "../Expenses/Expenses";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import useStyles from "./Application.style";
import Sidebar from "../Sidebar/Sidebar";

function Application() {
  const user = useContext(UserContext);

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return user ? (
    <div>
      <Sidebar />
      <Router>
        <ProfilePage path="/" />
        <AddItem path="/dashboard/additem" />
        <ViewAll path="/dashboard/viewall" />
        <Expenses path="/dashboard/addexpense" />
      </Router>
    </div>
  ) : (
    <Router>
      {/* <Redirect noThrow={true} from="/*" to="/" /> */}
      <SignIn path="/" />
    </Router>
  );
}

export default Application;
