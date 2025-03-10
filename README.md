# Nest Assessment Application

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Setup

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd nest-assessment

   ```

2. **Install dependencies:**

   npm install

3. **Set up environment variables:**
   PORT=<to set custom port or default port 3000>
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   GOOGLE_CALLBACK_URL=<your-google-callback-url>
   FACEBOOK_CLIENT_ID=<your-facebook-client-id>
   FACEBOOK_CLIENT_SECRET=<your-facebook-client-secret>
   FACEBOOK_CALLBACK_URL=<your-facebook-callback-url>

4. **Build the project::**
   npm run build

5. **IRun the application**
   npm run start:prod

## Running in Development Mode

1. **Install dependencies:**
   npm run start:dev

2 **To run unit tests:**
npm run test

3 **To run end-to-end tests:**
npm run test:e2e
