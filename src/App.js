import React, { useEffect } from 'react';
// Components
import HomePage from './components/HomePage';
//home
import Home from './components/Home/Home'
// Stripe
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
// Styles
import './index.scss';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import Login from './components/Login/Login';
import Registration from './components/Login/Registration/Registration';
import ShowMyListingPage from './components/ShowMyListingPage';
import ResetPassword from './components/Login/ResetPassword';
import ResetPasswordEmail from './components/Login/ResetPasswordEmail';
// import Navigation from "./componnent/Shared/Navigation/Navigation";

const stripePromise = loadStripe("pk_test_51KTSZnK1xy4zxYRaaKhm9HWxKJqPB1oY0syDUffT6NYjoapCwNJ7se3gOVGEg2aRJwryXhWWgjEEvN1pslJ4CBww003GndBqve");

function App() {
  var isLoggedIn = localStorage.getItem("user");
  // console.log(localStorage.getItem("user"));
  return (
    <AuthProvider>
			<BrowserRouter sx={{ backgroundColor: "#FAFAFA" }}>
        {/* Header */}
        {/* show header acording to the page */}
        {isLoggedIn && (
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#FAFAFA",
          borderBottom: "1px solid #EAEAEA",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}>
          <div style={{
            position: 'absolute',
            left: '20px',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'row',

          }}>
            <img src={require('./home.png')} alt="logo"
            style={{ 
              width: '50px',
              cursor: 'pointer',
            }}
            onClick={()=>{
              window.location.href = "/";
            }} />
          </div>
          <div style={{
            position: 'absolute',
            right: '20px',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'row',

          }}>
            <a
                style={{
                  marginRight: '1rem',
                  cursor: 'pointer',
                  color: '#000',
                  border: '1px solid #000',
                  padding: '0.5rem',
                }}
                onClick={() => {
                  window.location.href = '/listings';
                }
                }
                >
                  Show My Listings
                </a>
          <a
                style={{
                  color: '#000',
                  border: '1px solid #000',
                  padding: '0.5rem',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }
                }
                >
                  Logout
                </a>
          </div>
                
              </header>
        )}
				{/* <Navigation /> */}
				<Routes>
					<Route index element={isLoggedIn?<Elements stripe={stripePromise}>
            <HomePage />
          </Elements>:<Login />} />
					<Route path="/login" index element={<Login />} />
					<Route path="/register" element={<Registration />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-link/:token" element={<ResetPasswordEmail />} />
          <Route path="/listings" element={<ShowMyListingPage />} />
					<Route path="/home" element={<Home/>}/>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
    
  );
}

export default App;