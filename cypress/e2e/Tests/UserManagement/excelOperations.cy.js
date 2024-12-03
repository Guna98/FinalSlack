import { writeDataToExcelFile, validateExcelData } from '../../../utils/excelUtils';

describe('Excel File Operations', () => {
    const excelFilePath = 'cypress/fixtures/supplier_bulk_upload.xlsx';
    const sheetName = 'Suppliers'; // Modify as per your sheet name

    before(() => {
        cy.readFile(excelFilePath, 'binary')
            .then(() => {
                cy.log('Excel file found');
                return cy.fixture('supplierData.json');
            })
            .then((supplierData) => {
                // Write data to Excel
                return writeDataToExcelFile(excelFilePath, sheetName, supplierData);
            })
            .then(() => {
                cy.log('Data written to Excel file');
            });
    });

    it('should validate data in Excel file', () => {
        cy.fixture('supplierData.json').then((supplierData) => {
            // Validate the written data
            validateExcelData(excelFilePath, sheetName, supplierData);
        });
    });
});
