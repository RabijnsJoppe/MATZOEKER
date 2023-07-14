//http://jsfiddle.net/Darker/cfzn01c6/
import "../App.css";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Keyboard from "./Keyboard";
import { useDispatch, useSelector } from "react-redux";
import { motion, useIsPresent, AnimatePresence } from "framer-motion";
import {
  setKeyboard,
  setInputData,
  setAntwoordCoord,
  setAnswerList,
  setAnswerInitialList,
  setImage,
  setThema,
  setId,
  setReset
} from "../Slices/testSlice";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Info } from 'feather-icons-react';
import { Check, X } from "feather-icons-react/build/IconComponents";
import { db } from '../firebase.config';
import { collection, getDoc, doc } from 'firebase/firestore'

function Game() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const keyboardRef = useRef(null);
  const gameRef = useRef(null);
  const imageRef = useRef(null);
  const keyboard = useSelector((state) => state.data.keyboard);
  const image = useSelector((state) => state.data.image);
  const thema = useSelector((state) => state.data.thema);

  const antwoordCoord = useSelector((state) => state.data.antwoordCoord);
  const [info, setInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  const [yClient, setYclient] = useState();
  const allAnswers = useSelector((state) => state.data.allAnswers);
  const inputData = useSelector((state) => state.data.inputData);
  const [game, setGame] = useState([]);
  const collectionRef = collection(db, 'matzoeker');
  const location = useLocation();

  function removeQueryPrefix(queryString) {
    return queryString.replace('?id=', '');
  }


  useEffect(() => {
    const getZoekerById = async (id) => {
      try {
        const docRef = doc(collectionRef, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const zoekerData = { ...docSnap.data(), id: docSnap.id };
          dispatch(setReset())
          setGame(zoekerData);
          dispatch(setImage(zoekerData.data.image))
          dispatch(setThema(zoekerData.data.thema))
          dispatch(setAnswerInitialList(zoekerData.data.formattedAreas));
          setLoading(false)
        } else {
          console.log("Document does not exist.");
        }
      } catch (err) {
        console.log(err);
      }
    };

    const zoekerId = removeQueryPrefix(location.search);
    getZoekerById(zoekerId);
    dispatch(setId(zoekerId));
  }, []);

  const handleDivClick = (event) => {
    if (!keyboard) {
      event.preventDefault();
      let x, y;
      let rect = imageRef.current.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      let width = rect.right - rect.left;

      if (imageRef.current.naturalWidth != width) {
        let height = rect.bottom - rect.top;
        x = x * (imageRef.current.naturalWidth / width);
        y = y * (imageRef.current.naturalHeight / height);
      }

      let relativeCoords = {
        x,
        y,
      };

      if (
        event.target.tagName !== "svg" &&
        event.target.tagName !== "path" &&
        event.target.tagName !== "SPAN"
      ) {
        if (event.clientX > rect.left && event.clientX < rect.right) {
          if (event.clientY > rect.top && event.clientY < rect.bottom) {
            setYclient(event.clientY)
            dispatch(setAntwoordCoord(
              {
                x: event.clientX,
                y: event.clientY,
                relativeCoordsX: relativeCoords.x,
                relativeCoordsY: relativeCoords.y,
              })
            );
            window.scrollTo(0, 0);
            dispatch(setKeyboard());

          }
        }
      }
    }
  };


  useEffect(() => {
    if (inputData.length == allAnswers.length && allAnswers.length != 0 && !loading) {
      navigate("/allesgevonden");
    }
  }, [inputData]);


  useEffect(() => {
    if (keyboard && (yClient > window.innerHeight - keyboardRef.current.offsetHeight)) {
      gameRef.current.style.marginTop = `-${yClient - (window.innerHeight - keyboardRef.current.offsetHeight) + 30}px`
    } else {
      gameRef.current.style.marginTop = `0px`
    }
  });


  return (
    <>
      {
        info && <div className="absolute top-0 left-0 right-0 bottom-0 z-40 h-screen w-screen mx-auto my-auto bg-[#ffffff] flex justify-center items-center flex-col" >
          <div onClick={() => setInfo(false)} className="absolute top-5 right-5 z-50" ><X /></div>
          <img src="https://static.standaard.be/Assets/Images_Upload/2023/06/14/matzoeker_preview.png" className="my-5" />
          <p className="mx-auto text-sm max-w-[90vw]">
            <strong>Klik</strong> op de afbeelding en <strong>typ</strong> het juiste antwoord. Zodra u er 10 gevonden heeft, kan u uw score bekijken.
            <br /><br />
            De zoeker van MAT is er puur voor het <strong>speelplezier</strong>.
          </p>        </div>
      }
      <div className="app overflow-hidden max-h-[98vh] touch-none	" ref={gameRef} >
        <div className="flex flex-row justify-between items-center w-full p-5 relative z-30">
          <h5 className="font-semibold"><Link to={"/"} ><ChevronLeft width="16" />terug</Link>
          </h5>
          <h5 className="font-bold text-lg">{thema}</h5>
          <h5 className="font-semibold" onClick={() => setInfo(true)}><Info width="16" /> info</h5>

        </div>
        <div onClick={handleDivClick} className="absolute h-screen w-screen z-10">
          {inputData.map((input, index) => (
            <div
              key={index}
              style={{
                top: input.y,
                left: input.x,
              }}
              className="absolute"
            >
              <span className="dot bg-[#7ecd17]"><Check color="#2EA404" size="16" /></span>
            </div>
          ))}
          {antwoordCoord &&
            <div
              key={antwoordCoord}
              style={{
                top: antwoordCoord.y,
                left: antwoordCoord.x,
              }}
              className="absolute"
            >
              <span className="dot bg-[#cf1616] shadow-md"></span>
            </div>
          }
        </div>
        <img
          src={image}
          alt=""
          className="!w-[90vw]"
          ref={imageRef}
        />
        <AnimatePresence mode="wait">
          {
            !keyboard && <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-evenly items-center flex-col relative z-20 grow max-h-[180px]"
            >
              <div className="mt-4 font-semibold text-sm">
                <p>{inputData == 0 ? "0" : inputData.length} van de {allAnswers.length} gevonden</p>
              </div>
              <Link to={"/resultaat"} className="font-semibold  my-4"><div className="bg-[#FF9899] py-3 px-6" >
                Naar de oplossingen
              </div>
              </Link>
            </motion.div>
          }
        </AnimatePresence >

        <div className="absolute z-20 pb-3 bottom-0 mx-auto w-full left-0 bg-[#ffffff]" ref={keyboardRef}>
          <Keyboard />
        </div>
      </div>
    </>


  );
}

export default Game;
