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
import Vehicle_Manage from "../Inventory/Pages/Manage_Vehicle/Vehicle_Manage/Vehicle_Manage";
import All_Vehicle from "../Pages/Vehicle/All_Vehicle/All_Vehicle";
import Hotel_Approve from "../Inventory/Pages/Manage _Approve/Hotel_Approve/Hotel_Approve";
import TourApprove from "../Inventory/Pages/Manage _Approve/Tour-Approve/Tour-Approve";
import Vehicle_Approve from "../Inventory/Pages/Manage _Approve/Vehicle_Approve/Vehicle_Approve";
import View_Hotel from "../Pages/Hotels/View_Hotel/View_Hotel";
import View_Vehicle from "../Pages/Vehicle/View_Vehicle/View_Vehicle";
import About_Us from "../Pages/About_Us/About_Us";
import Contact_Us from "../Pages/Contact_Us/Contact_Us";
import Update_Vehicle from "../Inventory/Pages/Manage_Vehicle/Update_Vehicle/Update_Vehicle";
import Edit_Tour_Plan from "../Inventory/Pages/Manage_Tour_Plan/Edit_Tour_Plan/Edit_Tour_Plan";
import Edit_Hotel_Room from "../Inventory/Pages/Manage_Hotel/Edit_Hotel_Room/Edit_Hotel_Room";
import PaymentPage from "../Pages/Payment_Page/PaymentPage";
import Payment_Success from "../Pages/Payment_Page/Payment_Success";
import Payment_Fail from "../Pages/Payment_Page/Payment_Fail";



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
            },
            {
                path:"/hotel-room/:id",
                element: <View_Hotel></View_Hotel>
            },


            // Vehicle Routes

            {
                path: "/vehicle",
                element: <All_Vehicle></All_Vehicle>
            },
            {
                path: "/vehicle/:id",
                element:<View_Vehicle></View_Vehicle>
            },


            // About Us 
            {
                path: "/about-us",
                element: <About_Us></About_Us>
            },


            //Contact Us

            {
                path: "/contact-us",
                element: <Contact_Us></Contact_Us>
            },

            // Payment Page 

            {
                path: "/Submit-Details/:id",
                element: <PaymentPage></PaymentPage>
            },
            {
                path: "/payment/success/:tranId",
                element: <Payment_Success></Payment_Success>
            },
            {
                path: "/payment/fail/:tranId",
                element: <Payment_Fail></Payment_Fail>
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
            {
                path: "/dashboard/tour-plan-approve",
                element:<TourApprove></TourApprove>
            },
            {
                path: "/dashboard/update-tour/:id",
                element: <Edit_Tour_Plan></Edit_Tour_Plan>
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
            {
                path: "/dashboard/approve-hotel-room",
                element:<Hotel_Approve></Hotel_Approve>
            },
            {
                path: "/dashboard/update-hotel/:id",
                element: <Edit_Hotel_Room></Edit_Hotel_Room>
            },



            // Vehicle Routes 

            {
                path: "/dashboard/create-vehicle",
                element:<Create_Vehicle></Create_Vehicle>
            },
            {
            path: "/dashboard/manage-vehicle",
            element:<Vehicle_Manage></Vehicle_Manage>
            },
            
            {
                path: "/dashboard/vehicle-approve",
                element:<Vehicle_Approve></Vehicle_Approve>
            },
            {
                path: "/dashboard/update-vehicle/:id",
                element:<Update_Vehicle></Update_Vehicle>
            }

        ]
    }


])