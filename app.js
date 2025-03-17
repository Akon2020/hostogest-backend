import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { PORT, URL_ORIGIN } from "./config/env.js";
import errorMiddleware, { errorLogs } from "./middleware/error.middleware.js";

const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1024mb" }));
app.use(bodyParser.json({ limit: "1024mb" }));
app.use(cors());
app.use(
  cors({
    origin: [URL_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    headers: {
      "Content-Type": ["application/x-www-form-urlencoded", "application/json"],
      "Content-Length": "0",
    },
  })
);

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: `Checking API => Passed successfully at ${new Date()}` });
});

app.get("/error", errorLogs);
app.use(errorMiddleware);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Une erreur s'est produite: ${err}`);
  } else {
    console.log(`Le serveur est lancé au http://localhost:${PORT}/`);
  }
});

export default app;
