const XLSX = require('xlsx');
const path = require('path');

describe('Collaborator Data Generator', () => {
    // Absolute path to the Excel file
    const absoluteFilePath = 'C:\\Users\\gunak\\OneDrive\\Desktop\\Desktop\\Project\\CypressAutomation v1\\cypress\\fixtures\\CollaboratorTemplate.xlsx';

    // List of predefined departments
    const DEPARTMENTS = [
        'Finance',
        'Health & Safety',
        'HR',
        'IT',
        'Legal',
        'Marketing',
        'Operations - Water',
        'Operations - Waste',
        'Operations - Emissions',
        'R&D',
        'Sales',
        'Other'
    ];

    // Function to generate random mobile number
    function generateRandomMobile() {
        return Math.floor(100000000 + Math.random() * 900000000).toString();
    }

    // Function to generate collaborator data
    function generateCollaboratorData(numRows = 10) {
        const data = [];
        const businessUnit = 'India_BU';

        // Generate rows
        for (let i = 1; i <= numRows; i++) {
            data.push({
                'Collaborator Name': `Collaborator ${i}`,
                'Email': `collb${i}_tester_anshul@mailinator.com`,
                'Business Unit': businessUnit,
                'Department': DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
                'Mobile Number': generateRandomMobile()
            });
        }

        return data;
    }

    it('Update Existing Excel File with Collaborator Data', () => {
        // Read the existing workbook
        cy.task('readExcelFile', absoluteFilePath).then((workbook) => {
            // Generate new collaborator data
            const newCollaboratorData = generateCollaboratorData();

            // Get the first worksheet (assuming it's the one we want to modify)
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // Convert existing worksheet to JSON
            const existingData = XLSX.utils.sheet_to_json(worksheet);

            // Combine existing data with new data
            const combinedData = [...existingData, ...newCollaboratorData];

            // Convert combined data back to worksheet
            const newWorksheet = XLSX.utils.json_to_sheet(combinedData);

            // Update the workbook with the new worksheet
            workbook.Sheets[worksheetName] = newWorksheet;

            // Write the updated workbook back to the file
            cy.task('writeExcelFile', { 
                filePath: absoluteFilePath, 
                workbook: workbook 
            });
        });
    });
});