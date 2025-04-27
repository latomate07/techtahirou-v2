# TechTahirou V2

This project is a **full-stack portfolio** setup, featuring:

- A **Vue.js frontend** (located in `app/frontend`)
- A **Strapi CMS backend** (located in `app/backoffice`)
- A **MySQL database** for Strapi
- An optional **phpMyAdmin** for database management
- A **Nginx reverse proxy** to route frontend, backend, and phpMyAdmin traffic

---

## 🚀 Project structure

```
.
├── app/
│   ├── frontend/   # Vue.js application
│   ├── backoffice/ # Strapi CMS backend
├── config/
│   ├── nginx.conf.template # Nginx dynamic configuration
├── docker-compose.yml
├── Dockerfile
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Environment variables

Create a `.env` file at the project root (example provided in `.env.example`):

```env
DOMAIN_FRONT=localhost
DOMAIN_BACKOFFICE=localhost
DOMAIN_PHPMYADMIN=localhost
```

---

## 📦 Installation

1. Clone the repository:
```bash
git clone git@github.com:latomate07/techtahirou-v2.git
cd techtahirou-v2
```

2. Copy and configure environment variables:
```bash
cp .env.example .env
# Then edit .env if necessary
```

3. Build and run the stack:
```bash
docker-compose up -d OR docker compose up -d
```

---

## 🌍 Access the applications

- Frontend: [localhost:3000](localhost:3000)
- Backoffice (Strapi): [localhost:1337](localhost:1337)
- PhpMyAdmin: [localhost:8081](localhost:8081)

---

## 📜 License

This project is licensed under the MIT License.

---

## ✨ Author

Built with 💻 by [Tahirou Laouan](https://techtahirou.com/)