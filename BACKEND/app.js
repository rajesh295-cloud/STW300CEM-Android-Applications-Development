const express = require('express');
const app = express();
const Commentmodel = require("./models/commentModel")
const NotificationModel = require("./models/notificationModel")
const OrderModel = require('./models/orderModel')
require('./config/db');
const cors = require('cors');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Productmodel = require("./models/productModel")
const Usermodel = require('./models/userModel')
const Notification = require('./routes/notificationRoutes')
app.use(Notification)
// socket 
const { Server } = require("socket.io")
const http = require("http")
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});
var onlineUsers = [];
function removeUser(id) {
    onlineUsers = onlineUsers.filter(user => user.socketId != id)
}
// get users
function getUser(userId) {
    const sockets = [];
    for (var i = 0; i <= onlineUsers.length; i++) {
        const data = onlineUsers[i]
        if (data) {
            const data_ = JSON.parse(data)
            // console.log(userId)
            // console.log(data_.userId)
            if (data_.userId === userId) {
                // console.log("found")
                sockets.push(data_.socketId)
            }
        }

    }
    return sockets;
}
io.on("connection", (socket) => {
    console.log("client connected");

    // adding clients
    socket.on("addClient", (data) => {
        if (data.socketId !== undefined) {
            if (onlineUsers.indexOf(data) === -1) {
                onlineUsers.push(JSON.stringify(data))
                const uniqueChar = [... new Set(onlineUsers)]
                onlineUsers = [...uniqueChar].reverse().reverse()
                // console.log(onlineUsers);
            }
        }
    })
    // commetn post using socket 
    socket.on("ReviewProduct", (data) => {
        const user = data.user
        const product = data.product
        const text = data.text
        const date = new Date().toDateString()
        // 
        var orderingname = ""
        Usermodel.findOne({ _id: user }).then((user) => {
            orderingname = user.username
            // 
            const commentSave = new Commentmodel({
                user: user,
                product: product,
                text: text,
                date: date
            })
            commentSave.save()
            if (commentSave) {
                // get product user and push notification 
                Productmodel.findOne({ _id: product }).then((val) => {
                    const notification = new NotificationModel({
                        notification_by: user,
                        notification_to: val.user,
                        date: date,
                        notification: orderingname + " commented on product at " + date
                    })
                    notification.save()
                    // push notification
                    const sockets = getUser(val.user)
                    // console.log("sockets", sockets);
                    for (var i = 0; i < sockets.length; i++) {
                        io.to(sockets[i]).emit("notification", {
                            notification: notification
                        })
                        // console.log("usocket", sockets);
                    }
                })

            }
        })
    })

    // order user
    socket.on('order', (data) => {
        const orders = data.orders
        const ordering = data.ordering
        const date = new Date().toDateString()
        // 
        var orderingname = ""
        Usermodel.findOne({ _id: orders }).then((user) => {
            orderingname = user.username
            // 
            const orderUser = new OrderModel({
                orders: orders,
                ordering: ordering
            })
            orderUser.save()
            if (orderUser) {
                const notification = new NotificationModel({
                    notification_by: orders,
                    notification_to: ordering,
                    date: date,
                    notification: orderingname + " ordered" + date
                })
                notification.save()
            }
        })
    })

    // unorder user
    socket.on('unorder',(data)=>{
        const orders = data.orders
        const ordering = data.ordering
        OrderModel.deleteOne({
            orders:orders,
            ordering:ordering
        },(function(err ,user){
            if(!err){
                console.log("unorder");
            }
        })) 
    })

    // disconnect
    socket.on('disconnect', () => {
        console.log('disconnected');
        removeUser(socket.id)
    })
})
// static files

app.use(express.static(__dirname+'/'))
// app.use("/uploads/images", express.static('uploads/images'));
// app.use("/product/uploads/images", express.static('uploads/images'));
// app.use("/profile/uploads/images", express.static('uploads/images'));
// app.use("/user/products/uploads/images", express.static('uploads/images'));
// app.use("/updateproduct/uploads/images", express.static('uploads/images'));

const authRoutes = require('./routes/authRoutes')
app.use(authRoutes);

const productRoutes = require('./routes/productRoutes')
app.use(productRoutes);

const orderRoutes = require('./routes/orderRoutes');
const OrderRoutes = require('./routes/orderRoutes');
app.use(orderRoutes)

server.listen(5000, () => {
    console.log("Backend & API is running Successfully....");
})