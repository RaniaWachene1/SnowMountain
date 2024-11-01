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
        IMAGE_NAME = 'snowmountain'
        WEBHOOK_URL = credentials('mail-cred') // Or use email instead of Slack
        FILENAME = 'secrets.json'
        SCRIPT_PATH = '.secret-detection.sh'
    }
  
    stages {

        // Frontend Checkout
        stage('Git Checkout Frontend') {
            steps {
                dir('frontend') {  // Checkout frontend in 'frontend' directory
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: 'main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/RaniaWachene1/SnowMountain.git',
                            credentialsId: 'git-cred'
                        ]],
                        doGenerateSubmoduleConfigurations: false,
                        submoduleCfg: [],
                        extensions: [[$class: 'CloneOption', depth: 0, noTags: false, shallow: false]]
                    ])
                }
            }
        }
       
     // Backend Checkout
        stage('Git Checkout Backend') {
            steps {
                dir('backend') {  
                    git branch: 'RaniaWachene', credentialsId: 'git-cred', url: 'https://github.com/nada176/Devops.git'
                }
            }
        }
        
     stage('Update Version') {
            steps {
                dir('backend') {  
                    script {
                        def version = "1.0.0.${env.BUILD_NUMBER}"
                        sh "mvn versions:set -DnewVersion=${version} -DgenerateBackupPoms=false"
                    }
                }
            }
        }
// Secret Scanning with GitLeaks
stage('Secret Scanning with GitLeaks') {
    steps {
        dir('backend') {
            sh "docker run -v \$(pwd):/path zricethezav/gitleaks:latest detect --no-git --source='/path' --report-format json --report-path /path/secrets-report.json"
        
        }
    }
}




        // Backend Compilation
        stage('Backend -  Compile') {
            steps {
                dir('backend') {
                    sh "mvn clean compile"
                }
            }
        }



        // Backend Tests
        stage('Backend Tests - JUnit/Mockito') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        // JaCoCo Code Coverage
        stage('Backend - JaCoCo Code Coverage') {
            steps {
                dir('backend') {
                    sh 'mvn jacoco:prepare-agent test jacoco:report'
                }
            }
        }

        // File System Scan
        stage('Backend - File System Scan') {
            steps {
                dir('backend') {
                    sh "trivy fs --format table -o trivy-fs-report.html ."
                }
            }
        }


// Backend - SonarQube Analysis
stage('Backend - SonarQube Analysis') {
    steps {
        dir('backend') {
            withSonarQubeEnv('sonar') {
                sh """
                    $SCANNER_HOME/bin/sonar-scanner \\
                    -Dsonar.projectName=StationSki \\
                    -Dsonar.projectKey=StationSki \\
                    -Dsonar.java.binaries=target/classes \\
                    -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \\
                    -Dsonar.issue.ignore.multicriteria=e1,e2 \\
                    -Dsonar.exclusions=**/dependency-check-*.html \\
                    -Dsonar.issue.ignore.multicriteria.e1.ruleKey=html:S4020 \\
                    -Dsonar.issue.ignore.multicriteria.e1.resourceKey=**/dependency-check-*.html \\
                    -Dsonar.issue.ignore.multicriteria.e2.ruleKey=html:TableWithoutCaptionCheck \\
                    -Dsonar.issue.ignore.multicriteria.e2.resourceKey=**/dependency-check-*.html
                """
            }
        }
    }
}

// ... [Remaining stages remain unchanged]

// Add 'SonarQube Quality Gate' stage
stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                }
            }
        }


        // OWASP Dependency Check
        stage('Backend -  OWASP Dependency Check') {
            steps {
                dir('backend') {
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
        }

        // Publish To Nexus
        stage('Backend - Publish To Nexus') {
            steps {
                dir('backend') {
                    withMaven(globalMavenSettingsConfig: 'global-settings', 
                    jdk: 'jdk17', maven: 'maven3', mavenSettingsConfig: '', 
                    traceability: true) {
                        sh "mvn deploy"
                    }
                }
            }
        }

        // Build & Tag Docker Image
        stage('Backend - Build & Tag Docker Image') {
            steps {
                dir('backend') {
                    script {
                        sh "docker build -t ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest ."
                    }
                }
            }
        }

        // Login to Nexus Docker Registry
        stage('Backend - Login to Nexus Docker Registry') {
            steps {
                dir('backend') {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'nexus-docker-credentials', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                            sh "echo $PASS | docker login ${NEXUS_DOCKER_REPO} -u $USER --password-stdin"
                        }
                    }
                }
            }
        }

        // Push Docker Image to Nexus
        stage('Backend - Push Docker Image to Nexus') {
            steps {
                dir('backend') {
                    script {
                        sh "docker push ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        // Docker Image Scan
        stage('Backend - Docker Image Scan') {
            steps {
                dir('backend') {
                    sh "trivy image --timeout 35m --scanners vuln --format table -o trivy-image-report.html ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest"
                }
            }
        }

      

        // Frontend Build
        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    script {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

   
        // Frontend - Build & Tag Docker Image
        stage('Frontend - Build & Tag Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                            sh "docker build -t raniawachene/snowmountain:latest ."
                        }
                    }
                }
            }
        }

        // Frontend - Push Docker Image
        stage('Frontend - Push Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                            sh "docker push raniawachene/snowmountain:latest"
                        }
                    }
                }
            }
        }
          stage('Docker Compose ') {
            steps {
                dir('backend') {
                    script {
                        sh 'docker-compose down || true'
                        sh 'docker-compose up -d'
                    }
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
                attachmentsPattern: '**/dependency-check-report.xml,**/trivy-fs-report.html,**/trivy-image-report.html,**/secrets-report.json'
            )
        }
        archiveArtifacts artifacts: '**/*.xml, **/*.html, **/secrets-report.json', allowEmptyArchive: true
    }
}


}
