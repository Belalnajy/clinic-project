## Prerequisites

Before starting, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Setup and Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**:
   git clone https://github.com/Belalnajy/clinic-project

   cd clinic-project

2. **Build and Run with Docker**:

   docker compose up --build

   This will build and start three containers:
   backend (Django) on http://localhost:8000
   frontend (React Vite) on http://localhost:3000
   db (PostgreSQL) on port 5432

3. **Apply Database Migrations**:

   docker compose exec backend python manage.py migrate

## Development Workflow

git checkout develop
git pull origin develop

1. **Create a Feature Branch**:
   git checkout -b feature/your-feature
   git add .
   git commit -m "Add your descriptive message here"
2. **Push and Create a Pull Request (PR)**:
   git push origin feature/your-feature

   Go to the repository on GitHub.
   Create a Pull Request from your branch to develop.
   Request a review from a team member.

3. **Merge the PR**:

   git checkout develop
   git pull origin develop

## Common Docker Commands

- **Start the project**: `docker compose up --build` (use `--build` only if you added new dependencies or changed Dockerfiles).
- **run containers in the background**: `docker compose up -d`
- **Apply database migrations**:
  ```bash
  docker compose exec backend python manage.py makemigrations
  docker compose exec backend python manage.py migrate
  ```
- **Stop the project**: `docker compose down`
- **Restart the project**: `docker compose restart`
