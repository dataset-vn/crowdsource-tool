import { format } from 'date-fns';
import { useCallback, useContext } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import truncate from 'truncate-middle';
import { Button, Card, Dropdown, Menu } from '../../../components';
import { DescriptionList } from '../../../components/DescriptionList/DescriptionList';
import { confirm } from '../../../components/Modal/Modal';
import { Oneof } from '../../../components/Oneof/Oneof';
import { ApiContext } from '../../../providers/ApiProvider';
import { cn } from '../../../utils/bem';
import { useTranslation } from "react-i18next";

export const MachineLearningList = ({ backends, fetchBackends, onEdit }) => {
  const rootClass = cn('ml');
  const api = useContext(ApiContext);

  const onDeleteModel = useCallback(async (backend) => {
    await api.callApi('deleteMLBackend', {
      params: {
        pk: backend.id,
      },
    });
    await fetchBackends();
  }, [fetchBackends, api]);

  const onStartTraining = useCallback(async (backend) => {
    await api.callApi('trainMLBackend', {
      params: {
        pk: backend.id,
      },
    });
    await fetchBackends();
  }, [fetchBackends, api]);

  return (
    <div className={rootClass}>
      {backends.map(backend => (
        <BackendCard
          key={backend.id}
          backend={backend}
          onStartTrain={onStartTraining}
          onDelete={onDeleteModel}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

const BackendCard = ({backend, onStartTrain, onEdit, onDelete}) => {
  const confirmDelete = useCallback((backend) => {
    confirm({
      title: t('MLList.delete') /*"Delete ML Backend"*/,
      body:  t('MLList.message') /*"This action cannot be undone. Are you sure?"*/,
      buttonLook: "destructive",
      onOk(){ onDelete?.(backend); },
    });
  }, [backend, onDelete]);

  const { t } = useTranslation();
  return (
    <Card style={{marginTop: 0}} header={backend.title} extra={(
      <div className={cn('ml').elem('info')}>
        <BackendState backend={backend}/>

        <Dropdown.Trigger align="right" content={(
          <Menu size="small">
            <Menu.Item onClick={() => onEdit(backend)}> {t('MLList.edit') /*Edit*/}</Menu.Item>
            <Menu.Item onClick={() => confirmDelete(backend)}>{t('MLList.delete2') /*Delete*/ }</Menu.Item>
          </Menu>
        )}>
          <Button type="link" icon={<FaEllipsisV/>}/>
        </Dropdown.Trigger>
      </div>
    )}>
      <DescriptionList className={cn('ml').elem('summary')}>
        <DescriptionList.Item term="URL" termStyle={{whiteSpace: 'nowrap'}}>
          {truncate(backend.url, 20, 10, '...')}
        </DescriptionList.Item>
        {backend.description && (
          <DescriptionList.Item
            term="Description"
            children={backend.description}
          />
        )}
        <DescriptionList.Item term="Version">
          {backend.version ? format(new Date(backend.version), 'MMMM dd, yyyy ∙ HH:mm:ss') : 'unknown'}
        </DescriptionList.Item>
      </DescriptionList>

      <Button disabled={backend.state !== "CO"} onClick={() => onStartTrain(backend)}>
        Start Training
      </Button>
    </Card>
  );
};

const BackendState = ({backend}) => {
  const { state } = backend;
  const { t } = useTranslation();
  return (
    <div className={cn('ml').elem('status')}>
      <span className={cn('ml').elem('indicator').mod({state})}></span>
      <Oneof value={state} className={cn('ml').elem('status-label')}>
        <span case="DI"> {t('MLList.disconnected')}</span>
        <span case="CO"> {t('MLList.connected')}</span>
        <span case="ER"> {t('MLList.error')}</span>
        <span case="TR"> {t('MLList.training')}</span>
        <span case="PR"> {t('MLList.predicting')}</span>
      </Oneof>
    </div>
  );
};
