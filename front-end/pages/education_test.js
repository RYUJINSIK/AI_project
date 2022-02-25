import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import Webcam from 'react-webcam';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

const EducataionTest = () => {
	const webcamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const [capturing, setCapturing] = useState(false);
	const [recordedChunks, setRecordedChunks] = useState([]);
	const [blobUrl, setBlobUrl] = useState('');

	const handleStartCaptureClick = useCallback(() => {
		setCapturing(true);
		mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
			mimeType: 'video/webm',
		});
		mediaRecorderRef.current.addEventListener(
			'dataavailable',
			handleDataAvailable,
		);
		mediaRecorderRef.current.start();
	}, [webcamRef, setCapturing, mediaRecorderRef]);

	const handleDataAvailable = useCallback(
		({ data }) => {
			if (data.size > 0) {
				setRecordedChunks((prev) => prev.concat(data));
			}
		},
		[setRecordedChunks],
	);

	const handleStopCaptureClick = useCallback(() => {
		mediaRecorderRef.current.stop();
		const blob = new Blob(recordedChunks, {
			type: 'video/webm',
		});
		const url = URL.createObjectURL(blob);
		setBlobUrl(url);
		setCapturing(false);
	}, [mediaRecorderRef, webcamRef, setCapturing]);

	const handleDownload = useCallback(() => {
		if (recordedChunks.length) {
			const blob = new Blob(recordedChunks, {
				type: 'video/webm',
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			document.body.appendChild(a);
			a.style = 'display: none';
			a.href = url;
			a.download = 'react-webcam-stream-capture.webm';
			a.click();
			window.URL.revokeObjectURL(url);
			setRecordedChunks([]);
		}
	}, [recordedChunks]);

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
						<Webcam
							audio={false}
							ref={webcamRef}
							videoConstraints={{
								height: 720,
								width: 1280,
							}}
						/>
						<br />
						{capturing ? (
							<Button
								variant="contained"
								size="large"
								onClick={handleStopCaptureClick}
								style={{ backgroundColor: '#7C7FFF' }}
							>
								녹화종료
							</Button>
						) : (
							<Button
								variant="contained"
								size="large"
								onClick={handleStartCaptureClick}
								style={{ backgroundColor: '#7C7FFF' }}
							>
								녹화시작
							</Button>
						)}
						{recordedChunks.length > 0 && (
							<>
								<Button
									variant="contained"
									size="large"
									onClick={handleDownload}
									style={{ backgroundColor: '#7C7FFF', marginLeft: '20px' }}
								>
									영상 다운로드
								</Button>
							</>
						)}
					</div>
				</Grid>
			</Grid>
		</>
	);
};

export default EducataionTest;
