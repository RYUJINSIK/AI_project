import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import axios from 'axios';
import Cookie, { setCookie, getCookie, removeCookie } from '../utils/cookie';
import jwt_decode from 'jwt-decode';
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Quiz = () => {
	const validateTimeAccesstoken = () => {
		// sessionStorage에서 accessToken을 가져온다.
		const accessToken = getCookie('access');
		// jwt를 decode 하여 payload를 추출한다.
		const decodePayload = jwt_decode(accessToken, { payload: true });

		// exp가 UNIX Time으로 나오기 때문에 변환을 해준다.
		var exp = new Date(decodePayload.exp * 1000).getTime();
		var now = new Date().getTime();
		console.log(new Date(decodePayload.exp * 1000));
		// 변환된 값을 비교하고 Boolean type을 반환한다.
		if (now < exp) {
			console.log('AccessToken 유효함!');
			return true;
		} else {
			console.log('AccessToken 만료됨!');
			return false;
		}
	};

	// interceptors 코드 위치??
	axios.interceptors.response.use(
		// 정상 응답처리
		(config) => {
			return config;
		},
		// 오류 발생시
		async (error) => {
			const originalRequest = error.config;
			const refresh_token = getCookie('refresh');
			// AccessToken이 만료됐다면
			if (!validateTimeAccesstoken()) {
				// Refreshtoken을 통해 Accesstoken을 재발급한다.
				console.log('access token 재발급 필요!');
				// getAccesstokenWithRefreshtoken(originalRequest)
				const { data } = await axios({
					method: 'post',
					url: `http://127.0.0.1:8000/user/token/refresh/`,
					data: { refresh: refresh_token },
				});
				console.log(data['access']);
				console.log('나난나뇨');
				// 쿠키 새로 지정하는 부분
				setCookie('access', data['access'], {
					path: '/',
					secure: true,
					sameSite: 'none',
				});
				axios.defaults.headers.common.Authorization = `Bearer ${data['access']}`;

				originalRequest['headers'][
					'Authorization'
				] = `Bearer ${data['access']}`;

				await axios(originalRequest).then((res) => {
					if (response['status'] === 200) {
						console.log(response['data']);
						setQuiz(response['data']);
						setQuizExist(true);
					}
				}); // 원래 axios 요청 그대로 할려면 then 부분까지 다 써야 하는지?
				console.log('끄으읏??');
			}
			return Promise.reject(error);
		},
	);

	const router = useRouter();
	const [dialog, setDialog] = useState(true);
	const [quiz, setQuiz] = useState([]);
	const [quizExist, setQuizExist] = useState(false);
	const [quizNum, setQuizNum] = useState(0);
	const [openAlert, setOpenAlert] = useState(false);
	const [alertMsg, setAlertMsg] = useState('');
	const [alertType, setAlertType] = useState('');
	const [showNext, setShowNext] = useState(false);
	const [tryCount, setTryCount] = useState(1);
	const [collectCount, setCollectCount] = useState(0);
	const [user, setUser] = useState('');
	const [quizEnd, setQuizEnd] = useState(false);

	useEffect(() => {
		setUser(localStorage.getItem('user'));
	}, []);

	const handleCloseAlert = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenAlert(false);
	};

	const getQuiz = (category) => {
		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/quiz/type/${category}`, {
				headers: {
					Authorization: `Bearer ${getCookie('access')}`,
				},
			})
			.then((response) => {
				console.log(response);
				if (response['status'] === 200) {
					console.log(response['data']);
					setQuiz(response['data']);
					setQuizExist(true);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getAnswerValue = () => {
		var obj_length = document.getElementsByName('quiz').length;

		for (var i = 0; i < obj_length; i++) {
			if (document.getElementsByName('quiz')[i].checked == true) {
				answerCheck(document.getElementsByName('quiz')[i].value);
			}
		}
	};

	const answerCheck = (value) => {
		if (quiz[quizNum].answer === value) {
			if (tryCount === 1) {
				setCollectCount(collectCount + 1);
			}
			setAlertMsg('정답입니다 !');
			setAlertType('success');
			setShowNext(true);
			setOpenAlert(true);
		}

		if (quiz[quizNum].answer !== value) {
			setTryCount(tryCount + 1);
			setAlertMsg('오답입니다 정답을 다시 선택해주세요 !');
			setAlertType('error');
			setOpenAlert(true);
		}
	};

	const getNextQuiz = () => {
		if (quizNum + 1 === quiz.length) {
			setQuizExist(false);
			setQuizEnd(true);
		} else {
			var obj_length = document.getElementsByName('quiz').length;

			for (var i = 0; i < obj_length; i++) {
				if (document.getElementsByName('quiz')[i].checked == true) {
					document.getElementsByName('quiz')[i].checked = false;
				}
			}
			setQuizNum(quizNum + 1);
			setTryCount(1);
			setShowNext(false);
		}
	};

	return (
		<>
			<HeaderNav />
			<br />
			<br />
			<Dialog open={dialog}>
				<DialogContent style={{ fontSize: '30px', textAlign: 'center' }}>
					수화퀴즈 주제를 선택해주세요.
					<br />
					<Button
						variant="contained"
						style={{
							fontSize: '20px',
							width: '45%',
							marginRight: '10px',
							backgroundColor: '#C1E1FF',
							color: 'black',
						}}
						onClick={() => {
							getQuiz(1);
							setDialog(false);
						}}
					>
						신체
					</Button>
					<Button
						variant="contained"
						style={{
							fontSize: '20px',
							width: '45%',
							backgroundColor: '#C1E1FF',
							color: 'black',
						}}
						onClick={() => {
							getQuiz(2);
							setDialog(false);
						}}
					>
						증상
					</Button>
				</DialogContent>
			</Dialog>
			{quizExist ? (
				<div style={mainDiv}>
					<div style={quizDiv}>
						<p style={quizTitle}>Quiz. 영상이 설명하는 동작을 맞춰보세요.</p>
						<video
							src={`${process.env.NEXT_PUBLIC_URL}/${quiz[quizNum].video}`}
							style={quizVideo}
							controls
						></video>
						<br />
						<div>
							<label className="radioLabel">
								<input
									type="radio"
									name="quiz"
									value={quiz[quizNum].choice_text[0]}
								/>
								<span>{quiz[quizNum].choice_text[0]}</span>
							</label>
							<br />

							<label className="radioLabel">
								<input
									type="radio"
									name="quiz"
									value={quiz[quizNum].choice_text[1]}
								/>
								<span>{quiz[quizNum].choice_text[1]}</span>
							</label>

							<br />

							<label className="radioLabel">
								<input
									type="radio"
									name="quiz"
									value={quiz[quizNum].choice_text[2]}
								/>
								<span>{quiz[quizNum].choice_text[2]}</span>
							</label>
						</div>
						{showNext ? (
							<Button
								variant="contained"
								style={{
									fontSize: '20px',
									backgroundColor: '#D0C1FF',
									color: 'black',
									borderRadius: '20px',
									width: '50%',
								}}
								onClick={() => {
									getNextQuiz();
								}}
							>
								다음문제
							</Button>
						) : (
							<Button
								variant="contained"
								style={{
									fontSize: '20px',
									backgroundColor: '#C1E1FF',
									color: 'black',
									borderRadius: '20px',
									width: '50%',
								}}
								onClick={() => {
									getAnswerValue();
								}}
							>
								정답확인
							</Button>
						)}
					</div>
				</div>
			) : (
				<div style={mainDiv}>
					<div style={quizDiv}>
						{quizEnd ? (
							<>
								<p style={{ fontSize: '30px', marginTop: '100px' }}>
									{user} 님의 퀴즈 점수입니다.
									<br />
									<br />
									총 문제 수 : 10
									<br />
									정답 수 : {collectCount}
								</p>
								<br />
								<span style={{ fontSize: '150px', color: 'red' }}>
									<RoughNotation type="underline" show="true" strokeWidth="3">
										{(collectCount / 10) * 100}
									</RoughNotation>{' '}
									<span style={{ color: 'black' }}>점</span>
								</span>
								<br />

								<Button
									variant="contained"
									style={{
										fontSize: '20px',
										backgroundColor: '#C1FFE3',
										color: 'black',
										borderRadius: '20px',
										width: '50%',
									}}
									onClick={() => {
										router.push('/wordlist');
									}}
								>
									수화 공부하러가기
								</Button>
								<br />
								<Button
									variant="contained"
									style={{
										marginTop: '20px',
										fontSize: '20px',
										backgroundColor: '#C1E1FF',
										color: 'black',
										borderRadius: '20px',
										width: '50%',
									}}
									onClick={() => {
										router.push('/');
									}}
								>
									메인화면으로 돌아가기
								</Button>
							</>
						) : (
							<></>
						)}
					</div>
				</div>
			)}

			<Snackbar
				open={openAlert}
				autoHideDuration={6000}
				onClose={handleCloseAlert}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={handleCloseAlert}
					severity={alertType}
					sx={{ width: '100%' }}
				>
					{alertMsg}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Quiz;

const mainDiv = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	paddingLeft: '50px',
	paddingRight: '50px',
};

const quizDiv = {
	textAlign: 'center',
	minHeight: '80vh',
	width: '40%',
	backgroundColor: '#fff',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	borderRadius: '20px',
};

const quizTitle = {
	marginTop: '20px',
	fontSize: '30px',
};

const quizVideo = {
	width: '90%',
	height: '400px',
};
