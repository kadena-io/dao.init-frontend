import React from 'react';
import { 
  useQueryParams,
  StringParam,
  withDefault
 } from 'use-query-params';
import {
  AppBar,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';

import logo from "./kadena_r_rev_3_whi_lor.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  logo: {
    height: "60px",
  }
}));

const ListItemLink = (props) => {
  const { icon, primary, to, subList } = props;
  const hasSubList = subList && Array.isArray(subList) ;
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  //Top level UI Routing Params
  const [,setAppRoute] = useQueryParams({
    "app": withDefault(StringParam,"init"),
    "ui": withDefault(StringParam,"guardians")
  });


  return (
    <React.Fragment>
      <li>
        <ListItem button onClick={()=>setAppRoute(to)}>
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
          {hasSubList ? (
            open ? <ExpandLess onClick={()=>setOpen(!open)} />
                 : <ExpandMore onClick={()=>setOpen(!open)} />
            ) : null}
        </ListItem>
      </li>
        {hasSubList ?
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className={classes.nested} dense>
              {subList.map(entry =>
                <ListItemLink
                  icon={entry.icon}
                  primary={entry.primary}
                  to={entry.to}
                  subList={entry.subList}
                  />
              )}
            </List>
          </Collapse>
        : null }
    </React.Fragment>
  );
};

export const NavDrawer = (props) => {
  const { window, entriesList } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      {entriesList.map(entries =>
        <React.Fragment>
          <Divider />
          <List>
            {entries.map(entry =>
              <ListItemLink
                icon={entry.icon}
                primary={entry.primary}
                to={entry.to}
                subList={entry.subList}
                />
            )}
          </List>
        </React.Fragment>
       )}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="logo" className={classes.logo}/>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}
