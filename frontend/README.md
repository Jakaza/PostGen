# Database Table Designer

A ReactJS frontend application to visually design database schemas with tables, fields, and relationships, and export the resulting schema as a PostgreSQL-compatible SQL file.

---

## Features

- **Add, edit, and delete database tables** dynamically.
- **Add and configure fields** (columns) per table with support for data types, primary keys, required fields, and foreign keys.
- **Create and remove relationships** (foreign key constraints) between tables.
- **Two view modes:** 
  - *Design view* — detailed table and relationship editing UI.
  - *Diagram view* — (planned, coming soon) visual diagram representation of tables and their relationships.
- **Export schema to backend** for generation of PostgreSQL SQL file and automatic download.
- Responsive, user-friendly interface built with React and Tailwind CSS.
- Uses environment variable `VITE_API_URL` to connect with backend API.

---

## Getting Started

### Prerequisites

- Node.js (version 18+ recommended)
- npm or yarn
- Backend API server exposing an `/export-schema` endpoint (expects tables and relationships data, returns SQL file)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Jakaza/PostGen.git
   cd PostGen
   cd frontend
    ```

2. Install dependencies:

   ```bash
    npm install
    # or
    yarn install
    ```

3. Create a .env file in the root of the frontend directory:

   ```bash
    VITE_API_URL=http://localhost:8000
    ```

4. Start the development server:
   ```bash
    npm run dev
    # or
    yarn dev
    ```