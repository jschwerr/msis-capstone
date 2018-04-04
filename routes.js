const express = require('express');
const router = express.Router();
const aws = require("aws-sdk");
const path = require("path");

aws.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

const docClient = new aws.DynamoDB.DocumentClient()

router.get('/api/sensor-messages', (req, res) => {
  docClient.scan({TableName: 'sensor_messages'}, function(err, data) {
    if (err) console.log(err);
    else res.json(data['Items']);
  })
})

router.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));// load the single view file (angular will handle the page changes on the front-end)
});

module.exports = router;
