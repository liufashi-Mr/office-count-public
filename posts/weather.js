const info = require("../info");
const getToken = require("../getToken");
const postMessage = require("../postMessage");
const axios = require("axios");
const moment = require("moment");

const templateId = "";
const week = ["日", "一", "二", "三", "四", "五", "六"];

const postWeather = async () => {
  const city = await axios
    .get(
      `https://restapi.amap.com/v3/geocode/geo?key=${info.gouldKey}&address=${info.address}&city=${info.city}`
    )
    .catch((err) => console.log(err));
  const { data: weatherInfo } = await axios
    .get(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${info.gouldKey}&city=${city.data.geocodes[0].adcode}&extensions=all&output=JSON`
    )
    .catch((err) => console.log(err));
  if (weatherInfo.status === "1") {
    const today = moment();
    const lastWage = moment(moment().format("YYYY-MM-15"), "YYYY-MM-DD").add(
      1,
      "M"
    );
    const wageDate = lastWage.diff(today, "days");
    const todayWeather = weatherInfo.forecasts[0].casts[0];
    const getReminder = (weather) => {
      let text = "";
      if (weather.dayweather.includes("雨")) {
        text = "要记得带伞哦！路上注意安全！今天也要开开心心！";
      }
      if (weather.dayweather.includes("晴") && weather.daytemp > 20) {
        text = "天气炎热，要做好防晒哦！路上注意安全！今天也要开开心心！";
      }
      if (weather.dayweather.includes("雪")) {
        text = "广州也会下雪吗?";
      }
      if (
        weather.dayweather.includes("晴") &&
        weather.daytemp < 20 &&
        weather.daytemp > 10
      ) {
        text = "今日阳光明媚，气候宜人";
      }
      if (weather.dayweather === "阴" || weather.dayweather === "多云") {
        text = "今天没有太阳~~~";
      }
      return text;
    };
    const data = {
      Date: {
        value:
          moment().format("YYYY-MM-DD") +
          ", " +
          "星期" +
          week[moment().weekday()],
        color: "#2b85e4",
      },
      Wage: {
        value: "周末放假",
        color: "#ed4014",
      },
      WageDate: {
        value: wageDate,
        color: "#ed4014",
      },
      Weekend: {
        value: "周末放假",
        color: "#ed4014",
      },
      WeekendDate: {
        value: 6 - moment().weekday(),
        color: "#ed4014",
      },
      WageDate: {
        value: wageDate,
        color: "#ed4014",
      },
      Weather: {
        value: todayWeather.dayweather,
        color: "#ff9900",
      },
      TemperatureLow: {
        value: todayWeather.nighttemp + "℃",
        color: "#19be6b",
      },
      TemperatureHigh: {
        value: todayWeather.daytemp + "℃",
        color: "#2d8cf0",
      },
      Reminder: {
        value: getReminder(todayWeather),
        color: "#ffc0cb",
      },
      Reminder_: {
        value: "",
        color: "#ffc0cb",
      },
    };
    getToken()
      .then((token) => {
        // 接受信息的人的openid
        postMessage(token, templateId, info.myOpenId, data);
        postMessage(token, templateId, info.openId, data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
module.exports = postWeather;
