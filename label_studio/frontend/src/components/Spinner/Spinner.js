import React from 'react';
import { cn } from '../../utils/bem';
import './Spinner.styl';
import Page from 'react-page-loading'



export const Spinner = ({ className, style, size, stopped = false }) => {
  const rootClass = cn('spinner');

  return (
    <div className={rootClass.mix(className)} style={{...(style ?? {}), '--spinner-size': `${size ?? 32}px`}}>
      <div className={rootClass.elem('body').mod({stopped}) } >
      <Page loader={"rotate-spin"} color={"#A9A9A9"} size={6}>
        </Page>
        
      
      </div>
    </div>
    // <div></div>
    
  );
};
