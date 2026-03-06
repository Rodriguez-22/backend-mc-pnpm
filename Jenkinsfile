pipeline {
    agent any
    
    environment {
        // Tu usuario de Docker Hub para subir las imágenes
        DOCKER_REGISTRY = 'jose196' 
    }

    stages {
        stage('Preparación') {
            steps {
                // Instalamos las dependencias necesarias
                sh 'pnpm install'
            }
        }

        stage('Build & Push MS-Usuarios') {
            steps {
                script {
                    // Compilamos usando Nest para generar el dist empaquetado
                    sh 'pnpm nest build ms-usuarios'
                    // Construimos la imagen de Docker
                    sh "docker build -t ${DOCKER_REGISTRY}/ms-usuarios:latest -f apps/ms-usuarios/deploy/Dockerfile ."
                    // Subimos la imagen a Docker Hub
                    sh "docker push ${DOCKER_REGISTRY}/ms-usuarios:latest"
                }
            }
        }

        stage('Build & Push MS-Gateway') {
            steps {
                script {
                    // Repetimos el proceso para el Gateway
                    sh 'pnpm nest build ms-client-gateway'
                    sh "docker build -t ${DOCKER_REGISTRY}/ms-gateway:latest -f apps/ms-client-gateway/deploy/Dockerfile ."
                    sh "docker push ${DOCKER_REGISTRY}/ms-gateway:latest"
                }
            }
        }

        stage('Sincronización GitOps (Argo CD)') {
            steps {
                script {
                    // Actualizamos un archivo para que Argo CD detecte un cambio en el repositorio
                    sh "date > last_deploy.txt"
                    
                    // Necesitas configurar una credencial en Jenkins con ID 'github-token'
                    withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh 'git add .'
                        sh 'git commit -m "chore: deploy selectivo gateway y usuarios [skip ci]"'
                        sh "git push https://${PASS}@github.com/rodriguez-22/backend-mc-pnpm.git HEAD:main"
                    }
                }
            }
        }
    }
}