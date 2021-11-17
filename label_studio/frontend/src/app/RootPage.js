import React from 'react';
import { Menubar } from '../components/Menubar/Menubar';
import { ProjectRoutes } from '../routes/ProjectRoutes';
import { useCurrentUser } from '../providers/CurrentUser';

export const RootPage = ({content}) => {
  const pinned = localStorage.getItem('sidebar-pinned') === 'true';
  const opened = pinned && localStorage.getItem('sidebar-opened') === 'true';

  const { user } = useCurrentUser();
  var enableMunubar = (user && user.hasOwnProperty('email') && user.email == "") ? false : true

  return (
    <Menubar
      enabled={enableMunubar}
      defaultOpened={opened}
      defaultPinned={pinned}
      onSidebarToggle={(visible) => localStorage.setItem('sidebar-opened', visible)}
      onSidebarPin={(pinned) => localStorage.setItem('sidebar-pinned', pinned)}
    >
      <ProjectRoutes content={content}/>
    </Menubar>
  );
};
