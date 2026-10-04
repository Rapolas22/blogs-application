import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
