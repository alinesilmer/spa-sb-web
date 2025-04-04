import React from 'react'
import '../styles/video.css'

const Video = ({
  videoSrc,
  children,
  className = "video-wrapper"
}) => {
  return (
    <div className={className}>
      <video className="video" autoPlay={true} muted={true} loop={true} controls={false}>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {children && (
        <div className="overlay-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Video;
