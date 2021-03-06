/*
 * File containing configuration parameters
 *
 */

// Dependencies
const path = require("path");

// Initializing container
const config = {
  "dataDir": path.join(__dirname, ".data"),
  "hashFunction": "sha512",
  "noOfTrials": 100
};

// Exporting parameters
module.exports = config;
