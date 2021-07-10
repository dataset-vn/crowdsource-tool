import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import { LsCross, LsPlus } from "../../assets/icons";
import { Button, Userpic } from "../../components";
import { useAPI } from "../../providers/ApiProvider";
import { Block, Elem } from "../../utils/bem";
import "./SelectedUser.styl";
import "./PeoplePage.styl";
import { Space } from "../../components/Space/Space";
import { ROLE_MEMBER } from "../../utils/constant";
import { useEffect, useState } from "react";

const UserProjectsLinks = ({ projects }) => {
  return (
    <Elem name="links-list">
      {projects.map((project) => (
        <Elem tag={NavLink} name="project-link" key={`project-${project.id}`} to={`/projects/${project.id}`} data-external>
          {project.title}
        </Elem>
      ))}
    </Elem>
  );
};

export const SelectedUserSetting = ({ user, onClose, projectID }) => {
  const fullName = [user.first_name, user.last_name].filter(n => !!n).join(" ").trim();
  const [role, setRole] = useState('annotator')
  const api = useAPI();
  const [userList, setUserList] = useState([])

  const addPeopleProjects = async () => {
    const response = await api.callApi("createProjectMember", {
      params: {
        pk: projectID
      },
      body: {
        user_pk: user.id,
        role: role
      }
    })
    console.log("99999999999999999999", response)

    window.location.reload();

  }
  useEffect(async () => {
    if (projectID) {
      const response = await api.callApi("getProjectMember", {
        params: {
          pk: projectID
        }
      })
      setUserList(response)
      console.log("-=-=-=-=-=-=--==", response)
      console.log("-=-=-=-=", user)
    }
  }, [])
  const checkUserMember = (user, userList) => {
    const selected = userList.filter((i) => i.user === user.id);
    if (selected.length!==0) {
      return true
    }

    return false
  }
  return (
    <Block name="user-info">
      <Elem name="close" tag={Button} type="link" onClick={onClose}><LsCross /></Elem>

      <Elem name="header">
        <Userpic
          user={user}
          style={{ width: 64, height: 64, fontSize: 28 }}
        />

        {fullName && (
          <Elem name="full-name">{fullName}</Elem>
        )}

        <Elem tag="p" name="email">{user.email}</Elem>
      </Elem>

      {user.phone && (
        <Elem name="section">
          <a href={`tel:${user.phone}`}>{user.phone}</a>
        </Elem>
      )}

      {!!user.created_projects.length && (
        <Elem name="section">
          <Elem name="section-title">Created Projects</Elem>

          <UserProjectsLinks projects={user.created_projects} />
        </Elem>
      )}

      {!!user.contributed_to_projects.length && (
        <Elem name="section">
          <Elem name="section-title">Contributed to</Elem>

          <UserProjectsLinks projects={user.contributed_to_projects} />
        </Elem>
      )}

      <Elem tag="p" name="last-active">
        Hoạt động lúc : {format(new Date(user.last_activity), 'dd MMM yyyy, KK:mm a')}
      </Elem>
      <Elem name="controls">
        <Space spread>
          <Space></Space>

          <Space>
            {
              checkUserMember(user, userList) ? <Elem tag="p" name="last-active">
                Đã là thành viên dự án
            </Elem> : <>
                <select id="cars" className="ls-button ls-button_look_ " onChange={(e) => setRole(e.target.value)} name="role_member">
                  {Object.keys(ROLE_MEMBER).map(
                    (i) => (
                      <option value={i}>{i}</option>
                    )
                  )}
                </select>
                <Button icon={<LsPlus />} onClick={addPeopleProjects}>
                  Thêm vào dự án
          </Button>
              </> 

            }

          </Space>


        </Space>
      </Elem>

    </Block>
  );
};
