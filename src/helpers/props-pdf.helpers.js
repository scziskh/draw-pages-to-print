import { defaultSizes } from "./config";
import { convertPdfToCanvases, getDistPDF } from "./pdf-dist.helpers";
import { getPdf } from "./pdf-lib.helpers";

export const getPdfsProps = async (files, status, setStatus) => {
  return Object.keys(files)?.reduce(async (accum, key) => {
    const temp = await accum;
    const file = files[key];
    setStatus(`Завантажуємо файл ${file.name}`);
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
    let coloredSizes = [];
    let sizes = [];
    let description = {};
    const area = [];
    try {
      if (pdf) {
        const distPDF = await getDistPDF(href);
        const canvases = await convertPdfToCanvases(
          distPDF,
          file.name,
          setStatus
        );

        pagesCount = distPDF.numPages;

        for (let index = 0; index < distPDF.numPages; index++) {
          const { width, height } = (
            await distPDF.getPage(index + 1)
          ).getViewport({ scale: 1 });
          let a = Math.max(
            Math.ceil(width / 2.83485),
            Math.ceil(height / 2.83485)
          );
          let b = Math.min(
            Math.ceil(width / 2.83485),
            Math.ceil(height / 2.83485)
          );
          let c = "";

          for (let i = 0; i < defaultSizes.length; i++) {
            if (a !== defaultSizes[i]) {
              if (defaultSizes[i] - 10 <= a && defaultSizes[i] + 10 >= a) {
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
          const currCanvas = canvases[index + 1];

          if (a < 450) {
            const colorPage = getPageColor(currCanvas, index);
            c = colorPage ? " Кольоровий" : " Чорно-білий";
          }

          coloredSizes.push(`${a}×${b}${c}`);
          sizes.push(`${a}×${b}`);
          area.push((a * b) / 1000000);
        }

        description.coloredSizes = coloredSizes.reduce((accum, item, index) => {
          accum[item] = accum[item] ? [...accum[item], index + 1] : [index + 1];
          return accum;
        }, {});

        description.area = area.reduce((accum, item, index) => {
          accum[item] = accum[item] ? [...accum[item], index + 1] : [index + 1];
          return accum;
        }, {});

        description.sizes = sizes.reduce((accum, item, index) => {
          accum[item] = accum[item] ? [...accum[item], index + 1] : [index + 1];
          return accum;
        }, {});
      } else {
        pagesCount = 0;
      }
    } catch (e) {
      console.error(e);
      pagesCount = 0;
    }

    const result = {
      pagesCount,
      name,
      href,
      coloredSizes,
      sizes,
      description,
      area,
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
  const coloredSizesArr = Object.entries(pdfsProps).reduce((accum, item) => {
    return item[1].coloredSizes ? item[1].coloredSizes.concat(accum) : accum;
  }, []);
  const coloredSizes = coloredSizesArr.reduce((accum, item) => {
    accum[item] = accum[item] ? (accum[item] += 1) : 1;
    return accum;
  }, {});
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
  const area = Object.entries(pdfsProps).reduce((accum, item) => {
    return item[1].area ? accum + +item[1].area : accum;
  }, 0);

  return { coloredSizes, sizes, badFiles, area };
};

const getPageColor = (canvas, index) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  console.log(`Обчислюємо колірність: Сторінка ${index + 1}`);
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
