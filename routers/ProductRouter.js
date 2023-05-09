const  express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');
const { Product } = require('../models/Product');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
    
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){
            uploadError = null;
        }

        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {

        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
const uploadOptions = multer({ storage: storage});
// get method //
router.get('/', async (req, res) => {
    const productList = await Product.find();
    

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList)
});

// post method //
router.post('/', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(404).send('Invalid Category');
    
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request');
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;



    let product = new Product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:`${basePath}${fileName}`,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,

    });

    product = await product.save();
    if(!product)
    return res.status(404).send('The product is not created');

    res.send(product);

});

//update method //
router.put('/:id',uploadOptions.single('image'),  async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).send('Invalid Product ID')
    }
    const category = await Category.findById(req.body.category);
    if(!category)return res.status(404).send('Invalid category');

    const file = req.file;
    let imagepath;

    if(file){
        const fileName = file.filename
        const basePath = `${req.protocol}//${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`
    }else{
        imagepath = product.image
    }

    const updatedProduct = await  Product.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            description:req.body.description,
            richDescription:req.body.richDescription,
            image:imagepath,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured,

        },
        {new: true}
    )
    if(!updatedProduct)
    return res.status(404).send('The product with this ID is not found');
    res.send(updatedProduct);
});

module.exports = router;
