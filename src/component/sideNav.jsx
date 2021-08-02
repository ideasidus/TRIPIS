// import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@material-ui/core";
// import clsx from 'clsx';

import MailIcon from '@material-ui/icons/Mail';
import GitHubIcon from '@material-ui/icons/GitHub';

import React, { useState } from "react";

import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';


const SideNav = (props) => {

    // const [collapsed, setCollapsed] = useState(false);
    // const [toggled, setToggled] = useState(false);

    // const handleSelect = (eventKey) => {
    //     console.log('selectedKey', eventKey)
    //     // setActiveKey(eventKey)
    // }

    return (
        <ProSidebar
            toggle={true}
            collapsed={true}
            style={{
                height: '100vh',
            }}
        >
            <SidebarHeader>
                <div
                    style={{
                        padding: '24px',
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
            <SidebarContent>
                <Menu iconShape="square">
                    <SubMenu title="Weather" icon={<MailIcon />}>
                        <MenuItem>Weather 정보 ~~ </MenuItem>
                    </SubMenu>
                    <SubMenu title="Restaurant" icon={<MailIcon />}>
                        <MenuItem>Restaurant</MenuItem>
                    </SubMenu>
                    <SubMenu title="Attraction" icon={<MailIcon />}>
                        <MenuItem>Attraction</MenuItem>
                    </SubMenu>
                    <SubMenu title="Event" icon={<MailIcon />}>
                        <MenuItem>Event</MenuItem>
                    </SubMenu>
                </Menu>
            </SidebarContent>

            <SidebarFooter style={{ textAlign: 'center' }}>
                <div
                    className="sidebar-btn-wrapper"
                    style={{
                        padding: '20px 24px',
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