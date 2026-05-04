const express = require('express');
const Redis = require('ioredis');
const app = express();
const redisPub = new Redis({ host: 'redis' });
const redisSub = new Redis({ host: 'redis' });

app.use(express.json());
let ordersLog = [];

// Barista'dan gelen "TAMAMLANDI" mesajlarını dinle
redisSub.subscribe('order-status-updates');
redisSub.on('message', (channel, message) => {
    const finishedOrder = JSON.parse(message);
    const order = ordersLog.find(o => o.id === finishedOrder.id);
    if (order) {
        order.status = "✅ HAZIR / TESLİM EDİLDİ"; // Durumu güncelle
    }
});

app.get('/', (req, res) => {
    let html = "<h1>☕ Kahve Dükkanı Takip Ekranı</h1><ul>";
    ordersLog.forEach(o => {
        html += `<li>[${o.time}] <b>${o.type}</b> - Durum: ${o.status} (ID: ${o.id})</li>`;
    });
    html += "</ul><p><i>Güncel durum için sayfayı yenileyin.</i></p>";
    res.send(html);
});

app.post('/order', async (req, res) => {
    const { type } = req.body;
    const order = {
        id: Math.floor(Math.random() * 10000),
        type: type || 'Americano',
        time: new Date().toLocaleTimeString(),
        status: "⏳ Hazırlanıyor..." // Başlangıç durumu
    };
    ordersLog.push(order);
    await redisPub.publish('coffee-orders', JSON.stringify(order));
    res.status(201).json(order);
});

app.listen(3000);