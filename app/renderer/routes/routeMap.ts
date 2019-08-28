import NotePage from '../containers/notepage';
import Login from '../containers/login';
import Counter from '../containers/counter';
import Weather from '../containers/weather';
import Register from '../containers/register';
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
    // link: '/register', location: '/register', isOnNav: false,
    title: 'Login', containerElement: Login, icon: DashboardIcon
};
export const registerPage: RouteMap = {
    link: '/register', location: '/register', isOnNav: false,
    // link: '/', location: '/', isOnNav: false,
    title: 'Register', containerElement: Register, icon: DashboardIcon
};

export const nestedIndexPage: RouteMap = {
    link: '/main/home', location: '/main/home', isOnNav: true,
    title: 'NotePage', containerElement: NotePage, icon: DashboardIcon
};

export const globalRoutes: RouteMap[] = [
    indexPage,
    nestedIndexPage,
    {link: '/main/counter', location: '/main/counter', isOnNav: true, title: 'Counter',
        containerElement: Counter, icon: ShoppingCartIcon},
    {link: '/main/weather', location: '/main/weather', isOnNav: true,
        title: 'Weather', containerElement: Weather, icon: PeopleIcon},
];

export const findRoute = (location: string) => globalRoutes.find(value => value.link === location)!.title;

export const navRoutes: RouteMap[] = globalRoutes.filter((value, index, array) => value.isOnNav);
