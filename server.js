const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/cafeOrders", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Connection error:", error));

// Order Schema
const orderSchema = new mongoose.Schema({
    username: String,
    tableNumber: String,
    items: Object,
    time: String,
    status: String
});

const Order = mongoose.model("Order", orderSchema);

// API to place an order
app.post("/placeOrder", async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: "Order placed successfully!" });
});

// API to get all orders
app.get("/orders", async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// API to update order status
app.put("/updateOrder/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await Order.findByIdAndUpdate(id, { status });
    res.json({ message: "Order updated successfully!" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// delete orders
