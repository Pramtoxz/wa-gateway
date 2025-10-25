# WhatsApp Gateway API Documentation

## Authentication

Semua endpoint (kecuali health check) memerlukan API key di header:

```
Authorization: Bearer YOUR_API_KEY
```

Set API key di file `.env`:
```
KEY=your-secret-api-key
```

---

## Session Management

### Start Session

Memulai session baru dan mendapatkan QR code untuk scan.

**Endpoint:** `POST /session/start`

**Request Body:**
```json
{
  "session": "mysession"
}
```

**Response (QR Code):**
```json
{
  "qr": "2@xxxxxxxxxxx..."
}
```

**Response (Already Connected):**
```json
{
  "data": {
    "message": "Connected"
  }
}
```

### Get All Sessions

Mendapatkan daftar semua session yang aktif.

**Endpoint:** `GET /session`

**Response:**
```json
{
  "data": ["session1", "session2"]
}
```

### Logout Session

Menghapus session dan logout dari WhatsApp.

**Endpoint:** `POST /session/logout`

**Request Body:**
```json
{
  "session": "mysession"
}
```

**Response:**
```json
{
  "data": "success"
}
```

---

## Send Messages

Semua endpoint pengiriman pesan akan mengembalikan response yang sama:

**Success Response:**
```json
{
  "success": true,
  "messageId": "1234567890-abc123",
  "message": "Message queued successfully"
}
```

**Rate Limit Error (429):**
```json
{
  "message": "Rate limit exceeded: Maximum 20 messages per minute"
}
```

### Send Text Message

**Endpoint:** `POST /message/send-text`

**Request Body:**
```json
{
  "session": "mysession",
  "to": "628123456789",
  "text": "Hello, this is a test message!",
  "is_group": false
}
```

**Parameters:**
- `session` (required): Session ID
- `to` (required): Nomor tujuan (format: 628xxx untuk Indonesia)
- `text` (required): Isi pesan
- `is_group` (optional): `true` jika mengirim ke grup, default `false`

### Send Image

**Endpoint:** `POST /message/send-image`

**Request Body:**
```json
{
  "session": "mysession",
  "to": "628123456789",
  "text": "Check out this image!",
  "image_url": "https://example.com/image.jpg",
  "is_group": false
}
```

**Parameters:**
- `session` (required): Session ID
- `to` (required): Nomor tujuan
- `text` (required): Caption untuk gambar
- `image_url` (required): URL gambar
- `is_group` (optional): `true` jika mengirim ke grup

### Send Document

**Endpoint:** `POST /message/send-document`

**Request Body:**
```json
{
  "session": "mysession",
  "to": "628123456789",
  "text": "Here is the document",
  "document_url": "https://example.com/document.pdf",
  "document_name": "report.pdf",
  "is_group": false
}
```

**Parameters:**
- `session` (required): Session ID
- `to` (required): Nomor tujuan
- `text` (required): Caption untuk dokumen
- `document_url` (required): URL dokumen
- `document_name` (required): Nama file dokumen
- `is_group` (optional): `true` jika mengirim ke grup

### Send Sticker

**Endpoint:** `POST /message/send-sticker`

**Request Body:**
```json
{
  "session": "mysession",
  "to": "628123456789",
  "image_url": "https://example.com/sticker.webp",
  "is_group": false
}
```

**Parameters:**
- `session` (required): Session ID
- `to` (required): Nomor tujuan
- `image_url` (required): URL sticker (format WebP recommended)
- `is_group` (optional): `true` jika mengirim ke grup

---

## Queue Management

### Get Queue Status

Mendapatkan status antrian pesan untuk session tertentu.

**Endpoint:** `GET /message/queue-status?session=mysession`

**Response:**
```json
{
  "session": "mysession",
  "stats": {
    "pending": 5,
    "processing": 1,
    "completed": 120,
    "failed": 2
  },
  "queue": [
    {
      "id": "1234567890-abc123",
      "sessionId": "mysession",
      "to": "628123456789",
      "text": "Hello",
      "type": "text",
      "status": "pending",
      "retryCount": 0,
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

**Stats Explanation:**
- `pending`: Jumlah pesan yang menunggu untuk dikirim
- `processing`: Jumlah pesan yang sedang diproses
- `completed`: Total pesan yang berhasil dikirim
- `failed`: Total pesan yang gagal setelah retry maksimal

---

## Profile

### Get Profile Info

Mendapatkan informasi profil dari nomor WhatsApp.

**Endpoint:** `POST /profile`

**Request Body:**
```json
{
  "session": "mysession",
  "target": "628123456789@s.whatsapp.net"
}
```

**Note:** Target harus menggunakan format lengkap:
- Personal: `628xxx@s.whatsapp.net`
- Group: `628xxx@g.us`

---

## Rate Limiting Configuration

Konfigurasi rate limiting dapat diatur di file `.env`:

```env
# Delay antar pesan (milliseconds)
MESSAGE_DELAY_MIN=3000        # Delay minimum 3 detik
MESSAGE_DELAY_MAX=7000        # Delay maksimum 7 detik

# Batasan pengiriman
MAX_MESSAGES_PER_MINUTE=20    # Maksimal 20 pesan per menit
MAX_MESSAGES_PER_HOUR=500     # Maksimal 500 pesan per jam
MAX_MESSAGES_PER_RECIPIENT=10 # Maksimal 10 pesan per nomor per jam

# Retry configuration
MAX_RETRY_ATTEMPTS=3          # Maksimal 3x retry jika gagal
```

### Cara Kerja Rate Limiting

1. **Per-Minute Limit**: Jika sudah mengirim 20 pesan dalam 1 menit, request baru akan ditolak
2. **Per-Hour Limit**: Jika sudah mengirim 500 pesan dalam 1 jam, request baru akan ditolak
3. **Per-Recipient Limit**: Jika sudah mengirim 10 pesan ke nomor yang sama dalam 1 jam, request ditolak
4. **Random Delay**: Setiap pesan akan dikirim dengan delay acak antara 3-7 detik untuk simulasi manusia

---

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Session tidak ada atau parameter salah |
| 401  | Unauthorized - API key tidak ada atau salah format |
| 403  | Forbidden - API key tidak valid |
| 429  | Too Many Requests - Rate limit tercapai |
| 500  | Internal Server Error |

---

## Best Practices

### 1. Menghindari Banned

- Gunakan delay yang wajar (3-7 detik recommended)
- Jangan kirim terlalu banyak pesan dalam waktu singkat
- Hindari spam ke nomor yang sama berulang kali
- Monitor queue status secara berkala

### 2. Error Handling

Sistem akan otomatis retry pesan yang gagal hingga 3x. Jika masih gagal, pesan akan ditandai sebagai "failed" dan bisa dicek di queue status.

### 3. Queue Monitoring

Gunakan endpoint `/message/queue-status` untuk monitoring:
- Cek berapa pesan yang pending
- Identifikasi pesan yang failed
- Monitor throughput pengiriman

### 4. Multi-Session

Setiap session memiliki queue dan rate limit terpisah, sehingga Anda bisa mengirim pesan dari multiple account secara bersamaan tanpa saling mempengaruhi.

---

## Example Usage (cURL)

### Send Text Message
```bash
curl -X POST http://localhost:5001/message/send-text \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "session": "mysession",
    "to": "628123456789",
    "text": "Hello from API!"
  }'
```

### Check Queue Status
```bash
curl http://localhost:5001/message/queue-status?session=mysession \
  -H "Authorization: Bearer your-api-key"
```

### Send Image
```bash
curl -X POST http://localhost:5001/message/send-image \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "session": "mysession",
    "to": "628123456789",
    "text": "Check this out!",
    "image_url": "https://example.com/image.jpg"
  }'
```

---

## Example Usage (JavaScript/Node.js)

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5001';
const API_KEY = 'your-api-key';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Send text message
async function sendText(session, to, text) {
  try {
    const response = await client.post('/message/send-text', {
      session,
      to,
      text
    });
    console.log('Message queued:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Check queue status
async function checkQueue(session) {
  try {
    const response = await client.get(`/message/queue-status?session=${session}`);
    console.log('Queue status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
sendText('mysession', '628123456789', 'Hello from Node.js!');
checkQueue('mysession');
```

---

## Example Usage (Python)

```python
import requests

API_URL = 'http://localhost:5001'
API_KEY = 'your-api-key'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Send text message
def send_text(session, to, text):
    response = requests.post(
        f'{API_URL}/message/send-text',
        headers=headers,
        json={
            'session': session,
            'to': to,
            'text': text
        }
    )
    return response.json()

# Check queue status
def check_queue(session):
    response = requests.get(
        f'{API_URL}/message/queue-status',
        headers=headers,
        params={'session': session}
    )
    return response.json()

# Usage
result = send_text('mysession', '628123456789', 'Hello from Python!')
print(result)

queue = check_queue('mysession')
print(queue)

