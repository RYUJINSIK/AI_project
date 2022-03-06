import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';

const Map = () => {
	const router = useRouter();

	return (
		<>
			<HeaderNav />
			MAP
		</>
	);
};

export default Map;
