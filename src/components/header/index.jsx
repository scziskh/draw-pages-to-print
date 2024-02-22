import styled from "styled-components";

const Header = (props) => {
  return (
    <Wrapper>
      <Img
        src="/assets/copy-logo2.png"
        alt="COPY SHOP"
        width={`95px`}
        height={`64px`}
      />
      <Form>
        <Button
          type={`button`}
          onClick={() => window.location.reload()}
          value={`
          Перезапустити`}
        />
      </Form>
    </Wrapper>
  );
};

const Img = styled.img`
  height: 64px;
`;

const Wrapper = styled.header`
  width: 100%;
  display: flex;
  padding: 20px;
  background-color: #212121;
`;

const Form = styled.form`
  position: absolute;
  display: flex;
  right: 20px;
  vertical-align: middle;
`;
const Button = styled.input`
  padding: 6px 28px 20px 0;
`;

export default Header;
