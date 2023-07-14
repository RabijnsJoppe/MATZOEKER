import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { motion, useIsPresent, AnimatePresence } from "framer-motion";

import {
    setAntwoord,
    setKeyboard,
    setInputData,
    setAntwoordCoord,
    setAnswerList
} from "../Slices/testSlice";
import { checkLocation } from '../helpers/checkLocation';
import { X } from 'feather-icons-react';
import { Delete } from 'feather-icons-react/build/IconComponents';


const Keyboard = () => {
    const dispatch = useDispatch();
    const antwoord = useSelector((state) => state.data.antwoord);
    const keyboard = useSelector((state) => state.data.keyboard);
    const antwoordCoord = useSelector((state) => state.data.antwoordCoord);
    const answerList = useSelector((state) => state.data.answerList);
    const [error, setError] = useState(false);

    const keys = [
        ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
        ['W', 'X', 'C', 'V', 'B', 'N', '-'],
        ['', 'spatie', '+'],

    ];

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (!e.key) return;
            if (e.key === 'Backspace') {
                handlePress('-');
            } else if (e.key === 'Enter') {
                handlePress('+');
            } else if (e.key === 'Space') {
                handlePress('+');
            } else if (isSingleLetter(e.key.toLowerCase())) {
                handlePress(e.key);
            }
        };

        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);



    const isSingleLetter = (key) => {
        return key.length === 1 && key.match(/[a-z]/i);
    };

    const isEnterKey = (key) => {
        return key === '+';
    };

    const isDeleteKey = (key) => {
        return key === '-';
    };

    const isSpaceKey = (key) => {
        return key === 'spatie';
    };

    const handlePress = (key) => {
        if (isSingleLetter(key)) {
            dispatch(setAntwoord(antwoord + key));
            setError(false);
        } else if (isSpaceKey(key)) {
            dispatch(setAntwoord(antwoord + " "));
            setError(false);
        } else if (isDeleteKey(key)) {
            if (antwoord.length) {
                dispatch(setAntwoord(antwoord.slice(0, antwoord.length - 1)));
                setError(false);
            }
        } else if (isEnterKey(key)) {
            handleNewGuess();
        }


    };

    const handleNewGuess = () => {
        if (checkLocation(antwoordCoord.relativeCoordsX, antwoordCoord.relativeCoordsY, antwoord, answerList)) {
            dispatch(setInputData({
                x: antwoordCoord.x,
                y: antwoordCoord.y,
                id: checkLocation(antwoordCoord.relativeCoordsX, antwoordCoord.relativeCoordsY, antwoord, answerList)
            }));
            dispatch(setAnswerList(checkLocation(antwoordCoord.relativeCoordsX, antwoordCoord.relativeCoordsY, antwoord, answerList)));
            dispatch(setKeyboard());
            dispatch(setAntwoord(""));
            dispatch(setAntwoordCoord(false));
        } else {
            setError(true);
        }
    };

    const back = () => {
        dispatch(setKeyboard());
        dispatch(setAntwoord(""));
        dispatch(setAntwoordCoord(false));
        setError(false);
    }

    return (
        <>
            {
                keyboard && <div
                    className='keyboard relative'
                >

                    <button onClick={back} className='w-9 h-9 bg-gray-300 text-white absolute -top-11 right-2 z-50'>
                        <X color="black" />
                    </button>
                    <div className='w-12 h-12 bg-white text-white absolute -top-12 right-0 '>

                    </div>
                    <div className='flex gap-2 px-1  my-1'>
                        <div className='h-9 border border-1 border-red-300 grow align-middle	flex justify-center items-center'>
                            <p>{antwoord}<span className="cursor" style={{ height: "16px" }}>|</span>
                            </p>
                        </div>
                    </div>
                    {
                        error && <div className='my-2'>
                            <p className='text-xs text-red-700 text-center'>Verkeerde antwoord, probeer opnieuw</p>
                        </div>
                    }
                    <div className='mx-auto ' >
                        {keys.map((row, rowIndex) => (
                            <div className="flex justify-center p-1 mx-auto items-center" key={rowIndex}>
                                {row.map((key) => (
                                    <>
                                        {isSingleLetter(key) ? (
                                            <button
                                                key={key}
                                                onClick={() => handlePress(key)}
                                                data-key={key}
                                                className={'flex items-center p-2 mx-0.5  border w-full justify-center'}
                                            > {key}
                                            </button>
                                        ) : isDeleteKey(key) ? (
                                            <button
                                                key={key}
                                                onClick={() => handlePress(key)}
                                                data-key={key}
                                                className={'flex items-center p-2 mx-0.5  border w-full justify-center'}
                                            >
                                                <span className="sr"><Delete size="14" /></span>
                                            </button>
                                        ) : isEnterKey(key) ? (
                                            <button
                                                key={key}
                                                onClick={() => handlePress(key)}
                                                data-key={key}
                                                className={'flex items-center p-2 mx-0.5  border w-full justify-center'}
                                            >
                                                <span className="sr">Enter</span>
                                            </button>
                                        ) : isSpaceKey(key) ? (
                                            <button
                                                key={key}
                                                onClick={() => handlePress(key)}
                                                data-key={key}
                                                className={'flex items-center p-2 mx-0.5  border w-full justify-center'}
                                            >
                                                <span className="sr">Spatie</span>
                                            </button>
                                        ) :
                                            <div
                                                key={key}
                                                onClick={() => handlePress(key)}
                                                data-key={key}
                                                className={'flex items-center p-2 mx-0.5  border w-full justify-center'}
                                            >
                                                <span style={{ height: "24px" }}></span>
                                            </div>
                                        }
                                    </>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>

    );
};

export default Keyboard;
