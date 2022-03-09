import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { setCookie } from '../utils/cookie';

const LoginModal = (props) => {
	const router = useRouter();
	const { show, open, close } = props;

	const handleCloseAlert = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenAlert(false);
	};
	const [user, setUser] = useState({
		id: '',
		password: '',
	});
	const onChangeAction = useCallback(
		(e) => {
			const { name, value } = e.target;
			setUser({ ...user, [name]: value });
		},
		[user, setUser],
	);
	const onSubmitAction = (e) => {
		if (user.id === '' || user.password === '') {
			setMessage('아이디, 비밀번호를 모두 입력해주세요.');
			setisError('inline-block');
			return false;
		}

		postLogin(user);
	};

	const postLogin = async (user) => {
		axios
			.post(`${process.env.NEXT_PUBLIC_URL}/user/login/`, {
				email: user.id,
				password: user.password,
			})
			.then((response) => {
				console.log(response);
				if (response['status'] === 200) {
					console.log(response['data']['access_token']);
					localStorage.setItem(
						'user',
						JSON.stringify(response['data']['email']),
					);

					setCookie('access', response['data']['access_token'], {
						path: '/',
						secure: true,
						sameSite: 'none',
					});
					setCookie('refresh', response['data']['refresh_token'], {
						path: '/',
						secure: true,
						sameSite: 'none',
					});

					close();
					location.reload();
				} else {
					setMessage('아이디 또는 비밀번호가 잘못 입력 되었습니다.');
				}
			})
			.catch((err) => {
				console.log(err);
				alert('아이디 및 비밀번호를 다시 입력해주세요');
			});
	};

	return (
		<>
			<Dialog open={show} onClose={close}>
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
						로그인
					</div>
					<hr />
				</DialogTitle>
				<DialogContent style={{ width: '550px', textAlign: 'center' }}>
					<div style={{ fontSize: '20px' }}>
						<div style={{ width: '30%', float: 'left' }}>ID</div>
						<div
							style={{
								width: '60%',
								display: 'inline-block',
								float: 'left',
							}}
						>
							<input
								type="text"
								name="id"
								onChange={onChangeAction}
								value={user.id}
								placeholder="ID를 입력해주세요"
							/>
						</div>
						<br />
						<div style={{ width: '30%', float: 'left' }}>Password</div>

						<div
							style={{
								width: '60%',
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
					</div>
					<br />
					<br />
					<div>
						<Button
							variant="contained"
							style={{
								width: '100%',
								backgroundColor: '#8ab3ff',
								marginBottom: '10px',
							}}
							onClick={onSubmitAction}
						>
							<span>로그인</span>
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default LoginModal;
