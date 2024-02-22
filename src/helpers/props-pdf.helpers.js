import { getPdf } from "./pdf-lib.helpers";

export const getPdfsProps = async (files) => {
  return Object.keys(files)?.reduce(async (accum, key) => {
    const temp = await accum;
    const file = files[key];
    const webkitRelativePath = file.webkitRelativePath;
    const pathArray =
      webkitRelativePath === "" ? [] : webkitRelativePath.split(`/`);
    pathArray.pop();
    const path =
      pathArray.length === 0 ? `Single PDF Files` : pathArray.join("/");
    const pdf = file.type === `application/pdf` ? await getPdf(file) : null;
    const { name } = file;

    const href = URL.createObjectURL(file);
    let pagesCount;
    let sizes;
    try {
      if (pdf) {
        pagesCount = pdf.getPageCount();
        sizes = pdf.getPages().map((currPage) => {
          const { width, height } = currPage.getSize();
          const a = Math.ceil(width / 2.8347);
          const b = Math.ceil(height / 2.8347);
          const result = a > b ? `${a}x${b}` : `${b}x${a}`;
          return result;
        });
      } else {
        pagesCount = 0;
      }
    } catch {
      pagesCount = 0;
    }

    const result = {
      pagesCount,
      name,
      href,
      sizes,
    };

    const folderName = pathArray[pathArray.length - 1];
    temp[path] ? temp[path]?.push(result) : (temp[path] = [result]);
    temp.folderList
      ? temp.folderList.add(pathArray[pathArray.length - 1])
      : (temp.folderList = new Set([folderName]));
    return temp;
  }, Promise.resolve({}));
};

export const getAmountsPdfProps = (pdfsProps) => {
  const sizesArr = Object.entries(pdfsProps).reduce((accum, item) => {
    return item[1].sizes ? item[1].sizes.concat(accum) : accum;
  }, []);
  const sizes = sizesArr.reduce((accum, item) => {
    accum[item] = accum[item] ? (accum[item] += 1) : 1;
    return accum;
  }, {});

  const badFiles = Object.entries(pdfsProps).reduce((accum, item) => {
    return item.pagesCount ? accum : accum++;
  }, 0);

  return { sizes, badFiles };
};
