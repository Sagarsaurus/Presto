/**
 * Created by sagarsaurus on 5/26/15.
 */
//add code for models and api here
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

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
        }, function(error, res, body){
            if(error) {
                response.status(500).send({error: error});
            }
            else {
                response.status(200).send({message: body});
            }
        });
    }
};


router.post('/getNews', api.getNews);

module.exports = router;