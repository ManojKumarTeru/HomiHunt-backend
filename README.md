# Property Listing Backend - Author (Manoj Kumar Teru)

- This is a full-featured backend system for managing property listings built with **TypeScript**, **Express**, **MongoDB**, and **Redis**.  
- It includes advanced filtering, user authentication, property favorites, and more.

---------------

## Features (Planned)

- User Authentication (Register/Login with JWT)
- CRUD Operations for Property Listings
- Advanced Filtering (Location, Price, Bedrooms, etc.)
- Favorite a Property
- Redis Caching
- Recommend a Property to Another User
- Deployed on Render

--------------

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Cache**: Redis
- **Authentication**: JWT + Bcrypt
- **Deployment**: Render



## Project Setup

- Configured TypeScript with `tsconfig.json` for ES6 target and CommonJS modules.
- Set up Express server with necessary middleware.
- Configured MongoDB connection using Mongoose.
- Organized project files inside the `src/` folder for clear structure.
- Integrated `nodemon` for hot-reloading during development.

## Importing CSV into MongoDB

- Downloaded the dataset CSV file from the provided source.
- Created a standalone script (`importCsv.ts`) to read the CSV file using `csv-parser`.
- Parsed CSV data and transformed fields as necessary (e.g., string `"True"` to Boolean `true`).
- Inserted the processed data into MongoDB collection using Mongoose models.
- Script is designed to be run **once** to seed initial data into the database.

----------


# API End points

**AUTH**
## Method	    Endpoint	        Description
POST	        /auth/signup	    Register new user
POST	         /auth/login	    Login and receive token


**PROPERTIES**
## Method	    Endpoint	                    Description
GET	           /properties	                   Get all properties
GET	           /properties/search	           Filter/search properties
POST	       /properties	                   Create new property (auth only)
PUT	           /properties/:id	               Update own property
DELETE	       /properties/:id	               Delete own property
GET	           /properties/my-properties	   Get properties created by user


**SEARCH**
## Method	        Endpoint	        Description
GET	                /search	        Get filter search data



**FAVORITES**
## Method	        Endpoint	        Description
GET	                /favorites	        Get user’s favorites
POST	            /favorites	        Add property to favorites
DELETE	            /favorites/:id	    Remove favorite


**Recommendations**
## Method	        Endpoint	                    Description
POST	            /recommendations/recommend	    Recommend property to user (by email)
GET	                /recommendations/received	    for received property recommendations