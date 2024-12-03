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
  
    // Custom task to check file existence
    Cypress.Commands.add('checkFileExists', (filePath) => {
      return cy.task('checkFileExists', filePath);
    });
  
    // Custom task to create directory if not exists
    Cypress.Commands.add('ensureDirectoryExists', (dirPath) => {
      return cy.task('ensureDirectoryExists', dirPath);
    });
  
    it('Prepare and Validate Excel File', () => {
      // First, check if the file exists
      cy.checkFileExists(absoluteFilePath).then((exists) => {
        if (!exists) {
          // If file doesn't exist, create the directory and an empty workbook
          const path = require('path');
          const XLSX = require('xlsx');
  
          // Ensure directory exists
          const directory = path.dirname(absoluteFilePath);
          cy.ensureDirectoryExists(directory);
  
          // Create a new workbook
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet([]);
          XLSX.utils.book_append_sheet(wb, ws, 'Collaborators');
  
          // Write the empty workbook
          XLSX.writeFile(wb, absoluteFilePath);
          cy.log(`Created new Excel file at ${absoluteFilePath}`);
        }
  
        // Generate and write collaborator data
        const newCollaboratorData = generateCollaboratorData();
  
        // Write the new data to the Excel file
        cy.task('writeExcelFile', {
          filePath: absoluteFilePath,
          jsonData: newCollaboratorData,
          sheetName: 'Collaborators'
        }).then(() => {
          // Verify the file was updated by reading it back
          cy.task('readExcelFile', {
            filePath: absoluteFilePath,
            sheetName: 'Collaborators'
          }).then((readData) => {
            // Assertions to verify data
            expect(readData).to.have.lengthOf(10);
            
            // Log the generated data for verification
            cy.log('Generated Collaborator Data:');
            readData.forEach((row, index) => {
              cy.log(`Row ${index + 1}:`, JSON.stringify(row));
              
              // Additional specific assertions
              expect(row['Collaborator Name']).to.equal(`Collaborator ${index + 1}`);
              expect(row['Email']).to.equal(`collb${index + 1}_tester_anshul@mailinator.com`);
              expect(row['Business Unit']).to.equal('India_BU');
              expect(DEPARTMENTS).to.include(row['Department']);
              expect(row['Mobile Number']).to.match(/^\d{9}$/);
            });
          });
        });
      });
    });
  });
  
  // Update your cypress.config.js with these additional tasks:
  // module.exports = defineConfig({
  //   e2e: {
  //     setupNodeEvents(on, config) {
  //       // ... existing tasks ...
  //       
  //       // Add these new tasks
  //       on('task', {
  //         checkFileExists(filePath) {
  //           const fs = require('fs');
  //           return fs.existsSync(filePath);
  //         },
  //         ensureDirectoryExists(dirPath) {
  //           const fs = require('fs');
  //           const path = require('path');
  //           
  //           // Create directory if it doesn't exist
  //           if (!fs.existsSync(dirPath)) {
  //             fs.mkdirSync(dirPath, { recursive: true });
  //           }
  //           return true;
  //         }
  //       });
  //     },
  //   },
  // });