import { FC, useState } from "react";
import { MonsterRef } from "../Interfaces/MonsterRef";
import MonsterCard from "../MonsterCard";
import { Monster } from "../Interfaces/Monster";
import axios from "axios";

interface AllMonsters {
    allMonsters: MonsterRef[] | undefined;
  }

const FightArena: FC<AllMonsters> = ({ allMonsters }) => {
  const [currentMonster1, setCurrentMonster1] = useState<Monster | undefined>();
  const [currentMonster2, setCurrentMonster2] = useState<Monster | undefined>();

  const [fightBegun, setFightBegun] = useState(false);
  const [fightText, setFightText] = useState("");

  const [searchVal1, setSearchVal1] = useState("");
  const [searchVal2, setSearchVal2] = useState("");

  const [filteredMonsters1, setFilteredMonsters1] = useState<MonsterRef[]>();
  const [filteredMonsters2, setFilteredMonsters2] = useState<MonsterRef[]>();

  const filterMonstList = (num: number) => {
    let filteredList: MonsterRef[] | undefined;
    if (num === 1) {
      filteredList = allMonsters?.filter((monster) => {
        return searchVal1 ? monster.index.includes(searchVal1) : [];
      });
    } else {
      filteredList = allMonsters?.filter((monster) => {
        return searchVal2 ? monster.index.includes(searchVal2) : [];
      });
    }
    return filteredList;
  };

  const monsterSearch = (event: any, num: number) => {
    if (num === 1) {
      setSearchVal1(event.target.value);
      setFilteredMonsters1(filterMonstList(1));
    } else {
      setSearchVal2(event.target.value);
      setFilteredMonsters2(filterMonstList(2));
    }
  };

  const setHelper = (event: any, num: number) => {
    console.log(event.target.innerText);
    if(allMonsters){
        for (let monst of allMonsters) {
            if (event.target.innerText === monst.name) {
              axios({
                method: "GET",
                url: `https://www.dnd5eapi.co${monst.url}`,
              }).then((response) => {
                if (num === 1) {
                  setCurrentMonster1(response?.data);
                  setFilteredMonsters1([]);
                  setSearchVal1(event.target.innerText);
                } else {
                  setCurrentMonster2(response?.data);
                  setFilteredMonsters2([]);
                  setSearchVal2(event.target.innerText);
                }
              });
            }
        }
    }
    
  };

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

  const rollDice = (sides: number, amount = 1) => {
    let outcome = 0;
    for (let i = 0; i < amount; i++) {
      outcome += Math.floor(Math.random() * sides) + 1;
    }
    return outcome;
  };

  return (
    <>
      <div className="flex-grid">
        <div className="fighter-select">
          <MonsterCard monster={currentMonster1} />
          <input
            onChange={(e) => monsterSearch(e, 1)}
            value={searchVal1}
            type="text"
            name="monster1-search"
            id="monster1-search"
            placeholder="Search Monsters"
          />
          <ul>
            {filteredMonsters1?.map((monster) => {
              return (
                <li
                  key={monster.index}
                  className="list-monster"
                  value={monster.name}
                  onClick={(e) => setHelper(e, 1)}
                >
                  {" "}
                  {monster.name}{" "}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col">
          <h1 className="versus">VS</h1>
        </div>
        <div className="fighter-select">
          <MonsterCard monster={currentMonster2} />
          <input
            onChange={(e) => monsterSearch(e, 2)}
            value={searchVal2}
            type="text"
            name="monster2-search"
            id="monster2-search"
            placeholder="Search Monsters"
          />
          <ul>
            {filteredMonsters2?.map((monster) => {
              return (
                <li
                  key={monster.index}
                  className="list-monster"
                  value={monster.name}
                  onClick={(e) => setHelper(e, 2)}
                >
                  {" "}
                  {monster.name}{" "}
                </li>
              );
            })}
          </ul>
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
