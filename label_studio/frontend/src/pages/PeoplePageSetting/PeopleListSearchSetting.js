import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Spinner, Userpic } from "../../components";
import { useAPI } from "../../providers/ApiProvider";
import { Block, Elem } from "../../utils/bem";
import { isDefined } from "../../utils/helpers";
import './PeopleList.styl';

export const PeopleListSearchSetting = ({onSelect, selectedUser, defaultSelected}) => {
  const api = useAPI();
  const [usersList, setUsersList] = useState([]);
  const [allUser,setAlluser]=useState()
  const fetchUsers = useCallback(async () => {

    const result = await api.callApi('memberships', {
      params: {pk: 1},
    });
    setUsersList([]);
    setAlluser(result)
  }, [api]);

  const selectUser = useCallback((user) => {
    if (selectedUser?.id === user.id || usersList.length===0) {
      onSelect?.(null);
    } else {
      onSelect?.(user);
    }
  }, [selectedUser,usersList]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({user}) => user.id === Number(defaultSelected));
      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);
  function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  const setInputValues=(email)=>{
    if(email===""){
      setUsersList([])
      onSelect?.(null);
    }else{
      let data =[];
      for (let i = 0; i < allUser.length; i++) {
        let fullName = allUser[i].user.first_name+ " " + allUser[i].user.last_name
        let str =  removeAccents(fullName);
        
        let em = removeAccents((email)) ;
        if (
          allUser[i].user.email.toLowerCase().includes(email.toLowerCase()) === true ||
          str.toLowerCase().includes(em.toLowerCase()) === true 
        ) {
          console.log(str)
          console.log(em)
          data.push(allUser[i]);
        }
      }
      setUsersList(data)
    }
    }
  return (
    <Block name="people-list">
      <Elem name="search">
      < input type="text" style={{width:"100%"}} placeholder="Tìm kiếm theo tên, email" onChange={e => setInputValues(e.target.value)} />

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
