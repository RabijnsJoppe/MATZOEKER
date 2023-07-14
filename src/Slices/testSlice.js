import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keyboard: false,
  image: "",
  thema: "",
  id: "",
  antwoordCoord: false,
  antwoord: "",
  inputData: [],
  answerList: [],
  allAnswers: [],
};
export const testSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setAntwoord: (state, action) => {
      state.antwoord = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setThema: (state, action) => {
      state.thema = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setAntwoordCoord: (state, action) => {
      state.antwoordCoord = action.payload;
    },
    setKeyboard: (state) => {
      state.keyboard = !state.keyboard;
    },
    setInputData: (state, action) => {
      console.log(action.payload);
      state.inputData = [...state.inputData, action.payload];
    },
    setReset: (state) => {
      state.inputData = [];
      state.keyboard = false;
      state.antwoordCoord = false;
      state.antwoord = "";
      state.image = "";
      state.thema = "";
    },
    setAnswerList: (state, action) => {
      const newArray = state.answerList.filter((obj) => obj.id !== action.payload);
      state.answerList = newArray;
    },
    setAnswerInitialList: (state, action) => {
      state.answerList = action.payload;
      state.allAnswers = action.payload;
    },
  },
});
export const { setKeyboard, setInputData, setAnswerList, setAntwoord, setAntwoordCoord, setAnswerInitialList, setImage, setThema, setId, setReset } = testSlice.actions;

export default testSlice.reducer;
