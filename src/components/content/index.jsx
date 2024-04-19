/* eslint-disable no-restricted-globals */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getPdfsProps } from "../../helpers/props-pdf.helpers";
import Loader from "../loader";
import Path from "../path";
import SimpleFile from "../simple-file";
import TableResult from "../table-result";

const Content = () => {
  const [files, setFiles] = useState(null); // curr files in input files
  const [pdfsProps, setPdfsProps] = useState({}); // properties of pdf files
  const [isLoading, setIsLoading] = useState(false); // if isLoading - true, else - false
  const [status, setStatus] = useState(null);

  const ref = useRef();

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute("directory", "");
      ref.current.setAttribute("webkitdirectory", "");
    }
  }, [ref]);

  useEffect(() => console.log(pdfsProps.area), [pdfsProps]);

  // action when file(s) choosed
  const handleFileChange = (e) => {
    setIsLoading(true);
    setFiles(e.target.files);
  };

  //set pdf props
  useEffect(() => {
    const setterPdfsProps = async () => {
      const currPdfsProps = await getPdfsProps(files, status, setStatus);

      setPdfsProps((state) => {
        const result = Object.assign(state, currPdfsProps);
        return result;
      });
      setIsLoading(false);
      setFiles(null);
    };

    if (files) {
      setterPdfsProps();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, isLoading]);

  useEffect(() => {
    setFiles(null);
    setIsLoading(false);
  }, [pdfsProps]);

  let numFiles = 0;

  const fileList = Object.keys(pdfsProps)?.map((pathname, index) =>
    pathname !== "folderList" ? (
      <div key={`${index}key${pathname}`}>
        <Path pathname={pathname} />
        {pdfsProps[pathname].map((currPdfProps, index) => {
          ++numFiles;
          return (
            <SimpleFile
              key={`${index}key${currPdfProps.name}${pathname}`}
              props={currPdfProps}
              index={`${pathname} ${currPdfProps.name}`}
            />
          );
        })}
      </div>
    ) : (
      ""
    )
  );

  return (
    <Wrapper>
      <FileContainer>
        <File
          type="file"
          ref={ref}
          onChange={handleFileChange}
          name="folder"
          id="folder"
          dir={`true`}
          multiple
          accept=".pdf"
          disabled={isLoading}
        />
        <FolderLabel htmlFor="folder">
          Додати папку з файлами (Додано:{" "}
          {Object.keys(pdfsProps).length - 1 > 0
            ? Object.keys(pdfsProps).length - 1
            : 0}{" "}
          папок, {numFiles} файлів)
        </FolderLabel>
      </FileContainer>
      <FixedHeightDiv>
        {isLoading ? (
          <Loader status={status} />
        ) : (
          <>
            <TableResult totalFiles={numFiles} />
          </>
        )}
      </FixedHeightDiv>
      {fileList}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  flex-grow: 1;
`;

const FileContainer = styled.form`
  position: relative;
  width: 50%;
  padding: 20px;
  height: 85px;
  margin: auto;
`;

const File = styled.input`
  display: none;
  &:disabled ~ label {
    color: #212121;
    background-color: lightgray;
    border-color: darkgrey;
    cursor: auto;
  }
`;

const FolderLabel = styled.label`
  display: block;
  width: 100%;
  margin: auto;
  cursor: pointer;
  color: #212121;
  border: 1px solid #212121;
  padding: 20px;
  transition: all 0.25s;
  text-align: center;
  white-space: nowrap;
  &:hover {
    background-color: #212121;
    color: white;
  }
`;

const FixedHeightDiv = styled.div`
  width: 100%;
  padding: 20px;
  min-height: 400px;
  display: flex;
  margin-left: 25%;
`;

export default Content;
