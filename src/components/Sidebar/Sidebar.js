import React, { useContext } from "react";
import SignIn from "../SignIn/SignIn";
import UserProvider from "../../providors/UserProvider";
import ProfilePage from "../ProfilePage/ProfilePage";
import { UserContext } from "../../providors/UserProvider";
import AddItem from "../AddItem/AddItem";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import {
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  MenuList,
  MenuItem,
  Drawer,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import useStyles from "./Sidebar.style";
import routes from "../../routes";
import { Router, Link, Location } from "@reach/router";
import {auth} from "../../firebase";

const drawerWidth = 240;

function Application() {
  const user = useContext(UserContext);

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [currentRoute, setCurrentRoute] = React.useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function selectedRoute(item){
      if(item === currentRoute.pathname){
          return true
      }
      return false
  }

  return (
    <div>
        {/* https://reach.tech/router/api/Location */}
        <Location>
            {(props) => {
                setCurrentRoute(props.location)
            }}
            </Location>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Resale Profit Tracker
          </Typography>
          <Button color="inherit" onClick = {() => {auth.signOut()}}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <MenuList>
            {/* https://stackoverflow.com/questions/50801093/material-ui-drawer-selection-how-to-route */}
            {routes.map((prop, key) => {
              return (
                <Link
                  to={prop.path}
                  style={{ textDecoration: "none" }}
                  key={key}
                >
                  <MenuItem
                    selected={selectedRoute(prop.path)}
                    onClick={handleDrawerClose}
                  >
                    <ListItemIcon>
                      <prop.icon />
                    </ListItemIcon>
                    <ListItemText primary={prop.sidebarName} />
                  </MenuItem>
                </Link>
              );
            })}
        </MenuList>
      </Drawer>
      <div className={classes.drawerHeader} />
    </div>
  );
}

export default Application;
