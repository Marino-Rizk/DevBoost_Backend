const path = require("path");
require("dotenv").config();
const axios = require("axios");


const removeSpaces = (str) => {
  return str.replace(/\s+/g, "");
};

/**
 * Function to upload and rename file with a timestamp
 * @param {Object} file - The uploaded file
 * @param {string} uploadDir - The directory to upload the file
 * @returns {Promise<Object>} - An object containing the file path and URL
 */
function uploadAndRenameFile(file) {
  return new Promise((resolve, reject) => {
    // Get the current timestamp
    const timestamp = Date.now();

    // Extract the file extension
    const fileExtension = path.extname(file.name);

    // Create a new file name with the timestamp
    const newFileName = `${timestamp}${fileExtension}`;

    const projectDir = path.resolve(__dirname, "..");

    // Define the upload path
    const uploadPath = path.join(projectDir, "/uploads", newFileName);

    // Define the file URL
    const fileUrl = `/uploads/${newFileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function (err) {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve({ filePath: uploadPath, fileUrl });
      }
    });
  });
}

function appendMainUrlToKey(jsonObj, key) {
  // Helper function to update a key's value

  if (jsonObj && process.env.MAIN_URL) {
    const updateKey = (obj) => {
      if (obj[key]) {
        obj[key] = process.env.MAIN_URL + obj[key];
      }
    };

    // If the JSON object is an array, iterate through each item
    if (Array.isArray(jsonObj)) {
      jsonObj.forEach((item) => updateKey(item));
    } else {
      // Otherwise, update the single object
      updateKey(jsonObj);
    }
  }

  return jsonObj;
}

function fixStringifiedJsonByKeyRecursive(jsonObj, key) {
  try {
    // Check if the jsonObj is an array, process each element
    if (Array.isArray(jsonObj)) {
      return jsonObj.map((item) => fixStringifiedJsonByKeyRecursive(item, key));
    }

    // If it's an object, process each key
    if (typeof jsonObj === "object" && jsonObj !== null) {
      for (const objKey in jsonObj) {
        if (objKey === key && typeof jsonObj[objKey] === "string") {
          // Parse the stringified JSON in the specified key
          jsonObj[objKey] = JSON.parse(jsonObj[objKey]);
        } else {
          // Recursively process the nested objects/arrays
          jsonObj[objKey] = fixStringifiedJsonByKeyRecursive(
            jsonObj[objKey],
            key
          );
        }
      }
    }
  } catch (error) {
    console.error(`Error parsing JSON string in key "${key}":`, error);
  }

  // Return the modified JSON object
  return jsonObj;
}

const formatDateToMySQL = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

module.exports = {
  removeSpaces,
  uploadAndRenameFile,
  appendMainUrlToKey,
  fixStringifiedJsonByKeyRecursive,
  formatDateToMySQL,
};
