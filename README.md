# Candidate Interview Project

## Project Overview

Welcome to the interview project! This project is designed to assess your skills in building a backend API using Node.

### Goals

- Understand your proficiency with Node.
- Assess your ability to design and implement a scalable API.
- Evaluate your coding practices and problem-solving approach.

## Installation

```bash
$ npm install
or
$ yarn
```

## (Optional) generate prisma files

```bash
$ npm run prisma generate
or
$ yarn prisma generate

```

## (Optional) open prisma tables

```bash
$ npm run prisma studio
or
$ yarn prisma studio

```

## Running the app

```bash
$ npm run start:dev
or
$ yarn start:dev
```

## Test

```bash
$ npm run test
or
$ yarn test
```

## API Documentation

This project includes built-in Swagger documentation (via NestJS) that allows you to explore and test all API endpoints directly from a web UI.
All current endpoints and request properties are documented.

To access the documentation:

- Start the project
- Open your browser at: http://localhost:4000/api

## Postman Collection

[Download Pokemon API Collection](./postman/pokemon-api.postman_collection.json)

## API Endpoints

### Create Pokémon

`POST /pokemons`

Creates a new Pokémon.

### List Pokémons

`GET /pokemons`

Returns all Pokémon with optional filtering, sorting and pagination.

#### Available filters

- name — filter by Pokémon name (partial match)

- type — filter by Pokémon type

- createdFrom — filter by minimum creation date

#### Sorting options

- orderByDate — sort by creation date (asc or desc)

- orderByName — sort by name (asc or desc)

#### Pagination

- page — page number (default: 1)

- limit — items per page (default: 10)

### Get Pokémon by ID

`GET /pokemons/:id`

Fetches a single Pokémon.

### Update Pokémon (full)

`PUT /pokemons/:id`

Replaces all fields of a Pokémon.

### Update Pokémon (partial)

`PATCH /pokemons/:id`

Updates one or more fields of a Pokémon.

### Delete Pokémon

`DELETE /pokemons/:id`

Deletes a Pokémon by ID.

## Unit Tests

Basic unit tests were created for the controller, service and repository layers.

## `pokemons` and `types` tables

The type field from the `pokemons`table was converted into a many-to-many `types`table.

## Future improvements

#### API Documentation

- Add full response schemas and standardized error models to Swagger for better clarity and client integration.

- Document success/error examples for each endpoint.

#### Tests

- Add integration tests to validate end-to-end behavior across modules.

- Add e2e tests to the controller layer to test routes and http response codes.
