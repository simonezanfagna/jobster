import { Logo } from "../components";
import { Link } from "react-router-dom";
import main from "../assets/images/main.svg";
import styled from "styled-components";

export default function Landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
            finibus, tortor id lacinia ultrices, sapien felis scelerisque nisi,
            sed ultricies enim mauris in dolor.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
}

// posso scrivere il css del componente direttamente nel file del proprio componente oppure
// sriverlo in un file js separato ed importarlo (in questo progetto nella cartella wrappers ho creato i file con lo styled-component da importare nei relativi componenti)
// ovviamente lo styled-component "Wrapper" NON e' responsabile della logica ma SOLO dello stile
// solo per questo primo componente terro' lo styled-component nella pagina del relativo componente
const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
