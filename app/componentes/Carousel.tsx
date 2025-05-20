"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Botones personalizados
const NextArrow = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button
    onClick={props.onClick}
    title="Siguiente" 
    className="absolute right-[-3rem] top-1/2 transform -translate-y-1/2 z-10 bg-[var(--gris-oscuro)] text-white px-2 py-1 rounded cursor-pointer hover:bg-[var(--gris-medio)] transition-all duration-200 "
  >
    &#62;
  </button>
);

const PrevArrow = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button
    onClick={props.onClick}
    title="Anterior"
    className="absolute left-[-3rem] top-1/2 transform -translate-y-1/2 z-10 bg-[var(--gris-oscuro)] text-white px-2 py-1 rounded cursor-pointer hover:bg-[var(--gris-medio)] transition-all duration-200"
  >
    &#60;
  </button>
);

function CarouselNombres() {
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
      name: "RAFAEL SANTOS",
      text: "Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina...",
    },
    {
      name: "DANIEL CUEVAS",
      text: "Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina...",
    },
    {
      name: "ALEJANDRO BERNAL",
      text: "Gran sitio para entrenar. Tiene lo necesario para cualquier tipo de rutina...",
    },
  ];

  return (
    <div className="relative px-8">
      <Slider {...settings}>
        {slides.map((item, index) => (
          <div key={index} className="px-2">
            <div className="bg-dc p-4 rounded-lg">
              <h3 className="oswald font-bold grisosc text-xl mb-3">{item.name}</h3>
              <p className="inter text-justify">{item.text}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CarouselNombres;
