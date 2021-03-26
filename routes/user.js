const express = require('express')
const router = express.Router();

const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const User = require('../model/user')

// post request
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatar",
            width: 150,
            crop: "scale"
        })
        const user = new User({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id
        })
        await user.save()
        res.send(user)
    } catch (err) {
        console.log(err)
    }
})

// get request
router.get('/', async (req, res) => {
    try {
        const user = await User.find()

        res.send(user)
    } catch (err) {
        console.log(err)
    }
})
// delete request
router.delete('/:id', async (req, res) => {
    try {
        // find user
        let user = await User.findById(req.params.id)
        // delete image from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id)

        // delete User from DB
        await user.remove()
        res.send(user)
    } catch (err) {
        console.log(err)
    }
})

// put request
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let user = await User.findById(req.params.id)

        await cloudinary.uploader.destroy(user.cloudinary_id)

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatar",
            width: 150,
            crop: "scale"
        })

        const data = new User({
            _id: req.params.id,
            name: req.body.name || user.name,
            avatar: result.secure_url || user.avatar,
            cloudinary_id: result.public_id || user.cloudinary_id
        })
        user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true, useFindAndModify: false })
        res.send(user)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
