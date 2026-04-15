# Application de Gestion de Location d'Appartements

Une application web complète pour la gestion de locations d'appartements courte durée, développée avec Laravel (backend API) et React (frontend SPA).

## Fonctionnalités

- **Authentification** : Inscription, connexion, gestion des rôles (Admin, Propriétaire, Client)
- **Gestion des appartements** : CRUD complet avec photos, prix, description
- **Calendrier de disponibilité** : Affichage des dates réservées, bloquées avec FullCalendar
- **Système de réservation** : Réservation en ligne avec vérification de disponibilité
- **Dashboard admin** : Statistiques, gestion des utilisateurs et réservations
- **Interface responsive** : Design moderne avec Tailwind CSS

## Stack Technique

- **Backend** : Laravel 13, PHP 8.3, MySQL
- **Frontend** : React 19, Vite, Tailwind CSS
- **Authentification** : Laravel Sanctum
- **Calendrier** : FullCalendar
- **UI** : Lucide icons, React Hot Toast

## Installation

### Prérequis

- PHP 8.3+
- Composer
- Node.js 18+
- MySQL
- Git

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd reservation-appartements
   ```

2. **Installer les dépendances PHP**
   ```bash
   composer install
   ```

3. **Installer les dépendances JavaScript**
   ```bash
   npm install
   ```

4. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   ```
   Configurer la base de données dans `.env` :
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=reservation_appartements
   DB_USERNAME=votre_username
   DB_PASSWORD=votre_password
   ```

5. **Générer la clé d'application**
   ```bash
   php artisan key:generate
   ```

6. **Exécuter les migrations**
   ```bash
   php artisan migrate
   ```

7. **Ajouter la colonne role aux utilisateurs**
   ```bash
   php artisan migrate
   ```

8. **Seeder la base de données**
   ```bash
   php artisan db:seed
   ```

9. **Construire les assets frontend**
   ```bash
   npm run build
   ```

10. **Démarrer le serveur**
    ```bash
    php artisan serve
    ```

    Et dans un autre terminal :
    ```bash
    npm run dev
    ```

## Utilisation

### Comptes de test

- **Admin** : admin@example.com / password
- **Propriétaire** : owner@example.com / password
- **Client** : client@example.com / password

### Endpoints API

- `GET /api/apartments` - Liste des appartements
- `GET /api/apartments/{id}` - Détails appartement
- `GET /api/apartments/{id}/availability` - Disponibilité calendrier
- `POST /api/reservations` - Créer réservation
- `GET /api/admin/stats` - Statistiques admin (auth requis)

## Structure du projet

```
├── app/
│   ├── Http/Controllers/
│   │   ├── Api/              # Contrôleurs API
│   │   ├── AdminController.php
│   │   └── ...
│   ├── Models/               # Modèles Eloquent
│   └── ...
├── database/
│   ├── migrations/           # Migrations base de données
│   ├── factories/            # Factories pour tests
│   └── seeders/              # Seeders de données
├── resources/
│   ├── js/
│   │   ├── components/       # Composants React
│   │   └── ...
│   └── views/                # Vues Blade (SPA)
├── routes/
│   ├── api.php               # Routes API
│   └── web.php               # Routes web
└── ...
```

## Développement

### Commandes utiles

```bash
# Démarrer le serveur Laravel
php artisan serve

# Démarrer Vite (dev)
npm run dev

# Construire pour production
npm run build

# Exécuter les tests
php artisan test

# Créer une migration
php artisan make:migration nom_migration

# Créer un modèle
php artisan make:model NomModele
```

### Architecture

- **Backend** : API RESTful avec Laravel
- **Frontend** : Single Page Application React
- **Authentification** : Token-based avec Sanctum
- **Base de données** : Relations Eloquent optimisées
- **Sécurité** : Validation, sanitisation, middleware

## Déploiement

1. Configurer le serveur web (Apache/Nginx)
2. Configurer la base de données production
3. Exécuter migrations et seeders
4. Construire assets : `npm run build`
5. Configurer les permissions des dossiers storage/
6. Configurer HTTPS

## Sécurité

- Authentification sécurisée
- Validation des entrées
- Protection CSRF
- Sanitisation des données
- Middleware d'autorisation

## Tests

```bash
# Exécuter tous les tests
php artisan test

# Tests avec couverture
php artisan test --coverage
```

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Push et créer une PR

## Licence

MIT

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
