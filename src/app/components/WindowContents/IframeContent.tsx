import React from 'react';
import styled from 'styled-components';

const IframeWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IframeContentProps {
  url: string;
}

const IframeContent: React.FC<IframeContentProps> = ({ url }) => {
  return (
    <IframeWrapper>
      <StyledIframe 
        src={url}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </IframeWrapper>
  );
};

export default IframeContent; 