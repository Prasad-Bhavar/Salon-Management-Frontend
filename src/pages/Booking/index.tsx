import {
    Routes,
    Route,
} from "react-router-dom";

import NotFound from "../OtherPage/NotFound";

import BookingList from "./BookingList";
import BookingDetail from "./BookingDetail";

const BookingRoutes = () => {

    return (

        <Routes>

            {/*
                BOOKING LIST
            */}

            <Route
                index
                element={
                    <BookingList />
                }
            />

            {/*
                BOOKING DETAIL
            */}

            <Route
                path="view/:id"
                element={
                    <BookingDetail />
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

export default BookingRoutes;