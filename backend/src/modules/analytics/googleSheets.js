const axios = require('axios');
const { GOOGLE_SHEETS_WEBHOOK_URL } = require('../../config/constants');

/**
 * Gửi dữ liệu báo cáo sang Google Sheets thông qua Apps Script Web App (webhook).
 * Apps Script sẽ nhận JSON này và ghi vào các sheet + dựng biểu đồ.
 *
 * Cấu hình: đặt GOOGLE_SHEETS_WEBHOOK_URL trong file .env của backend.
 * (Xem hướng dẫn ở docs/GOOGLE_SHEETS_SETUP.md)
 */
async function pushReport(report) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    throw {
      status: 400,
      message: 'Chưa cấu hình GOOGLE_SHEETS_WEBHOOK_URL trong .env của backend',
    };
  }

  try {
    const res = await axios.post(GOOGLE_SHEETS_WEBHOOK_URL, report, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
      // Apps Script thường trả 302 redirect → cho axios đi theo
      maxRedirects: 5,
    });
    return res.data;
  } catch (err) {
    throw {
      status: 502,
      message: `Không gửi được sang Google Sheets: ${err.message}`,
    };
  }
}

module.exports = { pushReport };
