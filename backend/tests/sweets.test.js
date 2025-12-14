const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Sweet = require("../src/models/Sweet");
require("dotenv").config();

let token;
let sweetId;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }


    const userRes = await request(app).post("/api/auth/register").send({
        username: "sweetadmin_" + Date.now(),
        email: "admin" + Date.now() + "@sweets.com",
        password: "adminpassword"
    });

    const loginRes = await request(app).post("/api/auth/login").send({
        email: userRes.body.email || ("admin" + Date.now() + "@sweets.com"),
        password: "adminpassword"
    });


    const email = "admin" + Date.now() + "@sweets.com";
    await request(app).post("/api/auth/register").send({
        username: "sweetadmin",
        email,
        password: "password"
    });
    const res = await request(app).post("/api/auth/login").send({
        email,
        password: "password"
    });
    token = res.body.token;
});

afterAll(async () => {

    if (sweetId) {
        await Sweet.findByIdAndDelete(sweetId);
    }
    await mongoose.disconnect();
});

describe("Sweets Endpoints", () => {
    it("should create a new sweet", async () => {
        const res = await request(app)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Galaxy Donut",
                category: "Donut",
                price: 50,
                quantity: 100
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("name", "Test Galaxy Donut");
        sweetId = res.body._id;
    });

    it("should get all sweets", async () => {
        const res = await request(app)
            .get("/api/sweets")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should purchase a sweet (decrement quantity)", async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toBe(99);
    });
});
