const { sendError } = require('../utils/response.helper');
const { ADMIN_DASHBOARD_KEY } = require('../config/constants');

/**
 * Bảo vệ các endpoint của Admin Dashboard bằng một key bí mật.
 * Key được gửi qua header `X-Admin-Key` (hoặc query `?key=` để tiện test).
 */
function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (!key || key !== ADMIN_DASHBOARD_KEY) {
    return sendError(res, 'Sai key quản trị hoặc chưa cung cấp key', 401);
  }
  next();
}

module.exports = { adminAuth };
