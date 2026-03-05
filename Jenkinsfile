pipeline {
    agent any

    // 👇 AÑADE ESTO PARA QUE JENKINS USE NODE Y PNPM 👇
    tools {
        nodejs 'node20' 
    }

    environment {
        DOCKER_USER = 'jose196'
        DOCKER_HUB_AUTH = credentials('docker-hub-credentials')
    }

    stages {
        stage('Preparación') {
            steps {
                echo 'Limpiando entorno...'
                checkout scm
            }
        }

        stage('Instalación pnpm') {
            steps {
                // Ahora Jenkins ya sabrá qué es pnpm
                sh 'pnpm install'
            }
        }

        stage('Construir Imágenes Docker') {
            steps {
                script {
                    echo 'Construyendo imágenes...'
                    sh "docker build -t ${DOCKER_USER}/tito-gateway:latest -f apps/ms-gateway/Dockerfile ."
                    sh "docker build -t ${DOCKER_USER}/tito-ms-productos:latest -f apps/ms-productos/Dockerfile ."
                    sh "docker build -t ${DOCKER_USER}/tito-ms-usuarios:latest -f apps/ms-usuarios/Dockerfile ."
                }
            }
        }

        stage('Subir a Docker Hub') {
            steps {
                sh "echo $DOCKER_HUB_AUTH_PSW | docker login -u $DOCKER_HUB_AUTH_USR --password-stdin"
                sh "docker push ${DOCKER_USER}/tito-gateway:latest"
                sh "docker push ${DOCKER_USER}/tito-ms-productos:latest"
                sh "docker push ${DOCKER_USER}/tito-ms-usuarios:latest"
            }
        }
    }
}