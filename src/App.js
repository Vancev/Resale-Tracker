import React from "react";
import Application from "./components/Application";
import UserProvider from "./providors/UserProvider";
function App() {
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
}
export default App;