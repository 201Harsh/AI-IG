import React from "react";
import { FaSpinner, FaCircleNotch, FaCog, FaCompass } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(0.95); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const FullPageLoader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a192f 0%, #172a45 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: #64ffda;
`;

const LoadingText = styled.div`
  margin-top: 30px;
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const OuterSpinner = styled(FaCircleNotch)`
  position: absolute;
  font-size: 120px;
  animation: ${spin} 3s linear infinite;
  color: rgba(100, 255, 218, 0.3);
`;

const MiddleSpinner = styled(FaCompass)`
  position: absolute;
  font-size: 70px;
  top: 25px;
  left: 25px;
  animation: ${spin} 4s linear infinite reverse;
  color: rgba(100, 255, 218, 0.6);
`;

const InnerSpinner = styled(FaCog)`
  position: absolute;
  font-size: 40px;
  top: 40px;
  left: 40px;
  animation: ${spin} 5s linear infinite;
  color: #64ffda;
`;

const FloatingDots = styled.div`
  display: flex;
  margin-top: 40px;
  gap: 15px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #64ffda;
  animation: ${float} 1.5s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay || "0s"};
`;

const LoadingAnimation = () => {
  return (
    <FullPageLoader>
      <SpinnerContainer>
        <OuterSpinner />
        <MiddleSpinner />
        <InnerSpinner />
      </SpinnerContainer>

      <LoadingText>Creating Connection With EndGaming AI</LoadingText>

      <FloatingDots>
        <Dot $delay="0s" />
        <Dot $delay="0.2s" />
        <Dot $delay="0.4s" />
        <Dot $delay="0.6s" />
      </FloatingDots>
    </FullPageLoader>
  );
};

export default LoadingAnimation;
