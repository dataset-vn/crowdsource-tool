import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Spinner, Userpic } from "../../components";
import { useAPI } from "../../providers/ApiProvider";
import { useProject } from "../../providers/ProjectProvider";
import { Block, Elem } from "../../utils/bem";
import { isDefined } from "../../utils/helpers";
// import { useDraftProject } from "../CreateProject/utils/useDraftProject";
import './PeopleList.styl';

export const PeopleListSetting = ({onSelect, selectedUser, defaultSelected,projectID}) => {
  const api = useAPI();
  const [usersList, setUsersList] = useState();
  const [userInProjects, setUserInProjects] = useState(null)
  const {project} = useProject();
  console.log("9999999999999999",projectID,project.id)


  const fetchUsers = useCallback(async (projectID) => {
    let data=[];
    const result = await api.callApi('memberships', {
      params: {pk: 1},
    });
    if(projectID){
      const response = await api.callApi("getProjectMember", {
        params: {
          pk: projectID
        }
      })
      for(let i=0;i<response.length;i++){
        const selected = result.find( ({user}) => user.id === response[i].user);
        if (selected) data.push(selected);
      }
    }
    
    
  
        
      
    
      setUsersList(data);
  }, [api]);

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


  // useEffect(async () => {
  //   const response = await api.callApi("getProjectMember", {
  //     params: {
  //       pk: 2
  //     }
  //   })

  //   setUserInProjects(response)
  // }, []);


  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({user}) => user.id === Number(defaultSelected));
      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);

  return (
    <Block name="people-list">
      {usersList ? (
        <Elem name="users">
          <Elem name="header">
            <Elem name="column" mix="avatar"/>
            <Elem name="column" mix="email">Email</Elem>
            <Elem name="column" mix="name">Tên</Elem>
            <Elem name="column" mix="last-activity">Hoạt động</Elem>
          </Elem>
          <Elem name="body">
            {usersList.map(({user}) => {
              const active = user.id === selectedUser?.id;

              return (
                <Elem key={`user-${user.id}`} name="user" mod={{active}} onClick={() => selectUser(user)}>
                  <Elem name="field" mix="avatar">
                    <Userpic user={user} style={{ width: 28, height: 28 }}/>
                  </Elem>
                  <Elem name="field" mix="email">
                    {user.email}
                  </Elem>
                  <Elem name="field" mix="name">
                    {user.first_name} {user.last_name}
                  </Elem>
                  <Elem name="field" mix="last-activity">
                    {formatDistance(new Date(user.last_activity), new Date(), {addSuffix: true})}
                  </Elem>
                </Elem>
              );
            })}
          </Elem>
        </Elem>
      ) : (
        <Elem name="loading">
          <Spinner size={36}/>
        </Elem>
      )}
    </Block>
  );
};
