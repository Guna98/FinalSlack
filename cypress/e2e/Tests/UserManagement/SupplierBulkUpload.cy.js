import { SupplierBulkUpload } from '../../pages/User_Management/Supplier_BulkUpload';
import 'cypress-file-upload'; // Add this import

const BulkUpload = new SupplierBulkUpload()
describe('Supplier Bulk Upload', () => {
    beforeEach(() => {
        cy.login();
    });

    it('should upload the supplier bulk file', () => {
        const fileName = 'supplier_bulk_upload1.xlsx';

            BulkUpload
                .clickUserManagment()
                .clickSupplierButton()
                .clickBulkUpload()
                 //.supplierBulkFile()
                .chooseFile(fileName) 
                .clickUpload()
               // .clickReset()
        });
    })
