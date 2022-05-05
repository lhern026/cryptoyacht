import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--secondary);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  
  display: flex;
  flex-direction: column;
  
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 1rem;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 1rem;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 10%;
  width: 10%;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  backdrop-filter: blur(20px);
  
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 16px;
  line-height: 1.6;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;
