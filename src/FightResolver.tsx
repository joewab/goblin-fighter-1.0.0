import React, { useState } from 'react';
import axios from 'axios';
import { Action, Monster } from './Interfaces/Monster';
import { rollDice } from './RollDice';

interface Monsters {
  monster1: Monster | undefined;
  monster2: Monster | undefined;
}

const FightResolver: React.FC<Monsters> = ({monster1, monster2}) => {

  const [buttonText, setButtonText] = useState('Fight!')
  const [response, setResponse] = useState('');
  const [fightBegun, setFightBegun] = useState(false);
  const [fightText, setFightText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [turn, setTurn] = useState(0);
  const [monst1HP, setMonst1HP] = useState(1);
  const [monst2HP, setMonst2HP] = useState(1);
  const [hpInit, setHpInit] = useState(false);

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
        setDisplayText(`The battle is over, ${winner} wins!`)
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
        setFightText(initiativeString);
        setDisplayText(initiativeString)
        setButtonText('Continue Fight');
        setFightBegun(true);

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
      setDisplayText('Please choose two fighters.');
    }
  };

  const handleGenerateText = async (newPrompt: string) => {    
    try {
      const res = await axios.post('http://localhost:5000/api/generate', { prompt: newPrompt });
      setFightText((prevText) => {
        return prevText + '\n\n' + res.data.text;
      });

      setDisplayText(res.data.text);
      
    } catch (error) {
      console.error('Error generating text:', error);
      setResponse('Error generating text. Please try again later.');
    }
  };

  return (
    <div className='fight-container'>
      <div className={`fight-result ${fightBegun ? "fight-begun" : ""}`}>
        {displayText}
      </div>
      <button className='fight-button' onClick={() => resolveFight(monster1, monster2)}>{buttonText}</button>
    </div>
  );
};

export default FightResolver;
