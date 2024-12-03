import { readExcelFile, writeDataToExcelFile } from "../../../utils/excelUtils";
import countryLocations from '../../../fixtures/countryLocations';
import supplierCategories from '../../../fixtures/supplierCategories';

// Log supplier categories for verification
console.log('Supplier Categories:', supplierCategories);

function generateSampleData(count) {
	const data = [];
	for (let i = 0; i < count; i++) {
		const country = getRandomItem(Object.keys(countryLocations));
		data.push({
			company_name: `Supplier ${String.fromCharCode(65 + i)}`,
			country_of_incorporation: country,
			pan_no: generateRandomString(10),
			location: getRandomItem(countryLocations[country]),
			business_criticality: getRandomItem(['High', 'Medium', 'Low']),
			annual_spend: Math.floor(Math.random() * (1500000 - 300000 + 1)) + 300000,
			supplier_category: getRandomItem(supplierCategories),
			name_of_spoc: `John Doe ${i + 1}`,
			designation: `Manager ${i + 1}`,
			email: `john.doe${i + 1}@example.com`,
			mobile_no: `+1234567890${i < 10 ? '0' + i : i}`,
			full_address: `${123 + i} Main St, City ${i + 1}`,
			website: `https://www.supplier${String.fromCharCode(97 + i)}.com`
		});
	}
	return data;
}

function getRandomItem(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function generateRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function ensureAllCategoriesPresent(data, categories) {
	// Ensure categories is an array
	const categoriesArray = Array.isArray(categories) ? categories : Object.keys(categories);
	const presentCategories = new Set(data.map(row => row.supplier_category));
	const missingCategories = categoriesArray.filter(category => !presentCategories.has(category));

	missingCategories.forEach(category => {
		data.push({
			...data[0], // Copy the first row as a template
			company_name: `Supplier ${String.fromCharCode(65 + data.length)}`,
			supplier_category: category
		});
	});

	return data;
}

describe('Supplier Data Test', () => {
	const excelFilePath = 'cypress/fixtures/supplier_bulk_upload1.xlsx';
	const sheetName = 'Suppliers';
	const sampleSize = 50;
	let excelData;

	before(() => {
		// Generate sample data
		const sampleData = generateSampleData(sampleSize);
		
		// Use Cypress task to write data to Excel file
		cy.task('writeExcelFile', { filePath: excelFilePath, jsonData: sampleData, sheetName })
			.then(() => {
				// Use Cypress task to read the updated Excel file
				return cy.task('readExcelFile', { filePath: excelFilePath, sheetName });
			})
			.then((data) => {
				// Ensure all categories are present
				excelData = ensureAllCategoriesPresent(data, supplierCategories);
				cy.log('Excel data read and updated:', excelData);
				
				// Write the updated data back to the Excel file
				return cy.task('writeExcelFile', { filePath: excelFilePath, jsonData: excelData, sheetName });
			});
	});

	it('should read and validate Excel data', () => {
		expect(excelData).to.have.length(sampleSize);
		
		excelData.forEach((row, index) => {
			cy.log(`Validating row ${index + 1}:`, row);

			expect(row).to.have.property('company_name').that.is.a('string');
			cy.log(`Company name: ${row.company_name}`);

			expect(row).to.have.property('country_of_incorporation').that.is.oneOf(Object.keys(countryLocations));
			cy.log(`Country of incorporation: ${row.country_of_incorporation}`);

			expect(row).to.have.property('pan_no').that.is.a('string');
			cy.log(`PAN: ${row.pan_no}`);

			expect(row).to.have.property('location').that.is.a('string');
			cy.log(`Location: ${row.location}`);

			expect(row).to.have.property('business_criticality').that.is.oneOf(['High', 'Medium', 'Low']);
			cy.log(`Business criticality: ${row.business_criticality}`);

			expect(row).to.have.property('annual_spend').that.is.a('number');
			cy.log(`Annual spend: ${row.annual_spend}`);

			expect(row).to.have.property('supplier_category').that.is.oneOf(supplierCategories);
			cy.log(`Supplier category: ${row.supplier_category}`);

			expect(row).to.have.property('name_of_spoc').that.is.a('string');
			cy.log(`SPOC name: ${row.name_of_spoc}`);

			expect(row).to.have.property('designation').that.is.a('string');
			cy.log(`Designation: ${row.designation}`);

			expect(row).to.have.property('email').that.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
			cy.log(`Email: ${row.email}`);

			expect(row).to.have.property('mobile_no').that.is.a('string');
			cy.log(`Mobile number: ${row.mobile_no}`);

			expect(row).to.have.property('full_address').that.is.a('string');
			cy.log(`Full address: ${row.full_address}`);

			expect(row).to.have.property('website').that.is.a('string');
			cy.log(`Website: ${row.website}`);
		});

		// Check if all categories from supplierCategories.js are present in the data
		expect(categoriesInData.size).to.equal(supplierCategories.length);
		supplierCategories.forEach(category => {
			expect(categoriesInData.has(category)).to.be.true;
		});
	});

	it('should validate country and location consistency', () => {
		excelData.forEach((row) => {
			const country = row.country_of_incorporation;
			const location = row.location;
			expect(countryLocations[country]).to.include(location);
		});
	});

	it('should check for unique company names', () => {
		const companyNames = excelData.map(row => row.company_name);
		const uniqueCompanyNames = new Set(companyNames);
		expect(uniqueCompanyNames.size).to.equal(sampleSize);
	});

	it('should validate email format', () => {
		excelData.forEach((row) => {
			expect(row.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
		});
	});

	it('should check annual spend range', () => {
		excelData.forEach((row) => {
			expect(row.annual_spend).to.be.at.least(300000).and.at.most(1500000);
		});
	});
});