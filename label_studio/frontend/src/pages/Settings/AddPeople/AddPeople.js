import { formatDistance } from 'date-fns';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LsPlus } from '../../../assets/icons';
import { Button, Userpic } from '../../../components';
import { Description } from '../../../components/Description/Description';
import { Form, Input, Label, TextArea, Toggle } from '../../../components/Form';
import { Space } from '../../../components/Space/Space';
import { useAPI } from '../../../providers/ApiProvider';
import { useConfig } from '../../../providers/ConfigProvider';
import { Block, Elem } from '../../../utils/bem';
import { SelectedUser } from '../../PeoplePage/SelectedUser';
import { PeopleList } from "./PeopleList";

import './MachineLearningSettings.styl';
import './AddPeopleSetting.styl';
import { PeopleListSetting } from './PeopleListSetting';
import { SelectedUserSetting } from './SelectedUserSetting';
import { useDraftProject } from '../../CreateProject/utils/useDraftProject';
import { useProject } from '../../../providers/ProjectProvider';


export const AddPeople = () => {
  const api = useAPI();
  const inviteModal = useRef();
  const config = useConfig();
  const [selectedUser, setSelectedUser] = useState(null);
  const {project} = useProject();
  
  const [link, setLink] = useState();
 

  const selectUser = useCallback((user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user?.id);
  }, [setSelectedUser]);


  const defaultSelected = useMemo(() => {
    return localStorage.getItem('selectedUser');
  }, []);
    
  return (
    <>
      <Block>
      <Block name="project-people-list">
      <Elem name="column" mix="email">Thành viên dự án</Elem>
        <Elem name="content">
          <PeopleListSetting
            selectedUser={selectedUser}
            defaultSelected={defaultSelected}
            onSelect={(user) => selectUser(user)}
            projectID={project.id}
          />
        </Elem>
      </Block>

      <Space >    
      </Space>
      <br></br>
      <br></br>
      <Space >    
      </Space>

      
      <Block name="org-people-list">
      <Elem name="column" mix="email">Người dùng hệ thống</Elem>
    
        <Elem name="users">
        </Elem>
        <Elem name="content">
          <PeopleList
            selectedUser={selectedUser}
            defaultSelected={defaultSelected}
            onSelect={(user) => selectUser(user)}
          />

          {selectedUser && (
            <SelectedUserSetting
              user={selectedUser}
              onClose={() => selectUser(null)}
              projectID={project.id}
            />
          )}
        </Elem>
      </Block>
      </Block>
      
    </>
  );
};

AddPeople.title = "Add People";
AddPeople.path = "/add-people";
