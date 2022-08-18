import React from "react";
import { Title } from '../Basic/Basic';
import { StyledSectionWrapper } from './Settings.styled';

export const SettingsListSectionHeader = (props) => {
  const { icon, title } = props;

  return (
    <StyledSectionWrapper>
      {icon}

      <Title size="l" style={{ marginLeft: 16 }}>
        {title}
      </Title>
    </StyledSectionWrapper>
  );
};