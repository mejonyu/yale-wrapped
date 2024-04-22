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

        // Normalize by subtracting the pelvis position from the wrist positions
        var pelvis_x = frame.people[0].joints[0].position.x;
        var pelvis_y = frame.people[0].joints[0].position.y; 
        
        var left_wrist_x_normalized = (frame.people[0].joints[7].position.x - pelvis_x) * -1;
        var right_wrist_x_normalized = (frame.people[0].joints[10].position.x - pelvis_x) * -1;

        if (left_wrist_x_normalized > 200) {  
            return 'exit'; 
        } else if (right_wrist_x_normalized < -200) { 
            return 'continue'; 
        }

        return null;
    }
};
