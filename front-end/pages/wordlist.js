import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import axios from 'axios';

import { getCookie } from '../utils/cookie';

const WordList = () => {
	const router = useRouter();
	const [userName, setUserName] = useState(null);

	useEffect(() => {
		console.log(localStorage.getItem('user'));
		setUserName(localStorage.getItem('user'));
		console.log(userName);

		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/video/list/`, {
				headers: {
					Authorization: `Bearer ${getCookie('access_token')}`,
				},
			})
			.then((response) => {
				console.log(response);
				if (response['status'] === 200) {
					console.log('ok');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<>
			<HeaderNav />
			WordList
		</>
	);
};

export default WordList;
