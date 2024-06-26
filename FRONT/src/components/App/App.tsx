import "./App.css"
import Expenses from "components/Expenses/Expenses"
import Header from "components/Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Footer from "components/Footer/Footer"
import Income from "components/Income"
import HomePage from "components/HomePage"
import ErrorPage from "components/ErrorPage/ErrorPage"
import Auth from "components/Auth/Auth"

function App() {


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
