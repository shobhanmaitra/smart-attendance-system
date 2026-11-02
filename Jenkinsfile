pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'smart-attendance'
        CONTAINER_NAME = 'smart-attendance-app'
    }

    // Simple alternative to webhook: check GitHub for new commits every ~2 minutes
    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                    docker run -d --name $CONTAINER_NAME -p 8080:80 $IMAGE_NAME:latest
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    sleep 3
                    echo "Container running state:"
                    docker inspect -f '{{.State.Running}}' $CONTAINER_NAME | grep true
                    echo "Checking website response:"
                    docker exec $CONTAINER_NAME wget -qO- http://localhost/ | grep "Smart Attendance"
                '''
            }
        }
    }

    post {
        success { echo 'Deployed! Open http://localhost:8080' }
        failure { echo 'Pipeline failed. Check the stage logs above.' }
    }
}
