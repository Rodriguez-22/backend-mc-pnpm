pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'jose196'
        GIT_REPO        = 'https://github.com/rodriguez-22/backend-mc-pnpm.git'
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
    }

    stages {

        // ─── 1. Instalar dependencias UNA sola vez ───────────────────────────
        stage('Install dependencies') {
            steps {
                sh 'pnpm install --frozen-lockfile'
            }
        }

        // ─── 2. Build + Push de cada microservicio ───────────────────────────
        stage('Build & Push ms-client-gateway') {
            steps {
                script {
                    sh 'nest build ms-client-gateway'
                    sh "docker build -t ${DOCKER_REGISTRY}/tito-gateway:${IMAGE_TAG} \
                            -f apps/ms-client-gateway/deploy/Dockerfile ."
                    sh "docker push ${DOCKER_REGISTRY}/tito-gateway:${IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push ms-usuarios') {
            steps {
                script {
                    sh 'nest build ms-usuarios'
                    sh "docker build -t ${DOCKER_REGISTRY}/tito-ms-usuarios:${IMAGE_TAG} \
                            -f apps/ms-usuarios/deploy/Dockerfile ."
                    sh "docker push ${DOCKER_REGISTRY}/tito-ms-usuarios:${IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push ms-productos') {
            steps {
                script {
                    sh 'nest build ms-productos'
                    sh "docker build -t ${DOCKER_REGISTRY}/tito-ms-productos:${IMAGE_TAG} \
                            -f apps/ms-productos/deploy/Dockerfile ."
                    sh "docker push ${DOCKER_REGISTRY}/tito-ms-productos:${IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push ms-auth') {
            steps {
                script {
                    sh 'nest build ms-auth'
                    sh "docker build -t ${DOCKER_REGISTRY}/tito-ms-auth:${IMAGE_TAG} \
                            -f apps/ms-auth/deploy/Dockerfile ."
                    sh "docker push ${DOCKER_REGISTRY}/tito-ms-auth:${IMAGE_TAG}"
                }
            }
        }

        // ─── 3. GitOps: actualizar tags en cada values.yaml ──────────────────
        stage('GitOps Update') {
            steps {
                script {
                    // Actualiza el tag de imagen en cada chart de forma quirúrgica
                    sh """
                        sed -i 's|repository: "jose196/tito-gateway".*|repository: "${DOCKER_REGISTRY}/tito-gateway"|g' \
                            deploy/kubernetes/tito-pizzeria/charts/ms-gateway/values.yaml
                        sed -i 's|tag: .*|tag: "${IMAGE_TAG}"|g' \
                            deploy/kubernetes/tito-pizzeria/charts/ms-gateway/values.yaml

                        sed -i 's|repository: "jose196/tito-ms-usuarios".*|repository: "${DOCKER_REGISTRY}/tito-ms-usuarios"|g' \
                            deploy/kubernetes/tito-pizzeria/charts/ms-usuarios/values.yaml
                        sed -i 's|tag: .*|tag: "${IMAGE_TAG}"|g' \
                            deploy/kubernetes/tito-pizzeria/charts/ms-usuarios/values.yaml

                        sed -i 's|repository: "jose196/tito-ms-productos".*|repository: "${DOCKER_REGISTRY}/tito-ms-productos"|g' \
                            deploy/kubernetes/tito-pizzeria/charts/ms-productos/values.yaml
                        sed -i 's|tag: .*|tag: "${IMAGE_TAG}"|g' \
                            deploy/kubernetes/tito-pizzeria/charts/ms-productos/values.yaml
                    """

                    withCredentials([usernamePassword(
                        credentialsId: 'github-token',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_PASS'
                    )]) {
                        sh """
                            git config user.email "jenkins@tito-pizzeria.local"
                            git config user.name  "Jenkins CI"
                            git add deploy/kubernetes/tito-pizzeria/charts/*/values.yaml
                            git commit -m "chore: bump image tags to build-${IMAGE_TAG} [skip ci]"
                            git push https://${GIT_PASS}@github.com/rodriguez-22/backend-mc-pnpm.git HEAD:main
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deploy ${IMAGE_TAG} completado — ArgoCD sincronizará en breve."
        }
        failure {
            echo "❌ Pipeline fallido en build ${IMAGE_TAG}."
        }
    }
}