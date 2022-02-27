import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import { ReactMediaRecorder } from 'react-media-recorder';
import Webcam from 'react-webcam';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

const EducataionTest = () => {
	const [showData, setShowData] = useState(false);
	const webcamRef = React.useRef(null);
	const [videoBlob, setVideoBlob] = useState(null);

	useEffect(() => {
		console.log(videoBlob);
	}, [videoBlob]);

	const handleSubmit = () => {
		const formData = new FormData();
		formData.append('video', videoBlob);
		console.log(formData);
		axios({
			method: 'post',
			url: `${process.env.NEXT_PUBLIC_URL}/api/apidetail`,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		setVideoBlob(null);
	};

	return (
		<>
			<HeaderNav />
			<br />
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<div style={{ paddingLeft: '50px' }}>xs=6</div>
				</Grid>
				<Grid item xs={6}>
					<div style={{ borderLeft: '1px solid black', paddingLeft: '50px' }}>
						<ReactMediaRecorder
							video
							onStop={(blobUrl, blob) => {
								setVideoBlob(blob);
							}}
							render={({
								status,
								startRecording,
								stopRecording,
								mediaBlobUrl,
							}) => (
								<div>
									<p>{status}</p>
									{showData ? null : <Webcam audio={false} ref={webcamRef} />}
									{/* thakbe na button click a */}
									{showData ? <video src={mediaBlobUrl} controls /> : null}
									{/* thakbe  */}
									<div>
										<button onClick={startRecording}>Record</button>
										<button
											onClick={() => {
												setShowData(true);
												stopRecording();
											}}
										>
											{' '}
											🛑 Stop
										</button>
										<button
											onClick={() => {
												handleSubmit();
											}}
										>
											{' '}
											Submit
										</button>
									</div>
								</div>
							)}
						/>
					</div>
				</Grid>
			</Grid>
		</>
	);
};

export default EducataionTest;
