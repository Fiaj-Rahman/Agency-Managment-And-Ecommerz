import React, { useContext, useEffect, useState } from "react";
import axios from "axios"; // Import axios
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import {
    UserCircleIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    InboxArrowDownIcon,
    LifebuoyIcon,
    PowerIcon,
    Bars2Icon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { FaAddressBook, FaBloggerB, FaHome, FaPhoneVolume, FaProjectDiagram } from "react-icons/fa";
import { SiWikimediafoundation } from "react-icons/si";
import { MdContactPhone } from "react-icons/md";
import { AuthContext } from "../Authentication/AuthProvider/AuthProvider";

// Profile menu component with navigation paths
const profileMenuItems = [
    {
        label: "Dashboard",
        icon: UserCircleIcon,
        to: "/dashboard/statistic"
    },
   
    {
        label: "About Us",
        icon: InboxArrowDownIcon,
        to: "/about-us",
    },
    {
        label: "Contact Us",
        icon: InboxArrowDownIcon,
        to: "/contact-us",
    },
    {
        label: "Sign Out",
        icon: PowerIcon,
        to: "/signout",
    },
];

function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);
    const [registrationData, setRegistrationData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://varsity-project-server-site.vercel.app/registration");
                const data = response.data;
                const userData = data.find(item => item.email === user?.email);
                setRegistrationData(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (user?.email) {
            fetchUserData();
        }
    }, [user?.email]);

    const closeMenu = () => setIsMenuOpen(false);

    const handleNavigation = (to) => {
        if (to === "/signout") {
            logOut();
        } else {
            navigate(to);
        }
        closeMenu();
    };

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-1 px-3 lg:ml-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    <Tooltip content={registrationData?.fullName || "User"} placement="bottom">
                        <Avatar
                            variant="circular"
                            size="sm"
                            alt="Profile Picture"
                            className="border border-white p-0.5"
                            src={registrationData?.image || "https://i.ibb.co/nnWFqp9/b-Kash-payment-Process999.png"}
                        />
                    </Tooltip>
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1 bg-white shadow-lg rounded-lg">
                {profileMenuItems.map(({ label, icon, to }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                        <MenuItem
                            key={label}
                            onClick={() => handleNavigation(to)}
                            className={`flex items-center gap-2 rounded-lg py-2 px-4 text-gray-700 hover:bg-indigo-100 ${isLastItem ? "text-red-500" : ""}`}
                        >
                            {React.createElement(icon, {
                                className: `h-5 w-5 ${isLastItem ? "text-red-500" : "text-gray-500"}`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal text-gray-700"
                            >
                                {label}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}

const navListItems = [
    {
        label: "Home",
        icon: FaHome,
        to: "/",
    },
    
    {
        label: "Products",
        icon: FaAddressBook,
        to: "/product",
    },
    {
        label: "Hotel",
        icon: FaProjectDiagram,
        to: "/hotel-room",
    },
    
    {
        label: "Car/Bus",
        icon: FaBloggerB,
        to: "/vehicle",
    },
    {
        label: "Tourist Spot",
        icon: FaBloggerB,
        to: "/tour-plan",
    },
    
];

function NavList() {
    return (
        <ul className="mt-2 mb-4 flex flex-col gap-3 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center justify-center">
            {navListItems.map(({ label, icon, to }, key) => (
                <Typography key={label} as="a" variant="small" color="red" className="font-medium text-white">
                    <Link to={to}>
                        <MenuItem className="flex items-center gap-3 lg:rounded-lg px-3 py-2 hover:bg-indigo-500 transition-all ease-in-out duration-200">
                            {React.createElement(icon, { className: "h-[20px] w-[20px] text-indigo-300" })}{" "}
                            <span className=" font-medium">{label}</span>
                        </MenuItem>
                    </Link>
                </Typography>
            ))}
        </ul>
    );
}

export function NavBars() {
    const [isNavOpen, setIsNavOpen] = React.useState(false);
    const { user, logOut } = useContext(AuthContext);
    const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

    React.useEffect(() => {
        window.addEventListener("resize", () => window.innerWidth >= 960 && setIsNavOpen(false));
    }, []);

    const navigate = useNavigate();
    const [registrationData, setRegistrationData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://varsity-project-server-site.vercel.app/registration");
                const data = response.data;
                const userData = data.find(item => item.email === user?.email);
                setRegistrationData(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (user?.email) {
            fetchUserData();
        }
    }, [user?.email]);

    // Add Become Agency functionality
    const handleBecomeAgency = async () => {
        if (!user) {
            alert("Please log in first.");
            return;
        }

        try {
            // Make API request to backend to add "Agency: 'pending'" to the user
            const response = await axios.put("https://varsity-project-server-site.vercel.app/become-agency", {
                email: user.email,
            });

            if (response.data.success) {
                alert("You have successfully requested to become an agency!");
            } else {
                alert(response.data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error processing your request.");
        }
    };

    // Conditional render logic for Become Agency / Request Pending / No button when approved
    const renderAgencyButton = () => {
        if (user && registrationData?.agency === "pending") {
            return <button className="text-sm bg-gray-300 p-2 text-black font-bold rounded-lg hover:bg-gray-200" disabled>Request Pending</button>;
        } else if (user && registrationData?.agency === "approved") {
            return null; // No button when agency is approved
        } else if (user) {
            return (
                <button 
                    onClick={handleBecomeAgency}
                    className="text-sm bg-gray-300 p-2 text-black font-bold rounded-lg hover:bg-gray-200"
                >
                    Become an Agency
                </button>
            );
        }
    };

    return (
        <Navbar className="mx-auto fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-none">
            <div className="relative mx-auto flex items-center justify-between text-white">
                <Typography as="a" href="#" className="mr-4 ml-2 cursor-pointer py-1.5 font-bold">
                    <h4 className="text-sm sm:text-lg md:text-2xl lg:text-2xl">
                        <span className="text-blue-200">HotelTourCar</span><span className="text-green-200">.com</span>
                    </h4>
                </Typography>

                {/* Centered Nav List - Visible only on large devices */}
                <div className="hidden lg:flex-grow lg:flex lg:justify-center">
                    <NavList />
                </div>

                {/* Conditional Rendering for Become Agency / Request Pending / No button when approved */}
                <div>
                    {renderAgencyButton()}
                </div>

                {/* Conditional Rendering for Profile Menu and Login Button */}
                <div className="flex items-center ml-auto space-x-2">
                    {user ? (
                        <ProfileMenu />
                    ) : (
                        <Link to={'/login'}>
                            <Button size="sm" variant="filled" color="amber" className="hover:bg-amber-600 transition-all duration-200 ">
                                <span className="sm:text-xs">Log In</span>
                            </Button>
                        </Link>
                    )}
                </div>
                {/* Call Icon */}
                <div className="flex items-center justify-center">
                    <Link to="tel:+8801818697777">
                        <div className="ml-1 p-1 bg-green-600 hover:bg-green-700 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110">
                            <FaPhoneVolume className="h-5 w-5" />
                        </div>
                    </Link>
                </div>

                {/* Hamburger Icon for small screens */}
                <div className="sm:text-2xl text-blue-900 md:text-xl lg:hidden">
                    <IconButton
                        size="sm"
                        color="white"
                        variant="text"
                        onClick={toggleIsNavOpen}
                        className="ml-2"
                    >
                        <Bars2Icon className="h-6 w-6" />
                    </IconButton>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileNav open={isNavOpen} className="overflow-scroll bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-600">
                <NavList />
            </MobileNav>
        </Navbar>
    );
}


export default NavBars;
