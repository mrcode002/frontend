import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { PowerSettingsNew } from '@material-ui/icons';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";

// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';
import { CollectionsBookmark as CollectionsBookmarkIcon, ExpandLess, ExpandMore, Mail as MailIcon, Inbox as InboxIcon, StarBorder, Dashboard as DashboardIcon, Class as ClassIcon } from "@material-ui/icons";
import TeacherDashboard from "./TeacherDashboard"
import Courses from "./TeacherCourses";
import Collapse from '@material-ui/core/Collapse';
import { Switch, Route, NavLink } from "react-router-dom";
import { render } from '@testing-library/react';
import axios from "../../axiosInstance"
import TeacherClasses from "./TeacherClasses";

import * as actionTypes from '../../store/teacher/actions';
import { connect } from 'react-redux';
const drawerWidth = 240;

const styles = (theme) => {
  return {
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }
};

class MiniDrawer extends React.Component {
  constructor(props) {
    super(props);

    axios.defaults.headers['x-access-token'] = window.localStorage["x-access-token"];
  }
  async componentDidMount() {
    try {
      this.props.setTeacherState({ isLoading: true });
      const res = await axios.get('/teacher/myCourses');
      this.props.setTeacherState({ courses: res.data.courses, isLoading: false, showSnackbar: true, snackbarMessage: "Loaded Successfully" });
    }
    catch (error) {
      this.props.setTeacherState({ isLoading: false, showSnackbar: true, snackbarMessage: "Some error occured" });
    }

  }

  state = {
    subListExpanded: false,
    open: false,
  }

  setOpen = (newOpen) => {
    this.setState((prevState, props) => {
      return {
        open: newOpen,
      }
    })
  }
  handleDrawerOpen = () => {
    console.log("opening")
    this.setOpen(true);
  };

  handleDrawerClose = () => {
    this.setOpen(false);
  };

  handleSubListClick = () => {
    this.setState(prevState => {
      return {
        subListExpanded: !prevState.subListExpanded
      }
    });
  }

  logout = () => {
    localStorage.removeItem("x-access-token");
    localStorage.removeItem("role");
    delete axios.defaults.headers["x-access-token"];
    this.props.history.push('/');
  }

  render() {
    const { classes } = this.props;
    // console.log(this.props.theme);
    // console.log(this.props.theme.breakpoints.up('sm'));
    return (
      <>
        {this.props.isLoading &&
          <Backdrop className={classes.backdrop} open={this.props.isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
        }
        {this.props.showSnackbar &&
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.props.showSnackbar}
            autoHideDuration={2000}
            onClose={() => this.props.setTeacherState({ showSnackbar: false })}
            message={this.props.snackbarMessage} />
        }


        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: this.state.open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: this.state.open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Teacher section
            </Typography>
              <div style={{ marginLeft: "auto" }}>
                <IconButton edge="end" color="inherit" onClick={this.logout}>
                  <PowerSettingsNew />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
              }),
            }}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                {this.props.theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem button selected={this.props.location.pathname === this.props.match.path + "/dashboard"} component={NavLink} to={`${this.props.match.path}/dashboard`}>
                {/* Note that the prop "to" above is passed to "component" ie. NavLink element  */}
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </List>

            {(this.props.courses && this.props.courses.length > 0) ?
              <>
                <Divider />
                <List>
                  <ListItem button onClick={this.handleSubListClick} title="My Courses">
                    <ListItemIcon>
                      <CollectionsBookmarkIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Courses" />
                    {this.state.subListExpanded ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={this.state.subListExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {this.props.courses.map((course, ind) => {
                        const sub = course.name || "";
                        const subid = course.id || course._id;
                        return (
                          <ListItem button key={ind} className={classes.nested} selected={this.props.location.pathname === this.props.match.path + "/courses/" + subid} component={NavLink} to={`${this.props.match.path}/courses/${subid}`} title={sub}>
                            <ListItemIcon><ClassIcon /></ListItemIcon>
                            <ListItemText primary={sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase()} />
                          </ListItem>);
                      })}
                    </List>
                  </Collapse>
                </List>
              </>
              : null}
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Route path={`${this.props.match.path}/dashboard`} exact component={TeacherDashboard} />
            <Route exact path={`${this.props.match.path}/courses/:id`} component={Courses} />
            <Route exact path={`${this.props.match.path}/courses/:id/classes/:id`} component={TeacherClasses} />

          </main>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    courses: state.courses,
    isLoading: state.isLoading,
    showSnackbar: state.showSnackbar,
    snackbarMessage: state.snackbarMessage,

  }
}

const mapDisptachToProps = dispatch => {
  return {
    setTeacherState: (newState) => dispatch({ type: actionTypes.MODIFY_STATE, newState: newState })
  }
}

export default connect(mapStateToProps, mapDisptachToProps)(withTheme(withStyles(styles, { withTheme: true })(MiniDrawer)));