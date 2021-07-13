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

import './MembersList.styl';
// import { MembersList } from '../../PeoplePageSetting/MembersList';
import { MembersList } from './MembersList';
import { SelectedMember } from './SelectedMember';
// import { useDraftProject } from '../../CreateProject/utils/useDraftProject';  
import { useProject } from '../../../providers/ProjectProvider';

export const Members = () => {
  const api = useAPI();
  const config = useConfig();
  const [selectedUser, setSelectedUser] = useState(null);
  const {project} = useProject();
  
  const selectUser = useCallback((user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user?.id);
  }, [setSelectedUser]);

  const defaultSelected = useMemo(() => {
    return localStorage.getItem('selectedUser');
  }, []);
 
  return (
    <>
      <Block name="people-list">
      <Elem name="column" mix="email">Add Members</Elem>
      
        <Elem name="users">
        </Elem>
        <Elem name="content">
          <MembersList
            selectedUser={selectedUser}
            defaultSelected={defaultSelected}
            onSelect={(user) => selectUser(user)}      
          />

          {selectedUser && (
            <SelectedMember
              user={selectedUser}
              onClose={() => selectUser(null)}
              projectID={project.id}
            />
          )}
        </Elem>
      </Block>

      <Space >
        
      </Space>

      <Block name="people-list">
      <Elem name="column" mix="email">Thành viên dự án</Elem>
        <Elem name="content">
          <MembersList
            selectedUser={selectedUser}
            defaultSelected={defaultSelected}
            onSelect={(user) => selectUser(user)}
            projectID={project.id}
          />
        </Elem>
      </Block>
    </>
  );
};

Members.title = "Members";
Members.path = "/members";
