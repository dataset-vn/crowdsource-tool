import { useCallback, useContext, useEffect, useRef } from 'react';
import { Button } from '../../components';
import { Form, Label, TextArea, Toggle } from '../../components/Form';
import { MenubarContext } from '../../components/Menubar/Menubar';
import { ProjectContext } from '../../providers/ProjectProvider';
import { useTranslation } from "react-i18next";

export const InstructionsSettings = () => {
  const { t } = useTranslation();
  const {project, fetchProject} = useContext(ProjectContext);
  const pageContext = useContext(MenubarContext);
  const formRef = useRef();

  useEffect(() => {
    pageContext.setProps({formRef});
  }, [formRef]);

  const updateProject = useCallback(() => {
    fetchProject(project.id, true);
  }, [project]);

  return (
    <div style={{width: 480}}>
      <Form ref={formRef} action="updateProject" formData={{...project}} params={{pk: project.id}} onSubmit={updateProject}>
        <Form.Row columnCount={1}>
          <Label text= {t('Instructions.label') /*"Labeling Instructions"*/}large/>
          <div style={{paddingLeft: 16}}>
            <Toggle label={t('Instructions.show') /*"Show before labeling"*/} name="show_instruction"/>
          </div>
          <div style={{color: "rgba(0,0,0,0.4)", paddingLeft: 16}}>
          {t('Instructions.write') /*Write instructions to help users complete labeling tasks.*/}
          </div>
        </Form.Row>

        <Form.Row columnCount={1}>
          <TextArea name="expert_instruction" style={{minHeight: 128}}/>
        </Form.Row>

        <Form.Actions>
          <Form.Indicator>
            <span case="success">{t('Instructions.saved!')}</span>
          </Form.Indicator>
          <Button type="submit" look="primary" style={{width: 120}}>{t('Instructions.save')}</Button>
        </Form.Actions>
      </Form>
    </div>
  );
};

InstructionsSettings.title = "Hướng dẫn";
InstructionsSettings.path = "/instruction";
