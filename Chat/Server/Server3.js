//try {
    //  Create a new TCP client socket and connect to remote host
    var mySocket = new TCPSocket ("127.0.0.1", 6789);
    mySocket.onopen = function() {
        try {
            // Send data to server
            var moreBufferingOK = mySocket.send("Hello World");
            console.log('Data sent to server!');

            // Receive response from server
            mySocket.onmessage = function (messageEvent) {
                // Convert received data from ArrayBuffer to string
                var data = arrayBufferToString (messageEvent.data);
                console.log('Data received from server: ' + data);

                // Close the connection
                mySocket.close();
            }
        }
        catch(err) {
            // Sending failed
            console.error('Sending failed: ' + err.name);
        }
    }

    // Connection has been closed
    mySocket.onclose = function() {
        console.log('Connection has been closed');
    }

    // Handle errors
    mySocket.onerror = function(err) {
        console.error('Error: ' + err.name);
    }
/*}
catch(err) {
    // Handle runtime exception
    console.error('Could not create a TCP socket: ' + err.name);
}*/