import React, { useEffect, useState } from 'react';
import './index.css'
import SearchBar from '../../components/SearchBar';
import Carousel from '../../components/Carousel'
import Card from '../../components/card';
import test1 from '../../img/test1.jpg'
import test3 from '../../img/test3.jpg'
import SubHeader from '../../components/SubHeader';
import BottomTab from '../../components/BottomTabs';
import { useAuthenticator } from '@aws-amplify/ui-react';

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

const Home = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navItems = ["Tous","Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];
    const { authStatus } = useAuthenticator(context => [context.authStatus]);
    useEffect(() => {
      console.log(authStatus)
    }, [authStatus])
 
  return (
    <main>
      <h1 className="header-title">laLecturejecontribue</h1>

      <SearchBar/>

      <Carousel datas={imgdata}/>

      <SubHeader activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>

      <div className="card-container">
        {imgdata.map((article, index) => (
          <Card key={index} article={article} />
        ))}
      </div>
      <BottomTab/>
    </main>
  );
};

export default Home;
