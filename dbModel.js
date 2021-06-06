import mongoose from 'mongoose';

const instance = mongoose.Schema({
	timestamp: String,
	caption: String,
	user: String,
	Image: String,
	comments: [],
});

export default mongoose.model('posts', instance);
