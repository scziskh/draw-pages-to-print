import styled from "styled-components";

const Footer = (props) => {
  // get package.json version
  const { version } = require("../../../package.json");

  return (
    <Wrapper>
      <P>draw-pages-to-print v. {version}</P>
    </Wrapper>
  );
};

const P = styled.div`
  width: 100%;
  text-align: right;
  color: white;
`;

const Wrapper = styled.footer`
  width: 100%;
  display: flex;
  padding: 20px 100px;
  background-color: #212121;
  margin: auto;
`;

export default Footer;
