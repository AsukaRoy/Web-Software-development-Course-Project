# Web Software development Course Project

**Steps to get started**

- Steps to create a database

  - steps to create a user and using email as unique indexes

  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL,
    password CHAR(60) NOT NULL
  );

  CREATE UNIQUE INDEX ON users((lower(email)));
  ```

  - steps to create a user's morning report

    duration - decimal indicating hours slept

    sleep quality - [1,5]

    the generic mood - [1,5]

  ```sql
  CREATE TABLE morningReports (
    id SERIAL PRIMARY KEY,
    sleepDuration NUMERIC(100, 2),
    sleepQuality  NUMERIC(100, 2),
    moodMorning NUMERIC(100, 2),
    date DATE;
    user_id INTEGER REFERENCES users(id)
  );
  ```

  - steps to create a user's evening report

    sports and exercise - decimal indicating hours slept
    study - decimal indicating hours slept

    Regularity and quality of eating - [1,5]

    the generic mood - [1,5]

  ```sql
  CREATE TABLE eveningReports (
    id SERIAL PRIMARY KEY,
    sports NUMERIC(100, 2),
    study NUMERIC(100, 2),
    eating NUMERIC(100, 2),
    moodEvening NUMERIC(100, 2),
    date DATE;
    user_id INTEGER REFERENCES users(id)
  );
  ```

## test

```bash
deno test --allow-net --allow-env --allow-read
```
