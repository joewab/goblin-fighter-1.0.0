import './App.css'
import axios from "axios";
import { FC, useEffect, useState, useRef } from "react";
import { MonsterRef } from "./Interfaces/MonsterRef";
import MonsterCard from "./MonsterCard";
import { Action, Monster } from "./Interfaces/Monster";
import { useInView } from 'react-intersection-observer';
import cloud1 from './assets/cartoon-smoke-illustrated.png';
import cloud2 from './assets/cartoon-smoke-illustrated-2.png';


interface AppProps {
  title: string;
}

const App: FC<AppProps> = ({ title }) => {

  useEffect(() => {
    getMonsters();
  }, []);
  
  const getMonsters = () => {
      axios({
        method: 'GET',
        url: 'https://www.dnd5eapi.co/api/monsters'
      }).then((response) => {
        setAllMonsters(response.data.results);
      })
    }

  const { ref: headerRef, inView: headerVisible } = useInView({
    threshold: 1,
    root: null,
    rootMargin: '0px',
    onChange: (inView) => {
      console.log('Header in view:',inView);
      setScrollStarted(!inView);
    }
  });
  const { ref: areRef, inView: areVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: '0px',
    onChange: (inView) => {
      console.log('Are in view',inView);
    }
  });
  const { ref: youRef, inView: youVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: '0px',
    onChange: (inView) => {
      console.log('You in view',inView);
    }
  });
  const { ref: readyRef, inView: readyVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: '0px',
    onChange: (inView) => {
      console.log('Ready in view',inView);
    }
  });
  const { ref: toRef, inView: toVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: '0px',
    onChange: (inView) => {
      console.log('To in view',inView);
    }
  });
  const { ref: battleRef, inView: battleVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: '0px',
    onChange: (inView) => {
      console.log('Battle in view',inView);
    }
  });

  const [currentMonster1, setCurrentMonster1] = useState<Monster | undefined>();
  const [currentMonster2, setCurrentMonster2] = useState<Monster | undefined>();
  const [allMonsters, setAllMonsters] = useState<MonsterRef[]>([]);
  const [scrollStarted, setScrollStarted] = useState(false);

  const abilityMods = [-5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10] 

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
  const resolveFight = (monster1?: Monster, monster2?: Monster) => {
    let monster1HP: number = monster1 ? monster1.hit_points : 0;
    let monster2HP: number = monster2 ? monster2.hit_points : 0;

    const monster1Actions: Action[] = monster1 ? monster1?.actions : [];
    const monster2Actions: Action[] = monster2 ? monster2?.actions : [];

    const monster1InitiativeBonus: number = monster1? abilityMods[monster1.dexterity-1] : 0;
    const monster2InitiativeBonus: number = monster2? abilityMods[monster2.dexterity-1] : 0;



    console.log(monster1Actions, monster2Actions);
    
    const attackRoll = rollDice(20);
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
      <header ref={headerRef} className="App-header">
        <p>
          {title}
        </p>
      </header>
      <body className='App-body'>
        <div className={ `cloud-1 ${scrollStarted ? 'animateCloud1' : ''}` }>
          <img src={cloud1} alt="cloud" width="700" height="400"/>
        </div>
        <div className={ `cloud-2 ${scrollStarted ? 'animateCloud2' : ''}` }>
          <img src={cloud2} alt="cloud" width="800" height="400"/>
        </div>
        <div ref={areRef} className='title'>
          <span className={ `at-rest ${areVisible ? 'animateZoom' : ''}` }>
            Are
          </span>
        </div>
        <div ref={youRef} className='title'>
          <span className={ `at-rest ${youVisible ? 'animateZoom' : ''}` }>
            You
          </span>
        </div>
        <div ref={readyRef} className='title'>
          <span className={ `at-rest ${readyVisible ? 'animateZoom' : ''}` }>
            Ready
          </span>
        </div>
        <div ref={toRef} className='title'>
          <span className={ `at-rest ${toVisible ? 'animateZoom' : ''}` }>
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
          <button onClick={() => resolveFight(currentMonster1, currentMonster2)}>Fight!</button>
        </div>
      </body>
    </div>
  )
}

export default App;