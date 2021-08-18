const { query } = require('express');
let express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/orders');
mongoose.Promise = global.Promise;
var db = mongoose.createConnection;

var Order = mongoose.model('Order',
  {
    id: {
      type: Number
    },
    time: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: Number,
      min: -1,
      max: 2,
      default: 0
    },
    ownerId: {
      type: Number
    },
    Products: [{
      id: Number,
      name: String,
      description: String,
      price: Number,
      vol: Number
    }]
  });

var CounterOrder = mongoose.model('CounterOrder',
  {
    IdType: {
      type: String,
      default: "order"
    },
    orderId: {
      type: Number,
      default: 0
    },
  });


function getNextIdValue(Type) {
  var sequenceDocument = CounterOrder.findOneAndUpdate(
    {
      query: { IdType: Type },
      update: { $inc: { OrderId: 1 } },
      new: true
    });
  return sequenceDocument.OrderId;
}

router.get('/api/Orders', function (req, res) {
  Order.find(function (err, orders) {
    if (err) {
      console.log(err);
      res.status(500).send({ success: false, message: err });
    } else {
      res.send(orders);
    }
  });
});

router.get('/api/Order/:id', function (req, res) {
  Order.find({ id: req.params.id }, function (err, orders) {
    if (err) {
      console.log(err);
      res.status(500).send({ success: false, message: err });
    } else {
      res.send(orders);
    }
  });
})

router.post('/api/Order/updateStatus', (req, res) => {
  var modify = Order.findOneAndUpdate(
    ({ id: req.body.id }),
    ({ status: req.body.status }),
    function (err, orders) {
      if (err) {
        console.log(err);
        res.status(500).send({ success: false, message: err });
      } else {
        res.send({ success: true })
      }
    });
})

router.post('/api/AddOrder', (req, res) => {
  var newOrder = new Order(req.body);
  // res.render('index', { title: "Order And Payment Application" })
  // let newOrder = new Order({ id: 1, time: new Date(), status: 0, ownerId: 1, Products: [{id: 1, name: "name", description: "description", price: 1000, vol: 3}] });
  newOrder.time = new Date();
  newOrder.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send({ success: false, message: err });
    } else {
      res.send({ success: true });
    }
  });
})

module.exports = router;
