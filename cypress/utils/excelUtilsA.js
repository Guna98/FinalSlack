const XLSX = require('xlsx');

// Function to read the Excel file
const readExcelFile = (filePath, sheetName) => {
    return cy.readFile(filePath, 'binary').then((content) => {
        const workbook = XLSX.read(content, { type: 'binary' });
        
        if (!workbook.Sheets[sheetName]) {
            throw new Error(`Sheet "${sheetName}" not found in the workbook`);
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });
        
        if (data.length === 0) {
            cy.log('Warning: Excel sheet is empty');
        }
        
        return data;
    });
};

// Function to write data to Excel file (preserving existing structure)
const writeDataToExcelFile = (filePath, sheetName, data) => {
    return cy.readFile(filePath, 'binary').then((content) => {
        const workbook = XLSX.read(content, { type: 'binary' });
        const worksheet = workbook.Sheets[sheetName];

        // Preserve existing structure (including dropdowns)
        const updatedWorksheet = XLSX.utils.sheet_add_json(worksheet, data, { skipHeader: true, origin: 'A2' });
        
        workbook.Sheets[sheetName] = updatedWorksheet;
        XLSX.writeFile(workbook, filePath);
    });
};

// Function to validate data in Excel
const validateExcelData = (filePath, sheetName, expectedData) => {
    return readExcelFile(filePath, sheetName).then((jsonData) => {
        expect(jsonData.length).to.equal(expectedData.length, 'Number of rows should match');
        
        expectedData.forEach((item, index) => {
            const actualRow = jsonData[index];
            Object.keys(item).forEach(key => {
                expect(actualRow[key]).to.equal(item[key], `Mismatch in row ${index + 1}, column ${key}`);
            });
        });
    });
};

// Function to get column names from Excel
const getExcelColumnNames = (filePath, sheetName) => {
    return readExcelFile(filePath, sheetName).then((jsonData) => {
        if (jsonData.length > 0) {
            return Object.keys(jsonData[0]);
        }
        return [];
    });
};

module.exports = { readExcelFile, writeDataToExcelFile, validateExcelData, getExcelColumnNames };
