import AddItem from "./components/AddItem/AddItem";
import ViewAll from "./components/ViewAll/ViewAll"
import Expenses from "./components/Expenses/Expenses"
import { Home, ContentPaste, Notifications, AccountCircle } from '@material-ui/icons';

const Routes = [
    {
      path: '/dashboard/additem',
      sidebarName: 'Add Item',
      navbarName: 'Add Item',
      icon: Home,
      component: AddItem
    },
    {
      path: '/dashboard/viewall',
      sidebarName: 'View All Items',
      navbarName: 'View All Items',
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
  ];
  
  export default Routes;