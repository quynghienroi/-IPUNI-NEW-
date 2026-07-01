# IPUNI Admin Dashboard

Trang theo dõi riêng cho `ipuni-new.vercel.app`. Xem tài liệu đầy đủ tại
[`../docs/ADMIN_DASHBOARD.md`](../docs/ADMIN_DASHBOARD.md).

## Chạy nhanh
```bash
npm install
cp .env.example .env     # trỏ VITE_API_BASE_URL về backend
npm run dev              # http://localhost:5180
```

Đăng nhập bằng `ADMIN_DASHBOARD_KEY` (đặt trong `backend/.env`, mặc định `ipuni-admin-2026`).

## Build
```bash
npm run build            # ra thư mục dist/
```
