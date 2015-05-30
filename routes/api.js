/**
 * Created by sagarsaurus on 5/26/15.
 */
//add code for models and api here
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var eventful = require('eventful-node');
var client = new eventful.Client('r9GWjC5WKhRRZwfC');

var api = {
    getNews: function(req, response) {
        var Bing = require('node-bing-api')({ accKey: "khQagi4FvTxYWH52NvNtr3DO5Cud1mfLyL9VzXFF9Us" });

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
        var yelp = require("yelp").createClient({
            consumer_key: "JwN_Os8j4VRnuPV8j_TITQ",
            consumer_secret: "pGJ3NJd0T8YaGG5x1JSfiLyIQws",
            token: "JVLRsJxbzgWN_9xdbXwGHvWyQwkM2NZN",
            token_secret: "vR1eqDCCYrG7LEOZQygl_NMHmWY"
        });

        // See http://www.yelp.com/developers/documentation/v2/search_api
        yelp.search({term: "food", location: req.body.city, sort: 2}, function(err, data) {
            if(err) {
                response.status(500).send({error: err});
            }
            else {
                response.status(200).send({message: data});
            }
        });
    },

    getEvents: function(req, response) {
        client.searchEvents({ keywords: req.body.city+'   '+req.body.typeOfEvent }, function(err, data){

            if(err){

                response.status(500).send({error: err});

            }

            //console.log('Recieved ' + data.search.total_items + ' events');
            //
            //console.log('Event listings: ');
            //
            ////print the title of each event
            //for(var i in data.search.events){
            //
            //    console.log(data.search.events[i].title);
            //
            //}
            else {

                response.status(200).send({message: data});

            }

        });
    }
};


router.post('/getNews', api.getNews);
router.post('/getFood', api.getFood);
router.post('/getEvents', api.getEvents);

module.exports = router;