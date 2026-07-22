'use client'
import styled from 'styled-components'

export const SolidButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 15px 36px;
  border: 4px solid;
  border-color: transparent;
  font-size: 15px;
  background-color: rgba(250, 242, 232, 0.75);
  backdrop-filter: blur(12px);
  border-radius: 100px;
  font-weight: 700;
  color: #3d1f0a;
  box-shadow: 0 0 0 2px rgba(180, 100, 60, 0.45), 0 4px 16px rgba(180, 80, 20, 0.14);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  font-family: 'Space Mono', monospace;

  svg {
    position: absolute;
    width: 22px;
    height: 22px;
    fill: #3d1f0a;
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .arr-1 { right: 18px; }
  .arr-2 { left: -25%; }

  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #d4845a;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .text {
    position: relative;
    z-index: 1;
    transform: translateX(-12px);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &:hover {
    box-shadow: 0 0 0 8px transparent, 0 8px 24px rgba(212, 132, 90, 0.4);
    color: #fff8f0;
    border-radius: 14px;
  }

  &:hover .arr-1 { right: -25%; }
  &:hover .arr-2 { left: 18px; }
  &:hover .text { transform: translateX(12px); }
  &:hover svg { fill: #fff8f0; }
  &:hover .circle {
    width: 260px;
    height: 260px;
    opacity: 1;
  }

  &:active {
    scale: 0.95;
    box-shadow: 0 0 0 4px rgba(212, 132, 90, 0.6);
  }
`

export const OutlineButton = styled.button`
  padding: 1.1em 2.2em;
  border-radius: 16px;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 1px 2px 6px rgba(139, 69, 19, 0.12), 0 4px 14px rgba(180, 80, 20, 0.1);
  letter-spacing: 0.2em;
  border: 1.5px solid rgba(180, 100, 60, 0.35);
  background: rgba(250, 242, 232, 0.65);
  backdrop-filter: blur(12px);
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  text-transform: uppercase;
  color: #3d1f0a;

  &:hover {
    letter-spacing: 0.3em;
    transform: translateY(-0.25em);
    background: linear-gradient(135deg, #d4845a 0%, #c46a38 100%);
    border-color: #d4845a;
    color: #ffffff;
    box-shadow: 0 10px 28px rgba(212, 132, 90, 0.45);
  }

  &:active {
    letter-spacing: 0.25em;
    transition: 0.1s all;
    transform: translateY(-0.1em);
    background: linear-gradient(135deg, #b8653b 0%, #a8542a 100%);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(180, 80, 20, 0.3);
  }
`
