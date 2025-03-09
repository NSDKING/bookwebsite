import React, { useState } from 'react';
import './index.css'
import SubHeader from '../../components/SubHeader';
import test1 from '../../img/test1.jpg'
import test2 from '../../img/test2.jpg'
import test3 from '../../img/test3.jpg'
import Card from '../../components/card';
import BottomTab from '../../components/BottomTabs';

const images = [test1, test3]

const imgdata = [
  {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    image:test1,
    author:"jon atajunior",
    date: "2024/12/20",
    type:"Actualité",
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    image:test3,
    author:"jon atajunior",
    date: "2024/12/20",
    type:"Nouveauté",

  },

]
 
 
const Discovery = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navItems = ["Tous","Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];
   
 
  return (
    <main className='discovery-page'>

      <SubHeader activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>
  
        <div className="card-container">
          {imgdata.map((article, index) => (
            <Card key={index} article={article} />
          ))}
        </div>
        <div className="card-container">
          {imgdata.map((article, index) => (
            <Card key={index} article={article} />
          ))}
        </div>
        <div className="card-container">
          {imgdata.map((article, index) => (
            <Card key={index} article={article} />
          ))}
        </div>
        <BottomTab/>
    </main>
  );
};

export default Discovery;
