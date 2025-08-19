


import { useState } from "react";
import Routers from "./components/Routers/Routers";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  return (
    <Routers 
      isAuthenticated={isAuthenticated} 
      setIsAuthenticated={setIsAuthenticated} 
    />
  );
}

export default App;
