const info = require("../info");
const getToken = require("../getToken");
const postMessage = require("../postMessage");
const axios = require("axios");
const moment = require("moment");

const templateId = "";

const postAfterWork = async () => {
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
    const todayWeather = weatherInfo.forecasts[0].casts[0];
    const tomorrowWeather = weatherInfo.forecasts[0].casts[1];

    const getReminder = () => {
      const day = 5 - moment().weekday();
      switch (day) {
        case 0:
          return "恭喜你又熬到了周末，要好好休息享受周末啦";
        case 1:
          return "今天星期四，明天星期五，周末就要来啦";
        case 2:
          return "还有两天就周末了，开心起来!!!";
        case 3:
          return "叮~ 第二天工作结束，继续加油鸭!";
        case 4:
          return "本周第一天工作结束啦! 是不是很难熬~ 还有四天哦 O(∩_∩)O哈哈~";
      }
    };
    const data = {
      Weather: {
        value: tomorrowWeather.dayweather,
        color: "#ff9900",
      },
      Temperature: {
        value: `${tomorrowWeather.daytemp}℃ ~ ${tomorrowWeather.nighttemp}℃`,
        color: "#2d8cf0",
      },
      Reminder: {
        value: getReminder(),
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
module.exports = postAfterWork;
