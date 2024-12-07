import { useState, useEffect, FC, Dispatch, SetStateAction } from 'react';

interface TypeInput {
    text: string;
    delay: number;
    startType: boolean;
    setStartType: Dispatch<SetStateAction<boolean>>;
    clearText: boolean;
    setClearText: Dispatch<SetStateAction<boolean>>;
  }

const Typewriter: FC<TypeInput> = ({ text, delay, startType, setStartType, clearText, setClearText }) => {

  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {    
    if(text.length===0){
        setFightTextBoxHeight(4);
    }
    if (currentIndex < text.length && startType) {
        const timeout = setTimeout(() => {        
        setCurrentText((prevText) => { 
            if(clearText) {
                setFightTextBoxHeight(text.length);
                setClearText(false);
                return text[0];
            }
            return prevText + text[currentIndex] });
        setCurrentIndex((prevIndex) => {
            return prevIndex + 1
        });
        }, delay);
    
        return () => clearTimeout(timeout);
    } else {
       setStartType(false);
       setCurrentIndex(0);
       setClearText(true);
    }
    }, [currentIndex, delay, text, startType]);

    const setFightTextBoxHeight = (numChars: number) => {
        const textBox = document.getElementById('fightTextBox');
        const screenWidth = document.body.offsetWidth;        
        if(numChars >=90 && textBox){
            textBox.style.height= screenWidth < 1000? `${Math.round(numChars/45)*6}rem` : `${Math.round(numChars/45)*3.3}rem`
        } else if (textBox) {
            textBox.style.height= screenWidth < 1000? '8rem' : '6rem'
        }
      }

    return <div id='fightTextBox' className='fight-result'>{currentText}</div>;
};

export default Typewriter;