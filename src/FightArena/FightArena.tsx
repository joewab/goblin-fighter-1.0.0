import { FC, useState } from "react";
import { MonsterRef } from "../Interfaces/MonsterRef";
import MonsterCard from "./MonsterCard/MonsterCard";
import { Monster } from "../Interfaces/Monster";
import MonsterSelect from "./MonsterSelect/MonsterSelect";
import FightResolver from "./FightResolver";

interface AllMonsters {
    allMonsters: MonsterRef[];
  }

const FightArena: FC<AllMonsters> = ({ allMonsters }) => {
  const [currentMonster1, setCurrentMonster1] = useState<Monster | undefined>();
  const [currentMonster2, setCurrentMonster2] = useState<Monster | undefined>();
  const [clearText, setClearText] = useState(false);
  const [turn, setTurn] = useState(0);
  const [monst1HP, setMonst1HP] = useState(1);
  const [monst2HP, setMonst2HP] = useState(1);
  const [hpInit, setHpInit] = useState(false);
  const [buttonText, setButtonText] = useState('Fight!');
  const [roundCount, setRoundCount] = useState(0);

  const setMonster1Helper = (monster: Monster) => {
    setCurrentMonster1(monster);
  }

  const setMonster2Helper = (monster: Monster) => {
    setCurrentMonster2(monster);
  }

  return (
    <div className="flex-container">
      <div className="flex-grid">
        <div className="fighter-select">
          <MonsterCard monster={currentMonster1} hpInit={hpInit} monstHP={monst1HP} />
          <MonsterSelect allMonsters={allMonsters} setCurrentMonster={setMonster1Helper} 
          setClearText={setClearText} setTurn={setTurn} setMonst1HP={setMonst1HP} setMonst2HP={setMonst2HP}
          setHpInit={setHpInit} setButtonText={setButtonText}/>
        </div>
        <div>
          <h1 className="versus">VS</h1>
        </div>
        <div className="fighter-select">
          <MonsterCard monster={currentMonster2} hpInit={hpInit} monstHP={monst2HP} />
          <MonsterSelect allMonsters={allMonsters} setCurrentMonster={setMonster2Helper} 
          setClearText={setClearText} setTurn={setTurn} setMonst1HP={setMonst1HP} setMonst2HP={setMonst2HP}
          setHpInit={setHpInit} setButtonText={setButtonText}/>
        </div>
      </div>
      <FightResolver monster1={currentMonster1} monster2={currentMonster2} setCurrentMonster1={setCurrentMonster1} 
        setCurrentMonster2={setCurrentMonster2} clearText={clearText} setClearText={setClearText} 
        turn={turn} setTurn={setTurn} monst1HP={monst1HP} setMonst1HP={setMonst1HP} monst2HP={monst2HP} setMonst2HP={setMonst2HP}
        hpInit={hpInit} setHpInit={setHpInit} buttonText={buttonText} setButtonText={setButtonText}
        />
    </div>
  );
};

export default FightArena;
