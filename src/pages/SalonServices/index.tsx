import {
    Routes,
    Route,
} from "react-router-dom";

import NotFound from "../OtherPage/NotFound";

import ServicesList from "./ServicesList";
import ServiceForm from "./ServiceForm";
import ServiceDetail from "./ServiceDetail";

export default function OwnerServicesRoutes() {

    return (

        <Routes>

            {/* LIST */}

            <Route
                index
                element={
                    <ServicesList />
                }
            />

            {/* CREATE */}

            <Route
                path="/create"
                element={
                    <ServiceForm />
                }
            />

            {/* EDIT */}

            <Route
                path="/edit/:id"
                element={
                    <ServiceForm />
                }
            />

            {/* DETAIL */}

            <Route
                path="/view/:id"
                element={
                    <ServiceDetail />
                }
            />

            {/* 404 */}

            <Route
                path="*"
                element={
                    <NotFound />
                }
            />
        </Routes>
    );
}