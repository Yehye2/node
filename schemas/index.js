const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/node")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 실패", err);
});

module.exports = connect;
