import React from "react";
import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, Menu, Spinner, Userpic } from "../../../components";
import { useAPI } from "../../../providers/ApiProvider";
import { useProject } from "../../../providers/ProjectProvider";
import { Block, Elem } from "../../../utils/bem";
import { isDefined, isCurrentlyActive } from "../../../utils/helpers";

import ReactPaginate from "react-paginate";

import "./MemberListSetting.styl";

import { Space } from "../../../components/Space/Space";
import { useTranslation } from "react-i18next";

export const MemberListSetting = ({
	onSelect,
	selectedUser,
	defaultSelected,
	projectID,
	orgID = 1,
	resetFilter,
}) => {
	const { t } = useTranslation();
	const defaultPageSize = 15;
	const api = useAPI();
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageSize, setPageSize] = useState(defaultPageSize);
	const [pageCount, setPageCount] = useState();
	const [usersList, setUsersList] = useState();
	const [usersListSetup, setUsersListSetup] = useState();

	const { project } = useProject();

	const itemModal = (filter) => {
		if (filter === "role") {
			return (
				<Elem name='column' mix='role'>
					{t("MemberLSetting2.roles")}
				</Elem>
			);
		} else if (filter === "status") {
			return (
				<Elem name='column' mix='status'>
					{t("MemberLSetting2.status")}
				</Elem>
			);
		} else {
			return (
				<Elem name='column' mix='contact'>
					{t("MemberLSetting2.contactStatus")}
				</Elem>
			);
		}
	};

	const filterCheckSearch = (check) => {
		let arr = [];
		let newUserList = usersList;
		newUserList.forEach((element) => {
			if (element.user.contact_status === check) {
				arr.push(element);
			}
		});
		if (arr.length === 0) {
			let newUserListSetup = usersListSetup;
			newUserListSetup.forEach((element) => {
				if (element.user.contact_status === check) {
					arr.push(element);
				}
			});
		}
		setUsersList(arr);
	};

	const filterRoleSearch = (roleFilter) => {
		let arr = [];
		let newUserList = usersList;
		newUserList.forEach((element) => {
			if (element.role === roleFilter) {
				arr.push(element);
			}
		});
		if (arr.length === 0) {
			let newUserListSetup = usersListSetup;
			newUserListSetup.forEach((element) => {
				if (element.role === roleFilter) {
					arr.push(element);
				}
			});
		}
		setUsersList(arr);
	};

	const contentModal = (filter) => {
		if (filter === "role") {
			return (
				<Menu>
					<Menu.Item onClick={() => filterRoleSearch("owner")}>owner</Menu.Item>
					<Menu.Item onClick={() => filterRoleSearch("annotator")}>
						annotator
					</Menu.Item>
					<Menu.Item onClick={() => filterRoleSearch("manager")}>
						manager
					</Menu.Item>
					<Menu.Item onClick={() => filterRoleSearch("reviewer")}>
						reviewer
					</Menu.Item>
					<Menu.Item onClick={() => filterRoleSearch("pending")}>
						pending
					</Menu.Item>
					<Menu.Item onClick={() => filterRoleSearch("trainee")}>
						trainee
					</Menu.Item>
				</Menu>
			);
		} else if (filter === "status") {
			return (
				<Menu>
					<Menu.Item>{t("MemberLSetting2.online")}</Menu.Item>
					<Menu.Item>{t("MemberLSetting2.offline")}</Menu.Item>
				</Menu>
			);
		} else {
			return (
				<Menu>
					<Menu.Item onClick={() => filterCheckSearch("checked")}>
						{t("MemberLSetting2.checked")}
					</Menu.Item>
					<Menu.Item onClick={() => filterCheckSearch("not check")}>
						{t("MemberLSetting2.notChecked")}
					</Menu.Item>
				</Menu>
			);
		}
	};

	const modalFilterDrop = (filter) => {
		return (
			<Dropdown.Trigger content={contentModal(filter)}>
				{itemModal(filter)}
			</Dropdown.Trigger>
		);
	};

	const setContactStatus = async (contact_status, userID) => {
		if (contact_status == "not check") contact_status = "checked";
		else contact_status = "not check";
		const response = await api.callApi("updateProjectMember", {
			params: {
				pk: projectID,
			},
			body: {
				user_pk: userID,
				contact_status: contact_status,
			},
		});
		if (response) {
			let arr = [];
			let newUserList = usersList;
			newUserList.forEach((element) => {
				if (element.user.id === userID) {
					element.user.contact_status = contact_status;
				}
				arr.push(element);
			});
			setUsersList(arr);
		}
	};

	const fetchUsers = useCallback(
		async (projectID, page_size = pageSize, page = 1) => {
			let users = [];
			if (projectID) {
				const projectMembers = await api.callApi("getProjectMember", {
					params: {
						pk: projectID,
						page_size: page_size,
						page: page,
					},
				});
				setTotalRecords(projectMembers[0].total_records);
				users = convertProjectMember2User(projectMembers); // as ProjectMember and User are 2 different objects
			}
			setUsersList(users);
			setUsersListSetup(users);
			// console.log(users);
		},
		[api]
	);

	useEffect(() => {
		if (usersListSetup) {
			setUsersList(usersListSetup);
		}
	}, [resetFilter]);

	var handlePageClick = (data) => {
		let selectedPage = data.selected + 1 || 1;
		// console.log("selectedPage", selectedPage);
		fetchUsers(projectID, pageSize, selectedPage);
	};

	// const isCurrentlyActive = (lastActive) => {
	//   lastActive = new Date(lastActive);
	//   let distActive = new Date() - lastActive;
	//   let distActiveInMinute = distActive/1000/60
	//   if (distActiveInMinute <= 5) return true;
	//   return false
	// }

	const convertProjectMember2User = (projectMembers) => {
		let users = [];
		for (let i = 0; i < projectMembers.length; i++) {
			let memberData = {
				id: projectMembers[i].id,
				organization: null,
				user: {
					id: projectMembers[i].user,
					first_name: projectMembers[i].first_name,
					last_name: projectMembers[i].last_name,
					username: projectMembers[i].username,
					email: projectMembers[i].email,
					phone: projectMembers[i].phone,
					last_activity: projectMembers[i].activity_at,
					created_projects: [],
					contributed_to_projects: [],
					avatar: projectMembers[i].avatar,
					contact_status: projectMembers[i].contact_status,
				},
				role: projectMembers[i].role,
			};
			users.push(memberData);
		}
		return users;
	};

	const selectUser = useCallback(
		(user) => {
			if (selectedUser?.id === user.id) onSelect?.(null);
			else onSelect?.(user);
		},
		[selectedUser]
	);

	useEffect(() => {
		fetchUsers(projectID);
	}, [project]);

	useEffect(() => {
		setPageCount(Math.ceil(totalRecords / pageSize));
	}, [totalRecords]);

	useEffect(() => {
		if (isDefined(defaultSelected) && usersList) {
			const selected = usersList.find(
				({ user }) => user.id === Number(defaultSelected)
			);
			if (selected) selectUser(selected.user);
		}
	}, [usersList, defaultSelected]);

	function compareStrings(a, b) {
		let roles = ["owner", "manager", "reviewer", "annotator"];
		a = roles.indexOf(a);
		b = roles.indexOf(b);
		return a < b ? -1 : a > b ? 1 : 0;
	}

	return (
		<Block name='people-list'>
			{usersList ? (
				<Elem name='users'>
					<Elem name='header'>
						<Elem name='column' mix='avatar' />
						<Elem name='column' mix='email'>
							{t("MemberLSetting2.email")}
						</Elem>
						<Elem name='column' mix='name'>
							{t("MemberLSetting2.name")}
						</Elem>
						<Elem
							name='column'
							mix='role'
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
							}}>
							{modalFilterDrop("role")}
						</Elem>
						<Elem
							name='column'
							mix='status'
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
							}}>
							{modalFilterDrop("status")}
						</Elem>
						<Elem name='column' mix='last-activity'>
							{t("MemberLSetting2.activity")}
						</Elem>
						<Elem
							name='column'
							mix='contact'
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
							}}>
							{modalFilterDrop("contact")}
						</Elem>
					</Elem>
					<Elem name='body'>
						{usersList
							.sort((a, b) => compareStrings(a.role, b.role))
							.map((i) => {
								const active = i.user.id === selectedUser?.id;

								return (
									<Elem
										key={"member_" + i.user.id}
										name='user'
										mod={{ active }}
										onClick={() => selectUser(i.user)}>
										<Elem key={"avatar_" + i.user.id} name='field' mix='avatar'>
											<Userpic
												user={i.user}
												style={{ width: 28, height: 28 }}
											/>
										</Elem>
										<Elem key={"email_" + i.user.id} name='field' mix='email'>
											{i.user.email}
										</Elem>
										<Elem key={"name_" + i.user.id} name='field' mix='name'>
											{i.user.first_name} {i.user.last_name}
										</Elem>

										<Elem key={"role_" + i.user.id} name='field' mix='name'>
											{i.role}
										</Elem>

										<Elem key={"status_" + i.user.id} name='field' mix='role'>
											{isCurrentlyActive(i.user.last_activity) ? (
												<b style={{ color: "#31a24c" }}>
													{t("MemberLSetting2.online")}
												</b>
											) : (
												<b style={{ color: "grey" }}>
													{t("MemberLSetting2.offline")}
												</b>
											)}
										</Elem>

										<Elem
											key={"last_activity_" + i.user.id}
											name='field'
											mix='last-activity'>
											{formatDistance(
												new Date(i.user.last_activity),
												new Date(),
												{ addSuffix: true }
											)}
										</Elem>

										<Elem
											key={"contact_status_" + i.user.id}
											name='field'
											mix='contact'>
											<Button
												onClick={(e) => {
													e.stopPropagation();
													setContactStatus(i.user.contact_status, i.user.id);
												}}>
												{i.user.contact_status == "checked"
													? t("MemberLSetting2.checked")
													: t("MemberLSetting2.notChecked")}
											</Button>
										</Elem>
									</Elem>
								);
							})}
					</Elem>

					<Space></Space>

					<Elem>
						<ReactPaginate
							previousLabel={"<<"}
							nextLabel={">>"}
							breakLabel={"..."}
							breakClassName={"break-me"}
							pageCount={pageCount}
							marginPagesDisplayed={2}
							pageRangeDisplayed={5}
							onPageChange={handlePageClick}
							containerClassName={"pagination"}
							pageLinkClassName={"page_link"}
							activeClassName={"active_page"}
						/>
					</Elem>
				</Elem>
			) : (
				<Elem name='Loading...'>
					<Spinner size={36} />
				</Elem>
			)}
		</Block>
	);
};
