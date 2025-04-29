import React from "react";
import Home_Banner from "../Home_Banner/Home_Banner";
import Services from "../Home_Components/Services";
import WhyChooseUs from "../Home_Components/WhyChooseUs";
import ContactSection from "../Home_Components/ContactSection";
import Vehicle_Section from "../Home_Components/Vehicle_Section";
import Hotel_Section from "../Home_Components/Hotel_Section";
import Travel_Package_Section from "../Home_Components/Travel_Package_Section";
import Product_Section from "../Home_Components/Product_Section";

const MainHome = () =>{
    return(
        <div className="mt-20">
           <Home_Banner></Home_Banner>
           <Services></Services>
           <WhyChooseUs></WhyChooseUs>
           <Vehicle_Section></Vehicle_Section>
           <Hotel_Section></Hotel_Section>
           <Travel_Package_Section></Travel_Package_Section>
           <Product_Section></Product_Section>
           <ContactSection></ContactSection>
        </div>
    )
}

export default MainHome;