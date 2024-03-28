import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { pdfsPropsSlice } from "../../redux/reducers/fileList";

const SimpleFile = ({ props, index }) => {
  useEffect(() => console.log({ props, index }), [props, index]);
  const [isLoading, setIsLoading] = useState(false);

  const pdfsProps = useSelector((state) => state.pdfPropsReducer);
  const { updatePdfProps } = pdfsPropsSlice.actions;
  const dispatch = useDispatch();
  const [coloredSizes, setColoredSizes] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(
    () => setColoredSizes(Array.from(new Set(pdfsProps[index]?.coloredSizes))),
    [pdfsProps, index]
  );
  useEffect(
    () => setSizes(Array.from(new Set(pdfsProps[index]?.sizes))),
    [pdfsProps, index]
  );

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
      <div>
        {coloredSizes?.sort()?.map((item) => (
          <div key={item}>
            <strong>{item}: </strong>
            {pdfsProps[index]?.description?.coloredSizes[item]
              ? pdfsProps[index].description?.coloredSizes[item].map(
                  (el, i, array) =>
                    i === 0 || el - array[i - 1] !== 1
                      ? i !== 0
                        ? `, ${el}`
                        : el
                      : array[i + 1] - el !== 1
                      ? -el
                      : ""
                )
              : ""}
          </div>
        ))}
      </div>
      <div>
        {sizes?.sort()?.map((item) => (
          <div key={item}>
            <strong>{item}: </strong>
            {pdfsProps[index]?.description.sizes[item]
              ? pdfsProps[index].description.sizes[item].map((el, i, array) =>
                  i === 0 || el - array[i - 1] !== 1
                    ? i !== 0
                      ? `, ${el}`
                      : el
                    : array[i + 1] - el !== 1
                    ? -el
                    : ""
                )
              : ""}
          </div>
        ))}
      </div>
      <PagesNumber>{pdfsProps?.[index]?.pagesCount}</PagesNumber>
    </Wrapper>
  );
};

const Wrapper = styled.form`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 4fr 2fr 100px;
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
