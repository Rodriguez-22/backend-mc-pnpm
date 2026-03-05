pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USER = 'jose196' // Cambia por el tuyo si es necesario
        GIT_REPO_URL = 'https://github.com/rodriguez-22/backend-mc-pnpm.git'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'
            }
        }

        stage('Build & Push ms-auth') {
            steps {
                script {
                    // Construimos la imagen usando el Dockerfile corregido
                    sh "docker build -t ${DOCKER_HUB_USER}/tito-auth:latest -f apps/ms-auth/deploy/Dockerfile ."
                    // Subimos la imagen (requiere haber hecho docker login previamente en el server)
                    sh "docker push ${DOCKER_HUB_USER}/tito-auth:latest"
                }
            }
        }

        stage('Update Git Manifests') {
            steps {
                script {
                    // Aquí es donde GitOps ocurre: Jenkins actualiza el tag en el values.yaml
                    // Para simplificar, usaremos sed para cambiar el tag en el archivo de Helm
                    sh "sed -i 's/tag: .*/tag: \"latest\"/' deploy/kubernetes/tito-pizzeria/charts/ms-auth/values.yaml"
                    
                    // Commiteamos el cambio al repo para que Argo CD lo vea
                    withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh 'git add .'
                        sh 'git commit -m "chore: update ms-auth image tag [skip ci]"'
                        sh "git push https://${GIT_PASS}@github.com/rodriguez-22/backend-mc-pnpm.git HEAD:main"
                    }
                }
            }
        }
    }
}