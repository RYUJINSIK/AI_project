import React, { useState, useEffect } from 'react';
import { useRouter, Router } from 'next/router';
import axios from 'axios';
import { useCookies } from 'react-cookie';
// hook
import useModal from '../utils/useModal';
import Cookie from '../utils/cookie';
// components
import LoginModal from '../components/LoginModal';
import SignInModal from '../components/SignInModal';

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

const pages = ['수화배우기', '수화센터찾기', '수화퀴즈'];

const HeaderForm = () => {
	const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
	const router = useRouter();
	const {
		showModal: showLogin,
		openModal: openLogin,
		closeModal: closeLogin,
	} = useModal();
	const {
		showModal: showSignin,
		openModal: openSignin,
		closeModal: closeSignin,
	} = useModal();
	const [userName, setUserName] = useState(null);
	const [signinVal, setSigninVal] = useState(null);
	const [openAlert, setOpenAlert] = useState(false);
	const [alertMsg, setAlertMsg] = useState('');
	const [alertType, setAlertType] = useState('');

	useEffect(() => {
		setUserName(localStorage.getItem('user'));
		setSigninVal(localStorage.getItem('signin'));
	}, []);

	useEffect(() => {
		if (userName !== null) {
			if (router.pathname === '/') {
				setAlertMsg(`${userName}님 환영합니다. 😊`);
				setAlertType('success');
				setOpenAlert(true);
			}
		}
	}, [userName]);

	useEffect(() => {
		if (signinVal === 'success') {
			if (router.pathname === '/') {
				setAlertMsg(`회원가입이 완료되었습니다. 😀`);
				setAlertType('success');
				setOpenAlert(true);
				setSigninVal(null);
				localStorage.setItem('signin', 'false');
			}
		}
	}, [signinVal]);

	useEffect(() => {
		console.log(router);
	}, [router]);

	const onClickLogout = () => {
		removeCookie('access');
		removeCookie('refresh');
		localStorage.clear();
		setUserName(null);
		if (router.pathname === '/') {
			location.reload();
		} else {
			router.push('/');
		}
	};
	const handleCloseAlert = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenAlert(false);
	};
	const onClickMenu = (e) => {
		if (userName !== null) {
			if (e.target.value === '수화배우기') {
				router.push('/wordlist');
			}
			if (e.target.value === '수화센터찾기') {
				router.push('/map');
			}
			if (e.target.value === '수화퀴즈') {
				router.push('/quiz');
			}
		} else {
			setAlertMsg('로그인이 필요한 서비스입니다 로그인해주세요 !');
			setAlertType('warning');
			setOpenAlert(true);
		}
	};

	return (
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
							router.push('/');
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
								value={page}
								sx={{ my: 1, color: 'white', display: 'block' }}
								style={{ margin: '0px', color: 'black', fontSize: '20px' }}
								onClick={onClickMenu}
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
									onClick={() => {
										router.push('/mypage');
									}}
								>
									마이페이지
								</Button>
								<Button
									key="로그아웃"
									sx={{ my: 2, color: 'white', display: 'block' }}
									style={{ margin: '0px', color: 'black', fontSize: '20px' }}
									onClick={onClickLogout}
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
									onClick={openLogin}
								>
									로그인
								</Button>

								{showLogin && (
									<LoginModal
										show={showLogin}
										open={openLogin}
										close={closeLogin}
									/>
								)}

								<Button
									key="회원가입"
									sx={{ my: 2, color: 'white', display: 'block' }}
									style={{ margin: '0px', color: 'black', fontSize: '20px' }}
									onClick={openSignin}
								>
									회원가입
								</Button>

								{showSignin && (
									<SignInModal
										show={showSignin}
										open={openSignin}
										close={closeSignin}
									/>
								)}
							</>
						)}
					</Box>
				</Toolbar>
			</AppBar>

			<Snackbar
				open={openAlert}
				autoHideDuration={2000}
				onClose={handleCloseAlert}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					onClose={handleCloseAlert}
					severity={alertType}
					sx={{ width: '100%' }}
				>
					{alertMsg}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default HeaderForm;
