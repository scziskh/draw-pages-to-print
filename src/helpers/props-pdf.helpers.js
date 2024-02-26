import { defaultSizes } from "./config";
import { convertPdfToCanvases } from "./pdf-dist.helpers";
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
    let description;
    try {
      if (pdf) {
        const canvases = await convertPdfToCanvases(href);

        pagesCount = pdf.getPageCount();
        sizes = pdf.getPages().map((currPage, index) => {
          const { width, height } = currPage.getSize();

          let a = Math.max(
            Math.ceil(width / 2.8375),
            Math.ceil(height / 2.8375)
          );
          let b = Math.min(
            Math.ceil(width / 2.8375),
            Math.ceil(height / 2.8375)
          );

          for (let i = 0; i < defaultSizes.length; i++) {
            if (a !== defaultSizes[i]) {
              if (defaultSizes[i] + 10 <= a && defaultSizes[i] - 10 >= a) {
                a = defaultSizes[i];
              }
            }
            if (b !== defaultSizes[i]) {
              if (defaultSizes[i] - 10 <= b && defaultSizes[i] + 10 >= b) {
                b = defaultSizes[i];
              }
            }
          }
          if (a < defaultSizes[1]) {
            a = defaultSizes[1];
          }
          if (b < defaultSizes[0]) {
            b = defaultSizes[0];
          }

          const colorPage = getPageColor(canvases[index]);
          const c = colorPage ? "Кольоровий" : "Чорно-білий";

          const result = `${a}×${b} ${c}`;
          return result;
        });
        description = sizes.reduce((accum, item, index) => {
          accum[item] = accum[item] ? [...accum[item], index + 1] : [index + 1];
          return accum;
        }, {});
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
      description,
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
    return item[1].pagesCount ? accum : accum + 1;
  }, 0);

  return { sizes, badFiles };
};

const getPageColor = (canvas) => {
  const ctx = canvas.getContext("2d");
  console.log(ctx);
  for (let k = 1; k < canvas.width; k++) {
    for (let j = 1; j < canvas.height; j++) {
      const color = ctx.getImageData(k, j, 1, 1).data;
      if (
        Math.abs(+color[0] - +color[1]) > 10 ||
        Math.abs(+color[1] - +color[2]) > 10
      ) {
        return true;
      }
    }
  }
  return false;
};
