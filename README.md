# Custom Dashboard Builder with Customer Order Analytics

A complete enterprise-style dashboard builder with analytics widgets built for Halleyx Challenge II.
🎥 Demo Video
👉 Watch full demo here:
https://drive.google.com/file/d/1dcu_UikJiCpx5Uey9DVLnX8stlmy6dDZ/view?usp=sharing
 
## 🚀 Technology Stack
* **Frontend:** React (Vite), TailwindCSS, React Router, Recharts, React Grid Layout, Axios
* **Backend:** Spring Boot (Java 17+), Spring Data JPA, Hibernate, Validation, Lombok
* **Database:** MySQL

## 📋 Prerequisites
1. **Java 17** or higher installed.
2. **Node.js** (v18+ recommended) installed.
3. **MySQL** Server running locally on port 3306.


## ⚙️ Database Setup
1. Open your MySQL client (e.g., MySQL Workbench).
2. Execute the `database/schema.sql` script to create the `helleyx_dashboard` database, tables, and insert seed data.
3. Keep MySQL running (username: `root`, password: `root`). If your credentials differ, update them in `backend/src/main/resources/application.properties`.

## 🛠️ Running the Backend (Spring Boot)
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The API will start on `http://localhost:8080`.

## 💻 Running the Frontend (React + Vite)
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`.

## ✨ Features
* **Order Management:** Full CRUD operations for Customer Orders with robust validation.
* **Custom Dashboards:** Drag-and-drop widget layout system persisting to the database.
* **Analytics Widgets:** KPI Cards, Recharts (Bar, Line, Area, Scatter, Pie), and fully functional Paginated/Sortable Tables.
* **Global Filters:** Update all widgets instantly using the dashboard date filter.
* **Dark Mode:** Seamless fully integrated night mode toggle. 
