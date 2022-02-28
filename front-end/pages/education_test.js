import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import { ReactMediaRecorder } from 'react-media-recorder';
import Webcam from 'react-webcam';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SendIcon from '@mui/icons-material/Send';

const EducataionTest = () => {
	const [showData, setShowData] = useState(false);
	const webcamRef = useRef(null);
	const [videoBlob, setVideoBlob] = useState(null);
	const [camStatus, setCamStatus] = useState('');
	const [infoMessage, setInfoMessage] = useState('');

	useEffect(() => {
		if (camStatus === 'idle') {
			setInfoMessage('녹화 준비완료');
		}
		if (camStatus === 'recording') {
			setInfoMessage('녹화중');
		}
		if (camStatus === 'stopped') {
			setInfoMessage('녹화 완료');
		}
	}, [camStatus]);

	const handleSubmit = () => {
		const formData = new FormData();
		formData.append('video_url', videoBlob);
		formData.append('user_id', 1);

		axios({
			method: 'post',
			url: `${process.env.NEXT_PUBLIC_URL}/predict/upload/`,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
			.then(function (response) {
				console.log('post : ', response);
				updatePost();
			})
			.catch(function (error) {
				console.log(error);
			});

		setVideoBlob(null);
	};

	const updatePost = () => {
		const data = { user_id: '1' };

		axios({
			method: 'patch',
			url: `${process.env.NEXT_PUBLIC_URL}/predict/update/`,
			data: data,
		})
			.then(function (response) {
				console.log('patch : ', response);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	return (
		<>
			<HeaderNav />
			<br />
			<Grid container spacing={0}>
				<Grid item xs={6}>
					<div>
						<div style={MainDiv}></div>
					</div>
				</Grid>
				<Grid item xs={6} style={{ borderLeft: '5px solid #C9C9C9' }}>
					<div>
						<div style={MainDiv}>
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
										{setCamStatus(status)}
										<p style={Status}>{infoMessage}</p>
										<div style={{ marginTop: '10px' }}>
											{showData ? (
												<>
													<div className="recordFinish">
														<video
															src={mediaBlobUrl}
															style={CamStyle}
															controls
														/>
													</div>
													<Button
														style={DivideButton}
														onClick={() => {
															setShowData(false);
															startRecording();
														}}
													>
														<ReplayIcon style={{ marginRight: '10px' }} />
														다시 녹화하기
													</Button>
													<Button
														style={DivideButton}
														onClick={() => {
															handleSubmit();
														}}
													>
														<SendIcon style={{ marginRight: '10px' }} />
														제출하기
													</Button>
												</>
											) : (
												<>
													<div
														className={
															infoMessage === '녹화 준비완료'
																? 'recordStandby'
																: 'recording'
														}
													>
														<Webcam
															audio={false}
															ref={webcamRef}
															style={CamStyle}
														/>
													</div>
													{infoMessage === '녹화 준비완료' ? (
														<Button
															style={FullButton}
															onClick={() => {
																setShowData(false);
																startRecording();
															}}
														>
															<VideoCameraFrontIcon
																style={{ marginRight: '10px' }}
															/>
															녹화시작
														</Button>
													) : (
														<Button
															style={FullButton}
															onClick={() => {
																setShowData(true);
																stopRecording();
															}}
														>
															<CheckCircleOutlineIcon
																style={{ marginRight: '10px' }}
															/>
															녹화종료
														</Button>
													)}
												</>
											)}
										</div>
									</div>
								)}
							/>
						</div>
					</div>
				</Grid>
			</Grid>
		</>
	);
};

export default EducataionTest;

const Status = {
	fontSize: '30pt',
	fontWeight: 'bold',
};

const MainDiv = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '80vh',
};

const CamStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '80vh',
};

const DivideButton = {
	marginTop: '10px',
	marginRight: '10px',
	backgroundColor: '#B7EAFF',
	color: 'black',
	width: '48%',
};

const FullButton = {
	marginTop: '10px',
	backgroundColor: '#B7EAFF',
	color: 'black',
	width: '100%',
};
