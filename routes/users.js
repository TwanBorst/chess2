import express from 'express';
var router = express.Router();

/* GET users listing. */
router.post('/register', function(req, res) {
  res.sendStatus(200);
});

export default router;
