import React from 'react';
import { cn } from '../../utils/bem';
import './Spinner.styl';
// import { DtsLoading } from '../../assets/images';
import { required } from '../Form/Validation/Validators';
import { useTranslation } from "react-i18next";

export const Spinner = ({ className, style, size = 32, stopped = false, content='LOADING......' }) => {
  const rootClass = cn('spinner');

  const sizeWithUnit = typeof size === 'number' ? `${size}px` : size;

  const { t } = useTranslation();
    
  return (
    // <div className={rootClass.mix(className)} style={{...(style ?? {}), '--spinner-size': sizeWithUnit}}>
    //   <div className={rootClass.elem('body').mod({stopped})}>
    //     <span/>
    //     <span/>
    //     <span/>
    //     <span/>
    //   </div>
    // </div>
    // <img src={required('../../assets/images/dataset_loading.gif')}></img>
    <div>{ t('Spinner.loading') /*LOADING.....*/ }</div>
  );
};
