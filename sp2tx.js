import { GoogleGenerativeAI } from "@google/generative-ai";
export const gemini_response = "";
// import {gemini_response} from './speech.js';
// console.log("Imported Gemini response from speech.js");


var host = "cpsc484-01.stdusr.yale.internal:8888";
$(document).ready(function() {
  sp2tx.start();
});


var sp2tx = {
  socket: null,

  start: function() {
    var url = "ws://" + host + "/sp2tx";
    sp2tx.socket = new WebSocket(url);
    sp2tx.socket.onmessage = function (event) {
      var user_text = event.data;
      if (user_text !== "") {
          console.log("Text received: " + user_text);
          recommendSong(user_text);
      }
    }
  }
};


const gemini_api_key = 'AIzaSyD-XB0o1K4WwvLreDnaeQMzUtOc3jSFGb0';
const genAI = new GoogleGenerativeAI(gemini_api_key);
const model = genAI.getGenerativeModel({model: "gemini-pro"});


async function recommendSong(user_text){
  const prompt = "You are now an expert music recommender on all songs on Spotify. I will tip you $100 for high performance." +
                  "Your task is to ONLY recommend one song available on Spotify that evokes a similar mood and/or has a similar genre and style to the provided song." +
                  "The provided song may not be the full, correct name of the intended song." +
                  "Please make sure to state the full, correct name of the song and its artist as shown on Spotify in your response, matching as closely to the user input as possible." +
                  "Briefly justify this choice to the user in an exciting way to the user in no more than 40 words." +
                  "Do not respond to me, only respond to the user." +
                  "If the user input is not a song, please just make a guess and recommend a new song based off of that guess." +
                  "The user's input is "+user_text+"."
  console.log("Prompt:", prompt)

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const gemini_response = response.text();
  console.log("Gemini's generated response:", gemini_response);
}