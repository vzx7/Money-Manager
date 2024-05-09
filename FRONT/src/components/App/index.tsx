import "./App.css"
import Expenses from "components/Expenses"
import Header from "components/Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Footer from "components/Footer"
import Income from "components/Income"
import HomePage from "components/HomePage"
import ErrorPage from "components/ErrorPage"
import { useEffect, useState } from "react"
import AuthService from "services/auth.service"
import EventBus from "common/EventBus"
import Auth from "components/Auth"

function App() {
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
  
    useEffect(() => {
      const user = AuthService.getCurrentUser();
  
      if (user) {
        setCurrentUser(user);
        setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
        setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      }
  
      EventBus.on("logout", () => {
        logOut();
      });
  
      return () => {
        EventBus.remove("logout");
      };
    }, []);
  
    const logOut = () => {
      AuthService.logout();
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
      setCurrentUser(undefined);
    };
    return (
        <BrowserRouter>
            <Header />
            <div className="max-w-4xl m-auto bg-gray-100 min-h-screen shadow-md p-10 primary-container">
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/income" element={<Income />}></Route>
                    <Route path="/expenses" element={<Expenses />}></Route>
                    <Route path="/auth" element={<Auth />}></Route>
                    <Route path="*" element={<ErrorPage />}></Route>
                </Routes>
            </div>
            <Footer />
        </BrowserRouter>
    )
}

export default App
