import {React, useState, useEffect, useCallback, useContext } from 'react';
import { useAPI } from "../../providers/ApiProvider";
import {useProject} from "../../providers/ProjectProvider";
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import { Members } from './Members/Members';
import { DangerZone } from './DangerZone';
import { GeneralSettings } from './GeneralSettings';
import { InstructionsSettings } from './InstructionsSettings';
import { LabelingSettings } from './LabelingSettings';
import { MachineLearningSettings } from './MachineLearningSettings/MachineLearningSettings';
import { StorageSettings } from './StorageSettings/StorageSettings';


export const MenuLayout = ({children, ...routeProps}) => {
  
  const api = useAPI();
  const {project} = useProject();
  const currentSettingProjectOwner = localStorage.getItem('currentSettingProjectOwner')
  const currentSettingProjectId = localStorage.getItem('currentSettingProjectId')
  if (currentSettingProjectOwner == undefined) localStorage.setItem('currentSettingProjectOwner', project.created_by_id);
  if (currentSettingProjectId == undefined) localStorage.setItem('currentSettingProjectId', project.id);
  console.log("project ", project)
  console.log('currentSettingProjectOwner ', currentSettingProjectOwner)
  console.log('currentSettingProjectId ', currentSettingProjectId)

  var [user, setUser] = useState();
  const [userRole, setUserRole] = useState('annotator');

  // Get ProjectMember object whose user is the current (requesting) user
  const fetchUserProjectMember = useCallback( async () => {

    user = await api.callApi('me');

    if(user.id === currentSettingProjectOwner) user.role = 'owner';

    var settingProject = localStorage.getItem('currentSettingProject')

    console.log("settingProject ", settingProject)

    setUser(user)
    console.log("project", project)
    console.log("user", user)
    let projectMember = await api.callApi('getOneProjectMember', {
      params: {
        pk: currentSettingProjectId,
        user: user.id,
      }
    });
    console.log("projectMember1222", projectMember);
    setUserRole(projectMember[0].role);
  })

  useEffect(() => {
    // fetchThisUser();
    fetchUserProjectMember();
  }, [])

  const ownerVisibleComponents = [
    GeneralSettings,
    LabelingSettings,
    InstructionsSettings,
    MachineLearningSettings,
    StorageSettings,
    DangerZone,
    Members,
  ]

  const managerVisibleComponents = [
    GeneralSettings,
    InstructionsSettings,
    Members
  ]

  const getVisibleComponents = (role) => {
    if (role == 'owner') return ownerVisibleComponents;
    if (role == 'manager') return managerVisibleComponents;
    return [InstructionsSettings]
  }

  return (
    <SidebarMenu
      menuItems={
        getVisibleComponents(userRole)
      }
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
  component: InstructionsSettings,
  pages: {
    InstructionsSettings,
    GeneralSettings,
    LabelingSettings,
    MachineLearningSettings,
    StorageSettings,
    DangerZone,
    Members,
  },
};

