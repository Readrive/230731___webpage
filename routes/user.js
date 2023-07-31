const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post = require('../models/post');

const router = express.Router();

router.post('/:id/delete', isLoggedIn, async(req, res, next) => {
  try{
    await Post.destroy({where:{id:req.params.id, userId:req.user.id}});
    res.send("게시물 삭제 완료");
  } catch(error){
    console.error(error);
    next(error);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id:req.params.id } });
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
      const post = await Post.findAll({where:{id:req.params.id}});
      await post.removeLiker(parseInt(req.user.id));
      res.send('OK');
  }catch(error){
      console.error(error);
      next(error);
  }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/followCancle',isLoggedIn, async(req,res,next)=>{
    try{
        console.log(req.user.id, req.params.id);
        const user = await User.findOne({where:{id:req.params.id}});
        await user.removeFollower(parseInt(req.user.id));
        res.send('success');
    }catch(error){
        console.error(error);
        next(error);
    }
});


router.patch('/:nick', isLoggedIn, async(req,res,next)=>{
    try{
        console.log(req.user.id, req.params.id);
        const user = await User.update({nick : req.params.nick},{where: {id:req.user.id}});
        res.send('success');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await User.findAll({
      include: [{
        model: User,
        attributes: ['id', 'nick'],
      }
      ,{
        model: Post,
        attributes: ['id'],
        as: 'PostId'
      }
    ],
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;