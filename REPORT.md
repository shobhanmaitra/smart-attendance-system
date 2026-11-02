# Project Report Content
**DevOps-Based Automated Deployment of a Smart Attendance Management System** (B.Tech CSE)

## 1. Abstract
This project presents a Smart Attendance Management System, a lightweight web application for recording and viewing student attendance, together with a fully automated deployment pipeline. The application is built with HTML, CSS and JavaScript and stores data in browser localStorage. It is packaged in a Docker container using Nginx. A Jenkins pipeline, running locally in Docker, fetches code from GitHub, builds the Docker image, deploys the container and verifies it. Every push to GitHub results in automatic redeployment, demonstrating core DevOps practices such as containerization, continuous integration and continuous deployment without any cloud service.

## 2. Problem Statement
Manual attendance registers are time-consuming and prone to errors, and calculating attendance percentages by hand is tedious. In addition, deploying each website update manually (build, stop, run) is repetitive and inconsistent between machines. There is a need for a simple attendance tool and an automated, reproducible deployment process.

## 3. Objectives
- Develop a simple, responsive attendance management web application.
- Containerize the application using Docker and Nginx.
- Implement a CI/CD pipeline with Jenkins (Checkout, Build, Deploy, Verify).
- Automatically deploy new versions on every GitHub push.
- Run the entire setup locally with free, open-source tools.

## 4. Existing System and Proposed System
| Existing System | Proposed System |
|---|---|
| Paper registers or manual spreadsheets | Web-based attendance dashboard |
| Manual percentage calculation | Automatic percentage calculation |
| Manual build and deployment steps | Automated Jenkins pipeline |
| "Works on my machine" issues | Docker gives the same environment everywhere |
| Updates are slow to reach users | Push to GitHub triggers automatic redeployment |

## 5. Software and Hardware Requirements
**Software**
- Windows 10/11 with Docker Desktop (WSL2 backend)
- Git and a GitHub account
- Jenkins (official Docker image)
- Web browser (Chrome/Edge), code editor (VS Code)
- Optional: ngrok (for webhook)

**Hardware**
- Processor: Intel i3 / Ryzen 3 or higher (virtualization enabled)
- RAM: 8 GB recommended (minimum 4 GB)
- Storage: 10 GB free
- Internet connection for pulling images and GitHub

## 6. System Architecture Explanation
The developer pushes code to GitHub. Jenkins, running as a Docker container, detects the commit using SCM polling (or a webhook). Jenkins has the Docker CLI installed and the host's Docker socket mounted, so its Docker commands are executed by the host's Docker engine. The pipeline builds an image from the Dockerfile (Nginx Alpine plus the website files) and starts a container exposing port 8080. Users access the application at http://localhost:8080. Attendance data lives in each user's browser localStorage, so no database is needed.

## 7. Working Methodology
1. Develop the frontend (dashboard, student table, date selector, records).
2. Test locally in the browser.
3. Write a Dockerfile and run the app in a container.
4. Push the code to GitHub.
5. Run Jenkins in Docker with access to the Docker engine.
6. Create a pipeline job using the Jenkinsfile from the repository.
7. Pipeline stages: **Checkout** the code, **Build** the image, **Deploy** (replace the old container), **Verify** (container running and website responding).
8. Change the code and push; Jenkins redeploys automatically.

## 8. Advantages and Limitations
**Advantages**
- Simple, easy to understand and explain.
- Fully automated deployment; no manual steps.
- Consistent environment through Docker.
- Free, open-source and runs offline on a laptop.
- Fast, responsive, no database setup.

**Limitations**
- Data is stored only in one browser's localStorage (not shared between users or devices).
- No login or role-based access.
- Mounting the Docker socket in Jenkins is suitable only for local/demo use.
- No automated unit tests in the pipeline.
- Webhooks need a tunnel (e.g. ngrok) on a local machine.

## 9. Future Scope
- Add a backend and database for shared, permanent storage.
- Add login for teachers and students.
- Add automated tests and code quality checks to the pipeline.
- Export attendance as CSV/PDF reports.
- Deploy to a cloud server or Kubernetes cluster.
- QR code or face-recognition based attendance.
- Notifications (email/SMS) for low attendance.

## 10. Conclusion
The project demonstrates how a simple web application can be containerized with Docker and deployed automatically using a Jenkins CI/CD pipeline triggered by GitHub. It removes repetitive manual deployment work, gives a consistent runtime environment and provides a practical introduction to DevOps concepts using only free local tools. The same pipeline structure can be extended to larger applications and cloud platforms in the future.
