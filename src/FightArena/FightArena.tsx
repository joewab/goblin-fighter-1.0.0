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
          <MonsterCard monster={currentMonster1} />
          <MonsterSelect allMonsters={allMonsters} setCurrentMonster={setMonster1Helper} />
        </div>
        <div>
          <h1 className="versus">VS</h1>
        </div>
        <div className="fighter-select">
          <MonsterCard monster={currentMonster2} />
          <MonsterSelect allMonsters={allMonsters} setCurrentMonster={setMonster2Helper} />
        </div>
      </div>
      <FightResolver monster1={currentMonster1} monster2={currentMonster2} setCurrentMonster1={setCurrentMonster1} setCurrentMonster2={setCurrentMonster2}/>
    </div>
  );
};

export default FightArena;
