import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useAPI } from "../../../providers/ApiProvider";
import { Spinner, Userpic } from "../../../components";
import { Block, Elem } from "../../../utils/bem";
import { isDefined, isCurrentlyActive } from "../../../utils/helpers";
import './MemberListSetting.styl';
import { useTranslation } from "react-i18next";

export const MemberListSearchSetting = ({onSelect, selectedUser, defaultSelected, projectID}) => {
  const api = useAPI();
  const [usersList, setUsersList] = useState([]);
  const [searchInput, setSearchInput] = useState('')

  const fetchMembers = async function (searchValue) {
    // console.log("fetchMembers")
    if (searchValue != "") {
      const result = await api.callApi('memberships', {
        params: {
          pk: 1, // hardcode must be replaced by User's active_organization in the future
          search: searchValue
        },
      });
      if (result.length == 0) setSearchNoti("<b>Không tìm thấy người dùng nào!</b>")
      else setSearchNoti("<b>Có " + result.length + " kết quả:</b>");
      setUsersList(result);      
    }
  }

  const setSearchNoti = (content) => {
    let searchNotiElem = document.getElementById("search-noti");
    searchNotiElem.innerHTML = content;
  }


  const handleSearchInputChange = function (input) {
    if (input == "") setSearchNoti("")
    else {
      setSearchNoti("<b>Đang tìm kiếm......</b>")
    }
    onSelect?.(null); // undisplay the previous selected user
    setUsersList([]); // undisplay the previous users list
    if (input.length < 3) {
      setSearchInput('');
    } 
    if (input.length >= 3) {
      setSearchInput(input);
    }
  }

  const isUserMember = async (userID, projectID) => {
    let response = await api.callApi("getOneProjectMember", {
      params: {
        pk: projectID,
        user: userID
      }
    })
    if (response.length == 1) return true
    return false
  }

  const selectUser = useCallback((user) => {
    if (selectedUser?.id === user.id || usersList.length===0) {
      onSelect?.(null);
    } else {
      isUserMember(user.id, projectID)
      .then((res) => {
        user.isMember = res;
        onSelect?.(user);
      })
    }
  }, [selectedUser, usersList]);


  useEffect(() => {
    if (searchInput == "") {
      setUsersList([])
    }
    const delayDebounceFn =  setTimeout(() => {
      // console.log(searchInput);
      fetchMembers(searchInput);
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({user}) => user.id === Number(defaultSelected));
      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);
  const { t } = useTranslation();


  return (
    <Block name="people-list">
      <Elem name="search">
        < input type="text" style={{width:"30%", border: "2px solid"}} placeholder={ t('MemberLSetting.search') } onChange={e => handleSearchInputChange(e.target.value)} />
        <div style={{paddingLeft: "20px", paddingTop:"10px", paddingBottom:"10px"}} id='search-noti' ></div>
        {/* <div id='loader' ></div> */}
      </Elem>
      {usersList.length !==0 ? (
        <Elem name="users">
          <Elem name="header">
            <Elem name="column" mix="avatar"/>
            <Elem name="column" mix="email">{ t('MemberLSetting.email') }</Elem>
            <Elem name="column" mix="name">{ t('MemberLSetting.name') }</Elem>
            {/* <Elem name="column" mix="name">{ t('MemberLSetting.role') }</Elem> */}
            <Elem name="column" mix="role">{ t('MemberLSetting.status') }</Elem>
            <Elem name="column" mix="last-activity">{ t('MemberLSetting.activity') }</Elem>
          </Elem>
          <Elem name="body" style={{maxHeight: "500px", overflowY: "scroll"}}>
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
                  {/* <Elem name="field" mix="role" >
                    {user.role? user.role : "guest"}
                  </Elem> */}
                  <Elem name="field" mix="role" >
                    {isCurrentlyActive(user.last_activity)? 
                      <b style={{color:"#31a24c"}}>online</b> :
                      <b style={{color:"grey"}}>offline</b>}
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