import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

const LoginModal = (props) => {
	const { show, open, close } = props;

	// const [message, setMessage] = useState('');
	// 변수명을 지을땐 동사+명사로 지으면 제일 깔끔
	// const [isError, setisError] = useState('none');
	const [user, setUser] = useState({
		id: '',
		password: '',
	});
	const onChangeAction = useCallback(
		(e) => {
			const { name, value } = e.target;
			setUser({ ...user, [name]: value });

			console.log(e.target.value);
		},
		[user, setUser],
	);
	const onSubmitAction = (e) => {
		if (user.id === '' || user.password === '') {
			setMessage('아이디, 비밀번호를 모두 입력해주세요.');
			setisError('inline-block');
			return false;
		}

		// setisError('none');
		console.log(user);
		// postLogin(user);
	};

	const postLogin = async (user) => {
		axios
			.post('http://127.0.0.1:8000/user/login/', {
				email: user.id,
				password: user.password,
			})
			.then((response) => {
				console.log(response);
				console.log(response['status']);
				// console.log(data.name);
				// console.log(data.token);
				if (response['status'] === 200) {
					// setisError('none');
					// localStorage.setItem('userName', JSON.stringify(data.name));
					console.log(response['data']['access_token']);
					// localStorage.setItem('token', JSON.stringify(response['data']['access_token']));

					// const { accessToken } = response[data]['access_token'];

					// // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
					// axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

					// router.push('/');
					alert(`${response['data']['email']}님 안녕하세요 😀`);
				} else {
					setMessage('아이디 또는 비밀번호가 잘못 입력 되었습니다.');
					setisError('inline-block');
				}
			})
			.catch((err) => {
				console.log(err);
				alert('아이디 및 비밀번호를 다시 입력해주세요');
			});
	};

	return (
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
	);
};

export default LoginModal;
