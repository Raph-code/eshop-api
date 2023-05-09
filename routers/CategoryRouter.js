const  express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');
// get method
router.get('/', async (req, res) => {
    const categoryList = await  Category.find()
     

    if(!categoryList){
        res.status(500).json({success: false})
    }
    res.send(categoryList)
});

// post method
router.post('/', (req, res) => {
      
    const category = new Category({
        name: req.body.name,
        image: req.body.image,
        icon: req.body.icon,
    })

    category.save().then((createdCategory => {
        res.status(201).json(createdCategory)
    })).catch(err => {
       res.status(500).json({
        error: err,
        success: false
       })
       
})

});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200).json({
                success:true,
                message: 'The category was removed successfully.'
            })
        }else{
            return res.status(404).json({success:false, message: 'The category could not be found.'})
        }
    }).catch(err => {
        return res.status(500).json({succes: false, message: err})
    })
});

router.put('/:id', async(req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color,
        },
        {new: true}
    )
    if(!category)
    return res.status(404).send('The category with this ID is not found.');

    res.send(category)
})

// GET SINGLE METHOD //
router.get('/', async (req, res) => {
    const category = await  Category.findById(req.params.id)
     

    if(!category){
        res.status(500).json({success: false})
    }
    res.send(category)
});

module.exports = router;
