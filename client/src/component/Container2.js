import Home from "./Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from "./Signin";

import Dashboard from "./Dashboard";


export default function Container1() {
    return (<>
        {/* <Dashboard/> */}
        <Routes>
          
            <Route path="/t" element={<><Home /></>} />
          
            <Route path="/dashboard" element={<><Dashboard /></>} />
          

        </Routes>
    </>)
}