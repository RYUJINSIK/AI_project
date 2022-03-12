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
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const EducataionTest = () => {
	const router = useRouter();

	const [showData, setShowData] = useState(false);
	const webcamRef = useRef(null);
	const [videoBlob, setVideoBlob] = useState(null);
	const [camStatus, setCamStatus] = useState('');
	const [infoMessage, setInfoMessage] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState({});

	useEffect(() => {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_URL}/word/upload/${router.query.video_name}`,
				{
					headers: {
						Authorization: `Bearer ${getCookie('access')}`,
					},
				},
			)
			.then((response) => {
				console.log(response);
				console.log(response.data[0]['video_url']);
				if (response['status'] === 200) {
					// console.log(response['data'][0]['video_url']);
					setData(response.data[0]['video_url']);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

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
		postVideo();
	};

	const postVideo = () => {
		const formData = new FormData();
		formData.append('video_url', videoBlob);
		axios({
			method: 'post',
			url: `${process.env.NEXT_PUBLIC_URL}/predict/upload/`,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${getCookie('access')}`,
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
		setIsLoading(true);
		axios({
			method: 'patch',
			url: `${process.env.NEXT_PUBLIC_URL}/predict/change/`,
			headers: {
				Authorization: `Bearer ${getCookie('access')}`,
			},
		})
			.then(function (response) {
				console.log('patch : ', response);
				getScore();
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const getScore = () => {
		axios({
			method: 'get',
			url: `${process.env.NEXT_PUBLIC_URL}/predict/score/?labels=${router.query.video_name}`,
			headers: {
				Authorization: `Bearer ${getCookie('access')}`,
			},
		})
			.then(function (response) {
				setIsLoading(false);
				console.log('get : ', response['data']);

				let medal = response['data']['medal_name'];
				let score = response['data']['score'];

				putScore(medal, score);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const putScore = (medal, score) => {
		const formData = new FormData();
		formData.append('score', score);
		formData.append('learning_video_id', router.query.video_id);
		axios({
			method: 'put',
			url: `${process.env.NEXT_PUBLIC_URL}/user/score/`,
			data: formData,
			headers: {
				Authorization: `Bearer ${getCookie('access')}`,
			},
		})
			.then(function (response) {
				console.log('put : ', response);

				router.push({
					pathname: '/education_result',
					query: {
						video_id: router.query.video_id,
						video_name: router.query.video_name,
						video_kor: router.query.video_kor,
						difficulty: router.query.difficulty,
						score: score,
						medal: medal,
					},
				});
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const InfoTooltip = styled(({ className, ...props }) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.white,
			color: 'rgba(0, 0, 0, 0.87)',
			boxShadow: theme.shadows[1],
			fontSize: 20,
			maxWidth: 500,
		},
	}));

	return (
		<>
			<HeaderNav />
			<br />
			<Grid container spacing={0}>
				<Grid item xs={6}>
					<div style={mainDiv}>
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
											label={router.query.video_kor}
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
											<video
												src={`${process.env.NEXT_PUBLIC_URL}${data}`}
												style={CamStyle}
												controls
											></video>
										</div>
									</div>
								</div>
							)}
						/>
					</div>
				</Grid>
				<Grid item xs={6}>
					<div style={mainDiv}>
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
											<InfoTooltip
												title="정확한 채점을 위해 천천히 6초 이상 영상을 촬영해주세요."
												placement="top"
											>
												<Chip
													label="?"
													style={{
														// padding: '25px 0px 25px 0px',
														backgroundColor: '#A9ACFF',
														color: '#000',
														marginLeft: '10px',
														fontSize: '20px',
													}}
												/>
											</InfoTooltip>
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

const mainDiv = {
	marginLeft: '25px',
	backgroundColor: '#fff',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	borderRadius: '20px',
	textAlign: 'center',
	float: 'center',
	padding: '30px',
	minHeight: '80vh',
	width: '90%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	// alignItems: 'center',
};

const CamStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '90vh',
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
