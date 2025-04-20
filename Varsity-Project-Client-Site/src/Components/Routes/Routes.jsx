import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ErrorPage from "../Pages/ErrorPage/ErrorPage"
import MainHome from "../Pages/Home/MainHome/MainHome"
import Login from "../Authentication/Login/Login"
import Registration from "../Authentication/Registration/Registration"
import DashboardLayout from "../AllDashBoard/DashboardLayout/DashboardLayout";
import All_Statistic_Result from "../Inventory/Pages/Statistic/All_Statistic_Result/All_Statistic_Result";
import Approve_Agency from "../Inventory/Manage_Agency/Approve_Agency/Approve_Agency";
import Manage_Agency from "../Inventory/Manage_Agency/Manage_Agency/Manage_Agency";
import All_Product_Manage from "../Inventory/Pages/Manage_Product/All_Product_Manage/All_Product_Manage";
import Create_Product from "../Inventory/Pages/Manage_Product/Create_Product/Create_Product";
import All_Products_Display from "../Pages/Products/All_Products_Display/All_Products_Display";
import View_Product from "../Pages/Products/View_Product/View_Product";
import Update_Product from "../Pages/Products/Update_Product/Update_Product";
import Manage_Tour_Plan from "../Inventory/Pages/Manage_Tour_Plan/Manage_Tour_Plan/Manage_Tour_Plan";
import Create_Tour_Plan from "../Inventory/Pages/Manage_Tour_Plan/Create_Tour_Plan/Create_Tour_Plan";
import All_Tour_Plan from "../Pages/Tourist/All_Tour_Plan/All_Tour_Plan";
import View_Tour_Plan from "../Inventory/Pages/Manage_Tour_Plan/View_Tour_Plan/View_Tour_Plan";
import Create_Hotel_Room from "../Inventory/Pages/Manage_Hotel/Create_Hotel_Room/Create_Hotel_Room";
import Manage_Hotel from "../Inventory/Pages/Manage_Hotel/Manage_Hotel/Manage_Hotel";
import Show_All_Hotels from "../Pages/Hotels/Show_All_Hotels/Show_All_Hotels";
import Create_Vehicle from "../Inventory/Pages/Manage_Vehicle/Create_Vehicle/Create_Vehicle";




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

            // product Routes
            {
                path: "product",
                element: <All_Products_Display></All_Products_Display>
            },
            {
                path: "/product/:id",
                element: <View_Product></View_Product>
            },


            // Tour plan Routes
            {
                path: "/tour-plan",
                element: <All_Tour_Plan></All_Tour_Plan>
            },
            {
                path: "/tour-plan/:id",
                element: <View_Tour_Plan></View_Tour_Plan>
            },


            // Hotel Room Routes

            {
                path: "/hotel-room",
                element: <Show_All_Hotels></Show_All_Hotels>
            }



        ]

    },

    {
        path: '/login',
        element: <Login></Login>
    },
    {
        path: '/signUp',
        element: <Registration></Registration>
    },

    {
        path: "/dashboard",
        element: <DashboardLayout></DashboardLayout>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/dashboard/statistic",
                element: <All_Statistic_Result></All_Statistic_Result>
            },

            // Agency Routes
            {
                path: "/dashboard/manage-agency",
                element: <Manage_Agency></Manage_Agency>
            },
            {
                path: "/dashboard/approve-agency",
                element: <Approve_Agency></Approve_Agency>
            },


            // Product Routes
            {
                path: "/dashboard/manage-product",
                element: <All_Product_Manage></All_Product_Manage>
            },
            {
                path: "/dashboard/create-product",
                element: <Create_Product></Create_Product>
            },
            {
                path: "/dashboard/edit-product/:id",
                element: <Update_Product></Update_Product>
            },


            // Tour Plan Routes

            {
                path: "/dashboard/manage-tour-plan",
                element: <Manage_Tour_Plan></Manage_Tour_Plan>
            },
            {
                path: "/dashboard/create-tour-plan",
                element: <Create_Tour_Plan></Create_Tour_Plan>
            },


            // Hotel Room Routes

            {
                path: "/dashboard/create-hotel-room",
                element: <Create_Hotel_Room></Create_Hotel_Room>
            },
            {
                path: "/dashboard/manage-hotel",
                element:<Manage_Hotel></Manage_Hotel>
            },



            // Vehicle Routes 

            {
                path: "/dashboard/create-vehicle",
                element:<Create_Vehicle></Create_Vehicle>
            }

        ]
    }


])