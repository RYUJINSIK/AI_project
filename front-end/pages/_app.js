import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>마음의소리</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
