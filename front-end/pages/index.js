import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from '../components/HeaderNav';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const Main = () => {
	const router = useRouter();
	const goMainPage = () => {
		router.push('/main');
	};

	return (
		<>
			<div className="mainDiv">
				<HeaderNav />
				<Grid container spacing={5}>
					<Grid item xs={6} style={mainGrid}>
						<span
							style={{ fontSize: '50px', color: 'white', textAlign: 'right' }}
						>
							<span style={{ fontSize: '60px' }}>마음의 소리</span>
							<br />
							간단하지만 따뜻한 손의 인사
							<br />
							지금 당신의 마음의 소리를 들려주세요
							<Button
								variant="contained"
								style={{
									fontSize: '20px',
									width: '30%',
									height: '80px',
									marginTop: '20px',
									backgroundColor: '#FFF',
									borderRadius: '20px',
									color: 'black',
									fontSize: '30px',
									boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
								}}
								onClick={() => {
									router.push('/wordlist');
								}}
							>
								수화 배우러가기
							</Button>
						</span>
					</Grid>
					<Grid item xs={6} style={mainGrid}>
						<img src="images/main-infoimg.png" />
					</Grid>
				</Grid>
				<br />
				<br />
				<br />
				<br />
				<br />
				<div style={{ width: '100%', textAlign: 'center', fontSize: '30px' }}>
					💻 영상으로 배우는 쉬운 학습
					<br />
					<span style={{ fontSize: '20px' }}>
						청각장애인 / 의료진 / 주변사람들을 위한 수화 교육 서비스
						<br />
						응급상황에 필요한 신체 · 증상별 단어를 배워보세요
					</span>
				</div>
				<div style={flowDiv}>
					<div style={flowWrap}>
						<div style={flowTitle1}>학습 순서</div>
						<div className="container">
							<div className="box">
								<div className="icon">01</div>
								<div className="content">
									<h3>학습할 단어 선택 📝</h3>
									<p>
										난이도별로 나눠진 신체 · 증상 단어 30개중
										<br />
										학습하고싶은 단어를 선택하세요.
									</p>
								</div>
							</div>
							<div className="box">
								<div className="icon">02</div>
								<div className="content">
									<h3>수화 영상 학습 📚</h3>
									<p>
										주어지는 동영상을 보고 <br />
										수화 동작을 학습하세요
									</p>
								</div>
							</div>
							<div className="box">
								<div className="icon">03</div>
								<div className="content">
									<h3>수화 따라하기 🙋‍♂️</h3>
									<p>
										영상을 보고 학습한 수화동작을
										<br />
										따라하는 모습을 녹화하세요
									</p>
								</div>
							</div>
							<div className="box">
								<div className="icon">04</div>
								<div className="content">
									<h3>나의 수화 채점하기 💯</h3>
									<p>
										내가 따라한 동작이 정확한지
										<br />
										채점해서 확인해보세요
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div style={flowDiv}>
					<div style={flowWrap}>
						<div style={flowTitle2}>추가 서비스</div>
						<div className="container">
							<div className="box2">
								<div className="icon">01</div>
								<div className="content">
									<h3>점수에 따른 메달 🏆</h3>
									<p>
										채점 결과에 따라 메달이 주어집니다.
										<br />
										🥇 금메달을 모아보세요!
									</p>
								</div>
							</div>

							<div className="box2">
								<div className="icon">02</div>
								<div className="content">
									<h3>학습현황 확인 📑</h3>
									<p>
										마이페이지에서 최근 학습한 단어, 학습 진행률,
										<br />
										메달 보유 현황을 확인할 수 있습니다.
									</p>
								</div>
							</div>
							<div className="box2">
								<div className="icon">03</div>
								<div className="content">
									<h3>수화 센터 확인 🌍</h3>
									<p>
										현재 접속한 위치에서 제일 가까운 5군데의 <br />
										수화센터 위치를 확인할 수 있습니다
									</p>
								</div>
							</div>
							<div className="box2">
								<div className="icon">04</div>
								<div className="content">
									<h3>수화 퀴즈풀기 ✅</h3>
									<p>
										신체 · 증상으로 구분된 수화퀴즈를 풀어보고
										<br />
										배운내용을 복습해보세요 !
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Main;

const mainGrid = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '90vh',
};

const flowDiv = {
	margin: '0px',
	padding: '0px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '50vh',
};

const flowWrap = {
	backgroundColor: '#fff',
	padding: '20px',
	borderRadius: '20px',
	boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
};

const flowTitle1 = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
	fontSize: '25px',
	height: '50px',
	backgroundColor: '#FBDCFF',
	borderRadius: '20px',
	textAlign: 'center',
	boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
};
const flowTitle2 = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
	fontSize: '25px',
	height: '50px',
	backgroundColor: '#DECDFF',
	borderRadius: '20px',
	textAlign: 'center',
	boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
};
