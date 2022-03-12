import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import axios from 'axios';
import Cookie, { setCookie, getCookie, removeCookie } from '../utils/cookie';
import jwt_decode from 'jwt-decode';
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const EducataionResult = () => {
	const router = useRouter();
	const [userName, setUserName] = useState(null);
	const [wordList, setWordList] = useState([]);

	useEffect(() => {
		setUserName(localStorage.getItem('user'));

		axios
			.get(
				`${process.env.NEXT_PUBLIC_URL}/word/random_list/${router.query.video_id}`,
				{
					headers: {
						Authorization: `Bearer ${getCookie('access')}`,
					},
				},
			)
			.then((response) => {
				console.log(response);
				if (response['status'] === 200) {
					console.log(response['data']);
					setWordList(response['data']);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<>
			<HeaderNav />
			<br />
			<Grid container spacing={0}>
				<Grid item xs={5}>
					<div>
						<div style={MainDiv}>
							<div style={ScoreBoard}>
								<Typography variant="h3" component="div" gutterBottom>
									성적표
								</Typography>
								<br />
								<div style={ScoreBoardLine}>
									<div style={ScoreTitle}>이름</div>
									<div style={ScoreContent}>
										{userName !== null ? userName.replace(/\"/gi, '') : ''}
									</div>
								</div>
								<div style={ScoreBoardLine}>
									<div style={ScoreTitle}>학습단어</div>
									<div style={ScoreContent}>{router.query.video_kor}</div>
								</div>
								<div style={ScoreBoardLine}>
									<div style={ScoreTitle}>난이도</div>
									<div style={ScoreContent}>
										{router.query.difficulty === 'L' && <span>⭐</span>}
										{router.query.difficulty === 'M' && <span>⭐⭐</span>}
										{router.query.difficulty === 'H' && <span>⭐⭐⭐</span>}
									</div>
								</div>
								<br />
								<br />
								<div>
									<span style={{ fontSize: '40px' }}>점수 :</span>
									<span style={Score}>
										<RoughNotation type="underline" show="true" strokeWidth="3">
											{router.query.score}
										</RoughNotation>{' '}
									</span>
									<span style={{ fontSize: '40px', marginLeft: '10px' }}>
										획득메달 :{router.query.medal === 'gold' && <span>🥇</span>}
										{router.query.medal === 'silver' && <span>🥈</span>}
										{router.query.medal === 'bronze' && <span>🥉</span>}
									</span>
									<br />
									<br />
									<div style={{ textAlign: 'center' }}>
										<Button
											variant="contained"
											style={{ backgroundColor: '#86BEFF', fontSize: '25px' }}
											onClick={() => {
												router.push('/mypage');
											}}
										>
											마이페이지 이동하기
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Grid>
				<Grid item xs={7}>
					<div>
						<div style={MainDiv}>
							<Typography variant="h3" component="div" gutterBottom>
								이 단어도 공부해볼까요 ?
							</Typography>
							<Grid container spacing={2}>
								{wordList.length &&
									wordList.map((data, index) => (
										<Grid item xs={4}>
											<Card
												style={{ width: '90%' }}
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
						</div>
					</div>
				</Grid>
			</Grid>
		</>
	);
};

export default EducataionResult;

const MainDiv = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '80vh',
};

const ScoreBoard = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '80vh',
	minWidth: '60vh',
	backgroundColor: 'white',
	border: '1px solid black',
	boxShadow: '5px 5px 5px 0px gray',
};

const ScoreBoardLine = {
	width: '90%',
	borderBottom: '3px solid gray',
	marginTop: '30px',
};

const ScoreTitle = {
	width: '35%',
	float: 'left',
	fontSize: '30px',
};

const ScoreContent = {
	display: 'flex',
	float: 'left',
	fontSize: '30px',
	display: 'inline-block',
};

const Score = {
	fontSize: '50px',
	color: 'red',
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
