//http://jsfiddle.net/Darker/cfzn01c6/
import "../App.css";
import * as DS from "@mediahuis/chameleon-react";
import { Close, Checkmark } from "@mediahuis/chameleon-theme-wl/icons";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Confetti from 'react-confetti'
import Speelook from "./Speelook";
import { setImage, setThema } from "../Slices/testSlice";

function Allesgevonden() {
  const inputData = useSelector((state) => state.data.inputData);
  const allAnswers = useSelector((state) => state.data.allAnswers);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(setImage(""))
    dispatch(setThema(""))
  }, []);


  return (
    <>
      <div className="app">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#fca5a5']}
          recycle={false}
          numberOfPieces={500}
        />
        <>
          <div className="flex flex-row justify-center items-center w-full mt-5 mb-1">
            <h5 className="font-bold text-xl">DS MATZOEKER</h5>
          </div>
          <p className="px-2 py-1 bg-red-300 mx-auto text-xs ">19/05/2023</p>
          <div className="mx-auto  max-w-[90vw]">
            <h4 className="text-[5em] font-bold mb-3">{inputData.length}/{allAnswers.length}</h4>
            <p>Proficiat, je hebt ze allemaal gevonden!</p>
          </div>
          <Speelook />
        </>
      </div >
    </>

  );
}

export default Allesgevonden;
