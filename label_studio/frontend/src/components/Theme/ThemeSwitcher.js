import React from 'react';
import './switcher.scss';

const ThemeSwitcher = () =>{
    return(
        <div className="ThemeSwitcher">
            
        <div className='theme-options'>
            <div id='theme-bronze' />
            <div id='theme-silver' />
            <div id='theme-gold' />
            <div id='theme-ruby' />
            <div id='theme-diamond' />
        
        <div className='content-box'>
            <h3>Multiple theme switcher</h3>
        </div>
        </div>
        </div>
    )
};

export default ThemeSwitcher;