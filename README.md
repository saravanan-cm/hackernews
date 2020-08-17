# Paytm Hackernews V1.0.0

## Languages and Tools involved

-   NodeJS, Express, Redis, Docker, Jest

## Steps to setup the project in local (using Docker)

-   Commands to setup the application with Docker. You need to have docker and docker-compose in your system as pre-requisites for this setup.
    -   docker-compose build
    -   docker-compose up
-   Hola, You did it. You can use the postman collection and try the API now...

## Steps to setup the project in local (without Docker)

-   Commands to setup the application locally without Docker. You need to have node > 10 and Redis in your system as pre-requisites for this setup.
    -   npm install
    -   npm start
    -   npm test (to run the test cases)
-   Hola, You did it. You can use the postman collection and try the API now...

## Postman collection link

-   **https://www.getpostman.com/collections/1e738b137b3c5a621da3**, Use this collection to test API calls in postman. Kindly change port number(For Docker it's 5050, For local setup it's 5000)

### Change Log

-   V1.0.0 `[Release]`
    -   Production ready build to get details from hackernews.
    -   Build with unit testing for all cases using Jest
    -   Integrated Docker to create virtual setup in local
