const fs = require("fs");
const path = require("path");
const axios = require("axios");
const moment = require("moment");
const info = require("./info");
function getToken() {
  return new Promise((resolve, reject) => {
    const tokenFile = path.join(__dirname, "token.json");
    fs.readFile(tokenFile, "utf-8", function (err, data) {
      if (err) {
        reject(err);
      } else {
        if (data) {
          const token = JSON.parse(data);
          if (token.expires_in > moment().unix()) {
            resolve(token.access_token);
            return;
          }
        }
        axios
          .get(
            `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${info.appId}&secret=${info.appSecret}`
          )
          .then((res) => {
            resolve(res.data.access_token);
            const t = res.data;
            t.expires_in = t.expires_in + moment().unix() - 1200;
            fs.writeFile(
              tokenFile,
              JSON.stringify(t, "", "\t"),
              function (err) {
                if (err) {
                  reject(err);
                }
              }
            );
          })
          .catch((err) => reject(err));
      }
    });
  });
}
module.exports = getToken;
