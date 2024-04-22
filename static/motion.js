var host = "cpsc484-02.stdusr.yale.internal:8888";
$(document).ready(function() {
    frames.start();
});

var frames = {
    socket: null,

    start: function() {
        var url = "ws://" + host + "/frames";
        frames.socket = new WebSocket(url);
        frames.socket.onmessage = function(event) {
            var frameData = JSON.parse(event.data);
            var handCommand = frames.get_hand_command(frameData);

            if (handCommand === 'exit') {
                console.log("Left hand raised: Going back..."); 
                // window.history.back(); 
            } else if (handCommand === 'continue') {
                console.log("Right hand raised: Going forward...");
                // window.history.forward(); 
            }
        }
    },

    get_hand_command: function(frame) {
        if (frame.people.length < 1) {
            return null;
        }

        // Assuming left wrist index is 7 and right wrist index is 10
        var leftWrist = frame.people[0].joints[7].position.x;
        var rightWrist = frame.people[0].joints[10].position.x;


        if (leftWrist < -200) { 
            return 'exit'; 
        } else if (rightWrist > 200) { 
            return 'continue'; 
        }

        return null;
    }
};
