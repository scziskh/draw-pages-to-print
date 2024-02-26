import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const convertPdfToCanvases = async (url, fileName, setStatus) =>
  new Promise(async (resolve, reject) => {
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const fileArray = new Uint8Array(existingPdfBytes);
    const doc = await pdfjs.getDocument({
      data: fileArray,
      useSystemFonts: true,
    }).promise;

    const pages = {};

    for (let i = 1; i < doc.numPages + 1; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 0.1 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const task = page.render({ canvasContext: ctx, viewport: viewport });
      task.promise.then(() => {
        setStatus(
          `Обробляємо файл "${fileName}" (Сторінка ${
            Object.keys(pages).length
          } з ${doc.numPages})`
        );
        pages[i] = canvas;
        if (Object.keys(pages).length + 1 === doc.numPages) {
          setStatus(`Обчислюємо колірність файлу "${fileName}"`);
        }
        if (Object.keys(pages).length === doc.numPages) {
          resolve(pages);
        }
      });
    }
  });
