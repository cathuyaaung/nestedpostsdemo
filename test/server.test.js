
var expect = require('expect');
var request = require('supertest');
const app = require('./../app');

describe('POST /api/echo', function (){
    it('should echo the input', function(done){
        let text = {"test":"test1"};
        request(app)
          .post('/api/echo')
          .send(text)
          .expect(200)
          .expect(function (res){
            expect(res.body).toEqual(text);
          }).end(function(err, res){
            if (err) {
              return done(err);
            }
            done();
          })
      })
});

describe('POST /api/postmessage', function(){
  it('should save message into db', function(done){
    let samplemessage = {"message": "testmessage1"};
    request(app)
      .post('/api/postmessage')
      .send(samplemessage)
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      });
  });
});