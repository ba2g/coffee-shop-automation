This project aims to communication in coffee shop, day by day trying to add more qualifications for the system.
This system contains 3 main parts, Order Service (Port 3000)
Redis
Barista Service
For try to project docker must be downloaded your personal computer,

bash
   git clone [https://github.com/ba2g/coffee-shop-automation.git](https://github.com/ba2g/coffee-shop-automation.git)
   cd coffee-shop-automation
up the system
docker-compose up --build
from browser search http://localhost:3000
And testing:
Open new terminal and send the worlds best coffee(Americano) to the console
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{"type": "Americano"}'
After sending order you can refresh the page and see your order turns preparing then ready.
Used Technologies
-Node.js & Express
-Redis
-Docker & Docker Compose
-Git
