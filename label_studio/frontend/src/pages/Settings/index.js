import React, { useEffect, useState } from 'react';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import { ApiContext } from '../../providers/ApiProvider';
import { useProject } from '../../providers/ProjectProvider';
import { AddPeople } from './AddPeople/AddPeople';
import { DangerZone } from './DangerZone';
import { GeneralSettings } from './GeneralSettings';
import { InstructionsSettings } from './InstructionsSettings';
import { LabelingSettings } from './LabelingSettings';
import { MachineLearningSettings } from './MachineLearningSettings/MachineLearningSettings';
import { StorageSettings } from './StorageSettings/StorageSettings';

export const MenuLayout = ({children, ...routeProps}) => {
  const api = React.useContext(ApiContext);
  const [isAdmin, setisAdmin] = useState(false)
  const {project} = useProject();
  useEffect(async () => {
    const responseGetActive = await api.callApi("getActiveOrganization");
    console.log("+++++++++=++",responseGetActive)
    console.log("+++=====++=++",project)

    if(project?.created_by?.id===responseGetActive?.id){
      setisAdmin(true)
    }


  }, [location]);
  return (
    <SidebarMenu
      menuItems={ isAdmin ?[
        GeneralSettings,
        LabelingSettings,
        InstructionsSettings,
        MachineLearningSettings,
        StorageSettings,
        DangerZone,
        AddPeople,
      ] : [InstructionsSettings,AddPeople,]}
      path={routeProps.match.url}
      children={children}
    />
  );
};

export const SettingsPage = {
  title: "Settings",
  path: "/settings",
  exact: true,
  layout: MenuLayout,
  component: GeneralSettings,
  pages: {
    InstructionsSettings,
    LabelingSettings,
    MachineLearningSettings,
    StorageSettings,
    DangerZone,
    AddPeople,
  },
};
