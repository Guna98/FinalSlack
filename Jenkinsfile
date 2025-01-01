pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pull the repository from GitHub
                git url: 'https://github.com/Guna98/FinalSlack.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install necessary dependencies (e.g., npm install)
                sh 'npm install'
            }
        }

        stage('Run Specific Test') {
            steps {
                // Run the specified Cypress test file
                sh 'npx cypress run --spec "cypress/e2e/Tests/Run_All_Regression_Tests.cy.js"'
            }
        }
    }

    post {
        always {
            script {
                // Send Slack notification based on the test result
                if (currentBuild.result == 'SUCCESS') {
                    slackSend(channel: '#jenkins-automation', message: "Test run completed successfully!")
                } else {
                    slackSend(channel: '#jenkins-automation', message: "Test run failed!")
                }
            }
        }
    }
}
