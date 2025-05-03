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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation, useNavigate } from 'react-router-dom';  // Import Link and useLocation for active highlighting
import { IoIosCreate, IoIosPeople } from "react-icons/io";
import { MdManageSearch, MdOutlineManageAccounts, MdOutlineManageSearch } from 'react-icons/md';
import { TbLogout } from 'react-icons/tb';
import { CgProfile } from "react-icons/cg";
import { RiAdminFill } from "react-icons/ri";
import { GoProjectSymlink } from "react-icons/go";
import { TiTick } from "react-icons/ti";
import { AuthContext } from '../../Authentication/AuthProvider/AuthProvider';
// import { AuthContext } from '../../Components/Authentication/AuthProvider/AuthProvider';

const drawerWidth = 240;

const DashBoardNavBar = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const location = useLocation();  // Hook to get the current path for highlighting
    const { user, logOut } = React.useContext(AuthContext);
    const navigate = useNavigate(); // Declare navigate

    const handleSignOut = () => {
        logOut(); // Call the logOut function from AuthContext
        navigate('/login'); // Redirect user to the login page after logging out
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

    const drawer = (
        <div>
            <List>
                {[ 
                    { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard/statistic' },
                    { text: 'Manage Hotel', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-hotel' },
                    { text: 'Manage Vehicle', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-vehicle' },
                    { text: 'Manage Tourist-Spot', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-tour-plan' },
                    { text: 'Manage Product', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-product' },
                    { text: 'Manage Agency', icon: <MdOutlineManageAccounts className='text-2xl' />, link: '/dashboard/manage-agency' },
                   
                ].map(({ text, icon, link }, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton selected={location.pathname === link}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                                primary={
                                    <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {text}
                                    </Link>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            <List>
                {[
                    { text: 'Approve Hotel', icon: <TiTick className='text-2xl' />, link: '/dashboard/approve-hotel-room' },
                    { text: 'Approve Vehicle', icon: <TiTick className='text-2xl' />, link: '/dashboard/vehicle-approve' },
                    { text: 'Approve Tourist-Spot', icon: <TiTick className='text-2xl' />, link: '/dashboard/tour-plan-approve' },
                    { text: 'Approve Agency', icon: <TiTick className='text-2xl' />, link: '/dashboard/approve-agency' },
                   
                    { text: 'Sign Out', icon: <TbLogout className='text-2xl' />, onClick: handleSignOut },
                ].map(({ text, icon, link, onClick }, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton selected={location.pathname === link} onClick={onClick}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                                primary={
                                    link ? (
                                        <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {text}
                                        </Link>
                                    ) : (
                                        text
                                    )
                                }
                            />
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
                        <div>
                            <div><Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <span className="text-indigo-100 font-bold">HotelTourCar.com</span>
                            </Link>
                            </div>
                        </div>
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
