import React, { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { Action, Monster } from '../Interfaces/Monster';
import { rollDice } from '../RollDice';
import Typewriter from "../Typewriter"

interface Monsters {
  monster1: Monster | undefined;
  monster2: Monster | undefined;
  setCurrentMonster1: Dispatch<SetStateAction<Monster | undefined>>;
  setCurrentMonster2: Dispatch<SetStateAction<Monster | undefined>>;
  clearText: boolean;
  setClearText:Dispatch<SetStateAction<boolean>>;
  turn: number;
  setTurn: Dispatch<SetStateAction<number>>;
  monst1HP: number;
  setMonst1HP: Dispatch<SetStateAction<number>>;
  monst2HP: number;
  setMonst2HP: Dispatch<SetStateAction<number>>;
  hpInit: boolean;
  setHpInit: Dispatch<SetStateAction<boolean>>;
  buttonText: string;
  setButtonText: Dispatch<SetStateAction<string>>;
}

const FightResolver: React.FC<Monsters> = ({monster1, monster2, setCurrentMonster1, setCurrentMonster2, clearText, setClearText,
  turn, setTurn, monst1HP, setMonst1HP, monst2HP, setMonst2HP, hpInit, setHpInit, buttonText, setButtonText
}) => {
  const [displayText, setDisplayText] = useState('');
  const [startType, setStartType] = useState(false);
  const [loading, setLoading] = useState(false);

  const abilityMods: number[] = [
    -5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6,
    6, 7, 7, 8, 8, 9, 9, 10,
  ];

  const resolveFight = (monster1?: Monster, monster2?: Monster) => {
    if(monster1 && monster2){
      if(!hpInit){
        setMonst1HP(monster1.hit_points);
        setMonst2HP(monster2.hit_points);
        setHpInit(true);
      }
      if(monst1HP <= 0 || monst2HP <= 0){
        const winner: string | undefined = monst1HP <= 0 ? monster2?.name : monster1?.name;
        setButtonText('Fight Complete');
        setDisplayText(() =>  {
          setClearText(true);
          setStartType(true);
          return `The battle is over, ${winner} wins!`
        });
        setCurrentMonster1(undefined);
        setCurrentMonster2(undefined);
      } else if(turn===0) {
        const monster1InitiativeBonus: number = monster1 ? abilityMods[monster1.dexterity - 1] : 0;
        const monster2InitiativeBonus: number = monster2 ? abilityMods[monster2.dexterity - 1] : 0;    
  
        const monster1Initiative: number = rollDice(20) + monster1InitiativeBonus;
        const monster2Initiative: number = rollDice(20) + monster2InitiativeBonus;
  
        let winner: string | undefined;
        
        if(monster1Initiative > monster2Initiative){
          winner = monster1.name;
          setTurn(1);
        } else if (monster1Initiative < monster2Initiative) {
          winner = monster2.name;
          setTurn(2);
        } else {
          if(monster1.dexterity > monster2.dexterity) {
            winner = monster1.name;
            setTurn(1);
          } else {
            winner = monster2.name;
            setTurn(2);
          }
        } 
        const initiativeString: string = `Initiative: ${monster1?.name} rolls a ${monster1Initiative}, ${monster2?.name} rolls a ${monster2Initiative}, ${winner} goes first!`;
        //TBD: create fightText state to record the entire encounter, allow pdf download
        // setFightText(initiativeString);
        setDisplayText(() =>  { 
          setClearText(true);
          setStartType(true);
          return initiativeString
        })
        setButtonText('Continue Fight');
      } else {      
          const attacker: Monster = turn===1 ? monster1 : monster2;
          const defender: Monster = turn===1 ? monster2 : monster1;
          const defenderAC: number = defender.armor_class[0].value;
      
          const attackerActions: Action[] = attacker.actions;
          const attacks = attackerActions.filter((action) => action.attack_bonus);
          const randomAttackIndex: number = Math.floor(Math.random() * attacks.length);
          const selectedAttack = attacks[randomAttackIndex];
          const attackBonus: number = selectedAttack.attack_bonus;
          const attackRoll: number = rollDice(20, 1) + attackBonus;
  
          if(attackRoll >= defenderAC) {
            const damageDice: string = selectedAttack.damage[0].damage_dice;
            const damageArray = damageDice.split('d');
            const baseDamageArray: string[] = damageArray[1].split('+');
            let baseDamage: number = rollDice(Number(baseDamageArray[0]), Number(damageArray[0]));
            const totalDamage: number = baseDamage + Number(baseDamageArray[1]);
  
            if(turn===1){
              setMonst2HP(monst2HP - totalDamage);
            } else {
              setMonst1HP(monst1HP - totalDamage);
            }
            if(monst1HP <= 0 || monst2HP <= 0){
                const newPrompt = `in one sentence describe how a ${attacker.name} defeats a ${defender.name} using a ${selectedAttack.name} attack that deals ${totalDamage} damage. Use language from a fantasy novel. Make sure it is in the present tense.`
                setButtonText('Fight Complete');
                handleGenerateText(newPrompt); 
            } else {
              const newPrompt = `in one sentence describe a successful ${selectedAttack.name} attack from a ${attacker.name} on a ${defender.name} that deals ${totalDamage} damage. Use language from a fantasy novel. Make sure it is in the present tense.`
              handleGenerateText(newPrompt);
            }
          } else {
            const newPrompt = `in one sentence decribe how a ${attacker.name} misses a ${defender.name} with a ${selectedAttack.name} attack. Use language from a fantasy novel. Make sure it is in the present tense.`
            handleGenerateText(newPrompt);
          }
          setTurn(turn===1 ? 2 : 1);
      }  
    } else {      
      setDisplayText(() => {
        setClearText(true);
        setStartType(true);
        return 'Please choose two monsters.';
      });    }
  };

  const handleGenerateText = async (newPrompt: string) => {  
    setLoading(true);  
    try {
      const res = await axios.post('https://peht7l6021.execute-api.us-east-2.amazonaws.com/dev', { prompt: newPrompt });
      //TBD: create fightText state to record the entire encounter, allow pdf download
      // setFightText((prevText) => {
      //   return prevText + '\n\n' + res.data.text;
      // });
      setDisplayText(() => {
        setClearText(true);
        setStartType(true);
        return res.data.body;
      });
    } catch (error) {
      console.error('Error generating text:', error);
    }
    setLoading(false);  
  };

  return (
    <div className='fight-container'>
      <Typewriter text={displayText} delay={15} startType={startType} setStartType={setStartType} clearText={clearText} setClearText={setClearText} />
      <button className={loading ? 'fight-button lds-dual-ring': 'fight-button'} onClick={() => resolveFight(monster1, monster2)}>{buttonText}</button>
    </div>
  );
};

export default FightResolver;
