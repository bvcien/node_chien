const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    title:mongoose.Schema.Types.String,
    content:mongoose.Schema.Types.String,
    image:mongoose.Schema.Types.String,
})

const blog = mongoose.model('Blog', userSchema)
module.exports = blog
