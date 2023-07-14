//http://jsfiddle.net/Darker/cfzn01c6/
import "../App.css";

import { useState, useRef, useEffect } from "react";
import { db } from '../firebase.config';
import { collection, getDocs, query } from 'firebase/firestore'
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setAnswerList, setImage, setReset, setThema } from "../Slices/testSlice";

function Home() {
  const [games, setGames] = useState([]);
  const collectionRef = collection(db, 'matzoeker');
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(setReset())
  }, []);

  useEffect(() => {
    const getZoeker = async () => {
      const q = query(collectionRef);
      await getDocs(q).then((zoek) => {
        let zoekerData = zoek.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        zoekerData.sort((a, b) =>
          b.data.startdatum.localeCompare(a.data.startdatum)
        );
        setGames(zoekerData)
      }).catch((err) => {
        console.log(err);
      })
    }
    getZoeker()
  }, []);

  function formatDate(inputDate) {
    const parts = inputDate.split("-");
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  }
  return (

    <>
      <div className="app">
        <>
          <div className="flex flex-row justify-center items-center w-full mt-5 mb-1">
            <h5 className="font-bold text-xl">DS MATZOEKER</h5>
          </div>
          {games
            .filter((game, index) => game.data.zichtbaar)
            .filter((game, index) => new Date(game.data.startdatum) <= new Date())
            .filter((game, index) => index == 0)
            .map((game) => (
              <div key={game.id}>
                <p className="px-2 py-1 w-fit bg-red-300 mx-auto text-xs mb-4">{formatDate(game.data.startdatum)}</p>
                <p className="mx-auto text-sm max-w-[90vw]">
                  <strong>Klik</strong> op de afbeelding en <strong>typ</strong> het juiste antwoord. Zodra u er 10 gevonden heeft, kan u uw score bekijken.
                  <br /><br />
                  De zoeker van MAT is er puur voor het <strong>speelplezier</strong>.
                </p>
                <Link to={{
                  pathname: "/zoeker",
                  search: `id=${game.id}`,
                }}>
                  <img src={game.data.image} className="my-5 aspect-square  object-cover opacity-80 w-3/4 mx-auto" />
                </Link>
                <div
                  className="flex justify-center items-center flex-col relative z-20"
                >
                  <Link to={{
                    pathname: "/zoeker",
                    search: `id=${game.id}`,
                  }} className="font-semibold my-6"> <div className="bg-[#FF9899] py-3 px-6" >
                      Begin aan de zoeker
                    </div>
                  </Link>
                </div>
              </div>
            ))}

          <h5 className="font-semibold text-xl text-left w-[90vw] mt-5 mb-2">Speel de vorige zoekers</h5>
          <div className="grid-cols-2 grid gap-4 w-[90vw] mx-auto mt-3 mb-3">
            {games
              .filter((game, index) => game.data.zichtbaar)
              .filter((game, index) => new Date(game.data.startdatum) <= new Date())
              .filter((game, index) => index !== 0)
              .map((game) => (
                <Link to={{
                  pathname: "/zoeker",
                  search: `id=${game.id}`,
                }} className="font-semibold" key={game.id}>
                  <div className="relative aspect-square opacity-70" key={game.data.startdatum}>
                    <div className="px-2 py-1 bg-red-300 h-fit w-fit absolute text-xs top-0 right-0 bottom-0 left-0 m-auto flex justify-center items-center">
                      <p>{formatDate(game.data.startdatum)}</p>
                    </div>
                    <img src={game.data.image} className="object-cover w-full h-full" />
                  </div>
                </Link>
              ))}
          </div>


        </>
      </div >
    </>

  );
}

export default Home;
