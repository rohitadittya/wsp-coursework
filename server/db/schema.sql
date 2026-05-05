CREATE TYPE user_role AS ENUM ('moderator', 'user', 'admin');

CREATE TABLE products (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title       TEXT           NOT NULL,
    description TEXT,
    category    TEXT,
    price       NUMERIC(10, 2) NOT NULL,
    tags        TEXT[]         NOT NULL DEFAULT '{}',
    brand       TEXT,
    images      TEXT[]         NOT NULL DEFAULT '{}',
    thumbnail   TEXT,
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE product_reviews (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id     INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating         SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment        TEXT,
    date           TIMESTAMPTZ,
    reviewer_name  TEXT,
    reviewer_email TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name  TEXT        NOT NULL,
    last_name   TEXT        NOT NULL,
    gender      TEXT,
    email       TEXT        NOT NULL UNIQUE,
    phone       TEXT,
    birth_date  DATE,
    image       TEXT,
    role        user_role   NOT NULL DEFAULT 'user',
    address     TEXT,
    city        TEXT,
    state       TEXT,
    state_code  TEXT,
    postal_code TEXT,
    country     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER     NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cart_items
ADD CONSTRAINT unique_user_product UNIQUE (user_id, product_id);