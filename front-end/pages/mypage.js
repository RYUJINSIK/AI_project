import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';
import axios from 'axios';
import { getCookie } from '../utils/cookie';

import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 60,
    borderRadius: 5,
    border: '1px solid gray',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#C1E1FF' : '#308fe8',
    },
}));

const MyPage = () => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [dialog, setDialog] = useState(false);
    const [userName, setUserName] = useState(null);
    const [learningData, setLearningData] = useState([]);
    const [medalCount, setMedalCount] = useState({
        bronze: 0,
        silver: 0,
        gold: 0,
    });

	useEffect(() => {
		setUserName(localStorage.getItem('user'));
		axios
			.get(`${process.env.NEXT_PUBLIC_URL}/user/mypage/`, {
				headers: {
					Authorization: `Bearer ${getCookie('access')}`,
				},
			})
			.then((response) => {
				console.log(response);
				if (response['status'] === 200) {
					console.log(response['data']);
					setMedalCount({
						...medalCount,
						bronze: response['data']['bronze'],
						silver: response['data']['silver'],
						gold: response['data']['gold'],
					});
					setProgress(
						Math.ceil((response['data']['learning_rate'] / 30) * 100),
					);
					setLearningData(response['data']['recent_learning']);
				}
				if (response['status'] === 204) {
					console.log('기록없음');
					setDialog(true);
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
			<br />
			<div style={mainDiv}>
				<div style={userInfoDiv}>
					<Grid container spacing={0}>
						<Grid item xs={3}>
							<div style={medalDiv}>
								<table>
									<tbody>
										<tr>
											<td colspan="3">
												<Chip
													label={`${
														userName !== null
															? userName.replace(/\"/gi, '')
															: ''
													}님 보유 메달`}
													style={medalTitle}
												/>
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
												<Chip
													label={`${medalCount.gold}개`}
													style={medalText}
												/>
											</td>
											<td>
												<Chip
													label={`${medalCount.silver}개`}
													style={medalText}
												/>
											</td>
											<td>
												<Chip
													label={`${medalCount.bronze}개`}
													style={medalText}
												/>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</Grid>
						<Grid item xs={9}>
							<div style={progressDiv}>
								<Typography variant="h5" component="div" gutterBottom>
									학습진행률 : {progress}%
								</Typography>
								<BorderLinearProgress variant="determinate" value={progress} />
							</div>
						</Grid>
					</Grid>
				</div>
				<br />
				<br />
				<div style={cardDiv}>
					<Typography variant="h4" component="div" gutterBottom>
						최근 학습한 단어
					</Typography>
					<Grid container spacing={1}>
						{learningData.length === 0 ? (
							<></>
						) : (
							learningData.map((data, index) => (
								<Grid item xs={2}>
									<Card style={{ width: '90%', backgroundColor: '#F5EFFF' }}>
										<CardActionArea>
											<CardMedia
												component="img"
												height="180"
												image={`${process.env.NEXT_PUBLIC_STATIC_URL}/${data[3]}`}
												alt={data[2]}
												key={index}
												onClick={() => {
													router.push({
														pathname: '/education_test',
														query: {
															video_id: data[0],
															video_name: data[1],
															video_kor: data[2],
															difficulty: data[4],
														},
													});
												}}
											/>
											<CardContent>
												<span style={wordTitle}>{data[2]}</span>
												<span style={wordDifficulty}>
													점수 : {data[6]}
													&nbsp; 메달 :{data[5] === 'gold' && <span>🥇</span>}
													{data[5] === 'silver' && <span>🥈</span>}
													{data[5] === 'bronze' && <span>🥉</span>}
												</span>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							))
						)}
					</Grid>
				</div>
			</div>

			<Dialog
				open={dialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent style={{ fontSize: '30px', textAlign: 'center' }}>
					학습기록이 없습니다. 학습을 먼저 진행해주세요.
					<Button
						variant="contained"
						style={{
							fontSize: '20px',
							backgroundColor: '#C1E1FF',
							color: 'black',
						}}
						onClick={() => {
							router.push('/wordlist');
						}}
					>
						수화 배우러가기
					</Button>
				</DialogContent>
			</Dialog>
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

const userInfoDiv = {
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0,0,0,.1)',
    width: '100%',
    borderRadius: '20px',
    // border: '1px solid gray',
};

const cardDiv = {
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0,0,0,.1)',
    width: '100%',
    borderRadius: '20px',
};

const progressDiv = {
    // backgroundColor: '#DADADA',
    // boxShadow: '3px 3px 3px 0px black',
    padding: '30px 50px 30px 0px',
    height: '140px',
    borderRadius: '20px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right',
};
const medalDiv = {
    // marginLeft: '20px',
    // backgroundColor: '#DADADA',
    // boxShadow: '3px 3px 3px 0px black',
    // width: '300px',
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
    boxShadow: '0 5px 15px rgba(0,0,0,.1)',
    marginBottom: '20px',
    fontSize: '20px',
};

const medalText = {
    backgroundColor: '#C1E3FF',
    boxShadow: '0 5px 15px rgba(0,0,0,.1)',
    marginTop: '5px',
    fontSize: '18px',
};

const medalSize = {
    width: '65px',
    height: '65px',
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
