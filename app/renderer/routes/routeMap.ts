import Home from '../components/Home';
import Login from '../containers/login';
import Counter from '../containers/counter';
import Weather from '../containers/weather';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
interface RouteMap {
    location: string;
    title: string;
    isOnNav: boolean;
    containerElement: any;
    icon?: any;
    link: string;
}

export const indexPage: RouteMap = {
    link: '/', location: '/', isOnNav: false,
    title: 'Login', containerElement: Login, icon: DashboardIcon
};

export const globalRoutes: RouteMap[] = [
    indexPage,
    {link: '/main/home', location: '/main/home', isOnNav: true,
        title: 'Home', containerElement: Home, icon: DashboardIcon},
    {link: '/main/counter', location: '/main/counter', isOnNav: true, title: 'Counter',
        containerElement: Counter, icon: ShoppingCartIcon},
    {link: '/main/weather', location: '/main/weather', isOnNav: true,
        title: 'Weather', containerElement: Weather, icon: PeopleIcon},
];

export const findRoute = (location: string) => globalRoutes.find(value => value.link === location)!.title;

export const navRoutes: RouteMap[] = globalRoutes.filter((value, index, array) => value.isOnNav);
