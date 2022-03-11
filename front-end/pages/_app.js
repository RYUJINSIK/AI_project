import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>마음의소리</title>
				<script
					type="text/javascript"
					src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}`}
				></script>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;


