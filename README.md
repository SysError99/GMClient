# GMClient
An extension made for enhancing GameMaker:Studio 1.4 features and prolong its lifetime.
---

# Usage
Compress this project as `7-Zip` archive, then change its extension from `.7z` to `.gmez`.

Import file to the project and start using it!

If you want to use this extension for networking via WebSocket, just change network location of `webSocketAddress` inside `./client/client.js` to your server address.
---

# References
There are plenty of command you can use in GML, as shown below:

### Audio
This category indicates functions related to media audio player.
1. `audio_play(url_file_location:string)` Plays audio as `Media`. (any medias or this can be interrupted by this or another media)
2. `audio_stop()` Stops currently playing audio media.

### Browser
This category indicates functions related to dialogs, necessary if this game is running via SysError99's WebApp
1. `dialog_alert(text:string)` Shows native dialog. This returns void.
2. `dialog_confirm(text:string ,hint:string)` Shows confirmation dialog. This returns text. But if this is 
3. `dialog_prompt(text:string, default:string)` Shows prompt dialog.
4. `full_screen()` Triggers canvas full-screen mode for the canvas. Returns 1 (number) if full-screen is successful, and 0 (number) if failed.

### Local Storage
This category indicates functions for load and save strings into browser's local storage (Can be used with SysError99's WebApp)
1. `load_data(location:string)` Load file from storage. Returns string.
2. `save_data(location:string, data:string)` Save string to localstorage.

### Networking
This category indicates functions for communicating with a web server via WebSocket.
1. `network_open()` Connect to a server with an address specified inside of file `./client/client.js`.
2. `network_receive()` Retreives any message that server have sent to the client. You should put this command inside `Step` loop to continuously retrieve anything from the server or connection status. Returns empty string when there is nothing happend. Returns connection status when there is a report of connection status. Returns string of data when there is some data received from a server.
#### Connection Status
 - `connected` Happens when a connection is established.
 - `error` Happens when there is an error occured.
 - `close` Happens when a connection is closed.
Example:
```javascript
    // Put this inside 'Step' Event!
    var received_message = network_receive();

    if (received_message != "") {
        switch (received_message) {
            case "connected":
                show_message("Connected to a server.");
                break;
            case "error":
                show_message("An error occured to the connection.");
                break;
            case "close":
                show_message("Connection is closed");
                break;
            default:
                show_message("This is a message from server:" + received_message);
                break;
        }
    }
```
3. `network_send(message:string)` Send a message to a server.

### SysError99's WebApp related functions
This category indicates only one function. `is_app()` checks if this app is running inside SysError's WebApp. Returns 1 if it is, and 0 if it's not.

### Multi-Touch
This category indicates multi-touch functions.
Example:
```javascript
// Put this function inside 'Step' Event~
touch_invoke(room_width,room_height); //start touch instance with defined screen resolution.

var touch_start_id;
var touch_end_id;
var touch_move_id;

do {
    // When Touch begins, like mouse_check_button_pressed()
    touch_start_id = touch_start();  //get ID of each touch

    if (touch_start_id > -1) { //if touch exists
        // Usage Example
        draw_sprite(spr_test, 1, touch_x(touch_start_id), touch_y(touch_start_id));
        draw_set_font(font_default);
        draw_text_ext(touch_x(touch_start_id),touch_y(touch_start_id),string(touch_start_id), 60, 200);
    }
} until (touch_start_id < 0);


do {
    // When Touch ends, like mouse_check_button_released()
    touch_end_id = touch_end(); //get ID of each touch

    if (touch_end_id > -1) {
        // Usage Example
        draw_sprite(spr_test, 2, touch_x(touch_end_id), touch_y(touch_end_id));
        draw_set_font(font_default);
        draw_text_ext(touch_x(touch_end_id), touch_y(touch_end_id), string(touch_end_id), 60, 200);
    }
} until (touch_end_id < 0);

do {
    // When Touch continuously happens (holding), like mouse_check_button()
    touch_move_id = touch_move(); //get ID of each touch

    if (touch_move_id > -1) {
        // Usage Example
        draw_sprite(spr_test,0,touch_x(touch_move_id),touch_y(touch_move_id));
        draw_set_font(font_default);
        draw_text_ext(touch_x(touch_move_id), touch_y(touch_move_id), string(touch_move_id), 60, 200);
    }
} until (touch_move_id < 0);

touch_clean(); //end touch instance.

```
#### Limitations
This extenstion only works with only `one instance`. If you want to use it in multiple instances, I'd recommend using `with` statement to call each instances you want instead:
```javascript
touch_invoke(room_width,room_height); //start touch instance with defined screen resolution.

var touch_start_id;
var touch_end_id;
var touch_move_id;

do {
    touch_start_id = touch_start();
    if (touch_start_id > -1) {
        // Set global values for instances.
        global.touch_id = touch_start_id;
        global.touch_x = touch_x(touch_start_id);
        global.touch_y = touch_y(touch_start_id);
        // Call instances
        with(obj_joystick) {
            event_perform("ev_mouse","ev_left_press");
            // then use global variables
        }
    }
} until (touch_start_id < 0);

do {
    touch_end_id = touch_end();
    if (touch_end_id > -1) {
        // Set global values for instances.
        global.touch_id = touch_start_id;
        global.touch_x = touch_x(touch_start_id);
        global.touch_y = touch_y(touch_start_id);
        // Call instances
        with(obj_joystick) {
            event_perform("ev_mouse","ev_left_release");
        }
    }
} until (touch_end_id < 0);

do {
    touch_move_id = touch_move();
    if (touch_move_id > -1) {
        // Set global values for instances.
        global.touch_id = touch_start_id;
        global.touch_x = touch_x(touch_start_id);
        global.touch_y = touch_y(touch_start_id);
        // Call instances
        with(obj_joystick) {
            event_perform("ev_mouse","ev_left_button);
        }
    }
} until (touch_move_id < 0);

touch_clean(); //end touch instance.

```

