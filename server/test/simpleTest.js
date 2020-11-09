var chai = require("chai");
var assert = require("assert");
var expect = chai.expect;


describe('Simple test', function(){

    beforeEach(function(){

    })

    it('Return hello world obj', function(){
        let res = {
            'value': "hello world"
        }
        return expect(res).to.deep.equal(res);
    })
})