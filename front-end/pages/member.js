import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';

const Member = () => {
	const router = useRouter();

	return (
		<>
			<HeaderNav />
			Member
		</>
	);
};

export default Member;
