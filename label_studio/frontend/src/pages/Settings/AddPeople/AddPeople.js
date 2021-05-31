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
import { PeopleList } from "../../PeoplePage/PeopleList";

import './MachineLearningSettings.styl';
import './PeopleList.styl';
import { PeopleListSetting } from '../../PeoplePageSetting/PeopleListSetting';
import { SelectedUserSetting } from '../../PeoplePageSetting/SelectedUserSetting';
import { useDraftProject } from '../../CreateProject/utils/useDraftProject';
import { useProject } from '../../../providers/ProjectProvider';


const InvitationModal = ({ link }) => {
  return (
    <Block name="invite">
      <Input
        value={link}
        style={{ width: '100%' }}
        readOnly
      />

      <Description style={{ width: '70%', marginTop: 16 }}>
        Invited members have private accounts. They can register and join to the organization using this link.
      </Description>
    </Block>
  );
};

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

  const setInviteLink = useCallback((link) => {
    const hostname = config.hostname || location.origin;
    setLink(`${hostname}${link}`);

  }, [config, setLink]);

  const updateLink = useCallback(() => {
    api.callApi('resetInviteLink').then(({ invite_url }) => {
      setInviteLink(invite_url);
    });
  }, [setInviteLink]);

  const inviteModalProps = useCallback((link) => ({
    title: "Invite people",
    style: { width: 640, height: 472 },
    body: () => (
      <InvitationModal link={link} />
    ),
    footer: () => {
      const [copied, setCopied] = useState(false);

      const copyLink = useCallback(() => {
        setCopied(true);
        copyText(link);
        setTimeout(() => setCopied(false), 1500);
      }, []);

      return (
        <Space spread>
          <Space>
            <Button style={{ width: 170 }} onClick={() => updateLink()}>
              Reset Link
            </Button>
          </Space>
          <Space>
            <Button primary style={{ width: 170 }} onClick={copyLink}>
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </Space>
        </Space>
      );
    },
    bareFooter: true,
  }), []);

  const showInvitationModal = useCallback(() => {
    inviteModal.current = modal(inviteModalProps(link));
  }, [inviteModalProps, link]);

  const defaultSelected = useMemo(() => {
    return localStorage.getItem('selectedUser');
  }, []);




  useEffect(() => {


    api.callApi("inviteLink").then(({ invite_url }) => {
      setInviteLink(invite_url);
    });
  }, []);

  useEffect(() => {
    inviteModal.current?.update(inviteModalProps(link));
  }, [link]);

  const [usersList, setusersList] = useState([{
    id: 1,
    email: "Huynhphoke@gmail.com",
    first_name: "Nguyen",
    last_name: "Duc Huynh",
    last_activity: new Date(),
  },
  {
    id: 1,
    email: "Huynhphoke@gmail.com",
    first_name: "Nguyen",
    last_name: "Duc Huynh",
    last_activity: new Date(),
  },
  {
    id: 1,
    email: "Huynhphoke@gmail.com",
    first_name: "Nguyen",
    last_name: "Duc Huynh",
    last_activity: new Date(),
  }])

  return (
    <>

      <Block name="people-list">
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


      <Space >
        
      </Space>

      <Block name="people-list">
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
    </>
  );
};

AddPeople.title = "Add People";
AddPeople.path = "/add-people";
