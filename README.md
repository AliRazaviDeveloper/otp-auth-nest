# Authentication Service

This project is an authentication service built using NestJS. It supports two methods for registration and login:

1. **OTP-based authentication**: Users can register and log in using a one-time password (OTP) sent to their phone.
2. **Email and password authentication**: Users can register and log in using their email and password. This method uses access tokens and refresh tokens for session management.

## Features

- **OTP Authentication**:

  - OTPs are valid for 2 minutes.
  - Endpoints are provided for sending and verifying OTPs.

- **Email and Password Authentication**:

  - Secure user registration with email, phone, and password.
  - Login with email and password.
  - Access tokens and refresh tokens are used for session management.

- **User Profile**:
  - Retrieve the current user's profile information using a bearer token.

## Endpoints

### OTP Authentication

- **Send OTP**

  - **Endpoint**: `/auth/send-otp`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "phone": "string"
    }
    ```

- **Check OTP**
  - **Endpoint**: `/auth/check-otp`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "phone": "string",
      "otp": "string" // Must be 6 digits long
    }
    ```

### Email and Password Authentication

- **Register**

  - **Endpoint**: `/auth/register`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "email": "string",
      "phone": "string",
      "password": "string", // Must be at least 8 characters long
      "confirmPassword": "string"
    }
    ```

- **Login**
  - **Endpoint**: `/auth/login`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### User Profile

- **Get Current User**
  - **Endpoint**: `/user/profile`
  - **Method**: `GET`
  - **Headers**:
    - `Authorization: Bearer <access_token>`

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AliRazaviDeveloper/otp-auth-nest
   cd <your-folder>
   ```

2. **Install dependencies**:

```bash
 npm install
```

3. **Set up the environment variables**:

   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables:

     ```bash
     PORT=8000

      DB_USER=your_database_user
      DB_PASSWORD=your_database_password
      DB_PORT=5432
      DB_DATABASE=your_database_name
      DB_PROVIDER=postgres

      JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
      JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret

      BCRYPT_SALT=your_salt_value
      BCRYPT_HASH=your_hash_value

     ```

4. **Run the application**:
   ```bash
    npm run start
   ```

## Access the API

- The application will run on `http://localhost:8000` by default.
- You can test the API endpoints using the following tools:

  1. **[Postman](https://www.postman.com/)**:

     - Create a new request in Postman.
     - Set the request method (GET, POST, etc.) and the URL to `http://localhost:8000/<endpoint>`.
     - Add necessary headers, such as `Authorization: Bearer <access_token>` for protected routes.
     - For POST requests, add the required JSON body.
     - Send the request and inspect the response.

  2. **[cURL](https://curl.se/)**:
     - Use cURL commands in your terminal to interact with the API.
     - Example to send a POST request:
       ```bash
       curl -X POST http://localhost:8000/auth/send-otp -H "Content-Type: application/json" -d '{"phone": "1234567890"}'
       ```
     - Example to send a GET request with a bearer token:
       ```bash
       curl -X GET http://localhost:8000/user/profile -H "Authorization: Bearer <access_token>"
       ```

- Make sure to replace `<endpoint>` with the actual API endpoint you're testing and `<access_token>` with a valid token if required.
