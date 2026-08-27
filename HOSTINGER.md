# Hostinger deployment

Deploy the repository root to `public_html` using Hostinger's Git deployment.
The site requires PHP 8.1 or newer and Apache rewrite support. Ensure the `api`
directory is writable by PHP. Copy `api/config.example.php` to `api/config.php`
on Hostinger and replace its placeholder with a private password of at least 12
characters. The first request creates `api/data.json` and `api/app.key`; all
three private files are excluded from Git and protected from web access.

Initial administrator login:

- Username: `admin`
- Password: the private value configured in `api/config.php`

Change the password immediately after the first successful login.
