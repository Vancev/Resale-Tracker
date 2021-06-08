import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "../SignIn/SignIn";
import ProfilePage from "../ProfilePage/ProfilePage";
import { UserContext } from "../../providors/UserProvider";
import ViewAll from "../ViewAll/ViewAll";
import Expenses from "../Expenses/Expenses";
import Estimate from "../Estimate/Estimate";
import ConnectEbay from "../Ebay/ConnectEbay"
import ManageEbay from "../Ebay/ManageEbay"
import Sidebar from "../Sidebar/Sidebar";

function Application() {
  const user = useContext(UserContext);

  //https://github.com/reach/router/issues/185#issuecomment-560876548
  const ProtectedRoute = ({ component: Component, ...props }) => {
    console.log(user);
    return <div>{user ? <Component {...props} /> : <SignIn />}</div>;
  };

  return (
    <div>
      <Sidebar />
      <Router>
        <ProtectedRoute component={ProfilePage} path="/" />
        <ProtectedRoute component={ViewAll} path="/dashboard/viewall" />
        <ProtectedRoute component={Expenses} path="/dashboard/addexpense" />
        <ProtectedRoute component={Estimate} path="/dashboard/estimate/:platform" />
        <ProtectedRoute component={Estimate} path="/dashboard/estimate/" />
        <ProtectedRoute component={ConnectEbay} path="/dashboard/connectebay/" />
        <ProtectedRoute component={ManageEbay} path="/dashboard/manageebay/" />
      </Router>
    </div>
  );
}

export default Application;
