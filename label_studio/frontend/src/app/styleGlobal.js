import { createGlobalStyle } from "styled-components";

const StyleGlobal = createGlobalStyle`
    body {
        
    }
    @media (max-width: 590px) {
        body {
        width:  100vw;
        overflow: hidden;
        .app-wrapper{
            width:  100vw !important;
            overflow: hidden !important;
        }
        .ls-menu-header{
            width: 100%;
        }
        .ls-menu-header__trigger{
            min-width: 160px;
        }
        .ls-dropdown.ls-visible {
            max-width: 160px !important;
        }
        .ls-projects-page__list {
            display: flex !important;
            width: 100%;
            height: 100vh;
            flex-direction: column !important;
            overflow-y: auto;
            position: absolute;
            left: 0;
            background-color: #F6F6F6 ;
            }
        }
        .ls-menu-header__context{
            min-width: 160px;
        }
    }
`;
export default StyleGlobal;
