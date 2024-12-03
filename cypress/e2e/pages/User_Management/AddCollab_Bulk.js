// Import necessary libraries
const XLSX = require('xlsx'); // Ensure you have this library installed

// Array of departments
const departments = [
    'Finance',
    'Health & HR',
    'IT',
    'Legal',
    'Marketing',
    'Operation',
    'Sales',
    'R&D',
    'Other'
];

// Function to generate a random department
function getRandomDepartment() {
    const randomIndex = Math.floor(Math.random() * departments.length);
    return departments[randomIndex];
}

// Function to generate 10 sets of data based on input
function generateDataSet(inputData) {
    const dataSets = [];
    for (let i = 0; i < 10; i++) {
        const newData = {
            'Collaborator Name': `${inputData.name} ${i + 1}`, // Unique name for each collaborator
            'Email': `collb${i + 1}_tester_anshul@mailinator.com`, // Unique email
            'Business Unit': inputData.businessU,
            'Department': getRandomDepartment(), // Randomly selected department
            'Mobile Number': `${inputData.mobileNumber + i}` // Increment mobile number
        };
        dataSets.push(newData);
    }
    return dataSets;
}

// Function to save data to an Excel file
function saveDataToFile(data) {
    const filePath = 'cypress/fixtures/CollaboratorTemplate.xlsx';
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Collaborators');
    XLSX.writeFile(workbook, filePath);
}

// Example usage
const inputData = {
    name: 'Collaborator1', // Base name
    businessU: 'India_BU', // Business Unit
    mobileNumber: 752265233 // Base mobile number
};

const generatedData = generateDataSet(inputData);
saveDataToFile(generatedData);
