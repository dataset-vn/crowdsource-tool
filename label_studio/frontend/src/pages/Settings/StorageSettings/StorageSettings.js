import React from 'react';
import { Columns } from '../../../components/Columns/Columns';
import { Description } from '../../../components/Description/Description';
import { Block, cn } from '../../../utils/bem';
import { StorageSet } from './StorageSet';
import './StorageSettings.styl';
import { useTranslation } from "react-i18next";

export const StorageSettings = () => {
  const rootClass = cn("storage-settings");
  const { t } = useTranslation();

  return (
    <Block name="storage-settings">
      <Description style={{marginTop: 0}}>
        { t("StorageSettings.use") /*Use cloud or database storage as the source for your labeling tasks or the target of your completed annotations.*/ }
      </Description>

      <Columns count={2} gap="40px" size="320px" className={rootClass}>
        <StorageSet
          title= {t('StorageSettings.source') /*"Source Cloud Storage"*/}
          buttonLabel= {t('StorageSettings.addsource') /*"Add Source Storage"*/}
          rootClass={rootClass}
        />

        <StorageSet
          title= {t('StorageSettings.target') /*"Target Cloud Storage"*/}
          target="export"
          buttonLabel= {t('StorageSettings.addtarget') /*"Add Target Storage"*/}
          rootClass={rootClass}
        />
      </Columns>
    </Block>
  );
};

StorageSettings.title = "Lưu trữ đám mây";
StorageSettings.path = "/storage";
