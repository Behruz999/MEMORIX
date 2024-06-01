import { Route, Routes } from "react-router-dom";
import { Root } from "../rootPage";

export const AppRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Root />} />
            </Routes>
        </>
    )
}
