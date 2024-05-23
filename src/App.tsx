import './App.css'
import axios from "axios";
import { FC, useEffect, useState, useRef } from "react";
import { MonsterRef } from "./Interfaces/MonsterRef";
import MonsterCard from "./MonsterCard";
import { Monster } from "./Interfaces/Monster";
import { useInView } from 'react-intersection-observer';

interface AppProps {
  title: string;
}

const App: FC<AppProps> = ({ title }) => {

  useEffect(() => {
    getMonsters();
  });
  
  const { ref: myRef, inView: elementVisible } = useInView();
  const { ref: battleRef, inView: battleVisible } = useInView();


  const getMonsters = () => {
      axios({
        method: 'GET',
        url: 'https://www.dnd5eapi.co/api/monsters'
      }).then((response) => {
        setAllMonsters(response.data.results);
      })
    }

  const [currentMonster1, setCurrentMonster1] = useState<Monster | undefined>();
  const [currentMonster2, setCurrentMonster2] = useState<Monster | undefined>();
  const [allMonsters, setAllMonsters] = useState<MonsterRef[]>([]);

  const setHelper = (event: any, monstNum: number) => {
    for(let monst of allMonsters){
      if(event===monst.index){
        axios({
          method: 'GET',
          url: `https://www.dnd5eapi.co${monst.url}`
        }).then((response) => {
          monstNum===1 ? setCurrentMonster1(response?.data) : setCurrentMonster2(response?.data);          
        })
      }
      }
    }

  const resolveFight = () => {
    console.log(currentMonster1);
    console.log(currentMonster2);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {title}
        </p>
      </header>
      <body className='App-body'>
        <div className='title'>Are</div>
        <div className='title'>You</div>
        <div ref={myRef} className='title'>{ elementVisible ? 'Ready' : 'or not' }</div>
        <div className='title'>To</div>
        <div ref={battleRef} className='title'>
          <span className={`battle ${battleVisible ? 'animateBattle' : ''}`}>Battle</span>
        </div>
        <div className='flex-grid'>
          <div className='col'>
            <MonsterCard monster={currentMonster1}/>
            <select className='fighter-select' onChange={e => setHelper(e.target.value, 1)}>
              <option defaultValue="">???????</option>
              {allMonsters.map((monster) => {
                return(
                  <option>{monster.index}</option>
                )
              })}
            </select>
          </div>
          <div className='col'>
            <h1 className='versus'>VS</h1>
          </div>
          <div className='col'>
            <MonsterCard monster={currentMonster2}/>
            <select className='fighter-select' onChange={e => setHelper(e.target.value, 2)}>
              <option defaultValue="">???????</option>
              {allMonsters.map((monster) => {
                return(
                  <option>{monster.index}</option>
                )
              })}
            </select>
          </div>
        </div>
        <div>
          <button onClick={resolveFight}>Fight!</button>
        </div>
      </body>
    </div>
  )
}

export default App;