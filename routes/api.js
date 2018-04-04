const express = require('express');
const router = express.Router();
const aws = require("aws-sdk");
const path = require("path");

aws.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

const ml = new aws.MachineLearning({apiVersion: '2014-12-12', region: "us-east-1"});

const docClient = new aws.DynamoDB.DocumentClient()

router.get('/sensor-messages', (req, res) => {
  docClient.scan({TableName: 'sensor_messages'}, function(err, data) {
    if (err) console.log(err);
    else res.json(data['Items']);
  })
});

router.get('/machine-learning', (req, res) => {
  var params = {
    MLModelId: 'ml-NeVRSNx4O5K', /* required */
    PredictEndpoint: 'https://realtime.machinelearning.us-east-1.amazonaws.com', /* required */
    Record: {
      "age": "36",
      "job": "admin.",
      "marital": "married",
      "education": "university.degree",
      "default": "no",
      "housing": "no",
      "loan": "no",
      "contact": "cellular",
      "month": "jun",
      "day_of_week": "mon",
      "duration": "174",
      "campaign": "1",
      "pdays": "3",
      "previous": "1",
      "poutcome": "success",
      "emp_var_rate": "-2.9",
      "cons_price_idx": "92.963",
      "cons_conf_idx": "-40.8",
      "euribor3m": "1.266",
      "nr_employed": "5076.2"
    }
  };

  ml.predict(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     res.json(data);           // successful response
  });
});

module.exports = router;
