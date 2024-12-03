export class SupplierBulkUpload {
    user_managment = '#user-management > .chakra-link'
    click_supplier_button = 'Suppliers'
    click_bulkupload = 'Bulk Upload'
    supplier_bulk_file = 'span > .chakra-link'
    choose_file = '.css-1windbk > .chakra-text'
    file_upload = "button[class='chakra-button css-1ikwvn0']"
    click_reset = 'Reset'


    clickUserManagment(){
        cy.get(this.user_managment).click()
        return this
    }
    clickSupplierButton(){
        cy.contains(this.click_supplier_button).click()
        return this
    }
    clickBulkUpload(){
        cy.contains(this.click_bulkupload).click({ force: true })
        return this
    }
    supplierBulkFile(){
        cy.get(this.supplier_bulk_file).click()
        return this
    }
    chooseFile(filePath) {
        cy.get(this.choose_file).then($button => {
            cy.wrap($button).click()
            cy.get('input[type="file"]').attachFile(filePath)
        })
        return this
    }
    clickUpload(){
        cy.get(this.file_upload).click()
        cy.contains('All the suppliers are uploaded successfully')
            .should('be.visible')
        return this
    }
    clickReset(){
        cy.contains(this.click_reset).click()
        return this
    }


}



