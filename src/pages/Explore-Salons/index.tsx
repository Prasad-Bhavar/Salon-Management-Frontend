// src/pages/Barbers/index.tsx

import { Routes, Route } from "react-router-dom";

import NotFound from "../OtherPage/NotFound";

import SalonDetailPage from "./SalonDetailPage";
import ExploreSalonsPage from "./ExploreSalonsPage";
import PaymentPage from "./Booking/PaymentPage";

const SalonRoutes = () => {

    return (

        <Routes>

            <Route
                index
                element={<ExploreSalonsPage />}
            />

            <Route
                path="/:id"
                element={<SalonDetailPage />}
            />
            <Route
                path="/payment"
                element={<PaymentPage />} />

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
};

export default SalonRoutes;