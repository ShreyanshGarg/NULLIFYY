const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_Connect_URL)
  .then(() => {
    console.log("Connected to database !!");
  })
  .catch((err) => {
    console.log(`Connection failed !!${err.message}`);
  });
