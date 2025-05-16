# Docker Setup for Frontend Development

This guide explains how to run the Dia Beat This frontend application using Docker for development with hot reloading.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Application

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Build and start the Docker container:

   ```bash
   docker-compose up
   ```

   This will:
   - Build the Docker image based on the Dockerfile
   - Start the container with the frontend application
   - Mount your local files into the container for hot reloading
   - Expose the application on port 5173

3. Access the application in your browser:

   ```
   http://localhost:5173
   ```

4. To stop the application, press `Ctrl+C` in the terminal where docker-compose is running, or run:

   ```bash
   docker-compose down
   ```

## Hot Reloading

The setup includes hot reloading, which means any changes you make to the source code will automatically be reflected in the browser without needing to restart the container.

## Dependency Conflicts

The Dockerfile uses the `--legacy-peer-deps` flag to handle dependency conflicts between packages. This is specifically addressing the conflict between:
- `react-day-picker@8.10.1` which requires `date-fns@^2.28.0 || ^3.0.0`
- The project's dependency on `date-fns@4.1.0`

## Troubleshooting

If you encounter any issues with hot reloading:

1. Make sure your Docker and Docker Compose versions are up to date
2. Try restarting the container with:
   ```bash
   docker-compose down && docker-compose up --build
   ```
3. Check if there are any errors in the Docker logs

If you encounter dependency issues:
1. You can modify the Dockerfile to use `--force` instead of `--legacy-peer-deps` if needed
2. Alternatively, consider updating your package.json to resolve the conflicts 