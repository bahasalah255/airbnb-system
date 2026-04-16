<div align="center">

<h1>Apartment Rental Management System</h1>

<p>A full-stack web application for managing short-term apartment rentals — from listing and booking to administration and analytics.</p>

<p>
  <a href="https://repo-apartement.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-0a66c2?style=for-the-badge" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.3" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

</div>

---

## Overview

This platform provides a complete short-term rental workflow. Clients can browse available apartments, check real-time availability, and make reservations. Owners manage their listings and monitor bookings through a dedicated panel. Administrators have full system control — managing users, reservations, and viewing platform-wide analytics.

The architecture follows a clean separation between a Laravel REST API backend and a React SPA frontend, designed to be scalable and maintainable.

---

## Features

| Feature | Description |
|---|---|
| Role-Based Authentication | Separate portals and permissions for Admin, Owner, and Client roles |
| Apartment Management | Full CRUD operations for listings with availability control |
| Reservation System | Real-time availability validation and end-to-end booking workflow |
| Interactive Calendar | Visual booking calendar powered by FullCalendar |
| Admin Dashboard | Platform analytics, user management, and system control |
| Responsive UI | Modern, mobile-friendly design built with Tailwind CSS |

---

## Screenshots

### Owner Panel
![Owner Panel](https://github.com/user-attachments/assets/279079ce-db0f-42aa-ae1e-9934f4abec80)

### Client Interface
![Client Interface](https://github.com/user-attachments/assets/9a27c733-c3d5-4050-b3e1-bdc09ee81db1)

### Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/376289a2-20fb-4bd4-8f74-46e71419b1f9)

---

## Tech Stack

### Backend
- **[Laravel](https://laravel.com/)** — REST API framework
- **PHP 8.3**
- **MySQL** — Relational database
- **Laravel Sanctum** — Token-based API authentication

### Frontend
- **[React](https://react.dev/)** — Component-based UI library
- **[Vite](https://vitejs.dev/)** — Fast development build tool
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[FullCalendar](https://fullcalendar.io/)** — Interactive booking calendar
- **[Lucide Icons](https://lucide.dev/)** — Icon library
- **[React Hot Toast](https://react-hot-toast.com/)** — Toast notification system

---

## Getting Started

### Prerequisites

Ensure the following are installed before proceeding:

- PHP 8.3+
- Composer
- Node.js 18+
- MySQL
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/bahasalah255/airbnb-system.git
cd airbnb-system
```

**2. Install dependencies**
```bash
composer install
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```

Open `.env` and update the database credentials:
```env
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**4. Generate the application key and run database migrations**
```bash
php artisan key:generate
php artisan migrate --seed
```

**5. Start the development servers**

In one terminal, start the backend:
```bash
php artisan serve
```

In a second terminal, start the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:8000`.

---

## Test Accounts

The following accounts are pre-seeded for testing each role:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Owner | owner@example.com | password |
| Client | client@example.com | password |

---

## API Reference

All protected endpoints require a Bearer token issued by Laravel Sanctum, obtained upon login.

### Apartments

```
GET  /api/apartments           — Retrieve all apartments
GET  /api/apartments/{id}      — Retrieve a single apartment
```

### Availability

```
GET  /api/apartments/{id}/availability   — Check availability for an apartment
```

### Reservations

```
POST /api/reservations         — Create a new reservation
```

### Admin

```
GET  /api/admin/stats          — Retrieve platform-wide statistics
```

---

## Project Structure

```
airbnb-system/
├── backend/
│   ├── app/                  # Controllers, Models, Middleware
│   ├── database/             # Migrations and Seeders
│   └── routes/
│       ├── api.php           # API route definitions
│       └── web.php           # Web route definitions
└── front-end/
    └── resources/js/         # React components and pages
```

---

## Live Demo

The application is deployed and accessible at **[repo-apartement.vercel.app](https://repo-apartement.vercel.app/)**.

---

## License

This project is open-source. You are free to use, modify, and distribute it.
