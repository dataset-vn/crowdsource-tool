import chr from "chroma-js";
import React, { useContext, useMemo } from "react";
import { ProjectContext } from "../../providers/ProjectProvider";

import { Block, Elem } from "../../utils/bem";
import {
	IconCalendar,
	IconMoney,
	IconGroupOfPersons,
} from "../../assets/icons";

export const ProjectDetailPage = () => {
	const { project, fetchProject } = useContext(ProjectContext);

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
									<Elem name='project_income'>Income:</Elem>
									<Elem name='numtype-data-withicon'>
										{project.project_rate}
										<Elem tag={IconMoney} name='icon' />
									</Elem>
								</Elem>
							) : (
								<Elem name='nonprofit_project'>
									Community Project - Nonprofit
								</Elem>
							)}
						</Elem>
						<Elem name='stat-item'>
							<Elem name='project_size-label'>Expected Project Size:</Elem>
							<Elem name='numtype-data-withicon'>
								{project.project_size}
								<Elem tag={IconGroupOfPersons} name='icon' />
							</Elem>
						</Elem>
						<Elem name='stat-item'>
							<Elem name='project_due-label'>Expected Due Date:</Elem>
							<Elem name='numtype-data-withicon'>
								{project.project_due}
								<Elem tag={IconCalendar} name='icon' />
							</Elem>
						</Elem>
					</Elem>
					<Elem name='description'>
						<Elem name='description-label'>Project Description: </Elem>
						<Elem name='description-data'>
							{project.description
								? project.description
								: "(This project has no description yet.)"}
						</Elem>
					</Elem>
					<Elem name='current_user_role'>
						{project.current_user_role ? (
							<Elem name='user_role_sentence'>
								You are currently a(an) {project.current_user_role}
							</Elem>
						) : (
							<Elem name='user_role_sentence'>
								You haven't joined this project yet
							</Elem>
						)}
					</Elem>
				</Block>
			</Elem>
		</Block>
	);
};

ProjectDetailPage.title = "Details";
ProjectDetailPage.path = "/details";
// ProjectDetailPage.exact = true;
