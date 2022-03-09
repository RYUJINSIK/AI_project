/* global kakao */
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { getCookie } from '../utils/cookie';

const Map = () => {
	const router = useRouter();
	const [mapData, setMapData] = useState([]);
	const [selectNum, setSelectNum] = useState(0);

	useEffect(() => {
		// 사용자 위도 경도 얻어서 getMapData 호출
		let lat, long;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					lat = position.coords.latitude;
					long = position.coords.longitude;
					getMapData(lat, long);
				},
				function (error) {
					console.error(error);
				},
				{
					enableHighAccuracy: false,
					maximumAge: 0,
					timeout: Infinity,
				},
			);
		} else {
			alert('GPS를 지원하지 않습니다');
			return;
		}
	}, []);

	const getMapData = (lat, long) => {
		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/signcenter/search/${lat}/${long}`, {
				headers: {
					Authorization: `Bearer ${getCookie('access')}`,
				},
			})
			.then((response) => {
				if (response['status'] === 200) {
					console.log(response['data']);
					setMapData(response['data']);
					console.log(response['data'][0]['center_info']);
					drawMap(
						response['data'][0]['center_info']['lat'],
						response['data'][0]['center_info']['lng'],
					);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const drawMap = (lat, long) => {
		console.log(mapData);
		var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(lat, long),
			level: 3,
		};

		var map = new kakao.maps.Map(container, options);
		var markerPosition = new kakao.maps.LatLng(lat, long);
		var marker = new kakao.maps.Marker(
			{
				position: markerPosition,
			},
			{
				position: markerPosition,
				text: '텍스트를 표시할 수 있어요!',
			},
		);
		marker.setMap(map);
	};

	return (
		<>
			<HeaderNav />
			<br />
			<div style={{ padding: '30px' }}>
				<Grid container spacing={0}>
					<Grid item xs={6}>
						<div style={mainDiv}>
							<Typography variant="h3" component="div" gutterBottom>
								{mapData}
							</Typography>
							<div
								id="map"
								style={{
									width: '100px',
									height: '100px',
								}}
							></div>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div style={mainDiv}>설명</div>
					</Grid>
				</Grid>
			</div>
		</>
	);
};

export default Map;

const mainDiv = {
	backgroundColor: '#fff',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	borderRadius: '20px',
	textAlign: 'center',
	float: 'center',
	padding: '30px',
	minHeight: '80vh',
	width: '90%',
};
