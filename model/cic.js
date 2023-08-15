const db = require("../untils/db");
const axios = require("axios");
const tough = require("tough-cookie");
const https = require("https");
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const agent = new https.Agent({ rejectUnauthorized: false });
const setCookieParser = require('set-cookie-parser');
const cookie = require('cookie');

// axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;

// Tạo một Axios instance với phiên bổ sung (cookie jar)
const axiosInstance = axios.create({
  withCredentials: true,
  jar: cookieJar,
});
const session = axios.create({
    withCredentials: true,
});
async function checkCic(CCCD, NAME) {
  try {
       const data = new URLSearchParams();
    data.append("idNumber", CCCD);
    data.append("name", NAME);
    const response = await axiosInstance.post(
      "http://tpmediaweb.ddns.net:623/api/user/check",
      data);
    // Sau khi nhận được phản hồi từ URL thứ nhất, tiến hành gửi yêu cầu POST với URL thứ hai
    var res = await response.data;
    return res;
    // const data = new URLSearchParams();
    // data.append("isNumber", CCCD);
    // data.append("name", NAME);
    // const response = await axios.post(
    //   "http://managekey.net/main/api.php",data);
    // // Sau khi nhận được phản hồi từ URL thứ nhất, tiến hành gửi yêu cầu POST với URL thứ hai
    // var res = await response.data;
    // return res;
  } catch (error) {
    return {
      message:"Thông tin không chính xác !"
    }
    console.error("Lỗi khi gửi yêu cầu POST tới URL thứ nhất:", error);
  }
}
async function postToSecondUrl(CCCD, NAME,cookieString) {
  try {
    const cookies = cookie.parse("PHPSESSID=ncg3cniipt36jcdm3cftnbtic7; ci_session=Kqjscpohzp5fApdZ%2B5qr%2FXT8MG4ZCdiuyb%2BJWvmnm0nU5jaLQdbhdSRLjq%2FFI5l22%2BTx%2BdPf5mHp0owkhh%2FY3Ggto%2B%2BneUQjQ1clEJ2db%2Bq2EaYce5zrZXZUMbC5LMSlxsGJrhb7IY8s%2BS0aKujIC1NvI1bur9AM0%2Bu5ZcSR6BlfAxm2Mlyh0g3u5jDAopEuuEDU%2Fa4bkof2r0MDrCGxgBG2%2BymHn2144AX2bRJkjjsw2ExZqLuuj9DWd0dgb52D%2BY0Ogkcggp3bqBinsWkbla5ajwAF917jxXveeDBf%2BKao1ku8InvStHDNW1E46ectPHxOxqJVQOMN8jCUDr%2B%2B9VkEFbruLcX7jHNDZI9812jq8roBFKbwuIW0tLbLpPzN3iXxgDJjnc2Au8Hg5G1tCFMvIqO0etnH%2B31NZZZ6mEvkngJOERPDzRq55ZDB1uXIRy%2BDN3gXBYevg0wWCnO9qe5mpMKBeqY6hAgRMlKbv46cxDtftDfGgjdkmggZ7aZSqd%2FtdVcHMZoCGGvA3%2B4mkWLMw8IaeHpu7scNTF6s9I6%2BIvEsynktTgU5MXjV9AvUMDUzMZB3kPowcSqQaahor%2FPHu1eXOx3ovoZU%2FzP9PMFpdKaO122e2nfr88zawc6vUWwbLxBOo%2FSDX8pBi9tTsdGQkid5yEGgaMUYReZBMGZYdLpUSFAbis7RhS%2FC8fMWQo%2BXt%2Bi%2BMGQdS8%2FcrdBFlrKQBjTl8W3uianghCQJbOr0D7ALH4yuyQDXdE3uKzHmT3krCQgJuteLf09Kq2EclJq%2BszueRJY6sAVu26ZTheThw0SbWH%2FkG4sNgoOvn1K3RocR6SBrcvt8XoF%2B58FFBxGyDVjEzmfg9diDc%2FxvLQMHKTFdmKPnKvIwUJTBtLoT2AapRE%2FYgJkcmqFm5tRCwMnojf3pxdZUXI01tRQ78XD2p%2BdJ0AKUt%2BNkUno2afCQ3Icqv6%2BuEkUYuYMTc4LIQt0HEFlvtVnJJauwoGp%2BTT%2BLwzDi9yWXNAQIEyA83XuXMT%2Bf19lUw35PqE%2Bi%2BrAh%2FWE4Wr2%2FfC1p4RNV3AMCmFV3iAGmaNx3uc2fBozmkQJUQyRriDICH3%2BtZuXDFfgW%2FJKONpEaXPSaZOkHyg9IrwuC0O%2Fa%2FYCysO4mrMG5lEoXVq9%2FRs5EUFeCE%2FXEIsY0meW6pNe1SJafuKo1rEQ95CAFMQXIiYR26pZQUBAg6dBxCvUPCz9Xelrob3i5qvgX6wQ%2B%2FvstV8SViEMMu5wK7pWUEwN5yKN%2FTbVl608uEU7lciciumfHtlE1zH0vrROP846SvyhzKYGZePEce1Qp1xhooGUnxm7DgcM614kDgBt3mmSJHrE7e3fupUL20Who%2Fj2p%2F292UYySMp3weFhzBVVM%2BQu6MoLh%2Bf01oh%2BE4Hzu");
    const dataCheck = new URLSearchParams();
    dataCheck.append("idNumber", CCCD);
    dataCheck.append("name", NAME);
    const response = await session.post(
      "https://crm.vnc24h.vn/du_an/mc_api/getCheckcic",
      dataCheck,
      { httpsAgent: agent,headers: {
        'Cookie': cookie.serialize(cookies)
      } }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu POST tới URL thứ hai:", error);
  }
}
function listPrice() {
  return new Promise((resolve, reject) => {
    db.dbConn.query("SELECT * FROM prices", (error, results, fields) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}
function getPrice(type) {
    return new Promise((resolve, reject) => {
      db.dbConn.query("SELECT * FROM prices WHERE type = ?",[type], (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }
function setPrice(price, type) {
  return new Promise((resolve, reject) => {
    db.dbConn.query(
      "UPDATE `prices` SET `price`=? WHERE type=?",
      [price, type],
      (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
}
function setHistorys(name, add, balance) {
  return new Promise((resolve, reject) => {
    db.dbConn.query(
      "INSERT INTO `historys`(`name`, `add`, `balance`) VALUES (?,?,?)",
      [name, add, balance],
      (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
}
function getHistorys(start, end) {
  return new Promise((resolve, reject) => {
    db.dbConn.query(
      "SELECT * FROM `historys` WHERE `timestemp` BETWEEN ? AND ? ORDER BY timestemp DESC;",
      [start, end],
      (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
}
module.exports = {
  checkCic,
  listPrice,
  setPrice,
  getHistorys,
  setHistorys,
  getPrice
};
