import dotenv from "dotenv";
dotenv.config();

import { seed as seedProducts } from "./products";
import { seed as seedUsers } from "./users";

Promise.all([seedProducts(), seedUsers()])
    .then(() => {
        console.log("Seeding complete");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error seeding data:", err);
        process.exit(1);
    });
