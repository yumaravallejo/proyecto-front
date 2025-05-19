"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Botones personalizados
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black text-white px-2 py-1 rounded"
  >
    &#62;
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black text-white px-2 py-1 rounded"
  >
    &#60;
  </button>
);

export default function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Para pantallas más pequeñas
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const slides = [
    {
      name: "JAVIER SASTRE",
      text: "Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina...",
    },
    {
      name: "SUSANA VALLEJO",
      text: "Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina...",
    },
    {
      name: "RAFAEL DÍAZ",
      text: "Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina...",
    },
  ];

  return (
    <div className="relative px-8">
      <Slider {...settings}>
        {slides.map((item, index) => (
          <div key={index} className="bg-dc p-5 rounded-lg m-2">
            <h3 className="oswald font-bold grisosc text-xl mb-3">{item.name}</h3>
            <p className="inter text-justify">{item.text}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}
