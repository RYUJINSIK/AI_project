import React, { useState, useEffect } from 'react';
import { useRouter, Router } from 'next/router';
import axios from 'axios';
// hook
import useModal from '../utils/useModal';
import Cookie from '../utils/cookie';
// components
import LoginModal from '../components/LoginModal';

// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const pages = ['메뉴1', '메뉴2', '메뉴3'];

const HeaderForm = () => {
	const router = useRouter();
	const { showModal, openModal, closeModal } = useModal();
	const [userName, setUserName] = useState(null);

	useEffect(() => {
		console.log('123');
		console.log(localStorage);
		setUserName(localStorage.getItem('user'));
		console.log(userName);
	}, []);

	const [openAlert, setOpenAlert] = useState(false);
	const [alertMsg, setAlertMsg] = useState('');
	const [alertType, setAlertType] = useState('');

	const handleClickAlert = () => {
		setOpenAlert(true);
	};

	const handleCloseAlert = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenAlert(false);
	};

	//회원가입
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState({
		errorId: 'none',
		errorPassword: 'none',
		errorName: 'none',
	});
	const [user, setUser] = useState({
		id: '',
		password: '',
		passwordCheck: '',
		name: '',
	});

	let isKorEng = /^[가-힣a-zA-Z]+$/; //이름: 한글이나 영문
	let isMail =
		/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 형식

	//비밀번호
	let isEngNum = /^(?=.*[a-zA-Z])(?=.*[0-9]).{10,}$/; //영문,숫자
	let isEngSpecial = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,}$/; //영문,특수문자
	let isSpecialNum = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{10,}$/; //특수문자, 숫자
	let isEngNumSpecial =
		/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/; //영문,숫자,특수문자 모두 사용

	const onChangeAction = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	// else 사용을 줄이자 else보다는 if를 많이사용
	const onClickCheck = (e) => {
		if (user.id === '') {
			setAlertMsg('아이디를 입력하세요 !');
			setAlertType('error');
			setOpenAlert(true);
			return;
		}

		if (!regCheck(isMail, user.id)) {
			setAlertMsg('적합하지 않은 이메일 형식입니다.');
			setAlertType('error');
			setOpenAlert(true);
			return;
		}

		// 중복 ID 검증 로직
		idCheck(user.id);
	};

	const onSubmitAction = (e) => {
		if (user.id === '' || user.name === '') {
			setAlertMsg('아이디, 이름을 모두 입력해주세요.');
			setAlertType('error');
			setOpenAlert(true);

			return;
		}
		if (user.password != user.passwordCheck) {
			setAlertMsg('비밀번호가 일치하지않습니다 !');
			setAlertType('error');
			setOpenAlert(true);
			return;
		}

		if (!regCheck(isKorEng, user.name)) {
			setAlertMsg('이름은 한글 또는 영문으로만 입력해주세요.');
			setAlertType('error');
			setOpenAlert(true);

			return;
		}

		if (!regCheck(isMail, user.id)) {
			setAlertMsg('적합하지 않은 이메일 형식입니다.');
			setAlertType('error');
			setOpenAlert(true);

			return;
		}

		if (
			!regCheck(
				isEngNum || isEngSpecial || isSpecialNum || isEngNumSpecial,
				user.password,
			)
		) {
			setAlertMsg('비밀번호 생성 규칙을 지켜 입력해주세요.');
			setAlertType('error');
			setOpenAlert(true);

			return;
		}

		console.log(user);
		postSignin(user);
	};

	function regCheck(regex, val) {
		if (regex.test(val)) {
			return true;
		}
	}
	// parameter를 명확하게, user 정보를 세분화해서 전달(데이터가 적다면) / 데이터가 많을땐 객체그대로 보내지만, 문서화 필수
	const postSignin = async (user) => {
		axios
			.post(`${process.env.NEXT_PUBLIC_URL}/user/register/`, {
				name: user.name,
				email: user.id,
				password: user.password,
				password2: user.passwordCheck,
			})
			.then((response) => {
				console.log(response);
				if (response['status'] === 201) {
					console.log('signin!');
					console.log(data);
					router.push('/');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// output : return data, if error : return err
	const idCheck = async (id) => {
		return axios
			.post(`${process.env.NEXT_PUBLIC_URL}/user/idchk/`, { email: user.id })
			.then((response) => {
				console.log(response);
				console.log(response['status']);
				if (response['status'] === 200) {
					setAlertMsg('사용가능한 아이디입니다.');
					setAlertType('success');
					setOpenAlert(true);
				}
				if (response['status'] === 201) {
					setAlertMsg('사용가능한 아이디입니다.');
					setAlertType('success');
					setOpenAlert(true);
				}
			})
			.catch((err) => {
				setAlertMsg('사용불가능한 아이디입니다.');
				setAlertType('error');
				setOpenAlert(true);
			});
	};

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar
					position="static"
					style={{ backgroundColor: '#00ff0000', paddingTop: '10px' }}
					elevation={0}
				>
					<Toolbar variant="dense">
						<Typography
							variant="h4"
							color="black"
							component="div"
							style={{ marginRight: '25px', cursor: 'pointer' }}
							onClick={() => {
								alert('click!');
							}}
						>
							<img
								src="/images/logo.png"
								style={{
									width: '30px',
									height: '30px',
									marginBottom: '-5px',
									marginRight: '5px',
								}}
							/>
							마음의소리
						</Typography>
						<Box sx={{ flexGrow: 1, display: 'flex' }}>
							{pages.map((page) => (
								<Button
									key={page}
									sx={{ my: 1, color: 'white', display: 'block' }}
									style={{ margin: '0px', color: 'black', fontSize: '20px' }}
								>
									{page}
								</Button>
							))}
						</Box>
						<Box sx={{ flexGrow: 0, display: 'flex', margin: '0px' }}>
							{userName !== null ? (
								<>
									<Button
										key="마이페이지"
										sx={{ my: 2, color: 'white', display: 'block' }}
										style={{ margin: '0px', color: 'black', fontSize: '20px' }}
									>
										마이페이지
									</Button>
									<Button
										key="로그아웃"
										sx={{ my: 2, color: 'white', display: 'block' }}
										style={{ margin: '0px', color: 'black', fontSize: '20px' }}
									>
										로그아웃
									</Button>
								</>
							) : (
								<>
									<Button
										key="로그인"
										sx={{ my: 2, color: 'white', display: 'block' }}
										style={{ margin: '0px', color: 'black', fontSize: '20px' }}
										onClick={openModal}
									>
										로그인
									</Button>

									{showModal && (
										<LoginModal
											show={showModal}
											open={openModal}
											close={closeModal}
										/>
									)}

									<Button
										key="회원가입"
										sx={{ my: 2, color: 'white', display: 'block' }}
										style={{ margin: '0px', color: 'black', fontSize: '20px' }}
										onClick={handleClickOpen}
									>
										회원가입
									</Button>
								</>
							)}
						</Box>
					</Toolbar>
				</AppBar>
			</Box>

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle id="alert-dialog-title">
					<div style={{ fontSize: '30px', textAlign: 'center' }}>
						<img
							src="/images/logo.png"
							style={{
								width: '30px',
								height: '30px',
								marginBottom: '-5px',
								marginRight: '5px',
							}}
						/>
						회원가입
					</div>
					<hr />
				</DialogTitle>
				<DialogContent style={{ width: '550px', textAlign: 'center' }}>
					<div style={{ fontSize: '15px' }}>
						<div
							style={{
								width: '25%',
								float: 'left',
								textAlign: 'left',
								marginLeft: '10px',
							}}
						>
							ID
							<Button
								size="small"
								onClick={onClickCheck}
								style={{
									marginLeft: '5px',
									borderRadius: '20px',
									border: '1px solid',
									padding: '5px 0px 0px 0px',
								}}
							>
								중복체크
							</Button>
						</div>
						<div
							style={{
								width: '70%',
								display: 'inline-block',
								float: 'left',
							}}
						>
							<input
								type="text"
								name="id"
								onChange={onChangeAction}
								value={user.id}
								placeholder="아이디는 이메일 형식으로 입력해주세요. ex) elice@elice.com"
							/>
						</div>
						<div
							style={{
								width: '25%',
								float: 'left',
								textAlign: 'left',
								marginLeft: '10px',
							}}
						>
							Password
						</div>

						<div
							style={{
								width: '70%',
								display: 'inline-block',
								float: 'left',
							}}
						>
							<input
								type="password"
								name="password"
								onChange={onChangeAction}
								value={user.password}
								placeholder="Password를 입력해주세요"
							/>
						</div>
						<div
							style={{
								width: '25%',
								float: 'left',
								textAlign: 'left',
								marginLeft: '10px',
							}}
						>
							Password Check
						</div>

						<div
							style={{
								width: '70%',
								display: 'inline-block',
								float: 'left',
							}}
						>
							<input
								type="password"
								name="passwordCheck"
								onChange={onChangeAction}
								value={user.passwordCheck}
								placeholder="Password를 다시 입력해주세요"
							/>
						</div>
						<div
							style={{
								width: '25%',
								float: 'left',
								textAlign: 'left',
								marginLeft: '10px',
							}}
						>
							이름
						</div>

						<div
							style={{
								width: '70%',
								display: 'inline-block',
								float: 'left',
							}}
						>
							<input
								type="text"
								name="name"
								onChange={onChangeAction}
								value={user.name}
								placeholder="이름은 한글이나 영문으로만 입력해주세요."
							/>
						</div>
					</div>
					<div style={{ marginTop: '100px' }}>
						<Button
							variant="contained"
							style={{
								width: '100%',
								backgroundColor: '#8ab3ff',
								marginTop: '10px',
							}}
							onClick={onSubmitAction}
						>
							<span>회원가입</span>
						</Button>
					</div>
				</DialogContent>
			</Dialog>

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

export default HeaderForm;
