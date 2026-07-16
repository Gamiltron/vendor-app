const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let orderIdCounter = 0;
const activeOrders = [];

let menuItemIdCounter = 0;
const menuItems = [
  // Basic Momo
  { id: ++menuItemIdCounter, name: 'Steam', category: 'Veg', price: 110, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Steam', category: 'Paneer', price: 130, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Steam', category: 'Chicken', price: 130, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Fried', category: 'Veg', price: 120, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Fried', category: 'Paneer', price: 140, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Fried', category: 'Chicken', price: 140, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Butter Pan Fried', category: 'Veg', price: 130, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Butter Pan Fried', category: 'Paneer', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Butter Pan Fried', category: 'Chicken', price: 150, isAvailable: true },

  // Moun10 Special Momo
  { id: ++menuItemIdCounter, name: 'Butter Garlic', category: 'Veg', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Butter Garlic', category: 'Paneer', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Butter Garlic', category: 'Chicken', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Crunchy', category: 'Veg', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Crunchy', category: 'Paneer', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Crunchy', category: 'Chicken', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Burnt Garlic', category: 'Veg', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Burnt Garlic', category: 'Paneer', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Burnt Garlic', category: 'Chicken', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Afghani Malai', category: 'Veg', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Afghani Malai', category: 'Paneer', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Afghani Malai', category: 'Chicken', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Jhol', category: 'Veg', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Jhol', category: 'Paneer', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Jhol', category: 'Chicken', price: 180, isAvailable: true },

  // Chinese Style Momo
  { id: ++menuItemIdCounter, name: 'Chilly', category: 'Veg', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Chilly', category: 'Paneer', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Chilly', category: 'Chicken', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Schezwan', category: 'Veg', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Schezwan', category: 'Paneer', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Schezwan', category: 'Chicken', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Crispy', category: 'Veg', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Crispy', category: 'Paneer', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Crispy', category: 'Chicken', price: 180, isAvailable: true },

  // Cheesy Momo
  { id: ++menuItemIdCounter, name: 'Cheesy Steam', category: 'Veg', price: 130, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Steam', category: 'Paneer', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Steam', category: 'Chicken', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Fried', category: 'Veg', price: 140, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Fried', category: 'Paneer', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Fried', category: 'Chicken', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Butter Pan Fried', category: 'Veg', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Butter Pan Fried', category: 'Paneer', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Butter Pan Fried', category: 'Chicken', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Crunchy', category: 'Veg', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Crunchy', category: 'Paneer', price: 190, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Cheesy Crunchy', category: 'Chicken', price: 190, isAvailable: true },

  // Newly Added Momo
  { id: ++menuItemIdCounter, name: 'Pasta Sauce', category: 'Veg', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Pasta Sauce', category: 'Paneer', price: 190, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Pasta Sauce', category: 'Chicken', price: 190, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Pan Fry Tandoori', category: 'Veg', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Pan Fry Tandoori', category: 'Paneer', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Pan Fry Tandoori', category: 'Chicken', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Chatpata', category: 'Veg', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Chatpata', category: 'Paneer', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Chatpata', category: 'Chicken', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Thecha', category: 'Veg', price: 150, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Thecha', category: 'Paneer', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Thecha', category: 'Chicken', price: 170, isAvailable: true },

  // Thukpa
  { id: ++menuItemIdCounter, name: 'Plain Thukpa', category: 'Veg', price: 160, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Plain Thukpa', category: 'Chicken', price: 180, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Masala Thukpa', category: 'Veg', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Masala Thukpa', category: 'Chicken', price: 190, isAvailable: true },

  // Add Ons
  { id: ++menuItemIdCounter, name: 'Kheema / Chilli Noodle', category: 'Veg', price: 170, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Kheema / Chilli Noodle', category: 'Chicken', price: 220, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Fries (Plain)', category: 'Veg', price: 120, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Fries (Piri Piri)', category: 'Veg', price: 140, isAvailable: true },
  { id: ++menuItemIdCounter, name: 'Fries (Cheesy)', category: 'Veg', price: 170, isAvailable: true },
];

function buildOutOfStockMap() {
  const map = {};
  for (const item of menuItems) {
    if (!item.isAvailable) {
      map[`${item.name}-${item.category}`] = true;
    }
  }
  return map;
}

app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

app.post('/api/orders', (req, res) => {
  const { customerName, items, paymentStatus } = req.body;

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer name and items are required' });
  }

  const estimatedTime = activeOrders.length * 5 + 5;

  const order = {
    id: ++orderIdCounter,
    customerName,
    items,
    paymentStatus: paymentStatus || 'Pending / Cash',
    status: 'pending',
    estimatedTime,
    createdAt: new Date().toISOString()
  };

  activeOrders.push(order);

  io.to('vendor').emit('new-order', order);
  res.status(200).json({ message: 'Order placed', order });
});

io.on('connection', (socket) => {
  console.log('Customer connected');
  socket.emit('stock-list-updated', buildOutOfStockMap());

  socket.on('join-vendor', () => {
    socket.join('vendor');
    console.log('Vendor connected');
  });

  socket.on('accept-order', (data) => {
    const order = activeOrders.find(o => o.id === data.orderId);
    if (order) order.status = 'preparing';
    console.log(`Order #${data.orderId} accepted — preparing`);
    io.emit('order-status-changed', { orderId: data.orderId, status: 'preparing', estimatedTime: order ? order.estimatedTime : null });
  });

  socket.on('complete-order', (data) => {
    const idx = activeOrders.findIndex(o => o.id === data.orderId);
    if (idx !== -1) activeOrders.splice(idx, 1);
    console.log(`Order #${data.orderId} completed`);
    io.emit('order-status-changed', { orderId: data.orderId, status: 'completed' });
  });

  socket.on('delete-order', (data) => {
    const idx = activeOrders.findIndex(o => o.id === data.orderId);
    if (idx !== -1) activeOrders.splice(idx, 1);
    console.log(`Order #${data.orderId} deleted`);
    io.emit('order-status-changed', { orderId: data.orderId, status: 'cancelled' });
  });

  socket.on('update-stock', (data) => {
    const item = menuItems.find(i => i.id === data.id);
    if (!item) return;
    item.isAvailable = data.available;
    const status = data.available ? 'available' : 'OUT OF STOCK';
    console.log(`${item.name} (${item.category}) — ${status}`);
    io.emit('menu-updated', menuItems);
    io.emit('stock-list-updated', buildOutOfStockMap());
  });

  socket.on('update-menu-item', (data) => {
    if (data.id) {
      const item = menuItems.find(i => i.id === data.id);
      if (!item) return socket.emit('error', { message: 'Item not found' });
      if (data.price !== undefined) item.price = data.price;
      if (data.name !== undefined) item.name = data.name;
      if (data.category !== undefined) item.category = data.category;
      if (data.isAvailable !== undefined) item.isAvailable = data.isAvailable;
      console.log(`Updated item #${item.id}: ${item.name} (${item.category}) — ₹${item.price}`);
    } else {
      const newItem = {
        id: ++menuItemIdCounter,
        name: data.name,
        category: data.category,
        price: data.price,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      };
      menuItems.push(newItem);
      console.log(`Added new item #${newItem.id}: ${newItem.name} (${newItem.category}) — ₹${newItem.price}`);
    }
    io.emit('menu-updated', menuItems);
    io.emit('stock-list-updated', buildOutOfStockMap());
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
