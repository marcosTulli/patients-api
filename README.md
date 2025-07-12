# Patients API

A RESTful API for managing patient data with authentication and CRUD operations. Built with Node.js, Express, and MongoDB.

## Features

- 🔐 User authentication (login/signup)
- 👥 Patient management (CRUD operations)
- 🛡️ JWT-based authorization
- 📊 MongoDB database integration
- 🐳 Docker support
- 📝 API documentation with Swagger

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: Version 22.14 or higher
- **Yarn**: Package manager
- **MongoDB**: Database (local or cloud instance)
- **Docker** (optional): For containerized deployment

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd patients-api
```

### 2. Node.js Version Management

This project uses Node.js version 22.14. You can manage the Node version using:

#### Using NVM (recommended)
```bash
# Install and use the version specified in .nvmrc
nvm install
nvm use

# Verify the version
node --version
```

#### Manual Installation
If you don't use NVM, ensure you have Node.js 22.14 installed:
```bash
node --version  # Should output v22.14.x
```

### 3. Install Dependencies

```bash
yarn install
```

### 4. Environment Configuration

Create a `.env` file in the root directory by copying from the example:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
MONGO_URL=mongodb+srv://<username>:<password>@patients-dev.b7kj2ra.mongodb.net
DB_NAME=patientsdb
PORT=8080
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

**Important**: Replace the placeholder values with your actual credentials:
- `<username>` and `<password>`: Your MongoDB credentials
- `API_KEY`: Your application API key
- `JWT_SECRET`: A secure secret for JWT token generation

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
yarn start:dev
```

The API will be available at `http://localhost:8080`

### Production Mode

```bash
yarn start
```

### Using Docker

Build and run the application using Docker Compose:

```bash
docker compose up --build
```

This will:
- Build the Docker image
- Start the application container
- Set up any required services (database, etc.)

## API Documentation

For detailed API documentation, refer to the `swagger.yaml` file in the project root. You can view the interactive documentation by:

1. Starting the development server
2. Navigating to `http://localhost:8080/api` (if Swagger UI is configured)

## Project Structure

```
patients-api/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
├── .env.example        # Environment variables template
├── .nvmrc             # Node.js version specification
├── docker-compose.yml  # Docker configuration
├── swagger.yaml       # API documentation
└── README.md          # This file
```

## Development Workflow

1. **Start development server**: `yarn start:dev`
2. **Make changes**: The server will automatically restart on file changes
3. **Test endpoints**: Use tools like Postman or curl to test API endpoints
4. **Check logs**: Monitor console output for errors and debugging information

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | Yes |
| `DB_NAME` | Database name | Yes |
| `PORT` | Server port (default: 8080) | No |
| `API_KEY` | Application API key | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```