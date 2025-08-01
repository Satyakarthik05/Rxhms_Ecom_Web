import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, useMediaQuery, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const tabConfig = [
  { label: 'Overview', value: '' }, 
  { label: 'Profile', value: 'profile' },
  { label: 'Orders', value: 'orders' },
  { label: 'Wishlist', value: 'wishlist' },
  { label: 'Help', value: 'help' },
];

const SideBarTabs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('');

  useEffect(() => {
    const currentPath = location.pathname.replace('/overview/', '');
    const matchedTab = tabConfig.find(tab => tab.value === currentPath);
    if (matchedTab) {
      setSelectedTab(matchedTab.value);
    } else if (location.pathname === '/overview') {
      setSelectedTab('');
    }
  }, [location.pathname]);

  const handleClick = (value: string) => {
    setSelectedTab(value);
    navigate(value);
  };

  if (!isMobile) return null;

  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
      width: '100%',
      overflow: 'hidden',
      py: 0.5,
      backgroundColor: '#F9FAFB',
    }}
  >
    {tabConfig.map(tab => {
      const isActive = selectedTab === tab.value;
      return (
        <Button
          key={tab.value || 'overview'}
          onClick={() => handleClick(tab.value)}
          sx={{
            textTransform: 'none',
            backgroundColor: isActive ? '#334F3E' : '#ECF0F0',
            color: isActive ? '#FFFFFF' : '#4B5565',
            fontSize: '12px',
            minWidth: 'auto',
            px: 1.5,
            py: 0.5,
            mx: 0.25,
            borderRadius: 1.5,
            fontWeight: 500,
            flexShrink: 1,
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: isActive ? '#334F3E' : '#dfe6e6',
            },
          }}
        >
          {tab.label}
        </Button>
      );
    })}
  </Box>
  );
};

export default SideBarTabs;
