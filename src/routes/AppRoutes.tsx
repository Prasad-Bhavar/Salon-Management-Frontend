import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
// import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layout/AppLayout";
import NotFound from "../pages/OtherPage/NotFound";
import Salons from "../pages/Salons";
import Home from "../pages/Dashboard/Home";
import BookingRoutes from "~/pages/Booking";
import SettingsRoutes from "~/pages/Setting";
import SalonServicesRoutes from "~/pages/SalonServices";
import BarberRoutes from "~/pages/Barbers";
/* AUTH */
const Login = lazy(() => import("../pages/Auth/Login"));

/* MODULE ROUTES */

export default function AppRoutes() {
    return (
        <Suspense fallback={<div >Loading...</div>}>
            <Routes>


                <Route path="/login" element={<Login />} />

                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/salons/*" element={<Salons />} />
                    <Route path="/bookings/*" element={<BookingRoutes />} />
                    <Route path="/settings/*" element={<SettingsRoutes />} />

                    //owner services
                    <Route path='/salon-services/*' element={<SalonServicesRoutes />} />
                    <Route path='/barbers/*' element={<BarberRoutes />} />
                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>
        </Suspense >
    );
}