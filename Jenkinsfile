pipeline {
    agent any

    tools {
        jdk 'jdk17'
        maven 'maven3'
        nodejs 'nodejs18'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        NEXUS_DOCKER_REPO = '192.168.80.142:5000'
        IMAGE_NAME = 'stationski'
    }
  
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()  // Clean the workspace before starting the job
            }
        }
         stage('Git Checkout Frontend') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/RaniaWachene1/SnowMountain.git',
                        credentialsId: 'git-cred'
                    ]],
                    doGenerateSubmoduleConfigurations: false,
                    submoduleCfg: [],
                    extensions: [[$class: 'CloneOption', depth: 0, noTags: false, shallow: false]]  // Perform a full clone
                ])
            }
        }

        stage('Verify Files in Workspace') {
            steps {
                sh 'pwd'
                sh 'ls -la'  // Verify the presence of the angular.json and other necessary files
            }
        }
      

        stage('Git Checkout Backend') {
            steps {
                git branch: 'RaniaWachene', credentialsId: 'git-cred', url: 'https://github.com/nada176/Devops.git'

            }
        }
    
 stage(' Frontend -  Build') {
            steps {
                dir('Station_Ski') {  // Navigate to the directory with package.json
                   sh 'npm install'
                sh 'ng build --prod' // Install dependencies
                }
            }
        }
 

        stage('Backend -  Compile') {
            steps {
                sh "mvn clean compile"
            }
        }

        stage('Tests - JUnit/Mockito') {
            steps {
                sh 'mvn test'
            }
        }

        stage('JaCoCo Code Coverage') {
            steps {
                sh 'mvn jacoco:prepare-agent test jacoco:report'
            }
        }

        stage('File System Scan') {
            steps {
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh """
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=StationSki \
                        -Dsonar.projectKey=StationSki \
                        -Dsonar.java.binaries=target/classes \
                        -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')]) {
                        dependencyCheck additionalArguments: '''
                            --scan ./ \
                            --format ALL \
                            --out . \
                            --prettyPrint \
                            --nvdApiKey ${NVD_API_KEY}
                        ''', odcInstallation: 'DC'
                        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                    }
                }
            }
        }

        stage('Build & Tag Docker Image') {
            steps {
                script {
                    sh "docker build -t ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Login to Nexus Docker Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-docker-credentials', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo $PASS | docker login ${NEXUS_DOCKER_REPO} -u $USER --password-stdin"
                    }
                }
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {
                script {
                    sh "docker push ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Docker Image Scan') {
            steps {
                sh "trivy image --timeout 15m --scanners vuln --format table -o trivy-image-report.html ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest"
            }
        }

        stage('Docker Compose Backend & MySQL') {
            steps {
                script {
                    sh 'docker-compose down || true' // Stops any previous containers
                    sh 'docker-compose up -d' // Starts MySQL and backend services
                }
            }
        }
    }

    post {
        always {
            script {
                def jobName = env.JOB_NAME
                def buildNumber = env.BUILD_NUMBER
                def pipelineStatus = currentBuild.result ?: 'UNKNOWN'
                def bannerColor = pipelineStatus.toUpperCase() == 'SUCCESS' ? 'green' : 'red'

                def body = """
                    <html>
                    <body>
                    <div style="border: 4px solid ${bannerColor}; padding: 10px;">
                    <h2>${jobName} - Build ${buildNumber}</h2>
                    <div style="background-color: ${bannerColor}; padding: 10px;">
                    <h3 style="color: white;">Pipeline Status: ${pipelineStatus.toUpperCase()}</h3>
                    </div>
                    <p>Check the <a href="${BUILD_URL}">console output</a>.</p>
                    </div>
                    </body>
                    </html>
                """

                emailext (
                    subject: "${jobName} - Build ${buildNumber} - ${pipelineStatus.toUpperCase()}",
                    body: body,
                    to: 'rania.wachene@esprit.tn',
                    from: 'raniawachen21@gmail.com',
                    replyTo: 'rania.wachene@esprit.tn',
                    mimeType: 'text/html',
                    attachmentsPattern: '**/dependency-check-report.xml,**/trivy-fs-report.html,**/trivy-image-report.html'
                )
            }
            archiveArtifacts artifacts: '**/*.xml, **/*.html', allowEmptyArchive: true
        }
    }
}
