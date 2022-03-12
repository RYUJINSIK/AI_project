import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import axios from 'axios';

import Cookie, { setCookie, getCookie, removeCookie } from '../utils/cookie';
import jwt_decode from 'jwt-decode';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const WordList = () => {
	const router = useRouter();
	const [wordList, setWordList] = useState([]);

	let url = '';

	useEffect(() => {
		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/word/list/`, {
				headers: {
					Authorization: `Bearer ${getCookie('access')}`,
				},
			})
			.then((response) => {
				if (response['status'] === 200) {
					console.log(response['data']);
					setWordList(response['data']);
					console.log('ok');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const selectDifficulty = (difficulty) => {
		if (difficulty === 'All') {
			url = `${process.env.NEXT_PUBLIC_URL}/word/list/`;
		} else {
			url = `${process.env.NEXT_PUBLIC_URL}/word/diff_list/${difficulty}`;
		}
		axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${getCookie('access')}`,
				},
			})
			.then((response) => {
				if (response['status'] === 200) {
					console.log(response);
					setWordList(response['data']);
					console.log('diff');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onChangeSelect = (e) => {
		selectDifficulty(e.target.value);
	};

	return (
		<>
			<HeaderNav />
			<br />

			<div style={mainDiv}>
				<div style={cardDiv}>
					<br />
					<Typography
						variant="h4"
						component="div"
						gutterBottom
						style={{ paddingRight: '50px' }}
					>
						&nbsp;&nbsp;&nbsp;학습할 단어 선택하기
						<select
							style={{
								float: 'right',
								display: 'inline-block',
								textAlign: 'left',
								paddingLeft: '20px',
							}}
							name="difficult"
							id="difficult"
							onChange={onChangeSelect}
						>
							<option value="All">난이도선택📃</option>
							<option value="L">초급 ⭐</option>
							<option value="M">중급 ⭐⭐</option>
							<option value="H">고급 ⭐⭐⭐</option>
						</select>
					</Typography>
					<Grid container spacing={3} style={{ paddingLeft: '20px' }}>
						{wordList.length &&
							wordList.map((data, index) => (
								<Grid item xs={3}>
									<Card
										style={{
											width: '90%',
											boxShadow: '0 5px 15px rgba(0,0,0,.3)',
										}}
										onClick={() => {
											router.push({
												pathname: '/education_test',
												query: {
													video_id: data.id,
													video_name: data.video_name,
													video_kor: data.korean_name,
													difficulty: data.difficulty,
												},
											});
										}}
									>
										<CardActionArea style={{ backgroundColor: '#F5EFFF' }}>
											<CardMedia
												component="img"
												height="180"
												image={`${process.env.NEXT_PUBLIC_URL}${data.image_url}`}
												alt=""
												key={index}
											/>
											<CardContent>
												<span style={wordTitle}>{data.korean_name}</span>
												<span style={wordDifficulty}>
													난이도
													{data.difficulty === 'L' && <span>⭐</span>}
													{data.difficulty === 'M' && <span>⭐⭐</span>}
													{data.difficulty === 'H' && <span>⭐⭐⭐</span>}
												</span>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							))}
					</Grid>
					<br />
				</div>
			</div>
		</>
	);
};

export default WordList;

const mainDiv = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '80vh',
	padding: '20px',
};
const titleDiv = {
	width: '100%',
	backgroundColor: '#fff',
	borderRadius: '20px',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	padding: '10px',
};

const cardDiv = {
	backgroundColor: '#fff',
	borderRadius: '20px',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	padding: '10px',
};

const wordTitle = {
	fontSize: '20px',
	float: 'left',
	paddingLeft: '10px',
	paddingRight: '10px',
	marginBottom: '15px',
	backgroundColor: '#B5D5FF',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	borderRadius: '20px',
};

const wordDifficulty = {
	fontSize: '20px',
	float: 'right',
	paddingLeft: '10px',
	paddingRight: '10px',
	marginBottom: '5px',
	backgroundColor: '#fff',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	borderRadius: '20px',
};
