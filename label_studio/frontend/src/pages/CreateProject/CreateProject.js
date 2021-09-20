import React from 'react';
import { useHistory } from 'react-router';
import { Button, ToggleItems } from '../../components';
import { Modal } from '../../components/Modal/Modal';
import { Space } from '../../components/Space/Space';
import { useAPI } from '../../providers/ApiProvider';
import { cn } from '../../utils/bem';
import { ConfigPage } from './Config/Config';
import "./CreateProject.styl";
import { ImportPage } from './Import/Import';
import { useImportPage } from './Import/useImportPage';
import { useDraftProject } from './utils/useDraftProject';
import { useTranslation } from "react-i18next";


const ProjectName = ({ name, setName, onSaveName, onSubmit, error, description, setDescription, project_due, setProjectDue, project_rate, setProjectRate, project_type, setProjectType, project_status, setProjectStatus, project_size, setProjectSize, show = true }) => {
  if (!show) return null;
  const { t } = useTranslation(); 
  return(
  <form className={cn("project-name")} onSubmit={e => { e.preventDefault(); onSubmit(); }}>
    <div className="field field--wide">
      <label htmlFor="project_name">{ t('projectCreate.name') /*Project Name*/ }</label>
      <input required name="name" id="project_name" value={name} onChange={e => setName(e.target.value)} onBlur={onSaveName} />
      {error && <span className="error">{error}</span>}
    </div>
    <div className="field field--wide">
      <label htmlFor="project_description">{ t('projectCreate.description') /*Description*/ }</label>
      <textarea
        name="description"
        id="project_description"
        placeholder= { t('projectCreate.placeholder') }
        rows="4"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
    </div>
    <div className="field field--wide">
      <label htmlFor="project_rate">Thu nhập</label>
      <input name="project_rate" id="project_rate" value={project_rate} onChange={e => setProjectRate(e.target.value)} />
    </div>
    <div>
      <label htmlFor="project_type">Loại hình dự án</label>
      <select required value={project_type} onChange={e => setProjectType(e.target.value)}>
        <option value="nonprofit_project">Cộng đồng</option>
        <option value="profitable">Có lợi nhuận</option>
      </select>
    </div>
    <div>
      <label htmlFor="project_status">Tình trạng hoạt động</label>
      <select required value={project_status} onChange={e => setProjectStatus(e.target.value)}>
        <option value="open">Đang tuyển</option>
        <option value="open_running">Vẫn tuyển</option>
        <option value="closed_running">Ngừng tuyển</option>
      </select>
    </div>
    <div>
      <label htmlFor="project_size">Số người dự kiến</label>
      <input name="project_size" id="project_size" required value={project_size} onChange={e => setProjectSize(e.target.value)} />
    </div>
    <div>
      <label htmlFor="project_due">Ngày kết thúc</label>
      <input name="project_due" id="project_due" type="date" data-date="" data-date-format="YYYY-MM-DD" required value={project_due} onChange={e => setProjectDue(e.target.value)} />
    </div>
  </form>
);
};

export const CreateProject = ({ onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = React.useState("name"); // name | import | config
  const [waiting, setWaitingStatus] = React.useState(false);

  const project = useDraftProject();
  const history = useHistory();
  const api = useAPI();

  const [name, setName] = React.useState("");
  const [error, setError] = React.useState();
  const [description, setDescription] = React.useState("");
  const [config, setConfig] = React.useState("<View></View>");
  const [project_rate, setProjectRate] = React.useState("");
  const [project_due, setProjectDue] = React.useState(new Date());
  const [project_status, setProjectStatus] = React.useState("Đang tuyển");
  const [project_size, setProjectSize] = React.useState(1);
  const [project_type, setProjectType] = React.useState("Cộng đồng");

  React.useEffect(() => { setError(null); }, [name]);

  const { columns, uploading, uploadDisabled, finishUpload, pageProps } = useImportPage(project);
  
  const rootClass = cn("create-project");
  const tabClass = rootClass.elem("tab");
  const steps = {
    name: <span className={tabClass.mod({ disabled: !!error })}>{ t('projectCreate.name') }</span>,
    import: <span className={tabClass.mod({ disabled: uploadDisabled })}>{ t('projectCreate.import') }</span>,
    config:  t('projectCreate.config') /*"Labeling Setup"*/,
  };

  // name intentionally skipped from deps:
  // this should trigger only once when we got project loaded
  React.useEffect(() => project && !name && setName(project.title), [project]);

  const projectBody = React.useMemo(() => ({
    title: name,
    description,
    project_rate,
    project_due,
    project_type,
    project_size,
    project_status,
    label_config: config,
  }), [name, description, project_rate, project_due, project_type, project_size, project_status, config]);

  const onCreate = React.useCallback(async () => {
    const imported = await finishUpload();
    if (!imported) return;
    
    setWaitingStatus(true);
    const response = await api.callApi('updateProject',{
      params: {
        pk: project.id,
      },
      body: projectBody,
    });
    setWaitingStatus(false);

    if (response !== null) {
      history.push(`/projects/${response.id}/data`);
    }
  }, [project, projectBody, finishUpload]);

  const onSaveName = async () => {
    if (error) return;
    const res = await api.callApi('updateProjectRaw', {
      params: {
        pk: project.id,
      },
      body: {
        title: name,
      },
    });
    if (res.ok) return;
    const err = await res.json();
    setError(err.validation_errors?.title);
  };

  const onDelete = React.useCallback(async () => {
    setWaitingStatus(true);
    if (project) await api.callApi('deleteProject', {
      params: {
        pk: project.id,
      },
    });
    setWaitingStatus(false);
    history.replace("/projects");
    onClose?.();
  }, [project]);

  return (
    <Modal onHide={() => history.push("/projects")} fullscreen visible bare closeOnClickOutside={false}>
      <div className={rootClass}>
        <Modal.Header>
          <h1>{ t('projectCreate.title') }</h1>
          <ToggleItems items={steps} active={step} onSelect={setStep} />

          <Space>
            <Button look="danger" size="compact" onClick={onDelete} waiting={waiting}>{ t('projectCreate.delete') }</Button>
            <Button look="primary" size="compact" onClick={onCreate} waiting={waiting || uploading} disabled={!project || uploadDisabled || error}>{ t('projectCreate.save') }</Button>
          </Space>
        </Modal.Header>
        <ProjectName
          name={name}
          setName={setName}
          error={error}
          onSaveName={onSaveName}
          onSubmit={onCreate}
          description={description}
          setDescription={setDescription}
          project_rate={project_rate}
          setProjectRate = {setProjectRate}
          project_due={project_due}
          setProjectDue={setProjectDue}
          project_size={project_size}
          setProjectSize={setProjectSize}
          project_status={project_status}
          setProjectStatus={setProjectStatus}
          project_type={project_type}
          setProjectType={setProjectType}
          show={step === "name"}
        />
        <ImportPage project={project} show={step === "import"} {...pageProps} />
        <ConfigPage project={project} onUpdate={setConfig} show={step === "config"} columns={columns} disableSaveButton={true} />
      </div>
    </Modal>
  );
};
