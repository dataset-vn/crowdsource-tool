import React from 'react';
import { cn } from '../../utils/bem';
import './Spinner.styl';
import Page from 'react-page-loading'
import GifLoader from 'react-gif-loader';



export const Spinner = ({ className, style, size, stopped = false }) => {
  const rootClass = cn('spinner');

  return (
    <div className={rootClass.mix(className)} style={{...(style ?? {}), '--spinner-size': `${size ?? 32}px`}}>
      <div className={rootClass.elem('body').mod({stopped}) } >
        <div style={{width:"11em",height:"11em"}}>
          <GifLoader
                loading={true}
                imageSrc="https://i.postimg.cc/D0fxLkv1/Vanilla-1s-288px.gif"
                imageStyle={{marginTop: "0%",width:"8em",heigth:"8em"}}
                overlayBackground="null"
            />
        </div>
        
      
      </div>
    </div>
    // <div></div>
    
  );
};
