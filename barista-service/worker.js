const Redis = require('ioredis');

// Buradaki host: 'redis' ifadesi docker-compose'daki servis adıdır
const redisSub = new Redis({ host: 'redis', port: 6379 });
const redisPub = new Redis({ host: 'redis', port: 6379 });

redisSub.subscribe('new-orders', (err) => {
    if (err) console.error("Kanal abone hatası:", err);
    else console.log("🚀 Barista yeni siparişleri dinliyor...");
});

redisSub.on('message', (channel, message) => {
    const order = JSON.parse(message);
    console.log(`☕ Barista: ${order.id} ID'li ${order.type} hazırlanıyor...`);

    // Siparişi hazırlama simülasyonu (3 saniye)
    setTimeout(() => {
        order.status = "✅ HAZIR / TESLİM EDİLDİ";
        redisPub.publish('order-status-updates', JSON.stringify(order));
        console.log(`✅ Barista: ${order.id} hazır ve bildirildi!`);
    }, 3000);
});