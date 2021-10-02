import chr from "chroma-js";
import React, { useContext, useMemo } from "react";
import { ProjectContext, useProject } from "../../providers/ProjectProvider";
import { useCurrentUser } from "../../providers/CurrentUser";
import { useAPI } from "../../providers/ApiProvider";
import { useContextProps } from "../../providers/RoutesProvider";
import { Block, Elem } from "../../utils/bem";
import { Space } from "../../components/Space/Space";
import { Button } from "../../components/Button/Button";
import { modal } from "../../components/Modal/Modal";
import { Modal } from "../../components/Modal/ModalPopup";
import {
	IconCalendar,
	IconMoney,
	IconGroupOfPersons,
} from "../../assets/icons";
import { useTranslation } from "react-i18next";

export const ProjectDetailPage = () => {
	const { project, fetchProject } = useContext(ProjectContext);
	const setContextProps = useContextProps();

	const [modal, setModal] = React.useState(false);
	const openModal = setModal.bind(null, true);
	const closeModal = setModal.bind(null, false);

	React.useEffect(() => {
		setContextProps({ openModal });
	}, []);

	const color = useMemo(() => {
		return project.color === "#FFFFFF" ? null : project.color;
	}, [project]);

	const projectColors = useMemo(() => {
		return color
			? {
					"--header-color": color,
					"--background-color": chr(color).alpha(0.2).css(),
			  }
			: {};
	}, [color]);

	const { t } = useTranslation();

	return (
		<Block name='project-detail-page'>
			<Elem name='content' case='loaded'>
				<Block
					name='detail-card'
					mod={{ colored: !!color }}
					style={projectColors}>
					<Elem name='header'>
						<Elem name='title'>{project.title}</Elem>
					</Elem>
					<Elem name='stats_with_nums'>
						<Elem name='stat-item'>
							{project.project_type == "profitable" ? (
								<Elem name='profitable_project'>
									<Elem name='project_income'>
										{t("projectDetail.incomeLabel")}
									</Elem>
									<Elem name='numtype-data-withicon'>
										{project.project_rate}
										<Elem tag={IconMoney} name='icon' />
									</Elem>
								</Elem>
							) : (
								<Elem name='nonprofit_project'>
									{t("projectDetail.communityProjectLabel")}
								</Elem>
							)}
						</Elem>
						<Elem name='stat-item'>
							<Elem name='project_size-label'>
								{t("projectDetail.projectSizeLabel")}
							</Elem>
							<Elem name='numtype-data-withicon'>
								{project.project_size}
								<Elem tag={IconGroupOfPersons} name='icon' />
							</Elem>
						</Elem>
						<Elem name='stat-item'>
							<Elem name='project_due-label'>
								{t("projectDetail.dueDateLabel")}
							</Elem>
							<Elem name='numtype-data-withicon'>
								{project.project_due}
								<Elem tag={IconCalendar} name='icon' />
							</Elem>
						</Elem>
					</Elem>
					<Elem name='description'>
						<Elem name='description-label' style={{ whiteSpace: "pre-line" }}>
							{t("projectDetail.descriptionLabel")}
						</Elem>
						<Elem name='description-data'>
							{project.description
								? project.description
								: t("projectDetail.noDescription")}
						</Elem>
					</Elem>
					<Elem name='current_user_role'>
						{project.current_user_role ? (
							<Elem name='user_role_sentence'>
								{t("projectDetail.currentRoleLabel")}
								{project.current_user_role}
							</Elem>
						) : (
							<Elem name='user_role_sentence'>
								{t("projectDetail.noRoleLabel")}
							</Elem>
						)}
					</Elem>
				</Block>
				{modal && <ModalNoPhoneNumber closeModal={closeModal} />}
			</Elem>
		</Block>
	);
};

ProjectDetailPage.title = "Details";
ProjectDetailPage.path = "/details";
// ProjectDetailPage.exact = true;

ProjectDetailPage.context = ({ openModal }) => {
	const { project } = useProject();
	if (
		project &&
		project.hasOwnProperty("current_user_role") &&
		project.hasOwnProperty("id")
	) {
		var userRole = project.current_user_role;
		var projectID = project.id;
	}
	const { user } = useCurrentUser();
	if (user && user.hasOwnProperty("id")) {
		var userID = user.id;
	}
	const api = useAPI();
	const createProjectMember = async ({ openModal }) => {
		if (user) {
			if (user.phone !== "") {
				const response = await api.callApi("createProjectMember", {
					params: {
						pk: projectID,
					},
					body: {
						user_pk: userID,
						role: "pending",
					},
				});
				window.location.reload();
			} else {
				openModal();
			}
		}
	};

	const removeProjectMember = async () => {
		const response = await api.callApi("removeProjectMember", {
			params: {
				pk: projectID,
			},
			body: {
				user_pk: userID,
			},
		});

		if (response.code == 200) {
			window.location.reload();
		}
	};

	const { t } = useTranslation();

	return project && project.id ? (
		<Space size='small'>
			{project.expert_instruction && mode !== "explorer" && (
				<Button
					size='compact'
					onClick={() => {
						modal({
							title: t("labelInstruc.title"),
							body: () => (
								<div
									dangerouslySetInnerHTML={{
										__html: project.expert_instruction,
									}}
								/>
							),
						});
					}}>
					{t("labelInstruc.action")}
				</Button>
			)}
			{userRole == null ? (
				<Button
					// onClick={userPhone !== "" ? createProjectMember : openModal}
					onClick={() => createProjectMember({ openModal })}
					look='primary'
					size='impact'
					// style={{ color: "white", background: "#0D88BC" }}
				>
					{t("projectDetail.applyButtonLabel")}
				</Button>
			) : userRole == "pending" ? (
				<Button
					onClick={removeProjectMember}
					look='primary'
					size='impact'
					// style={{ color: "white", background: "#BC0D17" }}
				>
					{t("projectDetail.cancelButtonLabel")}
				</Button>
			) : userRole == "trainee" ? null : null}
		</Space>
	) : null;
};

const ModalNoPhoneNumber = ({ closeModal }) => {
	const { t } = useTranslation();

	return (
		<Modal visible bare closeOnClickOutside={false}>
			<Modal.Header>
				<h2>{t("projectDetail.noPhoneModalHeader")}</h2>
			</Modal.Header>
			<div className='ls-modal__body'>
				{t("projectDetail.noPhoneModalText")}
			</div>
			<Modal.Footer>
				<Button
					look='primary'
					size='compact'
					href='/user/account/'
					onClick={closeModal}>
					{t("projectDetail.toAccountModalButton")}
				</Button>
				<Button look='danger' size='compact' onClick={closeModal}>
					{t("projectDetail.cancelModalButton")}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
