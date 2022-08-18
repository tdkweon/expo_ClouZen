import styled from "styled-components/native";

export const TextInput = styled.TextInput`
    background-color: rgba(0, 0, 0, 0.10);
    padding: 5px 5px;
    margin-bottom: 8px;
    border-radius: 4px;
    margin-bottom: ${(props) => (props.lastOne? "15": 8)}px;
`;