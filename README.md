# SAC Backend

## Docker Setup

This project has been configured for Docker deployment. You can run both the Node.js application and MongoDB database using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed on your system

### Running with Docker

1. Clone this repository
2. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=production
   PORT=3000
   DB_URL=mongodb://sac-mongo:27017/sac
   # Add any other environment variables your app needs below (JWT_SECRET, etc.)
   ```
3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```
4. The application will be accessible only within the Docker network. To connect to it, you'll need to:
   - Link other services to the same network
   - Use the container name (sac-backend) for connections
   - Or modify the docker-compose.yml to expose ports if needed

### Volumes

The following Docker volumes are created:
- `mongo-data`: Persists MongoDB data
- `./files`: Mounted to /app/files in the container for file storage
- `./public`: Mounted to /app/public in the container for static files

### Stopping the application

```bash
docker-compose down
```

To remove all data including volumes:
```bash
docker-compose down -v
``` 