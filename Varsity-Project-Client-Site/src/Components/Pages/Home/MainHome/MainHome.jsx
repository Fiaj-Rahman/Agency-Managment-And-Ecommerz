import React from "react";
import Home_Banner from "../Home_Banner/Home_Banner";
import Services from "../Home_Components/Services";
import WhyChooseUs from "../Home_Components/WhyChooseUs";
import ContactSection from "../Home_Components/ContactSection";

const MainHome = () =>{
    return(
        <div className="mt-20">
           <Home_Banner></Home_Banner>
           <Services></Services>
           <WhyChooseUs></WhyChooseUs>
           <ContactSection></ContactSection>
        </div>
    )
}

export default MainHome;