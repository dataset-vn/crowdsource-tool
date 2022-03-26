import React, { useCallback, useContext } from 'react';
import { NavLink } from "react-router-dom";
import { Button } from '../../components';
import { Form, Input, TextArea, Select, Toggle, Label } from '../../components/Form';
import { RadioGroup } from '../../components/Form/Elements/RadioGroup/RadioGroup';
import { ProjectContext } from '../../providers/ProjectProvider';
import { Block, Elem } from '../../utils/bem';
import { useTranslation } from "react-i18next";

export const GeneralSettings = () => {
  const {project, fetchProject} = useContext(ProjectContext);
  const { t } = useTranslation();
  const updateProject = useCallback(() => {
    if (project.id) fetchProject(project.id, true);
  }, [project]);

  const colors = [
    '#FFFFFF',
    '#F52B4F',
    '#FA8C16',
    '#F6C549',
    '#9ACA4F',
    '#51AAFD',
    '#7F64FF',
    '#D55C9D',
  ];

  const typeOption = [
    {label:t('projectCreate.community'), value:"nonprofit_project"},
    {label:t('projectCreate.paid'), value:"profitable"}
  ]

  const statusOption = [
    {label:t('projectCreate.open'), value:"open"},
    {label:t('projectCreate.open_running'), value:"open_running"},
    {label:t('projectCreate.closed_running'), value:"closed_running"}
  ]

  const samplings = [
    {value: "Sequential", label: t('GeneralSettings.sequential') /*"Sequential"*/, description: t('GeneralSettings.sampling') /*"Tasks are ordered by Data manager ordering"*/},
    {value: "Uniform", label: t('GeneralSettings.random') /*"Random"*/, description: t('GeneralSettings.sampling2') /*"Tasks are chosen with uniform random"*/},
  ];

  return (
    <div style={{width: 540}}>
      <Form
        action="updateProject"
        formData={{...project}}
        params={{pk: project.id}}
        onSubmit={updateProject}
      >
        <Form.Row columnCount={1} rowGap="32px">
          <Input
            name="title"
            label= {t('GeneralSettings.name') /*"Project Name"*/}
            labelProps={{large: true}}
          />

          <Select
            name="project_type"
            label={t('projectCreate.type')}
            options={typeOption}
            defaultValue={project.type}
            labelProps={{large: true}}
          />

          <Select
            name="project_status"
            label={t('projectCreate.status')}
            options={statusOption}
            defaultValue={project.project_status}
            labelProps={{large: true}}
          />

          <TextArea
            name="description"
            label= {t('GeneralSettings.des') /*"Description"*/}
            labelProps={{large: true}}
            style={{minHeight: 128}}
          />

          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Label text={"Tự động duyệt thành viên dự án"} large/>
            <div>
              <Toggle
                name="auto_approval"
                defaultChecked={project.auto_approval}
              />
            </div>
          </div>

          <RadioGroup name="color" label={t('GeneralSettings.color')} size="large" labelProps={{size: "large"}}>
            {colors.map(color => (
              <RadioGroup.Button key={color} value={color}>
                <Block name="color" style={{'--background': color}}/>
              </RadioGroup.Button>
            ))}
          </RadioGroup>

          <RadioGroup label= {t('GeneralSettings.task') /*"Task Sampling"*/} labelProps={{size: "large"}} name="sampling" simple>
            {samplings.map(({value, label, description}) => (
              <RadioGroup.Button
                key={value}
                value={`${value} sampling`}
                label={`${label} sampling`}
                description={description}
              />
            ))}
          </RadioGroup>
        </Form.Row>

        <Form.Actions>
          <Form.Indicator>
            <span case="success">{t('GeneralSettings.saved')}</span>
          </Form.Indicator>
          <Button type="submit" look="primary" style={{width: 120}}>{t('GeneralSettings.save')}</Button>
        </Form.Actions>
      </Form>
    </div>
  );
};


GeneralSettings.menuItem = "Tổng quan";
GeneralSettings.path = "/";
GeneralSettings.exact = true;
