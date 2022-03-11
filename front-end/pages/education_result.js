import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import axios from 'axios';
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
									<div style={ScoreContent}>류진식</div>
								</div>
								<div style={ScoreBoardLine}>
									<div style={ScoreTitle}>교육단어</div>
									<div style={ScoreContent}>목</div>
								</div>
								<div style={ScoreBoardLine}>
									<div style={ScoreTitle}>난이도</div>
									<div style={ScoreContent}>중급</div>
								</div>
								<br />
								<br />
								<div>
									<span style={{ fontSize: '40px' }}>점수 :</span>
									<span style={Score}>
										<RoughNotation type="underline" show="true" strokeWidth="3">
											100
										</RoughNotation>{' '}
									</span>
									<span style={{ fontSize: '40px', marginLeft: '10px' }}>
										획득메달 :
									</span>

									<img
										src="/images/gold-medal.png"
										style={{
											width: '40px',
											height: '40px',
										}}
									/>
									<br />
									<br />
									<Button
										variant="contained"
										style={{ backgroundColor: '#FFB494' }}
									>
										<span style={{ fontSize: '20px' }}>단어카드 등록하기</span>
									</Button>
									<Button
										variant="contained"
										style={{ backgroundColor: '#86BEFF', marginLeft: '20px' }}
									>
										<span style={{ fontSize: '20px' }}>
											마이페이지 이동하기
										</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</Grid>
				<Grid item xs={7}>
					<div>
						<div style={MainDiv}>
							<Typography variant="h3" component="div" gutterBottom>
								다른단어 배우러 가기
							</Typography>
							<Grid container spacing={0}>
								<Grid item xs={4}>
									<Card style={{ width: '90%' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="140"
												image="/images/example.png"
												alt="green iguana"
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													안녕하세요
													<br />
													<span style={{ fontSize: '20px' }}>점수 : 100</span>
													<span
														style={{ fontSize: '20px', marginLeft: '10px' }}
													>
														획득메달 :
													</span>
													<img
														src="/images/gold-medal.png"
														style={{
															width: '20px',
															height: '20px',
														}}
													/>
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
								<Grid item xs={4}>
									<Card style={{ width: '90%' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="140"
												image="/images/example.png"
												alt="green iguana"
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													안녕하세요
													<br />
													<span style={{ fontSize: '20px' }}>점수 : 100</span>
													<span
														style={{ fontSize: '20px', marginLeft: '10px' }}
													>
														획득메달 :
													</span>
													<img
														src="/images/gold-medal.png"
														style={{
															width: '20px',
															height: '20px',
														}}
													/>
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
								<Grid item xs={4}>
									<Card style={{ width: '90%' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="140"
												image="/images/example.png"
												alt="green iguana"
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													안녕하세요
													<br />
													<span style={{ fontSize: '20px' }}>점수 : 100</span>
													<span
														style={{ fontSize: '20px', marginLeft: '10px' }}
													>
														획득메달 :
													</span>
													<img
														src="/images/gold-medal.png"
														style={{
															width: '20px',
															height: '20px',
														}}
													/>
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							</Grid>
							<br />
							<Grid container spacing={0}>
								<Grid item xs={4}>
									<Card style={{ width: '90%' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="140"
												image="/images/example.png"
												alt="green iguana"
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													안녕하세요
													<br />
													<span style={{ fontSize: '20px' }}>점수 : 100</span>
													<span
														style={{ fontSize: '20px', marginLeft: '10px' }}
													>
														획득메달 :
													</span>
													<img
														src="/images/gold-medal.png"
														style={{
															width: '20px',
															height: '20px',
														}}
													/>
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
								<Grid item xs={4}>
									<Card style={{ width: '90%' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="140"
												image="/images/example.png"
												alt="green iguana"
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													안녕하세요
													<br />
													<span style={{ fontSize: '20px' }}>점수 : 100</span>
													<span
														style={{ fontSize: '20px', marginLeft: '10px' }}
													>
														획득메달 :
													</span>
													<img
														src="/images/gold-medal.png"
														style={{
															width: '20px',
															height: '20px',
														}}
													/>
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
								<Grid item xs={4}>
									<Card style={{ width: '90%' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="140"
												image="/images/example.png"
												alt="green iguana"
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													안녕하세요
													<br />
													<span style={{ fontSize: '20px' }}>점수 : 100</span>
													<span
														style={{ fontSize: '20px', marginLeft: '10px' }}
													>
														획득메달 :
													</span>
													<img
														src="/images/gold-medal.png"
														style={{
															width: '20px',
															height: '20px',
														}}
													/>
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
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
