import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ErrorPage from "../Pages/ErrorPage/ErrorPage"
import MainHome from "../Pages/Home/MainHome/MainHome"
import Login from "../Authentication/Login/Login"
import Registration from "../Authentication/Registration/Registration"




export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <MainHome></MainHome>,
            },

           

        ]

    },

    {
        path: '/login',
        element: <Login></Login>
    },
    {
        path: '/signUp',
        element:<Registration></Registration>
    }


])