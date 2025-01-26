import { Howl, Howler } from "howler";
import { atom, useAtom } from "jotai";
import { act, useEffect } from "react";

export const playAudio = atom({
  bubbleShoot: 0,
  bubblePop: 0,
  ambientSong: false,
});

export const Audio = () => {
  const [audioState, setAudioState] = useAtom(playAudio);

  const ambientSong = new Howl({
    src: ["./audio/music/house-8.mp3"],
    volume: 0.5,
    loop: true,
  });
  const playAmbientSong = (active) => {
    active ? ambientSong.play() : ambientSong.pause();
  };

  const playBubbleShoot = () => {
    const audio = new Howl({ src: ["./audio/bubble-shoot.mp3"], volume: 1 });
    audio.play();
  };

  const playBubblePop = () => {
    const audio = new Howl({ src: ["./audio/bubble-pop.mp3"], volume: 1 });
    audio.play();
  };

  useEffect(() => {
    playBubbleShoot();
  }, [audioState.bubbleShoot]);

  useEffect(() => {
    playBubblePop();
  }, [audioState.bubblePop]);

  useEffect(() => {
    console.log(audioState.ambientSong);

    playAmbientSong(audioState.song);
  }, [audioState.ambientSong]);

  return <></>;
};
