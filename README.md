# PostGen — Database Schema Designer & Exporter

Live Demo: [https://postgresql-gen.vercel.app/](https://postgresql-gen.vercel.app/)

Backend API: [https://postgen-8fgh.onrender.com/](https://postgen-8fgh.onrender.com/)

[![Frontend](https://img.shields.io/badge/Frontend-ReactJS-blue)](https://github.com/Jakaza/PostGen/tree/main/frontend)  
[![Backend](https://img.shields.io/badge/Backend-FastAPI-green)](https://github.com/Jakaza/PostGen/tree/main/backend)

---

## Project Overview

PostGen is a two-part open-source project for designing and exporting PostgreSQL database schemas:

- **Frontend:** A ReactJS app for visually designing database tables, fields, and relationships.
- **Backend:** A FastAPI service that accepts schema JSON, validates it, and generates PostgreSQL SQL files with tables, foreign keys, indexes, and comments.

Together, they enable developers and data architects to create, visualize, and export database schemas programmatically and efficiently.

---

## Project Structure

| Directory  | Description                                          | Link                                    |
| ---------- | ---------------------------------------------------- | --------------------------------------- |
| `frontend` | ReactJS UI for schema design and export              | [Frontend README](./frontend/README.md) |
| `backend`  | FastAPI API for schema validation and SQL generation | [Backend README](./backend/README.md)   |

---

## Getting Started for Contributors

Want to contribute? We welcome your help!

### How to Contribute

1. **Fork the repository**

   Click the **Fork** button at the top-right corner of the [PostGen GitHub repo](https://github.com/Jakaza/PostGen).

2. **Clone your fork locally**

   ```bash
   git clone https://github.com/Jakaza/PostGen.git/PostGen.git
   cd PostGen
    ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
    ```
3. **Make your changes**
- Work on either frontend or backend or both.

4. **Test your changes**
- Follow setup instructions in respective README files:
- > Frontend Setup
- > Backend Setup

5. **Commit and push your branch**
   ```bash
    git add .
    git commit -m "Describe your feature or fix"
    git push origin feature/my-feature
    Open a Pull Request
    ```

6. Go to your fork on GitHub and open a pull request against the main Jakaza/PostGen repository.