export class LoginPage{
    
    email_textbox = 'input[name="email"]'
    password_textbox = 'input[name="password"]'
    Sign_in_button = '.css-ye9xn6 > .chakra-button'

    //create function

    enterEmail(email){
        cy.get(this.email_textbox).type(email)
        return this
    }
    enterPassword(password){
        cy.get(this.password_textbox).type(password)
        return this
    }
    clickLogin(){
        cy.get(this.Sign_in_button).click()
        return this
    
    }
}
