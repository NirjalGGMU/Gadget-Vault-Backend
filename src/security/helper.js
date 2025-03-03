import fs from "fs";
import path from "path";

/**
 * Create uploads folder if it doesn't exist
 */
const createUploadsFolder = () => {
  const dir = "./uploads";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("Uploads folder created.");
  }
};

/**
 * Clean file name to prevent security issues
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Remove path information and non-safe characters
  return path.basename(filename)
    .replace(/[^a-z0-9.-]/gi, '_')
    .toLowerCase();
};

export {
  createUploadsFolder,
  sanitizeFilename
};