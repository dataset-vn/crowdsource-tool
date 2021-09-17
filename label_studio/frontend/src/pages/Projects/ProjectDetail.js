import React, { useContext } from "react";
import { Oneof } from "../../components/Oneof/Oneof";
import { Spinner } from "../../components/Spinner/Spinner";
import { ApiContext, useAPI } from "../../providers/ApiProvider";
import { ProjectContext, useProject } from "../../providers/ProjectProvider";
import { useParams } from "../../providers/RoutesProvider";
import { Block, Elem } from "../../utils/bem";

export const ProjectDetailPage = () => {
	const { project, fetchProject } = useContext(ProjectContext);

	return (
		<Block name='project-details'>
			{/* <Oneof value={networkState}> */}
			{/* <Elem name='loading' case='loading'>
				<Spinner />
			</Elem> */}
			<Elem name='content' case='loaded'>
				<Elem>Id: {project.id}</Elem>
				<Elem>Title: {project.title}</Elem>
				<Elem>Description: {project.description}</Elem>
				<Elem>Created at: {project.created_at}</Elem>
				<Elem>Project status: {project.project_status}</Elem>
				<Elem>Project type: {project.project_type}</Elem>
				<Elem>Color: {project.color}</Elem>
				<Elem>
					{project.current_user_role ? (
						<Elem>Your role: {project.current_user_role}</Elem>
					) : (
						<Elem>You haven't joined this project</Elem>
					)}
				</Elem>
			</Elem>
			{/* </Oneof> */}
		</Block>
	);
};

ProjectDetailPage.title = "Details";
ProjectDetailPage.path = "/details";
// ProjectDetailPage.exact = true;
