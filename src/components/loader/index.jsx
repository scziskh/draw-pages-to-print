import styled from "styled-components";

const Loader = () => (
  <Wrapper>
    <Circle />
  </Wrapper>
);
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 400;
  justify-content: center;
  margin-left: -25%;
`;
const Circle = styled.div`
  margin-top: 100px;
  display: block;
  background: linear-gradient(to left, #008ff0, #a1169c);
  width: 140px;
  height: 140px;
  animation: spin 2s linear infinite;
  border-radius: 50%;
  &:before {
    border-radius: 50%;
    width: 110px;
    height: 110px;
    content: "";
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: -1;
    background: white;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
