/* global kakao */
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { getCookie } from '../utils/cookie';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Map = () => {
	const router = useRouter();
	const [mapList, setMapList] = useState([]);
	const [selectNum, setSelectNum] = useState(0);

	useEffect(() => {
		// 사용자 위도 경도 얻어서 getMapData 호출
		let lat, long;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					lat = position.coords.latitude;
					long = position.coords.longitude;
					getMapData();
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

		const getMapData = () => {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_URL}/signcenter/search/${lat}/${long}`,
					{
						headers: {
							Authorization: `Bearer ${getCookie('access')}`,
						},
					},
				)
				.then((response) => {
					if (response['status'] === 200) {
						setMapList(response['data']);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		};
	}, []);

	useEffect(() => {
		if (mapList.length > 0) {
			drawMap(mapList[0].lat, mapList[0].lng);
		}
	}, [mapList]);

	const drawMap = (lat, long) => {
		var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(lat, long),
			level: 3,
		};

		var map = new kakao.maps.Map(container, options);
		var markerPosition = new kakao.maps.LatLng(lat, long);
		var marker = new kakao.maps.Marker({
			position: markerPosition,
		});
		marker.setMap(map);
	};
	const [expanded, setExpanded] = useState('panel0');

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<>
			<HeaderNav />
			<br />
			<div style={{ padding: '30px' }}>
				{mapList.length > 0 ? (
					<Grid container spacing={0}>
						<Grid item xs={6}>
							<div style={mainDiv}>
								<Typography variant="h3" component="div" gutterBottom>
									{mapList[selectNum].center_name}
								</Typography>
								<div
									id="map"
									style={{
										border: '3px solid gray',
										width: '80vh',
										height: '60vh',
									}}
								></div>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div style={mainDiv}>
								<Alert
									severity="info"
									style={{ width: '90%', textAlign: 'left', fontSize: '20px' }}
								>
									현재 사용자 위치에서 제일 가까운 5곳의 수화센터 정보입니다.
								</Alert>
								<br />
								{mapList.map((data, index) => (
									<Accordion
										expanded={expanded === `panel${index}`}
										onChange={handleChange(`panel${index}`)}
										style={{ width: '95%' }}
										onClick={() => {
											setSelectNum(index);
											drawMap(data.lat, data.lng);
										}}
									>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls="panel1a-content"
											id="panel1a-header"
										>
											<Typography variant="h5" component="div" gutterBottom>
												{data.center_name}
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<table className="mapTable">
												<tbody>
													<tr>
														<th>주소 :</th>
														<td>{data.location}</td>
													</tr>
													<tr>
														<th>전화번호 :</th>
														<td>{data.phone_num}</td>
													</tr>
													<tr>
														<th>영상전화번호 :</th>
														<td>{data.video_phone_num}</td>
													</tr>
												</tbody>
											</table>
										</AccordionDetails>
									</Accordion>
								))}
							</div>
						</Grid>
					</Grid>
				) : (
					<></>
				)}
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
	minHeight: '75vh',
	width: '90%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
};
