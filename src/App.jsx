import React from 'react';
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import Game from './Game';
import Home from './Home';
import End from './End';
import Allesgevonden from './Allesgevonden';


const App = () => {
  const element = useRoutes([
    {
      path: "/",
      element:
        <Home />
    },
    {
      path: "/zoeker",
      element:
        <Game />
    },
    {
      path: "/resultaat",
      element:
        <End />
    },
    {
      path: "/allesgevonden",
      element:
        <Allesgevonden />
    },
  ]);

  const location = useLocation();

  if (!element) return null;

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {React.cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
    </>
  );
};

export default App;
