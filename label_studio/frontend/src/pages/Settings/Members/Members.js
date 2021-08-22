import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Userpic } from '../../../components';
import { Description } from '../../../components/Description/Description';
import { Input } from '../../../components/Form';
import { Space } from '../../../components/Space/Space';
import { useAPI } from '../../../providers/ApiProvider';
import { useConfig } from '../../../providers/ConfigProvider';
import { Block, Elem } from '../../../utils/bem';
import { useProject } from '../../../providers/ProjectProvider';
import { MemberListSetting } from './MemberListSetting';
import { SelectedMemberSetting } from './SelectedMemberSetting';
import { MemberListSearchSetting } from './MemberListSearchSetting';
import './Members.styl';

export const Members = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMemberProject, setSelectedMemberProject] = useState(null);

  const { project } = useProject();


  const selectUser = useCallback((user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user?.id);
  }, [setSelectedUser]);

  const selectMemberProject = useCallback((user) => {
    if (user) user.isMember = true;
    setSelectedMemberProject(user);
    localStorage.setItem('selectedMemberProject', user?.id);
  }, [setSelectedMemberProject]);

  const defaultSelected = useMemo(() => {
    return localStorage.getItem('selectedUser');
  }, []);

  const defaultSelected2 = useMemo(() => {
    return localStorage.getItem('selectedMemberProject');
  }, []);


  return (
    <>
      <Block name="people-list">
        <Elem name="column" mix="email">Add Members</Elem>
        <Elem name="users">
        </Elem>
        <Elem name="content">
          <MemberListSearchSetting
            selectedUser={selectedUser}
            defaultSelected={defaultSelected}
            onSelect={(user) => selectUser(user)}
            projectID={project.id}
          />
          {selectedUser && (
            <SelectedMemberSetting
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
          <MemberListSetting
            selectedUser={selectedMemberProject}
            defaultSelected={defaultSelected2}
            onSelect={(user) => selectMemberProject(user)}
            projectID={project.id}
          />
          {selectedMemberProject && (
            <SelectedMemberSetting
              user={selectedMemberProject}
              onClose={() => selectMemberProject(null)}
              projectID={project.id}
            />
          )}
        </Elem>
      </Block>
    </>
  );
};

Members.title = "Members";
Members.path = "/members";