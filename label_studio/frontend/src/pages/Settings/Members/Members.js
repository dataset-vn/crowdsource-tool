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

export const Members = () => {
  const api = useAPI();
  const inviteModal = useRef();
  const config = useConfig();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMemberProject, setSelectedMemberProject] = useState(null);

  const { project } = useProject();

  const [link, setLink] = useState();


  const selectUser = useCallback((user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user?.id);
  }, [setSelectedUser]);

  const selectMemberProject = useCallback((user) => {
    setSelectedMemberProject(user);
    localStorage.setItem('selectedMemberProject', user?.id);
  }, [setSelectedMemberProject]);

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

  const defaultSelected2 = useMemo(() => {
    return localStorage.getItem('selectedMemberProject');
  }, []);




  useEffect(() => {


    api.callApi("inviteLink").then(({ invite_url }) => {
      setInviteLink(invite_url);
    });
  }, []);

  useEffect(() => {
    inviteModal.current?.update(inviteModalProps(link));
  }, [link]);


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
