WhatsApp Multi-Session Gateway (Node.js)
Sebuah gateway WhatsApp headless yang powerful, ringan, dan mudah di-deploy menggunakan Node.js. Mendukung multiple sessions, multi-device login, dan berbagai jenis pesan termasuk teks, gambar, dan dokumen.

Fitur Utama

✅ Multi-Device Support
✅ Multi-Session / Multi-Account Ready
✅ Mengirim Teks, Gambar, Dokumen, dan Sticker
✅ Message Queue System dengan Rate Limiting
✅ Anti-Spam Protection untuk menghindari banned
✅ Typing Indicator otomatis
✅ Random Delay untuk simulasi perilaku manusia
✅ Retry mechanism untuk pesan gagal
✅ Queue monitoring dan status tracking
✅ Mudah diintegrasikan via REST API
✅ Built-in Webhook Support

Panduan Memulai

1. Clone Repository
```bash
git clone https://github.com/Pramtoxz/wa_gateway.git
```

2. Navigasi ke Folder Project
```bash
cd wa_gateway
```

3. Install Dependencies
```bash
npm install
```

4. Setup Environment Variables
Copy file `.env.example` menjadi `.env` dan sesuaikan konfigurasi:
```bash
cp .env.example .env
```

Edit file `.env`:
```env
NODE_ENV=DEVELOPMENT
PORT=5001
KEY=your-secret-api-key

# Rate Limiting (untuk menghindari banned)
MESSAGE_DELAY_MIN=3000
MESSAGE_DELAY_MAX=7000
MAX_MESSAGES_PER_MINUTE=20
MAX_MESSAGES_PER_HOUR=500
MAX_MESSAGES_PER_RECIPIENT=10
MAX_RETRY_ATTEMPTS=3
```

5. Jalankan Server
```bash
npm run start
```

6. Buka Browser dan Scan QR Code
```
http://localhost:5001/session/start?session=mysession
```

7. Kirim Pesan dengan API

**Kirim Text Message:**
```bash
curl -X POST http://localhost:5001/message/send-text \
  -H "Authorization: Bearer your-secret-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "session": "mysession",
    "to": "628123456789",
    "text": "Hello from WhatsApp Gateway!"
  }'
```

**Cek Status Queue:**
```bash
curl http://localhost:5001/message/queue-status?session=mysession \
  -H "Authorization: Bearer your-secret-api-key"
```

Fitur Anti-Ban

Sistem ini dilengkapi dengan mekanisme anti-spam untuk meminimalisir risiko banned:

1. **Rate Limiting**: Membatasi jumlah pesan per menit dan per jam
2. **Random Delay**: Delay acak 3-7 detik antar pesan (configurable)
3. **Per-Recipient Limit**: Mencegah spam ke satu nomor
4. **Typing Indicator**: Menampilkan "sedang mengetik" sebelum kirim
5. **Message Queue**: Mengirim pesan secara berurutan, tidak sekaligus
6. **Auto Retry**: Retry otomatis untuk pesan yang gagal

API Endpoints

**Session Management:**
- `POST /session/start` - Start new session
- `GET /session` - Get all sessions
- `POST /session/logout` - Logout session

**Send Messages:**
- `POST /message/send-text` - Send text message
- `POST /message/send-image` - Send image with caption
- `POST /message/send-document` - Send document
- `POST /message/send-sticker` - Send sticker

**Queue Management:**
- `GET /message/queue-status` - Get queue status and statistics

**Profile:**
- `POST /profile` - Get profile info

Tips Menghindari Banned

1. Gunakan delay yang wajar (3-7 detik recommended)
2. Jangan kirim terlalu banyak pesan dalam waktu singkat
3. Hindari spam ke nomor yang sama berulang kali
4. Gunakan nomor bisnis resmi jika memungkinkan
5. Pastikan penerima sudah opt-in menerima pesan
6. Hindari konten spam atau promosi berlebihan