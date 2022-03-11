import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookie, { setCookie, getCookie, removeCookie } from '../utils/cookie';
import jwt_decode from 'jwt-decode';

const Main = () => {
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
					url: `http://127.0.0.1:8000/user/api/token/refresh/`,
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
					console.log('post : ', res);
				}); // 원래 axios 요청 그대로 할려면 then 부분까지 다 써야 하는지?
				console.log('끄으읏??');
			}
			return Promise.reject(error);
		},
	);

	const logout = async () => {
		axios({
			method: 'post',
			url: `http://127.0.0.1:8000/user/logout/`,
			data: { aaaa: '전송전송' },
			headers: {
				Authorization: `Bearer ${getCookie('access')}`,
			},
		})
			.then(function (response) {
				console.log('post : ', response);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	return (
		<>
			<HeaderNav />
			안녕하세요
			<button variant="contained" onClick={logout}>
				버튼버튼
			</button>
		</>
	);
};

export default Main;
