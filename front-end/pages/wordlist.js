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
	const [wordList, setWordList] = useState([]);

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
		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/word/diff_list/${difficulty}`, {
				headers: {
					Authorization: `Bearer ${getCookie('access_token')}`,
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
				<Grid container spacing={5} style={{ paddingLeft: '20px' }}>
					{wordList.length &&
						wordList.map((data, index) => (
							<Grid item xs={3}>
								<Card
									style={{ width: '90%' }}
									onClick={() => {
										router.push({
											pathname: '/education_test',
											query: {
												video_id: data.id,
												video_name: data.video_name,
												video_kor: data.korean_name,
											},
										});
									}}
								>
									<CardActionArea style={{ backgroundColor: '#E2F1FF' }}>
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
												난이도 : {data.difficulty}
											</span>
											{/* <Typography gutterBottom variant="h5" component="div">
												{data.korean_name}
												<br />
												<span style={{ fontSize: '20px' }}>
													난이도 : {data.difficulty}
												</span>
												<span style={{ fontSize: '20px', marginLeft: '10px' }}>
													분류 : {data.category}
												</span>
											</Typography> */}
										</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
						))}
				</Grid>
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
	backgroundColor: '#C0FFDE',
	boxShadow: '0 5px 15px rgba(0,0,0,.1)',
	borderRadius: '20px',
};
