"use Client";

import { JSX } from "react";

type Props = {
  videoUrl: string;
  texto: JSX.Element | null;
};

export default function Video(props: Props) {
  return (
      <div className="div-video relative">
        <video
          src={props.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="video brightness-[0.45]"
        />
        <div className="absolute">
            {props.texto}
        </div>
      </div>
  );

}
