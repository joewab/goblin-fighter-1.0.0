import { FC, useState } from "react";
import { MonsterRef } from "../Interfaces/MonsterRef";
import MonsterCard from "../MonsterCard/MonsterCard";
import { Monster } from "../Interfaces/Monster";
import { rollDice } from "../RollDice";
import MonsterSelect from "./MonsterSelect/MonsterSelect";

interface AllMonsters {
    allMonsters: MonsterRef[];
  }

const FightArena: FC<AllMonsters> = ({ allMonsters }) => {
  const [currentMonster1, setCurrentMonster1] = useState<Monster | undefined>();
  const [currentMonster2, setCurrentMonster2] = useState<Monster | undefined>();

  const [fightBegun, setFightBegun] = useState(false);
  const [fightText, setFightText] = useState("");

  const setMonster1Helper = (monster: Monster) => {
    setCurrentMonster1(monster);
  }

  const setMonster2Helper = (monster: Monster) => {
    setCurrentMonster2(monster);
  }

  const abilityMods: number[] = [
    -5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6,
    6, 7, 7, 8, 8, 9, 9, 10,
  ];

  const resolveFight = (monster1?: Monster, monster2?: Monster) => {
    // let monster1HP: number = monster1 ? monster1.hit_points : 0;
    // let monster2HP: number = monster2 ? monster2.hit_points : 0;

    // const monster1Actions: Action[] = monster1 ? monster1?.actions : [];
    // const monster2Actions: Action[] = monster2 ? monster2?.actions : [];

    const monster1InitiativeBonus: number = monster1
      ? abilityMods[monster1.dexterity - 1]
      : 0;
    const monster2InitiativeBonus: number = monster2
      ? abilityMods[monster2.dexterity - 1]
      : 0;    

    const monster1Initiative: number = rollDice(20) + monster1InitiativeBonus;
    const monster2Initiative: number = rollDice(20) + monster2InitiativeBonus;

    const winner: string | undefined =
      monster1Initiative > monster2Initiative
        ? monster1?.index
        : monster1Initiative < monster2Initiative
        ? monster2?.index
        : "neither";
    
    const initiativeString: string = `Initiative: ${monster1?.index} rolls a ${monster1Initiative}, ${monster2?.index} rolls a ${monster2Initiative}, ${winner} wins!`;
    
    if(monster1 && monster2) {
      setFightText(initiativeString + ' ...for now at least (this is a battle in progress...)');
    } else {
      setFightText('Please choose two fighters.');
    }
    setFightBegun(true);
  };

  return (
    <>
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
      <div className="fight-button">
        <button onClick={() => resolveFight(currentMonster1, currentMonster2)}>
          Fight!
        </button>
      </div>
      <div className={`fight-result ${fightBegun ? "fight-begun" : ""}`}>
        {fightText}
      </div>
    </>
  );
};

export default FightArena;
