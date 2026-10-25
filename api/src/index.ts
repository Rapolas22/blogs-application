import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/routes";
import postsRouter from "./routes/postsRoutes";
import method_override from "method-override";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));
app.use(CookieParser());
app.use(routes);
app.use(postsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
