const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minLength: 1,
		maxLength: 255,
		trim: true
	},
    description: {
        type: String,
		required: true,
		trim: true
    },
    thumbnail: {
        type: {
            data: Buffer,
            contentType: String
        }
    }
}, {collection:'video'});



module.exports =  mongoose.model('Video', videoSchema);