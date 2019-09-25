/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      var likes = undefined
      
      test('1 stock', function(done) {
        this.timeout(10000);
         chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'GOOG'})
        .end(function(err, res){
           console.log(res.body)
           assert.equal(res.status, 200);
           assert.property(res.body, 'stockData')
           assert.property(res.body.stockData, 'stock')
           assert.property(res.body.stockData, 'price')
           assert.property(res.body.stockData, 'likes')
           assert.equal(res.body.stockData.stock, 'GOOG')
           done();
        });
        
      });
      
      test('1 stock with like', function(done) {
        this.timeout(10000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'GOOG', like: 'true'})
        .end(function(err, res){
           console.log(res.body)
           assert.equal(res.status, 200);
           assert.property(res.body, 'stockData')
           assert.property(res.body.stockData, 'stock')
           assert.property(res.body.stockData, 'price')
           assert.property(res.body.stockData, 'likes')
           assert.isAtLeast(res.body.stockData.likes, 1, 'Should be at least 1')
           assert.equal(res.body.stockData.stock, 'GOOG')
           likes = res.body.stockData.likes
           done();
        })
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        this.timeout(10000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'GOOG', like: 'true'})
        .end(function(err, res){
           console.log(res.body)
           assert.equal(res.status, 200);
           assert.property(res.body, 'stockData')
           assert.property(res.body.stockData, 'stock')
           assert.property(res.body.stockData, 'price')
           assert.property(res.body.stockData, 'likes')
           assert.equal(res.body.stockData.likes, likes, 'Should be the same number of likes')
           assert.equal(res.body.stockData.stock, 'GOOG')
           done();
        })
      });
      
      test('2 stocks', function(done) {
        this.timeout(10000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['GOOG', 'MSFT']})
        .end(function(err, res){
           console.log(res.body)
           assert.equal(res.status, 200);
           assert.property(res.body, 'stockData')
           assert.isArray(res.body.stockData)
           assert.property(res.body.stockData[0], 'stock')
           assert.property(res.body.stockData[0], 'price')
           assert.property(res.body.stockData[0], 'rel_likes')
           assert.equal(res.body.stockData[0].stock, 'GOOG')
           assert.property(res.body.stockData[1], 'stock')
           assert.property(res.body.stockData[1], 'price')
           assert.property(res.body.stockData[1], 'rel_likes')
           assert.equal(res.body.stockData[1].stock, 'MSFT')
           done();
        })
      });
      
      test('2 stocks with like', function(done) {
        this.timeout(20000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['GOOG', 'MSFT'], like: 'true'})
        .end(function(err, res){
          chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'GOOG'})
            .end(function(err, res){
               console.log(res.body)
               assert.equal(res.status, 200);
               assert.property(res.body, 'stockData')
               assert.property(res.body.stockData, 'stock')
               assert.property(res.body.stockData, 'price')
               assert.property(res.body.stockData, 'likes')
               assert.equal(res.body.stockData.stock, 'GOOG')
               assert.isAtLeast(res.body.stockData.likes, 1, 'Should be at least 1')
            
                chai.request(server)
                .get('/api/stock-prices')
                .query({stock: 'MSFT'})
                .end(function(err, res){
                   console.log(res.body)
                   assert.equal(res.status, 200);
                   assert.property(res.body, 'stockData')
                   assert.property(res.body.stockData, 'stock')
                   assert.property(res.body.stockData, 'price')
                   assert.property(res.body.stockData, 'likes')
                   assert.equal(res.body.stockData.stock, 'MSFT')
                   assert.isAtLeast(res.body.stockData.likes, 1, 'Should be at least 1')
                done()
                });
            });
        })
        
        
      });
      
    });

});
