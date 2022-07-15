import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import NavBar from "./components/navbar";
import AuthProvider from "./contexts/AuthProvider";

import "./App.css";
function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes />
      </Router>
    </AuthProvider>
  );
}

export default App;
