import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "../SignIn/SignIn";
import ProfilePage from "../ProfilePage/ProfilePage";
import { UserContext } from "../../providors/UserProvider";
import ViewAll from "../ViewAll/ViewAll";
import Expenses from "../Expenses/Expenses";
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
      </Router>
    </div>
  );
}

export default Application;
