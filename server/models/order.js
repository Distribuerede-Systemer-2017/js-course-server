'use strict';

const Promise = require("bluebird");

module.exports = function (Order) {

  Order.getFullInfo = (userId ,filter, options, next) => {
    Order.find({
      "where": {
        "createdById": userId
      }
    }).then(orders => {
      Promise.each(orders, (order) => {
        return Promise.each(order.__data.orderItems, item => {
          return Order.app.models.Book.findById(item.bookId).then(book => item.bookInfo = book);
        })
      }).then(() => {
        next(null, orders);
      });
    }).catch(next);
  };

  Order.remoteMethod(
    'getFullInfo',
    {
      description: 'Flags this Moment instance',
      accepts: [
        {arg: 'id', type: 'string', description: "User id", required: true},
        {arg: 'filter', type: 'object', http: {source: 'query'}},
        {arg: "options", type: "object", http: "optionsFromRequest"}
      ],
      returns: {
        arg: 'Order', type: 'Order', root: true
      },
      http: {path: '/:id/allorders', verb: 'get'}
    }
  );

};
