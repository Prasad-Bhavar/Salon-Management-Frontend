// src/pages/Barbers/index.tsx

import { Routes, Route } from "react-router-dom";

import NotFound from "../OtherPage/NotFound";

import BarberList from "./BarberList";
import BarberForm from "./BarberForm";
import BarberDetails from "./BarberDetails";

const BarberRoutes = () => {

    return (

        <Routes>

            <Route
                index
                element={<BarberList />}
            />

            <Route
                path="create"
                element={<BarberForm />}
            />

            <Route
                path="edit/:id"
                element={<BarberForm />}
            />

            <Route
                path="view/:id"
                element={<BarberDetails />}
            />

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
};

export default BarberRoutes;