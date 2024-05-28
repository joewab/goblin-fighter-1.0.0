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
  
  const getMonsters = () => {
      axios({
        method: 'GET',
        url: 'https://www.dnd5eapi.co/api/monsters'
      }).then((response) => {
        setAllMonsters(response.data.results);
      })
    }

  const { ref: areRef, inView: areVisible } = useInView();
  const { ref: youRef, inView: youVisible } = useInView();
  const { ref: readyRef, inView: readyVisible } = useInView();
  const { ref: toRef, inView: toVisible } = useInView();
  const { ref: battleRef, inView: battleVisible } = useInView();

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

  //TODO: pass in entire monster and alter function to find the attack bonus
  const resolveFight = (attack_bonus?: number) => {
    const attackRoll = rollDice(20);
    console.log(currentMonster1);
    console.log(attackRoll, attack_bonus);
    return attack_bonus ? attackRoll + attack_bonus : attackRoll;
  }

  const rollDice = (sides: number, amount = 1) => {
    let outcome = 0;
    for (let i=0; i<amount; i++) {
      outcome+= Math.floor(Math.random() * sides) + 1;
    }
    return outcome;
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {title}
        </p>
      </header>
      <body className='App-body'>
        <div className='title'></div>
        <div className='title'></div>
        <div className='title'></div>

        <div ref={areRef} className='title'>
          <span className={ `at-rest ${areVisible ? 'animateAre' : ''}` }>
            Are
          </span>
        </div>
        <div ref={youRef} className='title'>
          <span className={ `at-rest ${youVisible ? 'animateYou' : ''}` }>
            You
          </span>
        </div>
        <div ref={readyRef} className='title'>
          <span className={ `at-rest ${readyVisible ? 'animateReady' : ''}` }>
            Ready
          </span>
        </div>
        <div ref={toRef} className='title'>
          <span className={ `at-rest ${toVisible ? 'animateTo' : ''}` }>
            To
          </span>
        </div>
        <div ref={battleRef} className='title'>
          <span className={`at-rest ${battleVisible ? 'animateBattle' : ''}`}>Battle?</span>
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
        <div className='button'>
          <button onClick={() => resolveFight(currentMonster1?.actions[1].attack_bonus)}>Fight!</button>
        </div>
      </body>
    </div>
  )
}

export default App;