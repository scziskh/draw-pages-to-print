import styled from "styled-components";

const Path = (props) => {
  return <Wrapper>{props.pathname}</Wrapper>;
};

export default Path;

const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  padding: 5px;
  background-color: aliceblue;
  border-top: 2px solid red;
`;
