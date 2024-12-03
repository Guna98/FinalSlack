const { defineConfig } = require("cypress");
const fs = require('fs');
const XLSX = require('xlsx');

module.exports = defineConfig({
  e2e: {
    reporter: 'mochawesome',  
    reporterOptions: {
      charts: true,
      reportDir: 'cypress/reports',  
      overwrite: false,  
      embeddedScreenshots: true,            
      html: true,                    
      json: true                    
    },
    video: true,                   
    screenshotOnRunFailure: true,     
  },
    setupNodeEvents(on, config) {
      require('mochawesome/plugin')(on);
      on('task', {
        readExcelFile({ filePath, sheetName }) {
          return new Promise((resolve, reject) => {
            try {
              const workbook = XLSX.readFile(filePath);
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              resolve(jsonData);
            } catch (error) {
              reject(error);
            }
          });
        },

        writeExcelFile({ filePath, jsonData, sheetName }) {
          return new Promise((resolve, reject) => {
            try {
              const workbook = XLSX.utils.book_new();
              const worksheet = XLSX.utils.json_to_sheet(jsonData);
              XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
              XLSX.writeFile(workbook, filePath);
              resolve(null);
            } catch (error) {
              reject(error);
            }
          });
        },

        writeFile({ filePath, content }) {
          return new Promise((resolve, reject) => {
            // content is already a buffer, so we can write it directly
            fs.writeFile(filePath, content, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(null);
              }
            });
          });
        },
      });
    },
});

