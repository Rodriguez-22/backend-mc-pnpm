pipeline {
    agent any

    environment {
        DOCKER_USER = 'jose196'
        // Referencia a las credenciales que creamos en el paso 1
        DOCKER_HUB_AUTH = credentials('docker-hub-credentials')
    }

    stages {
        stage('Preparación') {
            steps {
                echo 'Limpiando entorno y descargando código...'
                checkout scm
            }
        }

        stage('Instalación pnpm') {
            steps {
                // Asumiendo que usas pnpm para el monorepo
                sh 'pnpm install'
            }
        }

        stage('Construir Imágenes Docker') {
            steps {
                script {
                    echo 'Construyendo Gateway...'
                    sh "docker build -t ${DOCKER_USER}/tito-gateway:latest -f apps/ms-gateway/Dockerfile ."
                    
                    echo 'Construyendo Productos...'
                    sh "docker build -t ${DOCKER_USER}/tito-ms-productos:latest -f apps/ms-productos/Dockerfile ."
                    
                    echo 'Construyendo Usuarios...'
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