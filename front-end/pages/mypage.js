import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';

import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
const drawerWidth = 240;

const MyPage = () => {
	const router = useRouter();

	return (
		<>
			<HeaderNav />
			<br />
			<div style={mainDiv}>
				<div style={medalDiv}>
					<table>
						<tr>
							<td colspan="3">
								<Chip label="ㅇㅇㅇ님 보유 메달" style={medalTitle} />
							</td>
						</tr>
						<tr>
							<td>
								<img src="/images/gold-medal.png" style={medalSize} />
							</td>
							<td>
								<img src="/images/silver-medal.png" style={medalSize} />
							</td>
							<td>
								<img src="/images/bronze-medal.png" style={medalSize} />
							</td>
						</tr>
						<tr>
							<td>
								<Chip label="5개" style={medalText} />
							</td>
							<td>
								<Chip label="3개" style={medalText} />
							</td>
							<td>
								<Chip label="1개" style={medalText} />
							</td>
						</tr>
					</table>
				</div>

				<div style={gradeDiv}>
					<table>
						<tr>
							<td colspan="3">
								<Chip
									label="교육 등급"
									style={{
										backgroundColor: '#FBFFDA',
										boxShadow: '3px 3px 3px 0px black',
										marginBottom: '20px',
										fontSize: '20px',
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<img
									src="/images/gold-medal.png"
									style={{
										width: '80px',
										height: '80px',
									}}
								/>
							</td>
							<td>
								<img
									src="/images/silver-medal.png"
									style={{
										width: '80px',
										height: '80px',
									}}
								/>
							</td>
							<td>
								<img
									src="/images/bronze-medal.png"
									style={{
										width: '80px',
										height: '80px',
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<Chip
									label="5개"
									style={{
										backgroundColor: '#C1E3FF',
										boxShadow: '3px 3px 3px 0px black',
										marginTop: '10px',
										fontSize: '20px',
									}}
								/>
							</td>
							<td>
								<Chip
									label="3개"
									style={{
										backgroundColor: '#C1E3FF',
										boxShadow: '3px 3px 3px 0px black',
										marginTop: '10px',
										fontSize: '20px',
									}}
								/>
							</td>
							<td>
								<Chip
									label="1개"
									style={{
										backgroundColor: '#C1E3FF',
										boxShadow: '3px 3px 3px 0px black',
										marginTop: '10px',
										fontSize: '20px',
									}}
								/>
							</td>
						</tr>
						<tr>
							<td colspan="3">등급설명</td>
						</tr>
					</table>
				</div>
			</div>
		</>
	);
};

export default MyPage;
const mainDiv = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	paddingLeft: '50px',
	paddingRight: '50px',
};
const medalDiv = {
	marginLeft: '20px',
	// backgroundColor: '#DADADA',
	// boxShadow: '3px 3px 3px 0px black',
	width: '300px',
	height: '200px',
	borderRadius: '20px',
	textAlign: 'center',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
};

const medalTitle = {
	backgroundColor: '#FBFFDA',
	boxShadow: '3px 3px 3px 0px black',
	marginBottom: '20px',
	fontSize: '20px',
};

const medalText = {
	backgroundColor: '#C1E3FF',
	boxShadow: '3px 3px 3px 0px black',
	marginTop: '5px',
	fontSize: '15px',
};

const medalSize = {
	width: '60px',
	height: '60px',
};

const gradeDiv = {
	marginLeft: '20px',
	// backgroundColor: '#DADADA',
	// boxShadow: '3px 3px 3px 0px black',
	width: '500px',
	height: '200px',
	borderRadius: '20px',
	textAlign: 'center',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
};
