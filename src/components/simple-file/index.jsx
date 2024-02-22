import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { pdfsPropsSlice } from "../../redux/reducers/fileList";

const SimpleFile = ({ props, index }) => {
  const [isLoading, setIsLoading] = useState(false);

  const pdfsProps = useSelector((state) => state.pdfPropsReducer);
  const { updatePdfProps } = pdfsPropsSlice.actions;
  const dispatch = useDispatch();

  const { getValues } = useForm({
    mode: `onBlur`,
    defaultValues: props,
  });

  useEffect(() => {
    setIsLoading(false);
    dispatch(updatePdfProps({ index, pdfProps: getValues() }));
  }, [dispatch, getValues, index, isLoading, updatePdfProps]);

  return (
    <Wrapper {...pdfsProps?.[index]}>
      <FileName>
        {
          <a href={pdfsProps?.[index]?.href} target={`_blank`}>
            {pdfsProps?.[index]?.name}
          </a>
        }
      </FileName>
      <PagesNumber>{pdfsProps?.[index]?.pagesCount}</PagesNumber>
    </Wrapper>
  );
};

const Wrapper = styled.form`
  display: flex;
  padding: 10px;
  border: 1px solid #212121;
  background-color: ${(props) => {
    if (!props.pagesCount) {
      return "red";
    }
    return "white";
  }};
`;

const FileName = styled.div`
  a {
    color: #212121;
  }
  overflow: hidden;
  padding: 10px;
  width: 90%;
  white-space: nowrap;
`;
const PagesNumber = styled.div`
  position: relative;
  padding: 10px;
  width: 10%;
  text-align: center;
  font-weight: bold;
`;

export default SimpleFile;