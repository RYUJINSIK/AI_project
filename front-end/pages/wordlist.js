import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';

const WordList = () => {
	const router = useRouter();

	return (
		<>
			<HeaderNav />
			WordList
		</>
	);
};

export default WordList;
