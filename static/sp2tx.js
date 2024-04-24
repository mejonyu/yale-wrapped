// https://github.com/Yale-CPSC484-HCI/demo-gemini/blob/main/script.js

// import { GoogleGenerativeAI } from "@google/generative-ai";


var host = "cpsc484-02.stdusr.yale.internal:8888";
$(document).ready(function() {
  sp2tx.start();
});

var sp2tx = {
  socket: null,

  start: function() {
    var url = "ws://" + host + "/sp2tx";
    sp2tx.socket = new WebSocket(url);
    sp2tx.socket.onmessage = function (event) {
      var text = event.data;
      if (text !== "") {
          document.getElementById("song").value = text;
          console.log(text);
      }
    }
  }
// };


// const gemini_api_key = 'hidden-api-key';
// const genAI = new GoogleGenerativeAI(gemini_api_key);
// const model = genAI.getGenerativeModel({model: "gemini-pro"});


// async function recommendSong(text){
//   const prompt = "Recommend one song available on Spotify that evokes a similar mood and/or has a similar genre and style to the song: "+text+"." +
//                   "The provided song may not be the full, correct name of the intended song." +
//                   "Please make sure to state the full, correct name of the song and its artist as shown on Spotify in your response, matching as closely to the user input as possible" +
//                   "Briefly justify this choice in a friendly and exciting way in no more than 45 words." +
//                   "If "+text+" is not a song, please ask the user to try again with the name of a song."
//   console.log("Prompt:", prompt)

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const gemini_response = response.gemini_response();
//   console.log("Gemini's generated response:", gemini_response);
}
