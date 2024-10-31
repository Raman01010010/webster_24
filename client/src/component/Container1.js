// import Home from "./Home2";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from "./Signin";
import Signup from "./Signup";
import AboutUs from "./AboutUs";
import Otp from "./Otp";
import Persist from "./Persist";
import Dashboard1 from "./Dashboard1";
import Timetableprocess from './Timetableprocess';
import Gemini from "./json_to_gemini";
export default function Container1(){
    return(<>
    <Persist/>
          <Routes>
          {/* <Route path="/" element={<><Home/></>} /> */}
          <Route path="/dashboard1" element={<><Dashboard1/></>} />
          <Route path="/process" element={<><Timetableprocess/></>} />
          <Route path="/gemini" element={<><Gemini/></>} />

          <Route path="/signin" element={<><Signin/></>} />
          <Route path="/signup" element={<><Signup/></>} />
          <Route path="/otp" element={<><Otp/></>} />
          {/* <Route path="/home2" element={<><Home/></>} /> */}
          <Route path="/about" element={<><AboutUs/></>} />
         
    </Routes>

    </>)
}