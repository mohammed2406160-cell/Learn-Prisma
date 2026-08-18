import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

app.get("/", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            message: "Database connected",
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

app.post("/users", async (req, res) => {
    try {
        const { firstName, lastName, age } = req.body;

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                age,
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create user",
        });
    }
});
app.delete("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const deletedUser = await prisma.user.delete({
        where: {
            id: id,
        },
    });

    res.json(deletedUser);
});
app.listen(3001, () => {
    console.log(`Server is running on port ${3001}`);
});