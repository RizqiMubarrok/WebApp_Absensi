# Setup & Run (development)

1. Install PHP dependencies

```bash
composer install
```

2. Create .env (copy .env.example) and set DB config (MySQL) and APP_KEY

```bash
cp .env.example .env
php artisan key:generate
```

3. Run migrations and seeders

```bash
php artisan migrate --seed
```

4. Install JS dependencies and build assets

```bash
npm install
npm run dev
```

5. Run tests

```bash
php artisan test
```

Notes:

-   Registration is disabled — create users via factory or tinker if needed.
-   Dashboard stats are available at `/dashboard/stats` (authenticated).
-   Charts use `react-chartjs-2` (install via npm if not already installed).
