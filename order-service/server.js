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
        order.status = "✅ HAZIR / TESLİM EDİLDİ";
    }
});

// Takip Ekranı (Dashboard)
app.get('/', (req, res) => {
    let html = "<h1>☕ Kahve Dükkanı Takip Ekranı</h1><ul>";
    ordersLog.forEach(o => {
        html += `<li>[${o.time}] <b>${o.type}</b> - Durum: ${o.status} (ID: ${o.id}) - Öneriler: ${o.recommendations.join(", ")}</li>`;
    });
    html += "</ul><p><i>Güncel durum için sayfayı yenileyin.</i></p>";
    res.send(html);
});

// Sipariş Verme Endpoint'i
app.post('/order', async (req, res) => {
    const { type } = req.body;
    const selectedType = type || 'Americano';

    // 1. Python Servisinden Öneri İste
    let aiSuggestions = [];
    try {
        // fetch adresi docker-compose'daki servis ismini kullanıyor
        const response = await fetch(`http://recommendation-service:8000/recommend?item=${selectedType}`);
        if (response.ok) {
            const data = await response.json();
            aiSuggestions = data.ai_suggestions;
        }
    } catch (error) {
        console.log("⚠️ Python servisine ulaşılamadı, öneriler boş geçiliyor.");
    }

    // 2. Sipariş Objesini Oluştur
    const order = {
        id: Math.floor(Math.random() * 10000),
        type: selectedType,
        time: new Date().toLocaleTimeString(),
        status: "⏳ Hazırlanıyor...",
        recommendations: aiSuggestions 
    };

    // 3. Loglara ekle ve Redis'e fırlat (Barista'nın duyması için)
    ordersLog.push(order);
    redisPub.publish('new-orders', JSON.stringify(order));

    // 4. Yanıt dön
    res.json({
        message: "Sipariş başarıyla oluşturuldu!",
        order: order
    });
});

app.listen(3000, () => {
    console.log("🚀 Order Service 3000 portunda hazır!");
});