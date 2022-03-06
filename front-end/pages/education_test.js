import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import { ReactMediaRecorder } from 'react-media-recorder';
import Webcam from 'react-webcam';
import axios from 'axios';
import { getCookie } from '../utils/cookie';

import { RoughNotation, RoughNotationGroup } from 'react-rough-notation';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Backdrop from '@mui/material/Backdrop';

const EducataionTest = () => {
	const [showData, setShowData] = useState(false);
	const webcamRef = useRef(null);
	const [videoBlob, setVideoBlob] = useState(null);
	const [camStatus, setCamStatus] = useState('');
	const [infoMessage, setInfoMessage] = useState('');

	const [isLoading, setIsLoading] = useState(false);

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
		if (camStatus === 'acquiring_media') {
			setInfoMessage('녹화준비중');
		}
	}, [camStatus]);

	const onClickSubmit = () => {
		setIsLoading(true);
		// postVideo();
	};

	const postVideo = () => {
		const formData = new FormData();
		formData.append('video_url', videoBlob);
		formData.append('user_id', 1);

		axios({
			method: 'post',
			url: `${process.env.NEXT_PUBLIC_URL}/predict/upload/`,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${getCookie('access_token')}`,
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
										<div style={{ float: 'left' }}>
											<Typography variant="h5" component="div" gutterBottom>
												<Chip
													label="Step 1"
													style={{
														padding: '25px 0px 25px 0px',
														backgroundColor: '#CAFFE1',
														marginRight: '10px',
														boxShadow: '3px 3px 3px 0px gray',
														fontSize: '20px',
													}}
												/>
												영상을 보고 동작을 익히세요
											</Typography>
										</div>
										<div style={{ float: 'right', display: 'inline-block' }}>
											<Chip
												label="[단어이름]"
												style={{
													padding: '25px 0px 25px 0px',
													backgroundColor: '#B3E1FC',
													marginRight: '10px',
													boxShadow: '3px 3px 3px 0px gray',
													fontSize: '20px',
												}}
											/>
										</div>
										<br />
										<br />
										<div style={{ marginTop: '10px' }}>
											<div className="recordStandby">
												<video style={CamStyle} controls>
													<source src={mediaBlobUrl} />
												</video>
											</div>
										</div>
									</div>
								)}
							/>
						</div>
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
										<div style={{ float: 'left' }}>
											<Typography variant="h5" component="div" gutterBottom>
												<Chip
													label="Step 2"
													style={{
														padding: '25px 0px 25px 0px',
														backgroundColor: '#CAFFE1',
														marginRight: '10px',
														boxShadow: '3px 3px 3px 0px gray',
														fontSize: '20px',
													}}
												/>
												동작을 따라하는 모습을 녹화해보세요
											</Typography>
										</div>
										<div style={{ float: 'right', display: 'inline-block' }}>
											<Chip
												// className="recordStandby"
												label={infoMessage}
												style={{
													padding: '25px 0px 25px 0px',
													backgroundColor: '#FCCFDB',
													marginRight: '10px',
													boxShadow: '3px 3px 3px 0px gray',
													fontSize: '20px',
												}}
											/>
										</div>
										<br />
										<br />
										{setCamStatus(status)}
										<div style={{ marginTop: '10px' }}>
											{showData ? (
												<>
													<div className="recordFinish">
														<video style={CamStyle} controls>
															<source src={mediaBlobUrl} />
														</video>
													</div>
													<Button
														variant="contained"
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
														variant="contained"
														style={DivideButton}
														onClick={() => {
															onClickSubmit();
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
															variant="contained"
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
															variant="contained"
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

			<Backdrop
				sx={{
					color: '#fff',
					zIndex: (theme) => theme.zIndex.drawer + 1,
					flexDirection: 'column',
				}}
				open={isLoading}
			>
				<img
					src="/images/loading.gif"
					style={{
						width: '300px',
						height: '300px',
					}}
				/>
				<br />
				<Typography variant="h5" component="div" gutterBottom>
					채점중입니다 잠시만 기다려주세요
				</Typography>
			</Backdrop>
		</>
	);
};

export default EducataionTest;

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
