import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import leadRoutes from "./src/routes/leadRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";

//configuration
dotenv.config();

//database connection
connectDB();

const app = express();

//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//All Routes is Listed Here
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lead", leadRoutes);

//build a rest api here
app.get("/", (req, res) => {
  res.send("<h1><center>Welcome to Lead Maagement System</center></h1>");
});

//add a port
const PORT = process.env.PORT || 8080;

//run our application
app.listen(PORT, () => {
  console.log(`Server is running on the port number : ${PORT}`);
});
