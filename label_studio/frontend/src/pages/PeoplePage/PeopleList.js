import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Spinner, Userpic } from "../../components";
import { useAPI } from "../../providers/ApiProvider";
import { Block, Elem } from "../../utils/bem";
import { isDefined } from "../../utils/helpers";
import './PeopleList.styl';

export const PeopleList = ({onSelect, selectedUser, defaultSelected}) => {
  const api = useAPI();
  const [usersList, setUsersList] = useState();
  const [allUser,setAlluser]=useState()
  const fetchUsers = useCallback(async () => {
    const currentUser = await api.callApi('getActiveOrganization');
    const activeOrganizationID = currentUser.active_organization;

    const result = await api.callApi('memberships', {
      params: {pk: activeOrganizationID},
    });
    setUsersList(result);
    setAlluser(result)
  }, [api]);

  const selectUser = useCallback((user) => {
    if (selectedUser?.id === user.id) {
      onSelect?.(null);
    } else {
      onSelect?.(user);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({user}) => user.id === Number(defaultSelected));
      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);
  const setInputValues=(email)=>{
    if(email===""){
      setUsersList(allUser)
    }else{
      let data =[];
      for (let i = 0; i < allUser.length; i++) {
        if (
          allUser[i].user.email.toLowerCase().includes(email.toLowerCase()) === true 
        ) {
          data.push(allUser[i]);
        }
      }
      setUsersList(data)
    }
    }
  return (
    <Block name="people-list">
      <Elem name="search">
      < input type="text" name="search" placeholder="Tìm kiếm" onChange={e => setInputValues(e.target.value)} />

      </Elem>
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
