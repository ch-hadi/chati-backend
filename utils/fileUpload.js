import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const fs = require("fs");
// const path = require("path");

export async function uploadFile(file, directory) {
  if (file) {
    const uploadsDir = path.join(__dirname, "..", "uploads");

    const dirPath = path.join(uploadsDir, directory);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const { name, ext } = path.parse(file.name);

    const filename = `${name}_${Date.now()}${ext}`;

    const filePath = path.join(dirPath, filename);
    await file.mv(filePath);

    return filename;
  }
  return null;
}

export async function uploadFiles(files, directory) {
  if (files) {
    const uploadsDir = path.join(__dirname, "..", "uploads");

    const dirPath = path.join(uploadsDir, directory);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const _files = [];

    const filesArray = Array.isArray(files) ? files : [files];

    for (const file of filesArray) {
      const { name, ext } = path.parse(file.name);
      const newFileName = `${name}_${Date.now()}${ext}`;
      _files.push({ fileName: newFileName });
      await file.mv(path.join(dirPath, newFileName));
    }
    return _files;
  }
}

export async function rollbackUploads(uploads, directory) {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  const dirPath = path.join(uploadsDir, directory);

  if (!fs.existsSync(dirPath)) {
    return;
  }

  if (!uploads) {
    return;
  }

  if (Array.isArray(uploads)) {
    for (const upload of uploads) {
      if (!upload.fileName) {
        continue;
      }
      const filePath = path.join(dirPath, upload.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } else {
    if (!uploads) {
      return;
    }
    const filePath = path.join(dirPath, uploads);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

// module.exports = { uploadFile, uploadFiles, rollbackUploads };
