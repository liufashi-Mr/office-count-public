const axios = require("axios");

function postMessage(token, templateId, openId, data) {
  axios
    .post(
      "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" +
        token,
      {
        touser: openId,
        template_id: templateId, // 模板信息id
        topcolor: "#FF0000",
        data: data,
      }
    )
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = postMessage;
