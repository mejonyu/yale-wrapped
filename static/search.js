// Configuration for the WebSocket connection
const form = document.getElementById("song-form");
const songInput = document.getElementById("song");

// form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     window.location = 'http://0.0.0.0:5017/add_song_to_playlist?song=' + songInput.value;
// });

// motion logic
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var host = "cpsc484-02.stdusr.yale.internal:8888";
$(document).ready(async function() {
    await sleep(2000);
    frames.start();
});

var frames = {
    socket: null,

    start: function() {
        var submitted = false;
        var url = "ws://" + host + "/frames";
        frames.socket = new WebSocket(url);
        frames.socket.onmessage = function(event) {
            if (!submitted) {
                var frameData = JSON.parse(event.data);
                var handCommand = frames.get_left_wrist_command(frameData);
                if (handCommand === 'right') {
                    if (document.getElementById("song").value) {
                        window.location = 'http://0.0.0.0:5017/add_song_to_playlist?song=' + document.getElementById("song").value;
                        submitted = true;
                    }
                } else if (handCommand === 'left') {
                    document.getElementById("song").value = "";
                }
            } else {
                window.location = 'http://0.0.0.0:5017/results';
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

