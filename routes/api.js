/**
 * Created by sagarsaurus on 5/26/15.
 */
//add code for models and api here
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ipify = require('ipify');
var geo = require('geoip-lite');

var api = {
    getLocation: function(req, res) {
        ipify(function (err, ip) {
            res.status(200).send({message: geo.lookup(ip).ll});
        });
    }
};


router.get('/getLocation', api.getLocation);

module.exports = router;