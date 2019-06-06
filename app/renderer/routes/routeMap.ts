import Home from '../components/Home';
import Login from '../components/Login';
import Counter from '../containers/counter';
import Weather from '../containers/weather';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
interface RouteMap {
    key: number;
    location: string;
    title: string;
    isOnNav: boolean;
    containerElement: any;
    icon?: any;
}

export const indexPage: RouteMap = {
    key: 0, location: '/', isOnNav: false, title: 'Login', containerElement: Login, icon: DashboardIcon
};

export const globalRoutes: RouteMap[] = [
    indexPage,
    {key: 1, location: '/home', isOnNav: true, title: 'Home', containerElement: Home, icon: DashboardIcon},
    {key: 2, location: '/counter', isOnNav: true, title: 'Counter',
        containerElement: Counter, icon: ShoppingCartIcon},
    {key: 3, location: '/weather', isOnNav: true, title: 'Weather', containerElement: Weather, icon: PeopleIcon},
];

export const findRoute = (location: string) => globalRoutes.find(value => value.location === location)!.title;

export const navRoutes: RouteMap[] = globalRoutes.filter((value, index, array) => value.isOnNav);
