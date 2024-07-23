import React, { useState, useEffect, FC, Dispatch, SetStateAction } from 'react';

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
    if (currentIndex < text.length && startType) {
        const timeout = setTimeout(() => {        
        setCurrentText((prevText) => { 
            if(clearText) {
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

    return <div className='fight-result'>{currentText}</div>;
};

export default Typewriter;