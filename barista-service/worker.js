const Redis = require('ioredis');
const redisSub = new Redis({ host: 'redis' });
const redisPub = new Redis({ host: 'redis' });

redisSub.subscribe('coffee-orders');

redisSub.on('message', (channel, message) => {
    const order = JSON.parse(message);
    console.log(`⏳ Hazırlanıyor: ${order.type}`);

    setTimeout(async () => {
        console.log(`✅ ${order.type} HAZIR!`);
        
        // Order-service'e "BİTTİ" mesajı gönder
        await redisPub.publish('order-status-updates', JSON.stringify({ id: order.id }));
    }, 5000); // 5 saniye sürsün
});