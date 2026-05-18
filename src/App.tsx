import { BrowserRouter as Router, useNavigate } from "react-router";

import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";

export let navigateGlobal: any;

function Navigator() {
  const navigate = useNavigate();

  useEffect(() => {
    navigateGlobal = navigate;
  }, [navigate]);

  return null;
}
export default function App() {
  return (
    <>
      <Router>
        <Navigator />
        <ScrollToTop />
        <AppRoutes />

      </Router>

    </>
  );
}
