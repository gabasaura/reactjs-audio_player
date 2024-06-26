import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";

const MP3Player = () => {
    const songRef = useRef();
    const [music, setMusic] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // FETCH AUDIOS
    useEffect(() => {
        songList();
    }, []);

    const songList = async () => {
        try {
            const resp = await fetch('https://playground.4geeks.com/sound/songs');
            const data = await resp.json();
            setMusic(data.songs || []);
            if (data.songs && data.songs.length > 0) {
                setCurrentSong(data.songs[0]); // carga 1 por default
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleCurrentSong = (mp3) => {
        setCurrentSong(mp3);
        setIsPlaying(true);
    };

    // CONTROLS
    const getIndex = () => {
        return music.findIndex((mp3) => mp3.id === currentSong.id);
    };

    useEffect(() => {
        if (currentSong) {
            songRef.current.src = "https://playground.4geeks.com" + currentSong.url;
            isPlaying ? songRef.current.play() : songRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleGoBack = () => {
        const currentIndex = getIndex();
        const newIndex = (currentIndex - 1 + music.length) % music.length; // Loop back to the end if at the beginning
        setCurrentSong(music[newIndex]);
        setIsPlaying(true);
    };

    const handleGoFF = () => {
        const currentIndex = getIndex();
        const newIndex = (currentIndex + 1) % music.length; // Loop back to the start if at the end
        setCurrentSong(music[newIndex]);
        setIsPlaying(true);
    };

    return (
        <div>
            {/* TITLE */}
            <div className="d-flex justify-content-center mx-5">
                <div className="d-row w-75 bg-dark text-white border-light border">
                    <div className="m-0 p-0">
                        <div className="text-center p-4">
                            <h1 className="title">Play Like Spotify</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* SONG LIST */}
            <div className="d-flex justify-content-center mx-5">
                <div className="p-bottom d-row w-75 bg-dark text-white border-light border mx-5">
                    <div className="m-0">
                        <div className="list-group list-group-flush">
                            {music.map((mp3, index) => (
                                <a
                                    href="#"
                                    className={`list-group-item border-light bg-dark text-light playlist-btn ${currentSong && mp3.url === currentSong.url && isPlaying ? "active" : ""}`}
                                    key={index}
                                    onClick={() => handleCurrentSong(mp3)}
                                >
                                    <span className="px-3">{mp3.id}</span>
                                    <span>{mp3.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <audio controls hidden ref={songRef} />

            {/* NAVBAR FOOTER FIXED */}
            <div className="w-100 fixed-bottom">
                <div className="bg-dark text-white border-light border p-4 justify-content-center d-flex">
                    <div className="text-light goBtn" onClick={handleGoBack}>
                        <FaStepBackward />
                    </div>
                    <div className="bg-light rounded-5 mx-4 text-dark" onClick={handlePlayPause}>
                        {isPlaying ? <FaPause className="btnPlayer" /> : <FaPlay className="btnPlayer" />}
                    </div>
                    <div className="text-light goBtn" onClick={handleGoFF}>
                        <FaStepForward />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MP3Player;