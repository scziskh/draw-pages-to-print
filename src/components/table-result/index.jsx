import { useSelector } from "react-redux";
import styled from "styled-components";
import { getAmountsPdfProps } from "../../helpers/props-pdf.helpers";
import { useEffect } from "react";
import { useState } from "react";

const TableResult = (props) => {
  const pdfsProps = useSelector((state) => state.pdfPropsReducer);
  const [ammountsPdfsProps, setAmmountsPdfsProps] = useState({});
  useEffect(
    () => setAmmountsPdfsProps(getAmountsPdfProps(pdfsProps)),
    [pdfsProps]
  );
  const badFiles = { background: `red` };
  const firstRow = ammountsPdfsProps[`badFiles`] ? (
    <>
      <Div {...badFiles}>Увага! Деякі файли не опрацьовані </Div>
      <Div {...badFiles}>{ammountsPdfsProps[`badFiles`]}</Div>
    </>
  ) : (
    <>
      <Div>Формат</Div>
      <Div>Кількість</Div>
    </>
  );

  return (
    <Wrapper>
      <Grid>{firstRow}</Grid>
      {ammountsPdfsProps.sizes &&
        Object?.keys(ammountsPdfsProps.sizes)?.map((key) => (
          <Grid key={key}>
            <Div>{key}</Div>
            <Div>{ammountsPdfsProps.sizes[key]}</Div>
          </Grid>
        ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 50%;
`;
const Div = styled.div`
  border: 1px solid #212121;
  padding: 10px;
  text-align: center;
  background-color: ${(props) => props.background ?? "white"};
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;
export default TableResult;
