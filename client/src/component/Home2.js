import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Element } from 'react-scroll';
import { motion } from 'framer-motion';
import img1 from "../utility/pexels-pok-rie-33563-1004409.jpg";
// import img2 from "./pexels-anna-shvets-4226140.jpg";
// import img3 from "./pexels-lukas-590016 (1).jpg"
import img4 from "../utility/pexels-pixabay-263402.jpg"
import 'animate.css/animate.css';
import { useInView } from 'react-intersection-observer';
import About from "./AboutUs"
import Footer from "./Footer"
import { Button, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home2 = () => {
  const pageStyle = {
    background: '#212534',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });
  const [ref3, inView3] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  const [isScrollingIn1, setIsScrollingIn1] = useState(true);
  const [isScrollingIn2, setIsScrollingIn2] = useState(true);
  const [isScrollingIn3, setIsScrollingIn3] = useState(true);
  const [thresholdRange1, thresholdRange2] = [0, 250];
  const [thresholdRange3, thresholdRange4] = [200, 550];
  const [thresholdRange5, thresholdRange6] = [600, 900];
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;

      if (offset >= thresholdRange1 && offset < thresholdRange2 && !isScrollingIn1) {
        setIsScrollingIn1(true);
      } else if ((offset < thresholdRange1 || offset >= thresholdRange2) && isScrollingIn1) {
        setIsScrollingIn1(false);
      }

      if (offset >= thresholdRange3 && offset < thresholdRange4 && !isScrollingIn2) {
        setIsScrollingIn2(true);
      } else if ((offset < thresholdRange3 || offset >= thresholdRange4) && isScrollingIn2) {
        setIsScrollingIn2(false);
      }

      if (offset >= thresholdRange5 && offset < thresholdRange6 && !isScrollingIn3) {
        setIsScrollingIn3(true);
      } else if ((offset < thresholdRange5 || offset >= thresholdRange6) && isScrollingIn3) {
        setIsScrollingIn3(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrollingIn1, isScrollingIn2, isScrollingIn3]);
  const fun1 = () => toast("Wow so easy!");
  return (
    <>
      <Element name="home2">
        <div style={pageStyle}>
          <div className="text-center bg-purple-600	 text-white p-4">
            <h1 className="text-6xl mb-8 font-bold">Welcome to the WEBSTER</h1>
            <div className="space-x-4 mt-8">
              <Link to="/signin" className="text-white">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Sign In
                </button>
             
              </Link>
              <Link to="/signup" className="text-white">
                <button className="border border-green-500 hover:bg-green-500 hover:text-white text-green-500 font-bold py-2 px-4 rounded">
                  Sign Up
                </button>

              </Link>
              {/* <button onClick={fun1} className="border border-green-500 hover:bg-green-500 hover:text-white text-green-500 font-bold py-2 px-4 rounded">
        toast
                </button> */}
                <ToastContainer />
              {/* <Link to="/my" className="text-white">
                <button className="border border-green-500 hover:bg-green-500 hover:text-white text-green-500 font-bold py-2 px-4 rounded">
                  Sign Up
                </button> */}

              {/* </Link> */}
            </div>

          </div>
        </div>
      </Element>

      <div style={{ padding: '10vh' }}>
        <About />
      </div>
      <div style={{ padding: '10vh' }}>
        <Footer />
      </div>

    </>
  );
};

export default Home2;
