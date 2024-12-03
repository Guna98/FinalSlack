const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const countryLocations = require('./fixtures/countryLocations');
const supplierCategories = require('./fixtures/supplierCategories');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function generateRandomPhone() {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateSupplierData(numSuppliers) {
    const suppliers = [];
    
    const countries = Object.keys(countryLocations);
    const designations = ["CEO", "Director", "VP", "Manager"];
    const firstNames = ["John", "Jane", "Alice", "Bob", "Emma"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
    const streets = ["Street", "Avenue", "Road", "Boulevard"];
    const criticalities = ["High", "Medium", "Low"];
    
    for (let i = 0; i < numSuppliers; i++) {
        const country = getRandomItem(countries);
        const location = getRandomItem(countryLocations[country]);
        
        const supplier = {
            company_name: `Supplier ${String.fromCharCode(65 + i)}`,
            country_of_incorporation: country,
            pan_no: generateRandomString(10),
            location: location,
            business_criticality: getRandomItem(criticalities),
            annual_spend: Math.floor(Math.random() * (1500000 - 300000 + 1)) + 300000,
            supplier_category: getRandomItem(supplierCategories),
            name_of_spoc: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
            designation: getRandomItem(designations),
            email: `${generateRandomString(8).toLowerCase()}@example.com`,
            mobile_no: generateRandomPhone(),
            full_address: `${Math.floor(Math.random() * 900) + 100} ${getRandomItem(streets)}, ${location}`,
            website: `https://supplier${String.fromCharCode(65 + i).toLowerCase()}.com`
        };
        suppliers.push(supplier);
    }
    
    return suppliers;
}

// Generate 50 suppliers
const newData = generateSupplierData(50);

// Write the data to a JSON file
const jsonFilePath = path.join(__dirname, 'fixtures', 'supplierData.json');
fs.writeFileSync(jsonFilePath, JSON.stringify(newData, null, 2));

// Create an Excel file with the data
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(newData);
XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");

const excelFilePath = path.join(__dirname, 'fixtures', 'supplier_bulk_upload1.xlsx');
XLSX.writeFile(workbook, excelFilePath);

console.log(`Created supplier_bulk_upload1.xlsx with ${newData.length} supplier entries.`);
