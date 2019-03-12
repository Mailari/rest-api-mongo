def label = "ercan-pod-${UUID.randomUUID().toString()}"
def project = 'altorumleren'
def appName = 'nodejs-samples-2'
def imageTag = "${project}/${appName}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
def overAllStatus =  'SUCCESS'
def private_docker_registry_address='http://88.198.38.226:5000'
node  {
   def app
   currentBuild.result = 'SUCCESS'
       try {
           stage('Clone repository') {
               /* checkout scm */
               // repo test
               checkout scm
           }
           echo "branch name is ${env.BRANCH_NAME}"
           echo "branch name is ${BRANCH_NAME}"
           stage('Build image') {
               // This builds the actual image
               app = docker.build("${project}/${appName}")
           }

           stage('image test') {
               // Test image
               // Run command inside previously build docker image
               app.inside {
                sh "mongod &"
                sh "node -v"
                sh "npm -v"
                sh "npm i"
               }
           }

           stage('Test') {
               app.inside {
                   sh "npm run test"
               }
           }
         /*stage('Code Analysis') {
               app.inside{
                   //Please do not touch this section if you don't have sonar-project.properties file
                   sh "sonar-scanner"
               }

           }*/
           stage('Push image') {
               /* Finally, we'll push the image with two tags:
                * First, the incremental build number from Jenkins
                * Second, the 'latest' tag.
                * Pushing multiple tags is cheap, as all the layers are reused. */
               docker.withRegistry("${private_docker_registry_address}", 'docker-registry-credential-id') {
                       app.push("${env.BRANCH_NAME}.${env.BUILD_NUMBER}")
                       app.push("latest")
               }
           }
       }
       catch(exception) {
               currentBuild.result = 'FAILURE'
               // Send Email If the Build is Failed
               stage('Email')
                   {
                       env.ForEmailPlugin = env.WORKSPACE
                       emailext attachLog: true, attachmentsPattern: '**/*report.html',
                       body: "Code Check-In was Done.\n${currentBuild.result}: Job ${env.JOB_NAME} with buildnumber: ${env.BUILD_NUMBER} was Unsuccessfull.\nMore info at: ${env.BUILD_URL}\n",
                       subject: "${currentBuild.result} : ${env.JOB_NAME}, version: ${env.BUILD_NUMBER}",
                       to: "vipin@altorumleren.com,prateek@altorumleren.com,sandeep.parira@altorumleren.com,punnet.srivastava@altorumleren.com"
                   }
           }
       finally{
               if(currentBuild.result != 'FAILURE'){
                   stage('Email') {
                       env.ForEmailPlugin = env.WORKSPACE
                       emailext attachLog: true, attachmentsPattern: '**/*report.html',
                       body: "Code Check-In was Done.\n${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\nMore info at: ${env.BUILD_URL}\nCheck Sonar Report here http://sonarqube.altorumleren.com",
                       subject: currentBuild.currentResult + " : " + env.JOB_NAME,
                       to: "vipin@altorumleren.com,prateek@altorumleren.com,sandeep.parira@altorumleren.com,punnet.srivastava@altorumleren.com"
                   }
               }
       }
}
