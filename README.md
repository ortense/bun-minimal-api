# Bun minimal api example

A zero-dependency CRUD API written with [Bun](https://bun.com/)

To install dependencies:
```sh
bun install
```

To run:
```sh
bun dev
```

open http://localhost:4321


To build into a single executable:
```sh
bun compile
```

execute `./dist/app`

## Docker

Build the image:
```sh
docker build -t bun-minimal-api .
```

Run the container:
```sh
docker run -p 4321:4321 -v ./path/to/data:/app/data bun-minimal-api
```

open http://localhost:4321

### Environment Variables

- `PORT`: Server port (default: 4321)
- `DATABASE_URL`: SQLite database URL (default: sqlite:///app/data/sqlite.db)