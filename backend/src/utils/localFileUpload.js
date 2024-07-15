const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);

/**
 * Process and store a file locally in the specified upload folder.
 *
 * @param {object} file - The file object to be processed and stored.
 * @param {string} uploadFolderPath - The folder path where the file should be stored.
 * @returns {string} - The generated file name after processing and storing the file.
 */

const uploadFile = async (file, uploadFolderPath) => {
  try {
    if (!file) {
      throw new Error("No file provided.");
    }
    if (file.mimetype === "text/csv") {
      const fileName = `${file.name}`;
      const filePath = path.join(uploadFolderPath, fileName);
      await file.mv(filePath);

      return fileName;
    }
    const extension = file.mimetype.split("/")[1];
    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(uploadFolderPath, fileName);
    await file.mv(filePath);
    return fileName;
  } catch (error) {
    console.error("Error processing file:", error);
  }
};

/**
 * Delete a file from the specified upload folder, if it exists.
 *
 * @param {string} uploadFolderPath - The folder path where the file is located.
 * @param {string} profileImage - The name of the file to be deleted.
 *
 */

const deleteFile = async (uploadFolderPath, profileImage) => {
  const deletePath = path.join(uploadFolderPath, profileImage);

  if (fs.existsSync(deletePath)) {
    await unlink(deletePath).catch(console.error);
  }
};
module.exports = { uploadFile, deleteFile };
