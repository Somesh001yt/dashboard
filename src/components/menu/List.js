  import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
  import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  import CategoryIcon from '@mui/icons-material/Category';
  import RestaurantIcon from '@mui/icons-material/Restaurant';
  import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
  import HttpsIcon from '@mui/icons-material/Https';
  import LogoutIcon from '@mui/icons-material/Logout';


  export const listItem = [
    {
      id: 1,
      name: "Dashboard",
      link: "/",
      icon: <AccountBalanceIcon />,
    },
    {
      id: 2,
      name: "Manage Users",
      link: "/manage-users",
      icon: <AccountCircleIcon />,
    },
    {
      id: 3,
      name: "Manage Categories",
      link: "/manage-categories",
      related: "/category-form",
      icon: <CategoryIcon />,
    },
    {
      id: 4,
      icon: <DinnerDiningIcon />,
      name: "Manage Cuisines",
      link: "/manage-cuisine",
      related: "/cuisine-form",
    },
    {
      id: 5,
      icon: <RestaurantIcon />,
      name: "Manage Restaurants",
      link: "/manage-restaurants",
      related: "/restaurant-form",
    },
    {
      id: 6,
      icon: <HttpsIcon />,
      name: "Change Password",
      link: "/change-password",
    },
    {
      id: 7,
      icon: <LogoutIcon />,
      name: "Logout",
      
    },
  ];
