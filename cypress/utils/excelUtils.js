const XLSX = require('xlsx');

// Function to read the Excel file
const readExcelFile = (filePath, sheetName) => {
    console.log(`Attempting to read Excel file: ${filePath}, Sheet: ${sheetName}`);
    try {
        const workbook = XLSX.readFile(filePath);
        console.log('Workbook read successfully');
        
        if (!workbook.Sheets[sheetName]) {
            throw new Error(`Sheet "${sheetName}" not found in the workbook`);
        }
        
        const worksheet = workbook.Sheets[sheetName];
        console.log('Worksheet accessed');
        
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(`Data read from Excel: ${JSON.stringify(data)}`);
        
        if (data.length === 0) {
            console.warn('Warning: Excel sheet is empty');
        }
        
        return data;
    } catch (error) {
        console.error('Error in readExcelFile:', error);
        throw error;
    }
};

// Function to write data to Excel file (without affecting dropdowns)
const writeDataToExcelFile = (filePath, sheetName, data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Data must be a non-empty array');
            }

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            XLSX.writeFile(workbook, filePath);
            resolve(`Data written to ${filePath} successfully`);
        } catch (error) {
            reject(`Error writing to Excel file: ${error.message}`);
        }
    });
};

// Function to validate data in Excel
const validateExcelData = (filePath, sheetName, expectedData) => {
    return readExcelFile(filePath, sheetName).then((jsonData) => {
        expectedData.forEach((item, index) => {
            const actualRow = jsonData[index];
            // Validate each field, customize as per your needs
            expect(actualRow.companyName).to.equal(item.companyName);
            expect(actualRow.country).to.equal(item.country);
            expect(actualRow.PAN).to.equal(item.PAN);
            expect(actualRow.location).to.equal(item.location);
            expect(actualRow.businessCriticality).to.equal(item.businessCriticality);
            expect(actualRow.annualSpend).to.equal(item.annualSpend);
            expect(actualRow.supplierCategory).to.equal(item.supplierCategory);
            expect(actualRow.SPOCName).to.equal(item.SPOCName);
            expect(actualRow.designation).to.equal(item.designation);
            expect(actualRow.email).to.equal(item.email);
            expect(actualRow.mobile).to.equal(item.mobile);
            expect(actualRow.fullAddress).to.equal(item.fullAddress);
            expect(actualRow.website).to.equal(item.website);
        });
    });
};

module.exports = { readExcelFile, writeDataToExcelFile, validateExcelData };
