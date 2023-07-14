import "../App.css";
import { db } from '../firebase.config';
import { collection, getDocs, query } from 'firebase/firestore'
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Speelook({ }) {
  const [games, setGames] = useState([]);
  const skipId = useSelector((state) => state.data.id);

  const collectionRef = collection(db, 'matzoeker');
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
      <h5 className="font-semibold text-xl text-left w-[90vw] mt-5 mb-2">Speel ook de andere zoekers</h5>
      <div className="grid-cols-2 grid gap-4 w-[90vw] mx-auto mt-3 mb-3">
        {games
          .filter((game) => new Date(game.data.startdatum) <= new Date())
          .filter((game) => game.id != skipId)
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

  )
}

export default Speelook;
