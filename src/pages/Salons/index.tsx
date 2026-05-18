import { Routes, Route } from "react-router-dom";

import NotFound from "../OtherPage/NotFound";
import SalonList from "./SalonList";
import SalonForm from "./SalonForm";
import SalonDetails from "./SalonDetails";

const SalonRoutes = () => {
    return (
        <Routes>
            <Route index element={<SalonList />} />
            <Route path="create" element={<SalonForm />} />
            <Route path="edit/:id" element={<SalonForm />} />
            <Route path="view/:id" element={<SalonDetails />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default SalonRoutes;






