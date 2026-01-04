import styled from 'styled-components';

export const StyledSubmitButton = styled.button<{ $isEnabled: boolean }>`
  width: 100%;
  padding: 14px 24px;
  background-color: ${props => props.$isEnabled ? 'rgb(51,144,236)' : '#ccc'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.$isEnabled ? 'pointer' : 'not-allowed'};
  transition: background-color 0.2s;
  opacity: ${props => props.$isEnabled ? 1 : 0.6};

  &:hover {
    background-color: ${props => props.$isEnabled ? 'rgb(74,149,214)' : '#ccc'};
  }
`;

