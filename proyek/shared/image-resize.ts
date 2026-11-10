(function () {
"use strict";

function loadImageFromFile(file: any) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("File bukan gambar yang valid.")); };
    img.src = url;
  });
}

function resizeImageToDataUrl(img: any, targetDimension: any, maxDataUrlChars: any) {
  const size = targetDimension;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const srcSize = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
  const srcX = ((img.naturalWidth || img.width) - srcSize) / 2;
  const srcY = ((img.naturalHeight || img.height) - srcSize) / 2;
  ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, size, size);

  let quality = 0.85;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > maxDataUrlChars && quality > 0.3) {
    quality -= 0.15;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}

async function fileToResizedDataUrl(file: any, opts: any) {
  const maxSourceBytes = (opts && opts.maxSourceBytes) || 8 * 1024 * 1024;
  const targetDimension = (opts && opts.targetDimension) || 256;
  const maxDataUrlChars = (opts && opts.maxDataUrlChars) || 95000;

  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("File yang dipilih bukan gambar. Pilih file PNG, JPG, atau WEBP.");
  }
  if (file.size > maxSourceBytes) {
    throw new Error("Ukuran file terlalu besar (maks " + Math.round(maxSourceBytes / (1024 * 1024)) + "MB). Pilih foto lain atau kompres dulu.");
  }
  const img = await loadImageFromFile(file);
  return resizeImageToDataUrl(img, targetDimension, maxDataUrlChars);
}

window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.imageResize = { fileToResizedDataUrl, loadImageFromFile, resizeImageToDataUrl };

})();
