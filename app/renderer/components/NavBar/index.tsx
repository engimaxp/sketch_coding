import React from 'react';
import { Link } from 'react-router-dom';
import ListItem, {ListItemProps} from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {navRoutes} from '../../routes/routeMap';
interface LinkListItemProps extends ListItemProps {
    to: string;
    replace?: boolean;
}

const LinkListItem = (props: LinkListItemProps) => (
    <ListItem {...props} button component={Link as any} />
);

const navItems = (
    navRoutes.map((value, index) => (
        <LinkListItem  key={index} component={LinkListItem as any} to={value.link}>
            <ListItemIcon>
                {<value.icon />}
            </ListItemIcon>
            <ListItemText primary={value.title}/>
        </LinkListItem>
    ))
);

const NavBar = () => (
    <div>
        {navItems}
    </div>
);

export default NavBar;
