require("dotenv").config();
const mongoose = require("mongoose");
const Sweet = require("./models/Sweet");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const sweets = [
    { name: "Gulab Jamun", category: "Syrup Based", price: 20, quantity: 200, image: "/sweets/gulab_jamun.jpg" },
    { name: "Rasgulla", category: "Syrup Based", price: 25, quantity: 150, image: "/sweets/rasgulla.png" },
    { name: "Kaju Katli", category: "Barfi", price: 800, quantity: 50, image: "/sweets/kaju_katli.png" },
    { name: "Laddu", category: "Laddu", price: 400, quantity: 100, image: "/sweets/laddu.png" },
    { name: "Jalebi", category: "Fried", price: 300, quantity: 80, image: "/sweets/jalebi.png" },
    { name: "Barfi", category: "Milk Based", price: 500, quantity: 60, image: "/sweets/barfi.png" },
    { name: "Mysore Pak", category: "Ghee Based", price: 600, quantity: 40, image: "/sweets/mysore_pak.png" },
    { name: "Rasmalai", category: "Milk Based", price: 50, quantity: 70, image: "/sweets/rasmalai.png" },
    { name: "Soan Papdi", category: "Flaky", price: 250, quantity: 90, image: "/sweets/soan_papdi.png" },
    { name: "Peda", category: "Milk Based", price: 450, quantity: 120, image: "/sweets/peda.png" },
    { name: "Gajar Halwa", category: "Halwa", price: 350, quantity: 30, image: "/sweets/gajar_halwa.png" },
    { name: "Kalakand", category: "Milk Based", price: 550, quantity: 45, image: "/sweets/kalakand.png" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Seeding");

        await Sweet.deleteMany({});
        await User.deleteMany({});


        await Sweet.insertMany(sweets);


        const hashedPassword = await bcrypt.hash("adminpassword", 10);
        const adminUser = new User({
            username: "Admin",
            email: "admin@sweettooth.com",
            password: hashedPassword,
            role: "admin"
        });
        await adminUser.save();


        mongoose.connection.close();
        console.log("Connection closed");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
