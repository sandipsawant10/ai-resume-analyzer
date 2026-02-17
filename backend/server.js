import app from "./app.js";
import connectDB from "./src/db/index.js";

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`app running on ${PORT}`);
  });
})();
