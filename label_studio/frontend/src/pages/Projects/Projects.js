import React from "react";
import { BoxLoading } from "react-loadingg";
import { useParams as useRouterParams } from "react-router";
import { Redirect } from "react-router-dom";
import { Button } from "../../components";
import { Oneof } from "../../components/Oneof/Oneof";
import { Spinner } from "../../components/Spinner/Spinner";
import { ApiContext } from "../../providers/ApiProvider";
import { useContextProps } from "../../providers/RoutesProvider";
import { Block, Elem } from "../../utils/bem";
import { CreateProject } from "../CreateProject/CreateProject";
import { DataManagerPage } from "../DataManager/DataManager";
import { SettingsPage } from "../Settings";
import "./Projects.styl";
import { ProjectDetailPage } from "./ProjectDetail";
import { EmptyProjectsList, ProjectsList } from "./ProjectsList";
import { useTranslation } from "react-i18next";

export const ProjectsPage = () => {
	const api = React.useContext(ApiContext);
	const [projectsList, setProjectsList] = React.useState([]);
	const [networkState, setNetworkState] = React.useState(null);
	const setContextProps = useContextProps();

	const [modal, setModal] = React.useState(false);
	const openModal = setModal.bind(null, true);
	const closeModal = setModal.bind(null, false);

	const fetchProjects = async () => {
		setNetworkState("loading");
		const projects = await api.callApi("projects");

		setProjectsList(projects ?? []);
		setNetworkState("loaded");
	};

	React.useEffect(() => {
		fetchProjects();
	}, []);

	React.useEffect(() => {
		// there is a nice page with Create button when list is empty
		// so don't show the context button in that case
		setContextProps({ openModal, showButton: projectsList.length > 0 });
	}, [projectsList.length]);

	return (
		<Block name='projects-page'>
			<Oneof value={networkState}>
				<Elem name='loading' case='loading'>
					<Spinner />
				</Elem>
				<Elem name='content' case='loaded'>
					{projectsList.length ? (
						<ProjectsList projects={projectsList} />
					) : (
						<EmptyProjectsList openModal={openModal} />
					)}
					{modal && <CreateProject onClose={closeModal} />}
				</Elem>
			</Oneof>
		</Block>
	);
};

ProjectsPage.title = "Dự án"; //chưa thể áp dụng i18n với dòng này
ProjectsPage.path = "/projects";
ProjectsPage.exact = true;
ProjectsPage.routes = ({ store }) => [
	{
		title: () => store.project?.title,
		path: "/:id(\\d+)",
		exact: true,
		component: () => {
			const userRole = store.project?.current_user_role;
			console.log(userRole);
			const params = useRouterParams();
			if (
				userRole == null ||
				userRole == "" ||
				userRole == "pending" ||
				userRole == "trainee"
			) {
				return <Redirect to={`/projects/${params.id}/details`} />;
			}
			return <Redirect to={`/projects/${params.id}/data`} />;
		},
		pages: {
			DataManagerPage,
			SettingsPage,
			ProjectDetailPage,
		},
	},
];
ProjectsPage.context = ({ openModal, showButton }) => {
	if (!showButton) return null;
	const { t } = useTranslation();
	return (
		<Button onClick={openModal} look='primary' size='compact'>
			{t("projectCreate.title") /*Create*/}
		</Button>
	);
};
