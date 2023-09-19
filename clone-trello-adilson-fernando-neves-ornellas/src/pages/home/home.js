import React from 'react';

import './home.scss';

import Header from '../home/components/header/header'
import Main from '../home/components/main/main'
import Footer from '../home/components/footer/footer'

function Home () {
    return ( 
       <>
        <Header/> 
        <Main/>
        <Footer/>
       </>
    );
};
export default Home;
