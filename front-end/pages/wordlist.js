import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import axios from 'axios';

import { getCookie } from '../utils/cookie';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const WordList = () => {
	const router = useRouter();
	const [userName, setUserName] = useState(null);
	const [wordList, setWordList] = useState([]);

	useEffect(() => {
		console.log(localStorage.getItem('user'));
		setUserName(localStorage.getItem('user'));
		console.log(userName);

		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/video/list/`, {
				headers: {
					Authorization: `Bearer ${getCookie('access_token')}`,
				},
			})
			.then((response) => {
				console.log(response['data']);
				setWordList(response['data']);
				if (response['status'] === 200) {
					console.log('ok');
					console.log(wordList);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const selectDifficulty = (difficulty) => {
		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/video/diff_list/${difficulty}`, {
				headers: {
					Authorization: `Bearer ${getCookie('access_token')}`,
				},
			})
			.then((response) => {
				console.log(response);
				setWordList(response['data']);
				if (response['status'] === 200) {
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

			<div>
				<div style={MainDiv}>
					<Typography variant="h3" component="div" gutterBottom>
						교육할 단어 선택하기
					</Typography>
					<select
						style={{ float: 'right', display: 'inline-block' }}
						name="difficult"
						id="difficult"
						onChange={onChangeSelect}
					>
						<option value="">난이도선택📃</option>
						<option value="L">초급</option>
						<option value="M">중급</option>
						<option value="H">고급</option>
					</select>
					<br />
					<Grid container spacing={1} style={{ paddingLeft: '20px' }}>
						{wordList.length &&
							wordList.map((data, index) => (
								<Grid
									item
									xs={2}
									onClick={() => {
										router.push({
											pathname: '/education_test',
											query: {
												video_name: data.video_name,
												video_kor: data.korean_name,
											},
										});
									}}
								>
									<Card style={{ width: '90%' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="140"
												image="/images/example.png"
												alt=""
												key={index}
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													{data.korean_name}
													<br />
													<span style={{ fontSize: '20px' }}>
														난이도 : {data.difficulty}
													</span>
													<span
														style={{ fontSize: '20px', marginLeft: '10px' }}
													>
														분류 : {data.category}
													</span>
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							))}
					</Grid>
				</div>
			</div>
		</>
	);
};

export default WordList;

const MainDiv = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '80vh',
};
