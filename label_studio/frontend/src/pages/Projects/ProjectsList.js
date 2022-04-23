import chr from "chroma-js";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { LsBulb, LsCheck, LsEllipsis, LsMinus } from "../../assets/icons";
import { Button, Dropdown, Menu, Userpic } from "../../components";
import { Block, Elem } from "../../utils/bem";
import { absoluteURL } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "../../providers/CurrentUser";

export const ProjectsList = ({ projects }) => {
  const history = useHistory();
  return (
    <Elem name="list">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} history={history} />
      ))}
    </Elem>
  );
};

export const EmptyProjectsList = ({ openModal }) => {
  const { t } = useTranslation();
  return (
    <Block name="empty-projects-page">
      <Elem
        name="heidi"
        tag="img"
        src={absoluteURL("/static/images/Dman2_naive.png")}
      />
      <Elem name="header" tag="h1">
        {
          t("projectEmpty.header") //trước đấy là 1 string
        }
      </Elem>
      <p>
        {
          t("projectEmpty.content") //trước đấy là 1 string
        }
      </p>
      <Elem name="action" tag={Button} onClick={openModal} look="primary">
        {
          t("projectEmpty.action") //trước đấy là 1 string
        }
      </Elem>
    </Block>
  );
};

const ProjectCard = ({ project, history }) => {
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

  const projectStatus = project.project_status;
  const userRole = project.current_user_role;
  const { user } = useCurrentUser();

  const { t } = useTranslation();
  return (
    <Elem
      tag={NavLink}
      name="link"
      to={
        userRole == "" || userRole == "pending" || userRole == "trainee"
          ? `/projects/${project.id}/details`
          : `/projects/${project.id}/data`
      }
      data-external
    >
      <Block
        name="project-card"
        mod={{ colored: !!color }}
        style={projectColors}
      >
        <Elem
          name="project-status"
          style={
            projectStatus == "open"
              ? { color: "#22cc00" }
              : projectStatus == "open_running"
                ? { color: "#0003ff" }
                : projectStatus == "closed_running"
                  ? { color: "#777777" }
                  : { color: "#bb8811" }
          }
        >
          {projectStatus == "open"
            ? t("projectCard.projectStatusOpen")
            : projectStatus == "open_running"
              ? t("projectCard.projectStatusOpenRunning")
              : projectStatus == "closed_running"
                ? t("projectCard.projectStatusClosedRunning")
                : t("projectCard.projectStatusCompleted")}
        </Elem>
        <Elem name="header">
          <Elem name="title">
            <Elem name="title-text">{project.title ?? "New project"}</Elem>

            <Elem
              name="menu"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {user?.email != "" && userRole != "" && userRole != "pending" ? (
                <Dropdown.Trigger
                  content={
                    <Menu>
                      <Menu.Item href={`/projects/${project?.id}/settings`}>
                        {t("projectCard.setting")}
                      </Menu.Item>
                      <Menu.Item
                        href={`/projects/${project?.id}/data?labeling=1`}
                      >
                        {t("projectCard.label")}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button size="small" type="text" icon={<LsEllipsis />} />
                </Dropdown.Trigger>
              ) : null}
            </Elem>
          </Elem>
          <Elem name="summary">
            {userRole == null ||
            userRole == "" ||
            userRole == "pending" ||
            userRole == "trainee" ? (
                <Elem name="annotation">
                  <Elem name="total" style={{ textTransform: "capitalize" }}>
                    {project.project_type}
                  </Elem>
                  <Elem name="detail" style={{ textTransform: "capitalize" }}>
                    {userRole == "" || userRole == null
                      ? t("projectCard.userStatusAvailable")
                      : userRole}
                  </Elem>
                </Elem>
              ) : projectStatus != "completed" ? (
                <Elem name="annotation">
                  <Elem name="total">
                    {project.num_tasks_with_annotations} / {project.task_number}
                  </Elem>
                  <Elem name="detail">
                    <Elem name="detail-item" mod={{ type: "completed" }}>
                      <Elem tag={LsCheck} name="icon" />
                      {project.total_annotations_number}
                    </Elem>
                    <Elem name="detail-item" mod={{ type: "rejected" }}>
                      <Elem tag={LsMinus} name="icon" />
                      {project.skipped_annotations_number}
                    </Elem>
                    <Elem name="detail-item" mod={{ type: "predictions" }}>
                      <Elem tag={LsBulb} name="icon" />
                      {project.total_predictions_number}
                    </Elem>
                  </Elem>
                </Elem>
              ) : null}
          </Elem>
        </Elem>
        <Elem name="description">{project.description}</Elem>
        <Elem name="info">
          <Elem name="created-date">
            {format(new Date(project.created_at), "dd MMM ’yy, HH:mm")}
          </Elem>
          <Elem name="created-by">
            <Userpic src="#" user={project.created_by} showUsername />
          </Elem>
        </Elem>
      </Block>
    </Elem>
  );
};
