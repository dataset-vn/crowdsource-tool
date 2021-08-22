import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import { LsCross, LsPlus, DtsTrash } from "../../../assets/icons";
import { Button, Userpic } from "../../../components";
import { useAPI } from "../../../providers/ApiProvider";
import { Block, Elem } from "../../../utils/bem";
import "./SelectedMemberSetting.styl";
import "./MemberSetting.styl";
import { Space } from "../../../components/Space/Space";
import { ROLE_MEMBER } from "../../../utils/constant";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


export const SelectedMemberSetting = ({ user, onClose, projectID }) => {
  const { t } = useTranslation();
  const fullName = [user.first_name, user.last_name].filter(n => !!n).join(" ").trim();
  const [role, setRole] = useState('annotator')
  const api = useAPI();
  const [userList, setUserList] = useState([])

  const createProjectMember = async () => {
    const response = await api.callApi("createProjectMember", {
      params: {
        pk: projectID
      },
      body: {
        user_pk: user.id,
        role: role
      }
    })
    window.location.reload();
  }

  const removeProjectMember = async () => {
    const response = await api.callApi("removeProjectMember", {
      params: {
        pk: projectID
      },
      body: {
        user_pk: user.id,
      }
    });

    if (response.code == 200) {
      window.alert(response.detail);
      window.location.reload();
    }
  }

  useEffect(async () => {
    if (projectID) {
      const response = await api.callApi("getProjectMember", {
        params: {
          pk: projectID
        }
      })
      setUserList(response)
    }
  }, [])

  const checkUserMember =  (user) => {
    // Check if this user is member of current (context) project
    return user.isMember;
  }

  return  (
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

      <Elem tag="p" name="last-active">
        { t("SelectedMember.time") /*Hoạt động lúc :*/ } {format(new Date(user.last_activity), 'dd MMM yyyy, KK:mm a')}
      </Elem>
      <Elem name="controls">
        <Space spread>
          <Space></Space>
          <Space>
            {
              // If user is member of project, then display button Xóa-khỏi-dự-án, else Thêm-vào-dự-án.
              checkUserMember(user) ? 
              <>
              <Button icon={<DtsTrash/>} onClick={removeProjectMember}>
                { t("SelectedMember.delete") }
              </Button>
               </> : 
               <> 
                <select id="cars" className="ls-button ls-button_look_ "  onChange={(e) => setRole(e.target.value)} name="role_member">
                  {Object.keys(ROLE_MEMBER).map(
                    (i) => (
                      <option value={i}>{i}</option>
                    )
                  )}
                </select>        
                <Button icon={<LsPlus />} onClick={createProjectMember}>
                  { t("SelectedMember.addproject") /*Thêm vào dự án*/ }
                </Button>
              </> 
            }
          </Space>
        </Space>
      </Elem>
    </Block>
  );
};