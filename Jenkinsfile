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
        IMAGE_NAME = 'snowMountain'
    }
  
    stages {
        // Backend Checkout
        stage('Git Checkout Backend') {
            steps {
                dir('backend') {  // Checkout backend in 'backend' directory
                    git branch: 'RaniaWachene', credentialsId: 'git-cred', url: 'https://github.com/nada176/Devops.git'
                }
            }
        }
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

        // Backend Compilation
        stage('Backend - Compile') {
            steps {
                dir('backend') {
                    sh "mvn clean compile"
                }
            }
        }

        // Backend Tests
        stage('Tests - JUnit/Mockito') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        // JaCoCo Code Coverage
        stage('JaCoCo Code Coverage') {
            steps {
                dir('backend') {
                    sh 'mvn jacoco:prepare-agent test jacoco:report'
                }
            }
        }

        // File System Scan
        stage('File System Scan') {
            steps {
                dir('backend') {
                    sh "trivy fs --format table -o trivy-fs-report.html ."
                }
            }
        }

        // SonarQube Analysis
        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
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
        }

        // Quality Gate
        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                }
            }
        }

        // OWASP Dependency Check
        stage('OWASP Dependency Check') {
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
        stage('Publish To Nexus') {
            steps {
                dir('backend') {
                    withMaven(globalMavenSettingsConfig: 'global-settings', jdk: 'jdk17', maven: 'maven3', mavenSettingsConfig: '', traceability: true) {
                        sh "mvn deploy"
                    }
                }
            }
        }

        // Build & Tag Docker Image
        stage('Build & Tag Docker Image') {
            steps {
                dir('backend') {
                    script {
                        sh "docker build -t ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest ."
                    }
                }
            }
        }

        // Login to Nexus Docker Registry
        stage('Login to Nexus Docker Registry') {
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
        stage('Push Docker Image to Nexus') {
            steps {
                dir('backend') {
                    script {
                        sh "docker push ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        // Docker Image Scan
        stage('Docker Image Scan') {
            steps {
                dir('backend') {
                    sh "trivy image --timeout 15m --scanners vuln --format table -o trivy-image-report.html ${NEXUS_DOCKER_REPO}/${IMAGE_NAME}:latest"
                }
            }
        }

        // Docker Compose Backend & MySQL
        stage('Docker Compose Backend & MySQL') {
            steps {
                dir('backend') {
                    script {
                        sh 'docker-compose down || true'
                        sh 'docker-compose up -d'
                    }
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
