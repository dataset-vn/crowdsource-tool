import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Spinner, Userpic } from "../../../components";
import { useAPI } from "../../../providers/ApiProvider";
import { useProject } from "../../../providers/ProjectProvider";
import { Block, Elem } from "../../../utils/bem";
import { isDefined } from "../../../utils/helpers";
import './MemberListSetting.styl';
import React from 'react';


export const MemberListSetting = ({ onSelect, selectedUser, defaultSelected, projectID }) => {
  const api = useAPI();
  const [usersList, setUsersList] = useState();
  const [userInProjects, setUserInProjects] = useState(null)
  const { project } = useProject();

  const fetchUsers = useCallback(async (projectID) => {
    let data = [];
    const result = await api.callApi('memberships', {
      params: { pk: 1 },
    });
    if (projectID) {
      const response = await api.callApi("getProjectMember", {
        params: {
          pk: projectID
        }
      })

      for (let i = 0; i < response.length; i++) {
        const selected = result.find(({ user }) => user.id === response[i].user);
        if (selected) data.push({...selected,role : response[i].role});
      }
    }
    setUsersList(data);
  }, [api]);
  const checkUserMember = (idProject) => {

  }
  const selectUser = useCallback((user) => {
    if (selectedUser?.id === user.id) {
      onSelect?.(null);
    } else {
      onSelect?.(user);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers(projectID);
  }, [project]);


  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({ user }) => user.id === Number(defaultSelected));
      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);

  const compare =(a, b) => {
    // you can access the relevant property like this a.props[by]
    // depending whether you are sorting by tilte or year, you can write a compare function here, 
    a.user.props[by] - b.user.props[by]
  }
  const Sort= ({children, by})=> {
    if (!by) {
    // If no 'sort by property' provided, return original list
    return children
    }
    return React.Children.toArray(children).sort(compare)
    
    }

  function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    let roles = ['owner', 'manager', 'reviewer', 'annotator']
    // console.log("a",a)
    // console.log("b",b)
    a = roles.indexOf(a)
    b = roles.indexOf(b)
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }

  return (
    <Block name="people-list">

      {usersList ? (
        <Elem name="users">
          <Elem name="header">
            <Elem name="column" mix="avatar" />
            <Elem name="column" mix="email">Email</Elem>
            <Elem name="column" mix="name">Tên</Elem>
            <Elem name="column" mix="name">Quyền</Elem>
            <Elem name="column" mix="last-activity">Hoạt động</Elem>
          </Elem>
          <Elem name="body">
           
            {usersList.sort((a, b) => compareStrings(a.role, b.role)).map(( i ) => {
              const active = i.user.id === selectedUser?.id;

              return (
                <Elem key={`user-${i.user.id}`} name="user" mod={{ active }} onClick={() => selectUser(i.user)}>
                  <Elem name="field" mix="avatar">
                    <Userpic user={i.user} style={{ width: 28, height: 28 }} />
                  </Elem>
                  <Elem name="field" mix="email">
                    {i.user.email}
                  </Elem>
                  <Elem name="field" mix="name">
                    {i.user.first_name} {i.user.last_name}
                  </Elem>
                  <Elem name="field" mix="name">
                    {i.role}
                  </Elem>
                  <Elem name="field" mix="last-activity">
                    {formatDistance(new Date(i.user.last_activity), new Date(), { addSuffix: true })}
                  </Elem>
                </Elem>
              );
            })}
            
          </Elem>
        </Elem>
      ) : (
        <Elem name="loading">
          <Spinner size={36} />
        </Elem>
      )}
    </Block>
  );
};
