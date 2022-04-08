import { createGlobalStyle } from "styled-components";

const StyleGlobal = createGlobalStyle`
    body {
       .ls-projects-page__list {
          display: flex !important;
          height: 100vh;
          flex-direction: column !important;
          overflow-y: auto;
       }
    }
    
`;
export default StyleGlobal;
