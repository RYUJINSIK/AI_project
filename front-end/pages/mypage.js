import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';

const MyPage = () => {
	const router = useRouter();

	return (
		<>
			<HeaderNav />
			MyPage
		</>
	);
};

export default MyPage;
