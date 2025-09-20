import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Psychology as PsychologyIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    badge: null,
  },
  {
    title: 'AI Assistant',
    icon: <PsychologyIcon />,
    path: '/ai-assistant',
    badge: 'AI',
    badgeColor: 'primary',
  },
  {
    title: 'Knowledge Base',
    icon: <StorageIcon />,
    path: '/knowledge',
    badge: null,
  },
  {
    title: 'Search Engine',
    icon: <SearchIcon />,
    path: '/search',
    badge: 'NEW',
    badgeColor: 'success',
  },
  {
    title: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/analytics',
    badge: null,
  },
  {
    title: 'Projects',
    icon: <BusinessIcon />,
    path: '/projects',
    badge: null,
  },
  {
    title: 'Team Collaboration',
    icon: <GroupIcon />,
    path: '/team',
    badge: null,
  },
  {
    title: 'Document Processor',
    icon: <DescriptionIcon />,
    path: '/documents',
    badge: 'PRO',
    badgeColor: 'secondary',
  },
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    badge: null,
  },
];

const AdvancedSidebar = ({ open, onToggle }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState({});

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleExpand = (title) => {
    setExpanded(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const drawerWidth = open ? 280 : 64;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          minHeight: 64,
        }}
      >
        {open && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            AI Mind Vault
          </Typography>
        )}
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* User Profile Section */}
      {open && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 1,
              bgcolor: 'primary.main',
            }}
          >
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.email || 'User'}
          </Typography>
          <Chip
            label="Premium User"
            size="small"
            color="secondary"
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isExpanded = expanded[item.title];

          return (
            <React.Fragment key={item.title}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    px: 2,
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.light' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.contrastText' : 'inherit',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}
                  {open && item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color={item.badgeColor || 'default'}
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Bottom Actions */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        
        {/* Language Switcher */}
        <Tooltip title={i18n.language === 'en' ? 'Switch to Malayalam' : 'Switch to English'}>
          <IconButton
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ml' : 'en')}
            sx={{ mb: 1, width: '100%', justifyContent: 'flex-start' }}
          >
            {i18n.language === 'en' ? 'MA' : 'EN'}
            {open && (
              <Typography sx={{ ml: 2 }}>
                {i18n.language === 'en' ? 'Malayalam' : 'English'}
              </Typography>
            )}
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton
            onClick={toggleTheme}
            sx={{ mb: 1, width: '100%', justifyContent: 'flex-start' }}
          >
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            {open && (
              <Typography sx={{ ml: 2 }}>
                {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            )}
          </IconButton>
        </Tooltip>

        {/* Logout */}
        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogout}
            sx={{ width: '100%', justifyContent: 'flex-start' }}
            color="error"
          >
            <LogoutIcon />
            {open && (
              <Typography sx={{ ml: 2 }}>
                Logout
              </Typography>
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default AdvancedSidebar;
