import { connectDB } from "./utils/db.js";
import { app } from "./app.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is running on PORT", process.env.PORT);
});
