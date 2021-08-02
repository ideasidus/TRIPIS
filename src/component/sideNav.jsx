// import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@material-ui/core";
// import clsx from 'clsx';

import MailIcon from '@material-ui/icons/Mail';
import GitHubIcon from '@material-ui/icons/GitHub';

import React, { useState } from "react";

import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

import { useHistory, Link } from 'react-router-dom'

const SideNav = (props) => {
    let history = useHistory();
    // const [collapsed, setCollapsed] = useState(false);
    // const [toggled, setToggled] = useState(false);

    // const handleSelect = (eventKey) => {
    //     console.log('selectedKey', eventKey)
    //     // setActiveKey(eventKey)
    // }

    console.log('in SideNav', props)

    const clickHandler = (key) => {
        console.log('click', key)

        if (key === 'restaurant') {
            history.push('/restaurant');
        } else if (key === 'attracttion'){
            history.push('/attraction')
        } else if (key === 'event') {
            history.push('/event')
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
                        padding: '8px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: '1px',
                        // overflow: 'auto',
                        // textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    TRIPS
                </div>
            </SidebarHeader>
            <SidebarContent >
                <Menu iconShape="square" >
                    <SubMenu title="Weather" icon={<img src={`http://openweathermap.org/img/w/${props.weatherIcon}.png`} alt="img"/>}>
                        <MenuItem>{props.weatherTemp}</MenuItem>
                    </SubMenu>
                    <SubMenu title="Restaurant" icon={<MailIcon />} onClick={(e) => clickHandler('restaurant')}>
                        <MenuItem>Restaurant</MenuItem>
                    </SubMenu>

                    <SubMenu title="Attraction" icon={<MailIcon />} onClick={(e) => clickHandler('attracttion')}>
                        <MenuItem>Attraction</MenuItem>
                    </SubMenu>
                    <SubMenu title="Event" icon={<MailIcon />} onClick={(e) => clickHandler('event')}>
                        <MenuItem>Event</MenuItem>
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
                        href="https://github.com/ideasidus/TRIPIS"
                        target="_blank"
                        className="sidebar-btn"
                        rel="noopener noreferrer"
                    >
                        <GitHubIcon />
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