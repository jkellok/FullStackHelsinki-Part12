const express = require('express');
const router = express.Router();
const redis = require('../redis');

const configs = require('../util/config')
const { getAsync } = require('../redis/index');

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* GET usage data from redis */
router.get('/statistics', async (req, res) => {
  const counter = await getAsync("added_todos")
  res.send({
    "added_todos": JSON.parse(counter)
  })
})

module.exports = router;
