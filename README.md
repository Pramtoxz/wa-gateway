WhatsApp Multi-Session Gateway (Node.js)
Sebuah gateway WhatsApp headless yang powerful, ringan, dan mudah di-deploy menggunakan Node.js. Mendukung multiple sessions, multi-device login, dan berbagai jenis pesan termasuk teks, gambar, dan dokumen.
Fitur Utama

Multi-Device Support
Multi-Session / Multi-Account Ready
Mengirim Teks, Gambar, dan Dokumen
Mudah diintegrasikan via REST API
Built-in Webhook Support

Panduan Memulai
1. Clone Repository
git clone https://github.com/pramtoxz/wa_gateway.git
2. Navigasi ke Folder Project
cd wa_gateway
3. Install Dependencies
npm install
4. Jalankan Server
npm run start
5. Buka Browser dan Scan QR Code
http://localhost:5001/session/start?session=mysession
6. Coba Kirim Pesan Pertama
http://localhost:5001/message/send-text?session=mysession&to=628123456789&text=Hello