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

  var projectOwnerId 
  var projectId 

  // console.log("project ", project)
  // console.log("project keys", Object.keys(project))

  if (!project.hasOwnProperty('created_by')) projectOwnerId = localStorage.getItem('projectOwnerId')
  if (!project.hasOwnProperty('id')) projectId = localStorage.getItem('projectId')
  if (projectOwnerId == undefined) localStorage.setItem('projectOwnerId', project.created_by.id);
  if (projectId == undefined) localStorage.setItem('projectId', project.id);
  projectOwnerId = localStorage.getItem('projectOwnerId')
  projectId = localStorage.getItem('projectId')

  var [user, setUser] = useState();
  const [userRole, setUserRole] = useState();

  const fetchUserProjectMember =  async () => {
    user = await api.callApi('me');
    setUser(user)

    api.callApi('getOneProjectMember', {
      params: {
        pk: projectId,
        user: user.id,
      }
    })
    .then(ProjectMemberList => ProjectMemberList[0]) 
    .then((projectMember) => {
      if(user.id == projectOwnerId) setUserRole('owner');
      else setUserRole(projectMember.role);
    })
  }
  
  useEffect(() => {
    fetchUserProjectMember();
  }, [project])

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

  const annotatorVisibleComponents = [InstructionsSettings]
  const getVisibleComponents = (role) => {
    if (role == 'owner') return ownerVisibleComponents;
    if (role == 'manager') return managerVisibleComponents;
    return annotatorVisibleComponents;
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

