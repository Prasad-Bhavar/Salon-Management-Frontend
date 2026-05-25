import { BrowserRouter as Router, useNavigate } from "react-router";

import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

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

        <ToastContainer
          style={{ zIndex: 200000 }}
          toastStyle={{
            fontFamily: 'var(--font-outfit)',
          }}
        />
      </Router>

    </>
  );
}
