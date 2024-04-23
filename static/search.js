// Configuration for the WebSocket connection
const form = document.getElementById("song-form");
const songInput = document.getElementById("song");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const songValue = songInput.value.trim();
    if (songValue) {
        window.location = 'http://127.0.0.1:8000/add_song_to_playlist?song=' + songInput.value;
    }
});

var host = "cpsc484-02.stdusr.yale.internal:8888";
$(document).ready(function() {
    frames.start();
    sp2tx.start();
});

var frames = {
    socket: null,

    start: function() {
        var url = "ws://" + host + "/frames";
        frames.socket = new WebSocket(url);
        frames.socket.onmessage = function(event) {
            var frameData = JSON.parse(event.data);
            var handCommand = frames.get_left_wrist_command(frameData);

            if (handCommand === 'left') {
                window.location.reload(); // clear search bar
            } else if (handCommand === 'right') {
                document.getElementById("song-form").submit();
            }
        }
    },

    get_left_wrist_command: function (frame) {
        var command = null;
        if (frame.people.length < 1) {
          return command;
        }
    
        // Normalize by subtracting the root (pelvis) joint coordinates
        var pelvis_x = frame.people[0].joints[0].position.x;
        var pelvis_y = frame.people[0].joints[0].position.y;
        var pelvis_z = frame.people[0].joints[0].position.z;
        var left_wrist_x = (frame.people[0].joints[7].position.x - pelvis_x) * -1;
        var left_wrist_y = (frame.people[0].joints[7].position.y - pelvis_y) * -1;
        var left_wrist_z = (frame.people[0].joints[7].position.z - pelvis_z) * -1;

        // get right wrist coords
        var right_wrist_x = (frame.people[0].joints[14].position.x - pelvis_x) * -1;
        var right_wrist_y = (frame.people[0].joints[14].position.y - pelvis_y) * -1;
        var right_wrist_z = (frame.people[0].joints[14].position.z - pelvis_z) * -1;

        if (left_wrist_z < 100 && right_wrist_z < 100) {
          return command;
        }

        if (right_wrist_x > 200 && right_wrist_y > 500) {
            return "right";
        } else if (left_wrist_x < -200 && left_wrist_y > 500) {
            return "left";
        }
    
        return command;
      }
};

var sp2tx = {
    socket: null,
  
    start: function() {
      var url = "ws://" + host + "/sp2tx";
      sp2tx.socket = new WebSocket(url);
      sp2tx.socket.onmessage = function (event) {
        var text = event.data;
        if (text !== "") {
            console.log("Text received: "+text);
            recommendSong(text);
        }
      }
    }
  };

const gemini_api_key = 'hidden-api-key';
const genAI = new GoogleGenerativeAI(gemini_api_key);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

async function recommendSong(text){
  const prompt = "Recommend one song available on Spotify that evokes a similar mood and/or has a similar genre and style to the song: "+text+"." +
                  "The provided song may not be the full, correct name of the intended song." +
                  "Please make sure to state the full, correct name of the song and its artist as shown on Spotify in your response, matching as closely to the user input as possible" +
                  "Briefly justify this choice in a friendly and exciting way in no more than 45 words." +
                  "If "+text+" is not a song, please ask the user to try again with the name of a song."
//   console.log("Prompt:", prompt)

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const gemini_response = response.gemini_response();
  document.getElementById('song').value = gemini_response;
}


