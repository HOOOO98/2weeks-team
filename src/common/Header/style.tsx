import styled from 'styled-components';
export const HeaderComponent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${(props) => props.theme.navBar};

    position: fixed;
    z-index: 2;

    top: 0;
    left: 0;
    height: 72px;
    width: 100%;
`;

export const TitleAnchor = styled.a`
    font-size: 32px;
    font-weight: bold;
    color: ${(props) => props.theme.text};
    margin-left: 30px;
`;

export const AnchorContainer = styled.div`
    float: right;
`;

export const RightAnchorContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
    margin-right: 10px;
`;

export const ListAnchor = styled.a`
    margin-right: 20px;
    font-weight: 700;
    font-size: 24px;
    color: ${(props) => props.theme.text};
`;
