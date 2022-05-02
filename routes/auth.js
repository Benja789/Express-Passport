const express = require('express');
const router = express.Router();

router.get("/google", (req, res, next)=>{
  console.log(req.user)
  res.send(`hola ${req.user.name.givenName}`)
})

module.exports = router; 
