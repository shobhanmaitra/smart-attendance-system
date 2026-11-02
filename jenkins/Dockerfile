# Jenkins image that also has the Docker CLI, so pipelines can run "docker" commands.
# The CLI talks to the host's Docker engine through the mounted Docker socket.
FROM jenkins/jenkins:lts-jdk17

USER root
COPY --from=docker:cli /usr/local/bin/docker /usr/local/bin/docker
# Staying root lets Jenkins use the Docker socket without permission errors (local demo only).
