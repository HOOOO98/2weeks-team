import styled from '@emotion/styled/macro';

export const AllChannelsWrapper = styled.div`
    height: 100%;
    width: 16.25%;
    padding-top: 1%;
    background-color: #3f0e40;
    color: #ffffffb3;
`;

export const ChannelWrapper = styled.div`
    padding-left: 10%;
`;

export const ChannelFlexDiv = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

export const SubChannelFlexDiv = styled.div`
    display: flex;
    align-items: center;
    position: relative;

    &:hover {
        background-color: #4d2a51;
        cursor: pointer;
    }
`;

export const ChannelHr = styled.hr`
    border: solid 1px #4d2a51;
`;