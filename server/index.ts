import dotenv from "dotenv";
dotenv.config();

import express from "express";
import usersController from "./controllers/users";
import productController from "./controllers/products";
import cartController from "./controllers/cart";
import { DataEnvelope } from "./types";
import { requireAuth, validateJWT } from "./middleware/auth";

const PORT = process.env.PORT ?? 3000;
const SERVER = process.env.SERVER ?? "localhost";
const STATIC_DIR = process.env.STATIC_DIR ?? "client/dist";

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }

    next();
})
    .use(express.json())
    .use(validateJWT);

app.use(express.static(STATIC_DIR))
    .get("/suny", (_req, res) => {
        res.send("The best plan of my life!");
    })
    .use("/api/v1/users", usersController)
    .use("/api/v1/products", requireAuth(), productController)
    .use("/api/v1/cart", requireAuth(), cartController);

app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        console.error(err);

        const response: DataEnvelope<null> = {
            data: null,
            isSuccess: false,
            message: err.message ?? "An error occurred",
        };

        res.status((err as any).status ?? 500).send(response);
    },
);

app.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER}:${PORT}`);
});