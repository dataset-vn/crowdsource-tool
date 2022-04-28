import { createGlobalStyle } from "styled-components";

const StyleGlobal = createGlobalStyle`
    body {
        
    }
    @media (max-width: 590px) {
        body {
        width:  100vw;
        height: 100vh;
        overflow: hidden;
        .app-wrapper{
            width:  100vw !important;
            overflow: hidden !important;
        }
        .ls-content-wrapper{
            width:  100vw;
            overflow: hidden;
        }
        .ls-menu-header{
            width: 100vw;
        }
        .ls-menu-header__trigger{
            min-width: 160px;
        }
        .ls-before-appear{
            max-width: 160px;
        }
        .ls-main-menu{
            max-width: 160px;
        }
        .ls-dropdown.ls-visible {
            max-width: 160px !important;
        }
        .ls-projects-page__list {
            display: flex !important;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            flex-direction: column !important;
            overflow-y: auto;
            position: absolute;
            left: 0;
            background-color: #F2F2F2 ;
            }
        }
        .ls-menu-header__context{
            min-width: 160px;
        }
        .ls-sidebar_floating{
            display: none;
        }
        .ls-modal__body_bare {
            .ls-modal__header{
                flex-direction: column;
                .ls-toggle-items{
                    width: 100%;
                    margin: 5px 0px 5px 0px;
                }
            }
            .ls-create-project form.ls-project-name{
                width: 90%;
                padding: 0px 20px 0px 20px;
                /* .field--wide > *:not(:first-child){
                    width: 70%;
                    margin-left:10px
                } */
            }
        }
        .ls-content-wrapper__body{
            .ls-content-wrapper__content{
                .leaderboard{
                    font-size: 13px;
                    padding: 10px 10px;
                    overflow-y: auto;
                    .leaderboard__rank{
                        width: 10%;
                        padding: 0 0.5em;
                    }
                    .leaderboard__name{
                        width: 45%;
                        padding: 0 0.5em;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .leaderboard__recentPoints{
                        width: 25%;
                        padding: 0 0.5em;
                    }
                    .leaderboard__totalPoints{
                        width: 15%;
                        padding: 0 0.5em;
                    }
                }
            }
        }



        //dm
        .dm-tab-panel{
            width: 100vw;
            overflow-x: scroll;
        }
        .dm-dropdown.dm-visible {
            left: 10px !important;
        }
        .dm-label-view__lsf-wrapper.dm-label-view__lsf-wrapper_mode_explorer {
            position: absolute;
            z-index: 10;
            width: 100vw;
            height: 100%;
            .editor--38IjC {
                width: 100%;
            }
            .menu--389bf {
                width: 100%;
            }
            .lsf-annotation-tabs__all{
                display:  none;
            }
        }
        .editor--38IjC.ls-editor{
            width: 100%;
            .menu--389bf{
                width: 100%
            }
        }
    }
`;
export default StyleGlobal;
