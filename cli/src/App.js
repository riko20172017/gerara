import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Pamps from "./pages/Pamps";
import Valves from "./pages/Valves";
import Meters from "./pages/Meters";
import Periods from "./pages/Periods";
import NoPage from "./pages/NoPage";

function App() {
  console.log(process.env.NODE_ENV)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pamps" element={<Pamps />} />
          <Route path="valves" element={<Valves />} />
          <Route path="meters" element={<Meters />} />
          <Route path="periods" element={<Periods />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
