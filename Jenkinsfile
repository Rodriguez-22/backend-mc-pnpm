pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'jose196' // Tu usuario de Docker Hub
        GIT_REPO = 'https://github.com/rodriguez-22/backend-mc-pnpm.git'
    }

    stages {
        stage('Build & Push ms-auth') {
            steps {
                script {
                    // Construcción con Webpack (como vimos que funcionaba)
                    sh 'pnpm install'
                    sh 'nest build ms-auth'
                    sh "docker build -t ${DOCKER_REGISTRY}/ms-auth:latest -f apps/ms-auth/deploy/Dockerfile ."
                    sh "docker push ${DOCKER_REGISTRY}/ms-auth:latest"
                }
            }
        }

        stage('Build & Push ms-usuarios') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_REGISTRY}/ms-usuarios:latest -f apps/ms-usuarios/deploy/Dockerfile ."
                    sh "docker push ${DOCKER_REGISTRY}/ms-usuarios:latest"
                }
            }
        }

        stage('GitOps Update') {
            steps {
                script {
                    // Actualizamos el tag en el archivo de Helm para que Argo CD lo detecte
                    sh "sed -i 's/tag: .*/tag: \"latest\"/' deploy/kubernetes/tito-pizzeria/values.yaml"
                    
                    withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh 'git add .'
                        sh 'git commit -m "chore: update image tags [skip ci]"'
                        sh "git push https://${PASS}@github.com/rodriguez-22/backend-mc-pnpm.git HEAD:main"
                    }
                }
            }
        }
    }
}