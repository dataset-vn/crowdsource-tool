import { useCallback, useMemo, useState } from "react";
import { Button } from "../../../components";
import { Space } from "../../../components/Space/Space";
import { Block, Elem } from "../../../utils/bem";
import { useProject } from "../../../providers/ProjectProvider";
import { MemberListSetting } from "./MemberListSetting";
import { SelectedMemberSetting } from "./SelectedMemberSetting";
import { MemberListSearchSetting } from "./MemberListSearchSetting";
import "./Members.styl";
import { useTranslation } from "react-i18next";

export const Members = () => {
	const { t } = useTranslation();
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedMemberProject, setSelectedMemberProject] = useState(null);
	const [resetFilter, setResetFilter] = useState(null);

	const { project } = useProject();

	const selectUser = useCallback(
		(user) => {
			setSelectedUser(user);
			localStorage.setItem("selectedUser", user?.id);
		},
		[setSelectedUser]
	);

	const selectMemberProject = useCallback(
		(user) => {
			if (user) user.isMember = true;
			setSelectedMemberProject(user);
			localStorage.setItem("selectedMemberProject", user?.id);
		},
		[setSelectedMemberProject]
	);

	const defaultSelected = useMemo(() => {
		return localStorage.getItem("selectedUser");
	}, []);

	const defaultSelected2 = useMemo(() => {
		return localStorage.getItem("selectedMemberProject");
	}, []);

	return (
		<>
			<Block name='people-list'>
				<Elem name='column' mix='email'>
					{t("Member.add") /*Add Members*/}
				</Elem>

				<Elem name='users'></Elem>
				<Elem name='content'>
					<MemberListSearchSetting
						selectedUser={selectedUser}
						defaultSelected={defaultSelected}
						onSelect={(user) => selectUser(user)}
						projectID={project.id}
					/>
					{selectedUser && (
						<SelectedMemberSetting
							user={selectedUser}
							onClose={() => selectUser(null)}
							projectID={project.id}
						/>
					)}
				</Elem>
			</Block>

			<Space></Space>

			<Block name='people-list'>
				<Elem name='title-field'>
					<Elem name='column' mix='email'>
						{t("Member.project") /*Thành viên dự án*/}
					</Elem>
					<Button onClick={() => setResetFilter(!resetFilter)}>
						{t("Member.resetFilter") /* Reset Filter */}
					</Button>
				</Elem>
				<Elem name='content'>
					<MemberListSetting
						selectedUser={selectedMemberProject}
						defaultSelected={defaultSelected2}
						onSelect={(user) => selectMemberProject(user)}
						projectID={project.id}
						resetFilter={resetFilter}
					/>
					{selectedMemberProject && (
						<SelectedMemberSetting
							user={selectedMemberProject}
							onClose={() => selectMemberProject(null)}
							projectID={project.id}
						/>
					)}
				</Elem>
			</Block>
		</>
	);
};

Members.title = "Thành viên";
Members.path = "/members";
