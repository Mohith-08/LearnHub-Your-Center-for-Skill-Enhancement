
import React from 'react';

interface VideoPlayerProps {
    videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    return (
        <div className="bg-black rounded-lg shadow-lg overflow-hidden">
            <video
                key={videoUrl}
                className="w-full aspect-video"
                controls
                autoPlay
            >
                {/* The video URL is a placeholder, as actual video upload is mocked */}
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
