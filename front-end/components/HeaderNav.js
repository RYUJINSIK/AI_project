import React, { useState, useEffect } from 'react';
import { useRouter, Router } from 'next/router';

// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const pages = ['메뉴1', '메뉴2', '메뉴3'];

const HeaderForm = () => {
	const router = useRouter();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position="static"
				style={{ backgroundColor: '#00ff0000', paddingTop: '10px' }}
				elevation={0}
			>
				<Toolbar variant="dense">
					<Typography
						variant="h4"
						color="black"
						component="div"
						style={{ marginRight: '25px', cursor: 'pointer' }}
						onClick={() => {
							alert('click!');
						}}
					>
						<img
							src="/images/logo.png"
							style={{
								width: '30px',
								height: '30px',
								marginBottom: '-5px',
								marginRight: '5px',
							}}
						/>
						마음의소리
					</Typography>
					<Box sx={{ flexGrow: 1, display: 'flex' }}>
						{pages.map((page) => (
							<Button
								key={page}
								sx={{ my: 1, color: 'white', display: 'block' }}
								style={{ margin: '0px', color: 'black', fontSize: '20px' }}
							>
								{page}
							</Button>
						))}
					</Box>
					<Box sx={{ flexGrow: 0, display: 'flex', margin: '0px' }}>
						<Button
							key="마이페이지"
							sx={{ my: 2, color: 'white', display: 'block' }}
							style={{ margin: '0px', color: 'black', fontSize: '20px' }}
						>
							마이페이지
						</Button>
						<Button
							key="로그인/로그아웃"
							sx={{ my: 2, color: 'white', display: 'block' }}
							style={{ margin: '0px', color: 'black', fontSize: '20px' }}
						>
							로그인 / 로그아웃
						</Button>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default HeaderForm;
