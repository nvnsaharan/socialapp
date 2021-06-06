import React, { useState } from 'react';
import { storage } from './firebase';
import './ImageUpload.css';
import { Input } from '@material-ui/core';
import axios from './axios';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const ImageUpload = ({ username }) => {
	const [image, setImage] = useState(null);
	// const [url, setUrl] = useState('');
	const [progress, setProgress] = useState(0);
	const [caption, setCaption] = useState('');

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// progress function ...
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				// Error function ...
				console.log(error);
			},
			() => {
				// complete function ...
				storage
					.ref('images')
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						// setUrl(url);
						console.log(url);
						axios.post('/upload', {
							timestamp: new Date(),
							caption: caption,
							user: username,
							Image: url,
						});

						setProgress(0);
						setCaption('');
						setImage(null);
					});
			}
		);
	};

	return (
		<div className='imageupload'>
			{progress ? (
				<progress
					className='imageupload__progress'
					value={progress}
					max='100'
				/>
			) : (
				''
			)}

			<div className='upload_div'>
				<label className='custom-file-upload'>
					<input type='file' onChange={handleChange} />
					<AddAPhotoIcon style={{ fontSize: 25 }} />
				</label>
				<Input
					className='caption_Input'
					placeholder='Enter a caption'
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
				/>
			</div>
			<div>
				<button className='imageupload__button' onClick={handleUpload}>
					POST
				</button>
			</div>
		</div>
	);
};

export default ImageUpload;
