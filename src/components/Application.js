  
import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./SignIn/SignIn";
import UserProvider from "../providors/UserProvider";
import ProfilePage from "./ProfilePage";
import { UserContext } from "../providors/UserProvider";
function Application() {
  const user = useContext(UserContext);
  return (
        user ?
        <ProfilePage />
      :
        <Router>
          <SignIn path="/" />
        </Router>
      
  );
}

export default Application;