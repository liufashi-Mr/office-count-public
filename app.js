var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var wechatRouter = require("./routes/wechat");
var moment = require("moment");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/wechat", wechatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const postWeather = require("./posts/weather");
const postAfterWork = require("./posts/afterWork");
// 轮询时间,发送对应的post
const cycle = setInterval(async function () {
  const h = moment().hour();
  const m = moment().minute();
  const week = moment().weekday();
  // 不同时间执行不行的post
  try {
    //早上七点半
    if (h === 7 && m === 30 && week && week < 6) {
      postWeather();
    }
    // 下午五点五十九
    if (h === 5 && m === 59 && week && week < 6) {
      postAfterWork();
    }
  } catch (error) {
    console.log(error);
    clearInterval(cycle);
  }
}, 1000 * 60);

module.exports = app;
