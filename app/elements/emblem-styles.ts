import { css } from 'lit-element';

export const buttonStyles = css`
  button {
    width: 100%;
    height: 3rem;
    border: none;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: bold;
    transition: all 200ms ease-in;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    background: lightgray;
    cursor: pointer;
  }

  button:hover,
  button.selected {
    background: #eee;
  }

  button.icon {
    width: 3rem;
  }
`;
