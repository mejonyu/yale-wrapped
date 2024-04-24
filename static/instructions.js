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
            var handCommand = frames.get_command(frameData);

            if (handCommand === 'right') {
                window.location.href = 'http://0.0.0.0:5017/search';
            } else if (handCommand === 'left') {
                window.location.href = 'http://0.0.0.0:5017/results';
            }
        }
    },

    get_command: function (frame) {
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

