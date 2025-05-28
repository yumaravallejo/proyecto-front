"use client";

import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import React from "react";

export default function Dashboard() {
  
  return (
    <div className="items-center justify-items-center min-h-screen">
     <Header promocion={null} pagina="DASHBOARD" />
      
     <Footer />
    </div>
  );
}
