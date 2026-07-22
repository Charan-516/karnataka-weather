'use client'
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="loader-inner">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
          <div className="blob b4" />
          <div className="blob b5" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    --c1: #ffbf48;
    --c2: #be4a1d;
    --t: 2s;
    --size: 1;
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    transform: scale(var(--size));
    box-shadow:
      0 0 25px 0 #ffbf4780,
      0 20px 50px 0 #bf4a1d80;
    animation: colorize calc(var(--t) * 3) ease-in-out infinite;
    overflow: hidden;
  }

  .loader::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border-top: 1px solid var(--c1);
    border-bottom: 1px solid var(--c2);
    background: linear-gradient(180deg, #ffbf4740, #bf4a1d80);
    box-shadow:
      inset 0 10px 10px 0 #ffbf4780,
      inset 0 -10px 10px 0 #bf4a1d80;
  }

  .loader-inner {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    overflow: hidden;
    filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="g"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/></filter></svg>#g');
    -webkit-filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="g"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/></filter></svg>#g');
  }

  .blob {
    position: absolute;
    border-radius: 42%;
    background: linear-gradient(180deg, var(--c1) 30%, var(--c2) 70%);
  }

  .b1 {
    width: 44px;
    height: 44px;
    top: 12px;
    left: 28px;
    transform-origin: 50% 130%;
    animation: spin var(--t) linear infinite reverse;
  }

  .b2 {
    width: 40px;
    height: 40px;
    top: 18px;
    left: 30px;
    transform-origin: 50% -30%;
    animation: spin var(--t) linear infinite;
    animation-delay: calc(var(--t) / -3);
  }

  .b3 {
    width: 30px;
    height: 30px;
    top: 28px;
    left: 35px;
    transform-origin: -30% -10%;
    animation: spin var(--t) linear infinite reverse;
  }

  .b4 {
    width: 28px;
    height: 28px;
    top: 30px;
    left: 36px;
    transform-origin: -30% -10%;
    animation: spin var(--t) linear infinite reverse;
    animation-delay: calc(var(--t) / -2);
  }

  .b5 {
    width: 30px;
    height: 30px;
    top: 28px;
    left: 35px;
    transform-origin: 130% -10%;
    animation: spin var(--t) linear infinite;
  }

  .b6 {
    width: 28px;
    height: 28px;
    top: 30px;
    left: 36px;
    transform-origin: 130% -10%;
    animation: spin var(--t) linear infinite;
    animation-delay: calc(var(--t) / -1.5);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes colorize {
    0% {
      filter: hue-rotate(0deg);
    }
    20% {
      filter: hue-rotate(-30deg);
    }
    40% {
      filter: hue-rotate(-60deg);
    }
    60% {
      filter: hue-rotate(-90deg);
    }
    80% {
      filter: hue-rotate(-45deg);
    }
    100% {
      filter: hue-rotate(0deg);
    }
  }
`;

export default Loader;
