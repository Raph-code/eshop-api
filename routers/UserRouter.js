const  express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


// get method
router.get('/', async (req, res) => {
    const UserList = await  User.find()
    

    if(!UserList){
        res.status(500).json({success: false})
    }
    res.send(UserList)
});

// post method
router.post('/', async (req, res) => {
      
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street : req.body.street,
        apartment: req.body.apartment,
        Zip: req.body.Zip,
        city: req.body.city,
        country: req.body.country,

    })

   user = await user.save();
   if(!user){
    return res.status(404).send('The User is not created')
   }
   res.send(user);
});

// DELETE METHOD //
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(!user){
            return res.status(200).json({
                success:true,
                message: 'The user was removed successfully.'
            });
        }else{
            return res.status(404).json({success:false, message: 'The user could not be found.'})
        }
    }).catch(err => {
        return res.status(500).json({succes: false, message: err})
    })
});

// UPDATE METHOD //
router.put('/:id', async(req, res) => {
    let user = await User.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street : req.body.street,
        apartment: req.body.apartment,
        Zip: req.body.Zip,
        city: req.body.city,
        country: req.body.country,
        },
        {new: true}
    )
    if(!user)
    return res.status(404).send('The category with this ID is not found.');

    res.send(user)
});
// SINGLE //
router.get('/:id', async (req, res) => {
    const UserList = await User.findById()

    if(!UserList){
        res.status(500).json({success: false})
    }
    res.send(UserList)
});

// LOGIN //
router.post("/login", async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if(!user){
        return res.status(404).send('The user does not exit')
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        res.status(200).send({user: user.email, token: token});
    }else{
        res.status(400).send('password is incorrect')
    }
});



module.exports = router;