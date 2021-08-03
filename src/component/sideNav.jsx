// import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@material-ui/core";
// import clsx from 'clsx';

import MailIcon from '@material-ui/icons/Mail';
import GitHubIcon from '@material-ui/icons/GitHub';

import React, { useState } from "react";

import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

import { useHistory, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: {
        // "& nav ul li > .pro-inner-item" : {
        //     padding: "8px 35px 8px 10px"
        // }

        "& nav ul li .pro-inner-item" : {
            // fontSize: "14px",
            padding: "8px 35px 8px 10px!important",
        }
    },
}));


const SideNav = (props) => {
    let history = useHistory();
    const classes = useStyles();
    // const [collapsed, setCollapsed] = useState(false);
    // const [toggled, setToggled] = useState(false);

    // const handleSelect = (eventKey) => {
    //     console.log('selectedKey', eventKey)
    //     // setActiveKey(eventKey)
    // }


    const clickHandler = (key) => {
        if (key === 'restaurant') {
            history.push('/restaurant');
        } else if (key === 'attracttion'){
            history.push('/attraction')
        } else if (key === 'event') {
            history.push('/event')
        } else if (key === 'admin') {
            history.push('/admin')
        }
    }

    return (
        <ProSidebar
            toggle={true}
            collapsed={true}
            style={{
                height: '100vh',
            }}
            collapsedWidth='3vw'
        >
            <SidebarHeader>
                <div
                    style={{
                        padding: '5px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: '1px',
                        // overflow: 'auto',
                        // textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        height: '32px',
                        marginTop: '15px'
                    }}
                >
                    <a href="/#/restaurant">TRIPIS</a>
                </div>
            </SidebarHeader>
            <SidebarContent className={classes.content}>
                <Menu iconShape="square" >
                    <SubMenu title="Restaurant" icon={<img src="restaurant.png" width='35'/>} onClick={(e) => clickHandler('restaurant')}>
                        <MenuItem>Restaurant</MenuItem>
                    </SubMenu>
                    <SubMenu title="Attraction" icon={<img src="attraction.png" width='35'/>} onClick={(e) => clickHandler('attracttion')}>
                        <MenuItem>Attraction</MenuItem>
                    </SubMenu>
                    <SubMenu title="Event" icon={<img src="event.png" width='35'/>} onClick={(e) => clickHandler('event')}>
                        <MenuItem>Event</MenuItem>
                    </SubMenu>
                </Menu>    
                <Menu >
                    <SubMenu title="Weather" icon={<img src={`http://openweathermap.org/img/w/${props.weatherIcon}.png`} alt="img"/>}>
                        <MenuItem>{props.weatherTemp}℃</MenuItem>
                        <MenuItem>{props.weatherDesc}</MenuItem>
                    </SubMenu>
                </Menu>
            </SidebarContent>

            <SidebarFooter style={{ textAlign: 'center' }}>
                <div
                    className="sidebar-btn-wrapper"
                    style={{
                        padding: '20px 5px',
                    }}
                >
                    <a
                        onClick={(e) => clickHandler('admin')}
                        className="sidebar-btn"
                        rel="noopener noreferrer"
                    >
                        <img src="admin.png" width='35'/>
                        {/* <span> {intl.formatMessage({ id: 'viewSource' })}</span> */}
                    </a>
                </div>
            </SidebarFooter>
        </ProSidebar>
        // <Drawer
        //     variant="permanent"
        // >
        //     <List>
        //         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
        //             <ListItem button key={text}>
        //                 <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
        //                 <ListItemText primary={text} />
        //             </ListItem>
        //         ))}
        //     </List>
        //     <Divider />
        //     <List>
        //         {['All mail', 'Trash', 'Spam'].map((text, index) => (
        //             <ListItem button key={text}>
        //                 <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
        //                 <ListItemText primary={text} />
        //             </ListItem>
        //         ))}
        //     </List>

        // </Drawer>
    )
}

export default SideNav;