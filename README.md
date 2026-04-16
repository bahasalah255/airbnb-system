# Apartment Rental Management System

A full-stack web application for managing short-term apartment rentals. The platform provides a complete workflow for listing apartments, handling reservations, and managing users through a modern and scalable architecture.

---

## Demo

Live Demo: https://repo-apartement.vercel.app/  

---

## Screenshots

### Owner Panel 
![Home](<img width="1898" height="931" alt="image" src="https://github.com/user-attachments/assets/279079ce-db0f-42aa-ae1e-9934f4abec80" />
)

### Client Porfolio 
![Apartments](<img width="1898" height="931" alt="image" src="https://github.com/user-attachments/assets/9a27c733-c3d5-4050-b3e1-bdc09ee81db1" />
)

### Admin Dashbord
![admin](<img width="1898" height="931" alt="image" src="https://github.com/user-attachments/assets/376289a2-20fb-4bd4-8f74-46e71419b1f9" />
)


---


## Tech Stack

Backend:
- Laravel (REST API)
- PHP 8.3
- MySQL

Frontend:
- React
- Vite
- Tailwind CSS

Authentication:
- Laravel Sanctum

Other Tools:
- FullCalendar
- Lucide Icons
- React Hot Toast

---

## Installation

### Requirements

- PHP 8.3+
- Composer
- Node.js 18+
- MySQL
- Git

### Setup

Clone the repository:

```bash
git clone https://github.com/bahasalah255/airbnb-system.git
cd airbnb-system
composer install
npm install
cp .env.example .env
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
php artisan migrate --seed
php artisan serve
npm run dev
```
Usage

Test accounts:

Admin:
email: admin@example.com

password: password

Owner:
email: owner@example.com

password: password

Client:
email: client@example.com

password: password

---

API Endpoints
GET /api/apartments
GET /api/apartments/{id}
GET /api/apartments/{id}/availability
POST /api/reservations
GET /api/admin/stats

----
Project Structure
app/ → Backend logic (controllers, models)
database/ → Migrations and seeders
resources/js/ → React components
routes/api.php → API routes
