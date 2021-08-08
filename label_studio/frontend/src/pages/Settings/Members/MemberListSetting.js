import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Spinner, Userpic } from "../../../components";
import { useAPI } from "../../../providers/ApiProvider";
import { useProject } from "../../../providers/ProjectProvider";
import { Block, Elem } from "../../../utils/bem";
import { isDefined } from "../../../utils/helpers";

import ReactPaginate from 'react-paginate';

import './MemberListSetting.styl';

import React, { Component } from 'react';
import { Space } from "../../../components/Space/Space";

export const MemberListSetting = ({ onSelect, selectedUser, defaultSelected, projectID, orgID=1 }) => {
  const defaultPageSize = 15
  const api = useAPI();
  const [totalRecords, setTotalRecords] = useState()
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [pageCount, setPageCount] = useState()
  const [usersList, setUsersList] = useState();
  const { project } = useProject();

  const fetchUsers = useCallback(async (projectID, page_size=pageSize, page=1) => {
    let data = [];
    let resTotalRecords = 0;

    if (projectID) {
      const response = await api.callApi("getProjectMember", {
        params: {
          pk: projectID,
          page_size: page_size,
          page: page
        }
      })
      resTotalRecords = response[0].total_records
      setTotalRecords(resTotalRecords)

      for (let i = 0; i < response.length; i++) {
        let memberData = {
          id: response[i].id,
          organization: null,
          user: {
            id: response[i].user,
            first_name: response[i].first_name,
            last_name: response[i].last_name,
            username: response[i].username,
            email: response[i].email,
            phone: response[i].phone,
            last_activity: response[i].activity_at,
            created_projects: [],
            contributed_to_projects: [],
            avatar: response[i].avatar,
          },
          role: response[i].role
        }
        data.push(memberData)
      }
    }
    setUsersList(data);
  }, [api]);

  var handlePageClick = (data) => {
    let selectedPage = (data.selected + 1) || 1;
    console.log("selectedPage", selectedPage)
    fetchUsers(projectID, 2, selectedPage);
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
    setPageCount(Math.ceil(totalRecords/pageSize))
  }, [totalRecords])

  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({ user }) => user.id === Number(defaultSelected));
      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);

  function compareStrings(a, b) {
    let roles = ['owner', 'manager', 'reviewer', 'annotator']
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
                <Elem key={"member_" + i.user.id} name="user" mod={{ active }} onClick={() => selectUser(i.user)}>
                  <Elem key={"avatar_" + i.user.id} name="field" mix="avatar">
                    <Userpic user={i.user} style={{ width: 28, height: 28 }} />
                  </Elem>
                  <Elem key={"email_" + i.user.id} name="field" mix="email">
                    {i.user.email}
                  </Elem>
                  <Elem key={"name_" + i.user.id} name="field" mix="name">
                    {i.user.first_name} {i.user.last_name}
                  </Elem>
                  <Elem key={"role_" + i.user.id} name="field" mix="role">
                    {i.role}
                  </Elem>
                  <Elem key={"last_activity_" + i.user.id} name="field" mix="last-activity">
                    {formatDistance(new Date(i.user.last_activity), new Date(), { addSuffix: true })}
                  </Elem>
                </Elem>
              );
            })}
          </Elem>

          <Space>
          </Space>

          <Elem >
            <ReactPaginate 
              previousLabel={'<<'}
              nextLabel={'>>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              pageLinkClassName={'page_link'}
              activeClassName={'active_page'}
            />
          </Elem>
        </Elem>
      ) : (
        <Elem name="Loading...">
          <Spinner size={36} />
        </Elem>
      )}
    </Block>
  );
};