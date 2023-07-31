const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');
const { Post } = require('../models');

const db = {};
db.User = User;

const router = express.Router();

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
      const post = await Post.findOne({ where: { id: req.params.id } });
        await post.addLiker(parseInt(req.user.id));
        res.send('OK');
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
router.post('/:id/likeCancle',isLoggedIn, async(req,res,next)=>{
    try{
        console.log(req.user.id, req.params.id);
        const post = await Post.findOne({where:{id:req.params.id}});
        await post.removeLiker(parseInt(req.user.id));
        res.send('OK');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;