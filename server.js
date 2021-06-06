import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dbModel from './dbModel.js';

const app = express();
const port = process.env.PORT || 8080;

const pusher = new Pusher({
	appId: '1213147',
	key: '483cf55d24a3edf2a308',
	secret: '4f1e16a45a790d1c0079',
	cluster: 'ap2',
	useTLS: true,
});

app.use(express.json());
app.use(cors());
// B3ndcSKGWt2oZ8JY

const connection_url =
	'mongodb+srv://admin:B3ndcSKGWt2oZ8JY@cluster0.y8m87.mongodb.net/socialDB?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
	console.log('DB Connected!!');

	const changeStream = mongoose.connection.collection('posts').watch();

	changeStream.on('change', (change) => {
		console.log('Change..');
		console.log('End of Change!');

		if (change.operationType === 'insert') {
			const postDetails = change.fullDocument;
			pusher.trigger('posts', 'inserted', {
				user: postDetails.user,
				caption: postDetails.caption,
				image: postDetails.image,
			});
		} else {
			console.log('Unknown trigger...');
		}
	});
});

app.get('/', (req, res) => {
	res.status(200).send('hello world');
});

app.post('/upload', (req, res) => {
	const body = req.body;
	console.log('data posted !');
	dbModel.create(body, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get('/sync', (req, res) => {
	dbModel
		.find({})
		.sort({ timestamp: -1 })
		.exec((err, data) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).send(data);
			}
		});
});

app.listen(port, () => console.log(`listening on ${port}`));
