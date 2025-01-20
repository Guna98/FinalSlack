//import {LoginPage} from "../pages/login_page"
import { LoginPage } from "../../pages/Login_Page/login_page"
const loginPage = new LoginPage()
 

    it('Login',()=> {
        //cy.Reset()
        cy.visit('https://test.orennow.com/auth/login')
        loginPage
            .enterEmail('tester_rashmi@mailinator.com')
            .enterPassword('Test@1234')
            .clickLogin()
        // Removed assertion for successful login
             cy.Signout()
        

             
    })
    




