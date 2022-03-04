import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';

const Educataion = () => {
	const router = useRouter();

	return (
		<>
			<HeaderNav />
			Educataion
		</>
	);
};

export default Educataion;
