import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

const RecordView = () => (
	<div>
		<ReactMediaRecorder
			video
			render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
				<div>
					<p>{status}</p>
					<button onClick={startRecording}>Start Recording</button>
					<button onClick={stopRecording}>Stop Recording</button>
					<video src={mediaBlobUrl} controls autoPlay loop />
					<p>{mediaBlobUrl}</p>
				</div>
			)}
		/>
	</div>
);

export default RecordView;
