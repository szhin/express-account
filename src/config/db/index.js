const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.REACT_APP_DATABASE, {
      useNewUrlParser: true,
    });
    console.log("Connect mongodb atlas success!!");
  } catch (error) {
    console.log("Connect mongodb atlas failure");
  }
}

module.exports = { connect };
