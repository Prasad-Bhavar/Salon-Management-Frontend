import {
    Routes,
    Route,
} from "react-router-dom";

import NotFound from "../OtherPage/NotFound";

import MyBookingList from "./MyBookingList";
import MyBookingDetails from "./MyBookingDetails";

const MyBookingRoutes = () => {

    return (

        <Routes>

            {/*
                BOOKING LIST
            */}

            <Route
                index
                element={
                    <MyBookingList />
                }
            />

            {/*
                BOOKING DETAIL
            */}

            <Route
                path="/:id"
                element={
                    <MyBookingDetails />
                }
            />

            {/*
                NOT FOUND
            */}

            <Route
                path="*"
                element={
                    <NotFound />
                }
            />
        </Routes>
    );
};

export default MyBookingRoutes;