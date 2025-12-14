const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
require("dotenv").config();

/*
  NOTE: relying on the real DB for this test suite as per user env.
  In a strict TDD environment, we might use mongodb-memory-server,
  but here we will connect to the same URI or a test variant if available.
*/

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("Auth Endpoints", () => {
    let testUser = {
        username: "testuser_" + Date.now(),
        email: "test" + Date.now() + "@example.com",
        password: "password123"
    };

    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
    });

    it("should login the user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
    });

    it("should fail login with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: "wrongpassword"
            });

        expect(res.statusCode).toEqual(400);
    });
});
