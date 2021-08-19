import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useAPI } from "../../../providers/ApiProvider";
import { Spinner, Userpic } from "../../../components";
import { Block, Elem } from "../../../utils/bem";
import { isDefined } from "../../../utils/helpers";
import './MemberListSetting.styl';

export const MemberListSearchSetting = ({onSelect, selectedUser, defaultSelected}) => {
  const api = useAPI();
  const [usersList, setUsersList] = useState([]);
  const [searchInput, setSearchInput] = useState('')

  const fetchUsers = useCallback(async (searchValue) => {
    if (searchValue != "") {
      const result = await api.callApi('memberships', {
        params: {
          pk: 1, // hardcode must be replaced by User's active_organization in the future
          search: searchValue
        },
      });
      setUsersList(result);
    }
  }, [api]);

  const selectUser = useCallback((user) => {
    if (selectedUser?.id === user.id || usersList.length===0) {
      onSelect?.(null);
    } else {
      onSelect?.(user);
    }
  }, [selectedUser,usersList]);

  useEffect(() => {
    fetchUsers(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({user}) => user.id === Number(defaultSelected));
      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);


  return (
    <Block name="people-list">
      <Elem name="search">
        < input type="text" style={{width:"100%"}} placeholder="Tìm kiếm theo tên, email" onChange={e => setSearchInput(e.target.value)} />
      </Elem>
      {usersList.length !==0 ? (
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
      ) : null}
    </Block>
  );
};
