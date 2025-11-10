## Lebaba E‑commerce — Backend

Small, opinionated Node/Express backend for an e‑commerce demo app. It provides user auth (JWT), product and review management, order checkout integration (Stripe), image uploads (Cloudinary) and a few admin-only endpoints for stats and management.

### Key features
- User registration, login, logout
- Role-based access (user / admin)
- CRUD for products (admin controls)
- Reviews per user and review counts
- Order creation & Stripe checkout integration
- Image upload helper (Cloudinary)
- Aggregated user & admin stats endpoints

## Tech stack
- Node.js + Express
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- Cloudinary (image uploads)
- Stripe (payments)
- Dev helper: nodemon

## Quick start

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the values below (example provided). The app reads `process.env` values. Example `.env`:

```env
PORT=5000
UB_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/your-db?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret_here
# Cloudinary (recommended to set, UploadImage currently contains inline config)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

3. Run the server in development mode:

```bash
npm run start:dev
```

Or run in production mode:

```bash
npm start
```

The server listens on `PORT` (default 5000). Default base URL is http://localhost:5000/

## Environment variables
- `PORT` — optional, defaults to 5000
- `UB_URL` — MongoDB connection string (required)
- `JWT_SECRET_KEY` — secret used to sign JWT tokens (required)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — credentials for Cloudinary (recommended)

Important: the project currently includes hard-coded Cloudinary credentials in `src/utilis/UploadImage.js`. For security, replace those values with environment variables and/or remove them from source control.

## API overview

All routes are prefixed in `index.js` as follows:

- `/api/auth` — authentication and user management
- `/api/products` — products CRUD
- `/api/reviews` — create and list reviews
- `/api/orders` — create checkout sessions and manage orders
- `/api/stats` — user and admin stats

Selected endpoints (examples):

- POST `/api/auth/register` — register a new user
- POST `/api/auth/login` — login (returns cookie token)
- GET `/api/products` — list all products
- POST `/api/products/create-product` — create product (admin)
- POST `/api/reviews/post-review` — post a review (requires auth)
- POST `/create-checkout-session` — create a Stripe checkout session
- POST `/confirm-payment` — confirm Stripe payment

See the route files in `src/` for a complete list and required parameters.

## Project structure

Top-level layout:

- `index.js` — app entry and route mounting
- `src/users` — user model, controller, and routes
- `src/products` — product model, controller, and routes
- `src/orders` — order controller & routes
- `src/reviews` — review logic
- `src/stats` — aggregated stats endpoints
- `src/middleware` — auth and role verification middleware
- `src/utilis` — helper functions (image upload, response handler, baseURL)

## Development notes & recommended improvements
- Move Cloudinary credentials out of `src/utilis/UploadImage.js` into `.env` and load them with `process.env`.
- Harden token handling (the code currently reads token from cookies; you may want to allow Authorization headers for APIs used by mobile/other clients).
- Add unit and integration tests for controllers and middleware.
- Add request validation (e.g., using Joi or express-validator) to protect endpoints from malformed input.

## Contributing
Contributions are welcome. Open an issue describing the change, then send a PR with a focused set of changes. Please avoid committing secrets.

## License
This project currently has `ISC` in `package.json`. Confirm and update license metadata as needed.

## Contact
If you need help running the project or want recommended improvements, open an issue or contact the repository owner.

---

If you want, I can:

- update `src/utilis/UploadImage.js` to use environment variables (safe change)
- add a sample `.env.example` file
- add a short Postman collection or curl snippets for the main flows

Tell me which of those you'd like me to do next.
