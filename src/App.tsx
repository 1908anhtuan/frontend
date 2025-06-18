import { BrowserRouter as Router } from "react-router-dom"; // Import Router
import Header from "./components/header";
import AppRouter from "./router/router"; // Your routing logic here

function App() {
  return (
    <Router> {/* Wrap everything in Router */}
      <Header />
      <AppRouter />
    </Router>
  );
}

export default App;
