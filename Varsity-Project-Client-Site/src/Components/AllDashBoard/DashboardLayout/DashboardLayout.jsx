import React from "react";
import { Outlet } from "react-router-dom";
import DashBoardNavBar from "../DashBoardNavBar/DashBoardNavBar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      {/* Sidebar/Navigation */}
      <DashBoardNavBar />

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 mt-16 sm:mt-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;