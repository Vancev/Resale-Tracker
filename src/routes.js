import AddItem from "./components/AddItem/AddItem";
import ViewAll from "./components/ViewAll/ViewAll"
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
  ];
  
  export default Routes;