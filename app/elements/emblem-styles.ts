import { css } from 'lit-element';

export const menuItemStyles = css`
  .menu-item {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-property: transform box-shadow;
  }

  .menu-item:hover,
  .menu-item:focus {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transform-origin: center;
    transform: scale(1.3);
    z-index: 3;
    background: white;
  }
`;

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
