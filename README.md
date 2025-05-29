# 🏠 Property Listing Backend  
### Author: **Manoj Kumar Teru**

A full-featured backend system for managing property listings — built with **TypeScript**, **Express**, **MongoDB**, and **Redis**.  
Includes advanced filtering, authentication, favorites, and user-to-user property recommendations.

---

## Features

-  User Authentication (Register/Login with JWT & Cookies)
-  CRUD Operations for Property Listings
-  Advanced Filtering (Location, Price, Bedrooms, etc.)
-  Favorite a Property
-  Redis Caching for faster search
-  Recommend a Property to Another User (via email)
-  Deployed on Render

---

##  Tech Stack

| Layer          | Technology                            |
|----------------|----------------------------------------|
| Backend        | Node.js, Express, TypeScript           |
| Database       | MongoDB Atlas + Mongoose               |
| Caching        | Redis (via Upstash)                    |
| Authentication | JWT + Bcrypt (Cookie-based sessions)   |
| Deployment     | Render                                 |

---

## ⚙️ Project Setup

-  TypeScript configured with ES6 + CommonJS
-  Express server with middleware (CORS, cookies, body-parser)
-  MongoDB connected via Mongoose
-  Clean structure in `src/` directory
-  Hot reloading using `ts-node-dev`
-  Redis caching added to optimize read performance

---

## 📥 Importing CSV into MongoDB

-  Created a one-time script `importCsv.ts` to:
  - Read from CSV using `csv-parser`
  - Convert booleans (`"True"` → `true`)
  - Split pipe-delimited values (e.g., `"wifi|lift"`)
  - Insert into MongoDB via `Property` model

---

## API Endpoints

### **Auth**
| Method | Endpoint      | Description            |
|--------|---------------|------------------------|
| POST   | `/auth/signup`| Register new user      |
| POST   | `/auth/login` | Login + receive token  |

---

### **Properties**
| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/properties`             | Get all properties                   |
| GET    | `/properties/search`      | Filter/search by query params        |
| POST   | `/properties`             | Create new property *(auth required)*|
| PUT    | `/properties/:id`         | Update own property                  |
| DELETE | `/properties/:id`         | Delete own property                  |
| GET    | `/properties/my-properties` | Get properties created by current user |

---

### **Favorites**
| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | `/favorites`       | Get user's favorites      |
| POST   | `/favorites`       | Add to favorites          |
| DELETE | `/favorites/:id`   | Remove from favorites     |

---

### **Recommendations**
| Method | Endpoint                         | Description                                   |
|--------|----------------------------------|-----------------------------------------------|
| POST   | `/recommendations/recommend`     | Recommend property to a user (via email)      |
| GET    | `/recommendations/received`      | View properties recommended **to** the user   |

---

### **Search**
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/properties/search`| Advanced search/filtering|

---

## Deployment

- Live API hosted on **Render**
- Cloud database via **MongoDB Atlas**
- Caching handled by **Upstash Redis**

---

## Author

**Manoj Kumar Teru**  
[GitHub](https://github.com/ManojKumarTeru) • [LinkedIn](https://www.linkedin.com/in/manojkumarteru)

