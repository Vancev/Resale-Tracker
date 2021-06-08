import {AddItem} from "./components/AddItem/AddItem";
import ViewAll from "./components/ViewAll/ViewAll"
import Application from "./components/Application/Application"
import Expenses from "./components/Expenses/Expenses"
import ConnectEbay from "./components/Ebay/ConnectEbay"
import ManageEbay from "./components/Ebay/ManageEbay"
import { Home, ContentPaste, Notifications, AccountCircle } from '@material-ui/icons';
import Estimate from "./components/Estimate/Estimate";

const Routes = [
    // {
    //   path: '/dashboard/additem',
    //   sidebarName: 'Add Item',
    //   navbarName: 'Add Item',
    //   icon: Home,
    //   component: AddItem
    // },
    {
      path: '/',
      sidebarName: 'Home',
      navbarName: 'Home',
      icon: Home,
      component: Application
    },
    {
      path: '/dashboard/viewall',
      sidebarName: 'View/Add Items',
      navbarName: 'View/Add Items',
      icon: Home,
      component: ViewAll
    },
    {
      path: '/dashboard/addexpense',
      sidebarName: 'Add Expenses',
      navbarName: 'Add Expenses',
      icon: Home,
      component: Expenses
    },
    {
      path: '/dashboard/estimate',
      sidebarName: 'Estimate Expenses',
      navbarName: 'Estimate Expenses',
      icon: Home,
      component: Estimate
    },
    {
      path: '/dashboard/connectebay',
      sidebarName: 'Connect Ebay',
      navbarName: 'Connect Ebay',
      icon: Home,
      component: ConnectEbay
    },
    {
      path: '/dashboard/manageebay',
      sidebarName: 'Manage Ebay',
      navbarName: 'Manage Ebay',
      icon: Home,
      component: ManageEbay
    },
  ];
  
  export default Routes;