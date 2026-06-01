# NexInvent - Inventory & Order Management System

NexInvent is a full-stack, containerized Inventory and Order Management System designed to handle products, customers, and orders seamlessly. It features a robust Python API and a sleek, elegant React frontend.

## 🚀 Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Custom Elegant Dark Theme)
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database ORM**: SQLAlchemy
- **Data Validation**: Pydantic
- **Database**: PostgreSQL 15

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🌟 Features

- **Product Management**: Create, read, update, and delete products. Tracks SKU, price, and current stock quantities.
- **Customer Management**: Maintain a database of customers with email validation and contact details.
- **Order Processing**: Create orders connecting customers to products. Automatically validates available stock and deducts quantities upon order creation.
- **Dashboard**: Real-time summary metrics showing total products, customers, orders, and low-stock alerts.
- **Auto-Ping Mechanism**: Built-in background task on the backend to prevent the hosting server from going to sleep.
- **Responsive UI**: A fully responsive, elegant dark-themed interface with smooth transitions and custom toast notifications.

---

## 🐳 Running Locally with Docker

The easiest way to run the entire application locally is by using Docker Compose.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Git installed.

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Karan825/inventory-system.git
   cd inventory-system
   ```

2. **Start the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

*(Note: The database is fully persistent locally using Docker volumes).*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health`| Server status & auto-ping endpoint |
| `GET`  | `/products` | Get all products |
| `POST` | `/products` | Create a new product |
| `PUT`  | `/products/{id}`| Update product details |
| `DELETE`| `/products/{id}`| Delete a product |
| `GET`  | `/customers` | Get all customers |
| `POST` | `/customers` | Create a new customer |
| `DELETE`| `/customers/{id}`| Delete a customer |
| `GET`  | `/orders` | Get all orders |
| `POST` | `/orders` | Create an order (deducts stock) |
| `DELETE`| `/orders/{id}` | Delete an order |

---

## 🚀 Deployment

This project is configured for cloud deployment.
- **Backend Docker Image**: Configured to read the dynamic `$PORT` environment variable required by platforms like Render.
- **Database**: The backend automatically dynamically translates `postgres://` URLs to `postgresql://` dialects for compatibility with managed PostgreSQL providers.
- **Frontend**: Fully compatible with Vercel/Netlify. Ensure you set the `VITE_API_URL` environment variable to your live backend URL during deployment.
