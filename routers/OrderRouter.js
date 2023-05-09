const  express = require('express');
const router = express.Router();
const { Order } = require('../models/Order');
const { OrderItem } = require('../models/order-item');


// get method
router.get('/', async (req, res) =>{
    const OrderList = await  Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    

    if(!OrderList){
        res.status(500).json({success: false})
    }
    res.send(OrderList)
});

// get single order //
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ path: 'ordeItems', populate: {path: 'product', populate: 'category'}});

    if(!order){
        res.status(500).json({success: false})
    }
    res.send(order);
});

// post method //
router.post('/', async (req, res) => {
   
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
       }))
       const orderItemIdsResolved = await orderItemsIds;
       let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
       })

       order = await order.save();
       if(!order){
        return res.status(404).send('The order cannot be created')
       }

       res.send(order);
    });

// update mmethod //
router.put('/:id', async(req,res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status,
        },
        {new: true}
    )
    if(!order)
    return res.status(404).send('The order with this ID is not found');
    res.send(order);
});

// Delete Order //
router.delete('/:id', (req,res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if(!order){
            await order.orderItem.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            });
            return res.status(200).json({
                success: true,
                message: 'The order was removed successfully'
            })

        }else{
            return res.status(404).json({success: false, message:'The order could not be found'});
        }
    }).catch(err => {
        return res.status(500).json({success: false, message:err});
    })
});
// total sales //
router.get('/get/totalsales', async(req, res) => {
    const totalSales = await Order.aggregate([
        {$group: {_id:null, totalsales: {$sum: '$totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(404).send('The order sales cannot be generated');
    }
    res.send({totalsales: totalSales.pop().totalsales })
})
// count //
router.get('/get/count',async (req, res) => {
    const orderCount = await Order.countDocuments();

    if(!orderCount){
        res.status(500).json({success: false})
    }
    res.send({
        orderCount: orderCount
    });
});
// user order //
router.get('/get/userorders/:userid', async(req, res) => {
    const userOrderlist = await Order.find({user: req.params.userid})
    .populate({path: 'orderItems',populate: {path: 'product',populate: 'category'}})
    .sort({'dateOrdered': -1});

    if(!userOrderList){
        res.status(500).json({message: false}) 
    }
})

    module.exports = router;
