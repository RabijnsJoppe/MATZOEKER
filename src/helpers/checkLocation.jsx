import {
  checkSimilarity
} from "./checkSimilarity";

export function checkLocation(coX, coY, text, answerList) {

  let check = false;
  answerList.map((answer) => {
    if (coX > answer.xStart && coX < answer.xEnd) {
      if (coY > answer.yStart && coY < answer.yEnd) {
        if (text) {
          if (checkSimilarity(text, answer.antwoord) > 0.8) {
            check = answer.id;

          }
        }
      }
    }
  });
  return check;
}