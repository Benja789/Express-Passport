const express = require('express');
const router = express.Router();

router.get("/google", (req, res, next)=>{
  res.send("Hola ", req.user)
})

module.exports = router; 
