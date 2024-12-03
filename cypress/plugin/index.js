const XLSX = require('xlsx');
const fs = require('fs');

module.exports = (on, config) => {
  on('task', {
    // Read existing Excel file
    readExcelFile(filePath) {
      try {
        return XLSX.readFile(filePath);
      } catch (error) {
        throw new Error(`Error reading Excel file: ${error.message}`);
      }
    },
    
    // Write updated workbook back to file
    writeExcelFile({ filePath, workbook }) {
      try {
        XLSX.writeFile(workbook, filePath);
        return null;
      } catch (error) {
        throw new Error(`Error writing Excel file: ${error.message}`);
      }
    }
  });
};