/**
 * Created by sagarsaurus on 5/26/15.
 */
//add code for models and api here

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var eventful = require('eventful-node');
var client = new eventful.Client('r9GWjC5WKhRRZwfC');
var geolib = require('geolib');
var GooglePlaces = require('google-places');
var eventbriteAPI = require('node-eventbrite');

mongoose.model("Deal", {description : String, industry : String, affiliated_with : String, city: String, posted_by: String, latitude: Number, longitude: Number, valid_until: Date, url: String});
mongoose.model('InterestedUser', {firstName: String, lastName: String, email: String});

var api = {
    createInterestedUser: function(req, response) {
        var model = mongoose.model('InterestedUser');
        var insertContent = req.body;
        var toSave = new model(insertContent);
        model.findOne({'email' : req.body.email}, function(err, coll) {
            if (coll) {
                response.status(201).send({error: 'Email is already registered'});
            }
            else {
                toSave.save(function (err, resource) {
                    if(err!=null) {
                        response.status(201).send({error:err});
                    }
                    else {
                        response.status(200).send({message: 'Success!'});
                    }
                });
            }
        });
    },

    getNews: function(req, response) {
        var Bing = require('node-bing-api')({ accKey: "khQagi4FvTxYWH52NvNtr3DO5Cud1mfLyL9VzXFF9Us" });

        if(req.body.city.length == 0 || req.body.newsType.length == 0) {
            response.status(500).send({error: "Please make sure to provide all API parameters"});
        }

        Bing.news(req.body.city, {
            top: 50,  // Number of results (max 50)
            skip: 0,   // Skip first 3 results
            newssortby: "Date", //Choices are: Date, Relevance
            newscategory: req.body.newsType // Choices are:
                                        //   rt_Business
                                        //   rt_Entertainment
                                        //   rt_Health
                                        //   rt_Politics
                                        //   rt_Sports
                                        //   rt_US
                                        //   rt_World
                                        //   rt_ScienceAndTechnology
        }, function(errorMessage, res, body){
            if(errorMessage) {
                response.status(500).send({error: errorMessage});
            }
            else {
                response.status(200).send({message: body});
            }
        });
    },

    getFood: function(req, response) {
        if(req.body.city == null) {
            response.status(500).send({error: "Please make sure to provide all API parameters"});
        }

        var yelp = require("yelp").createClient({
            consumer_key: "JwN_Os8j4VRnuPV8j_TITQ",
            consumer_secret: "pGJ3NJd0T8YaGG5x1JSfiLyIQws",
            token: "JVLRsJxbzgWN_9xdbXwGHvWyQwkM2NZN",
            token_secret: "vR1eqDCCYrG7LEOZQygl_NMHmWY"
        });


        if(req.body.coordinates != null) {
            yelp.search({term: "food", location: req.body.city, cll: req.body.coordinates, sort: 2}, function(err, data) {
                if(err) {
                    response.status(500).send({error: err});
                }
                else {
                    response.status(200).send({message: data});
                }
            });
        }

        else {
            yelp.search({term: "food", location: req.body.city, sort: 2}, function(err, data) {
                if(err) {
                    response.status(500).send({error: err});
                }
                else {
                    response.status(200).send({message: data});
                }
            });
        }
        // See http://www.yelp.com/developers/documentation/v2/search_api

    },

    getHotels: function(req, response) {
        if(req.body.city == null) {
            response.status(500).send({error: "Please make sure to provide all API parameters"});
        }

        var yelp = require("yelp").createClient({
            consumer_key: "JwN_Os8j4VRnuPV8j_TITQ",
            consumer_secret: "pGJ3NJd0T8YaGG5x1JSfiLyIQws",
            token: "JVLRsJxbzgWN_9xdbXwGHvWyQwkM2NZN",
            token_secret: "vR1eqDCCYrG7LEOZQygl_NMHmWY"
        });


        if(req.body.coordinates != null) {
            yelp.search({term: "hotels", location: req.body.city, cll: req.body.coordinates, sort: 2}, function(err, data) {
                if(err) {
                    response.status(500).send({error: err});
                }
                else {
                    response.status(200).send({message: data});
                }
            });
        }

        else {
            yelp.search({term: "hotels", location: req.body.city, sort: 2}, function(err, data) {
                if(err) {
                    response.status(500).send({error: err});
                }
                else {
                    response.status(200).send({message: data});
                }
            });
        }
        // See http://www.yelp.com/developers/documentation/v2/search_api

    },

    addDeal: function(req, response) {
        //need to add support to make sure duplicate does not exist
        //perhaps add upvote system for deals so best ones are towards top?
        if(req.body.description == null ||  req.body.industry == null || req.body.affiliated_with == null || req.body.posted_by == null || req.body.latitude == null || req.body.longitude == null || req.body.valid_until == null || req.body.url == null) {
            response.status(500).send({error: "Please make sure to provide all API parameters"});
        }

        var Deal = mongoose.model('Deal');
        var toAdd = new Deal({
            description : req.body.description,
            industry: req.body.industry,
            affiliated_with: req.body.affiliated_with,
            posted_by: req.body.posted_by,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            valid_until: req.body.valid_until,
            url: req.body.url
        });

        toAdd.save(function(err) {
            if(err) {
                response.status(500).send({error: err});
            }
            else {
                response.status(200).send({message: 'success'});
            }
        });
    },

    getDeals: function(req, response) {
        var model = mongoose.model('Deal');
        model.find({}, function(err, coll) {
            if(err) {
                response.status(500).send({error: err});
            }

            else {
                for (i in coll) {
                    var elem = coll[i];
                    var lat = elem.latitude;
                    var long = elem.longitude;
                    if(geolib.getDistance({latitude: lat, longitude: long}, {latitude: parseFloat(req.body.latitude), longitude: parseFloat(req.body.longitude)}) > (req.body.radius*1609)) {
                        coll.splice(i, 1);
                    }
                }

                response.status(200).send({message: coll});
            }
        });
    }
};

router.post('/createInterestedUser', api.createInterestedUser);
router.post('/getNews', api.getNews);
router.post('/getFood', api.getFood);
router.post('/addDeal', api.addDeal);
router.post('/getDeals', api.getDeals);
router.post('/getHotels', api.getHotels);

module.exports = router;