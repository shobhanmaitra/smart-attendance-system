# Smart Attendance Management System
### DevOps-Based Automated Deployment using Docker, Jenkins and GitHub

## 1. Introduction
A simple frontend-only attendance website (HTML, CSS, JavaScript) served by **Nginx** inside a **Docker** container. A **Jenkins** pipeline running locally in Docker automatically rebuilds and redeploys the website whenever new code is pushed to **GitHub**.

## 2. Problem Statement
Manual attendance registers are slow and error-prone, and manually deploying every website update is repetitive. This project provides a simple attendance web app and an automated CI/CD pipeline that deploys each change without manual steps.

## 3. Objectives
- Build a clean attendance website with a dashboard.
- Containerize it using Docker and Nginx.
- Automate Build -> Deploy -> Verify using a Jenkins pipeline.
- Trigger the pipeline automatically on every GitHub push.
- Run everything locally, with no cloud services.

## 4. Technologies Used
| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript | Frontend (data stored in browser localStorage) |
| Nginx (Alpine) | Web server |
| Docker | Containerization |
| Jenkins | CI/CD automation |
| Git + GitHub | Version control and trigger source |

## 5. System Architecture
```
Developer --git push--> GitHub --(webhook / polling)--> Jenkins (container, port 9090)
                                                            |
                                          Checkout -> Build -> Deploy -> Verify
                                                            |  (Docker socket)
                                                            v
                                          Docker Engine (Docker Desktop)
                                                            |
                                            smart-attendance-app container
                                          (Nginx)  ->  http://localhost:8080
```
**How Jenkins reaches Docker:** the host's Docker socket (`/var/run/docker.sock`) is mounted into the Jenkins container, and the Jenkins image has the Docker CLI installed. So `docker build` / `docker run` inside the pipeline are executed by the host's Docker Desktop engine. The app container therefore runs on the host and is reachable at `localhost:8080`.

## 6. Folder Structure
```
smart-attendance-system/
  index.html        # page structure
  style.css         # styling
  script.js         # attendance logic + localStorage
  Dockerfile        # app image (nginx:alpine)
  Jenkinsfile       # CI/CD pipeline
  jenkins/
    Dockerfile      # Jenkins image + Docker CLI
  screenshots/      # put your screenshots here
  README.md
  .gitignore
```

## 7. Application Features
- Dashboard: total, present, absent, attendance percentage.
- Table of 10 sample students.
- Mark each student Present or Absent.
- Date selector to view or mark attendance for any date.
- Attendance records table (all saved dates).
- Percentage calculated automatically.
- Data persists after refresh (localStorage).

## 8. Run Locally (without Docker)
Double-click `index.html`, or in PowerShell:
```powershell
cd smart-attendance-system
start index.html
```

## 9. Docker Setup
Run in **PowerShell, inside the project folder**. Docker Desktop must be running.
```powershell
docker build -t smart-attendance:latest .                                   # build image
docker run -d --name smart-attendance-app -p 8080:80 smart-attendance:latest   # run container
docker ps                                                                   # running containers
docker logs smart-attendance-app                                            # view logs
docker stop smart-attendance-app                                            # stop
docker rm smart-attendance-app                                              # remove
```
Open http://localhost:8080

## 10. Jenkins Setup
### 10.1 Run Jenkins in Docker
```powershell
cd smart-attendance-system
docker build -t jenkins-docker ./jenkins
docker run -d --name jenkins -p 9090:8080 -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  jenkins-docker
```
- If the socket mount fails, retry with `-v //var/run/docker.sock:/var/run/docker.sock`.
- Check Docker access from Jenkins: `docker exec jenkins docker version` (must show Client and Server).

### 10.2 Unlock Jenkins
```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
Open http://localhost:9090, paste the password, choose **Install suggested plugins**, create an admin user.

### 10.3 Create the pipeline job
1. **New Item** -> name `smart-attendance-pipeline` -> **Pipeline** -> OK.
2. Under **Pipeline**: Definition = **Pipeline script from SCM**.
3. SCM = **Git**, Repository URL = `https://github.com/<your-username>/smart-attendance-system.git`
4. Branch = `*/main`, Script Path = `Jenkinsfile`.
5. Save, then click **Build Now** once. (This also registers the polling trigger from the Jenkinsfile.)

For a **private** repo: Jenkins -> Manage Jenkins -> Credentials -> add a GitHub Personal Access Token, then select it in the job. Never write passwords in the Jenkinsfile.

## 11. GitHub Integration
```powershell
cd smart-attendance-system
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/smart-attendance-system.git
git push -u origin main
```

### Automatic trigger - Option A: Polling (simplest, recommended)
Already in the Jenkinsfile: `pollSCM('H/2 * * * *')`. Jenkins checks GitHub about every 2 minutes and builds if there is a new commit. No extra setup, works behind any network.

### Automatic trigger - Option B: GitHub webhook (instant, optional)
GitHub cannot reach `localhost`, so a tunnel is needed:
1. Install ngrok and run: `ngrok http 9090`
2. GitHub repo -> Settings -> Webhooks -> Add webhook
   - Payload URL: `https://<ngrok-address>/github-webhook/`
   - Content type: `application/json`, event: Just the push event
3. Jenkins job -> Configure -> Build Triggers -> tick **GitHub hook trigger for GITScm polling**.

## 12. CI/CD Pipeline Explanation
| Stage | What it does |
|---|---|
| Checkout | Pulls the latest code from GitHub |
| Build | `docker build` creates image `smart-attendance:latest` |
| Deploy | Stops and removes the old container (if any), runs the new one on port 8080 |
| Verify | Confirms the container is running and that Nginx really serves the page |

## 13. How Automated Deployment Works
1. Developer edits code and runs `git push`.
2. Jenkins detects the new commit (polling or webhook).
3. Pipeline runs the four stages.
4. The old container is replaced by one built from the new code.
5. Refresh http://localhost:8080 to see the update.

## 14. Testing and Verification
1. Open http://localhost:8080, mark some students, refresh - data should remain.
2. Change a date and confirm a separate attendance sheet.
3. Edit the heading in `index.html`, then:
   ```powershell
   git add .
   git commit -m "Update heading"
   git push
   ```
4. Wait up to 2 minutes, watch the build in Jenkins (all stages green).
5. Hard refresh the site (Ctrl + F5) and confirm the change.
6. Check: `docker ps` shows `smart-attendance-app` with a fresh "Created" time.

## 15. Troubleshooting
| Problem | Fix |
|---|---|
| `docker: command not found` in Jenkins | Jenkins was started from the plain image. Rebuild with `jenkins/Dockerfile` and recreate the container. |
| `permission denied ... docker.sock` | Make sure `USER root` is in `jenkins/Dockerfile` and the socket is mounted. |
| `Cannot connect to the Docker daemon` | Start Docker Desktop and wait until it says "running". |
| `port is already allocated` (8080) | Another container/app uses 8080. Run `docker ps`, stop it, or change the port. |
| `container name already in use` | `docker rm -f smart-attendance-app` |
| Pipeline does not start after push | Run **Build Now** once manually; wait 2 min; check the job's **Git Polling Log**. |
| Webhook shows error in GitHub | ngrok URL changed after restart; update the webhook. Keep `/github-webhook/` at the end. |
| Jenkins page not opening | `docker ps` and `docker logs jenkins`; use port 9090. |
| Website shows old version | Hard refresh with Ctrl + F5. |
| Docker socket mount keeps failing | Fallback: Docker Desktop -> Settings -> General -> enable "Expose daemon on tcp://localhost:2375", then in Jenkinsfile add `environment { DOCKER_HOST = 'tcp://host.docker.internal:2375' }`. Less secure; local use only. |

Useful clean-up:
```powershell
docker rm -f smart-attendance-app
docker rm -f jenkins
```

## 16. Screenshots
| Screen | Image |
|---|---|
| Dashboard | ![Dashboard](screenshots/dashboard.png) |
| Attendance table | ![Table](screenshots/table.png) |
| Docker containers (`docker ps`) | ![Docker](screenshots/docker-ps.png) |
| Jenkins pipeline stages | ![Jenkins](screenshots/jenkins-pipeline.png) |
| GitHub repository | ![GitHub](screenshots/github.png) |
