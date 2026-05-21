import {
    Routes,
    Route,
} from "react-router-dom";

import SettingsPage from "./SettingsPage";

const SettingsRoutes = () => {

    return (

        <Routes>

            <Route
                index
                element={
                    <SettingsPage />
                }
            />
        </Routes>
    );
};

export default SettingsRoutes;