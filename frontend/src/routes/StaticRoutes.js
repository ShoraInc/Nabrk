import { Routes, Route } from "react-router-dom";

import Administration from "../static/AdministrationPage/Administration";

const StaticRoutes = () => {
  return (
    <Routes>
      <Route path="/administration" element={<Administration />} />
    </Routes>
  );
};

export default StaticRoutes;
