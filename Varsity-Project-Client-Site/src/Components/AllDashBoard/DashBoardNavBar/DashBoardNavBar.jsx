import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { TbLogout } from 'react-icons/tb';
import { TiTick } from "react-icons/ti";
import { AuthContext } from '../../Authentication/AuthProvider/AuthProvider';
import axios from 'axios';

const drawerWidth = 240;

const DashBoardNavBar = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const location = useLocation();
    const { user, logOut } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [registrationData, setRegistrationData] = React.useState(null);

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://varsity-project-server-site.vercel.app/registration");
                const data = response.data;
                const userData = data.find(item => item.email === user?.email);
                setRegistrationData(userData);
                console.log("User role identified:", userData?.role); // Debug log
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (user?.email) {
            fetchUserData();
        }
    }, [user?.email]);

    const handleSignOut = () => {
        logOut();
        navigate('/login');
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    // Menu items for admin
    const adminMenuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard/statistic' },
        { text: 'Manage Hotel', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-hotel' },
        { text: 'Manage Vehicle', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-vehicle' },
        { text: 'Manage Tourist-Spot', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-tour-plan' },
        { text: 'Manage Product', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-product' },
        { text: 'Manage Agency', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-agency' },
        { text: 'Manage User', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-user' },
    ];

    // Menu items for agency
    const agencyMenuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard/statistic' },
        { text: 'Manage Hotel', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-hotel' },
        { text: 'Manage Vehicle', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-vehicle' },
        { text: 'Manage Tourist-Spot', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-tour-plan' },
    ];

    // Approval items for admin
    const adminApprovalItems = [
        { text: 'Approve Hotel', icon: <TiTick className='text-2xl' />, link: '/dashboard/approve-hotel-room' },
        { text: 'Approve Vehicle', icon: <TiTick className='text-2xl' />, link: '/dashboard/vehicle-approve' },
        { text: 'Approve Tourist-Spot', icon: <TiTick className='text-2xl' />, link: '/dashboard/tour-plan-approve' },
        { text: 'Approve Agency', icon: <TiTick className='text-2xl' />, link: '/dashboard/approve-agency' },
    ];

    // Common items for all roles
    const commonItems = [
        { text: 'Sign Out', icon: <TbLogout className='text-2xl' />, onClick: handleSignOut },
    ];

    const getMenuItems = () => {
        if (!registrationData) return [];
        
        switch (registrationData.role) {
            case 'admin':
                return [...adminMenuItems];
            case 'agency':
                return [...agencyMenuItems];
            default:
                return []; // For 'user' role or undefined
        }
    };

    const getApprovalItems = () => {
        if (!registrationData) return [];
        return registrationData.role === 'admin' ? [...adminApprovalItems] : [];
    };

    const drawer = (
        <div>
            {registrationData && registrationData.role !== 'user' && (
                <>
                    <List>
                        {getMenuItems().map(({ text, icon, link }) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton 
                                    selected={location.pathname === link}
                                    component={Link}
                                    to={link}
                                >
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    {getApprovalItems().length > 0 && (
                        <>
                            <Divider />
                            <List>
                                {getApprovalItems().map(({ text, icon, link }) => (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton 
                                            selected={location.pathname === link}
                                            component={Link}
                                            to={link}
                                        >
                                            <ListItemIcon>{icon}</ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </>
            )}

            <Divider />
            <List>
                {commonItems.map(({ text, icon, onClick }) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={onClick}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <span className="text-indigo-100 font-bold">HotelTourCar.com</span>
                        </Link>
                        {registrationData && (
                            <Typography variant="caption" sx={{ ml: 2 }}>
                                ({registrationData.role})
                            </Typography>
                        )}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
};

DashBoardNavBar.propTypes = {
    window: PropTypes.func,
};

export default DashBoardNavBar;