# GMClient
An extension made for enhancing GameMaker:Studio 1.4 features and prolong its lifetime.

This plugin mainly supports majority of browsers, some features of Cordova and its plug-ins, and SysError99's WebApp.

---
# Notes for Cordova
This section mostly applies to mobile platform (Android and iOS) only.

## Config.XML file
There are some of configurations inside `<widget>` tag of `config.xml` file. These below are the required in order to make your app function properly.
1. Fixed orientation, strict your game orientation mode, works on every platforms.
```xml
<preference name="Orientation" value="landscape" />
```
2. Full-screen mode (Android), make your game in 'immersive mode'.
```xml
<preference name="Fullscreen" value="true" />
```
3. High-DPI mode (iOS), to prevent low-resolution when scaling your game.
```xml
<preference name="EnableViewportScale" value="true"/>
```

## Plug-ins
If you want to export the project with Cordova, these are plug-ins required to operate the app correctly.
 - [cordova-ios-fullscreen](https://github.com/innowatio/cordova-ios-fullscreen.git) (iOS)
 - cordova-plugin-viewport (Android), for high-DPI mode.

---
# Usage
Compress this project as `7-Zip` archive, then change its extension from `.7z` to `.gmez`.

Import file to the project and start using it!

If you want to use this extension for networking via WebSocket, just change network location of `webSocketAddress` inside `./client/client.js` to your server address.

---
# References
There are plenty of command you can use in GML, as shown below:

## Configuration
This section indicates all configuration being made inside of `./client/client.js`
1. `highDPI` (boolean) Enables high-resolution mode for canvas.

## GML References
This section indicates all GML functions can be used.

### Audio
This category indicates functions related to media audio player.
1. `audio_play(url_file_location:string)` Plays audio as `Media`. (any medias or this can be interrupted by this or another media)
2. `audio_stop()` Stops currently playing audio media.

### Browser
This category indicates functions related to browesr, necessary if this game is running via SysError99's WebApp
1. `browser_reload()` Reloads a browser.
2. `dialog_alert(text:string)` Shows native dialog. This returns void.
3. `dialog_confirm(text:string ,hint:string)` Shows confirmation dialog. This returns boolean, but if this runs on SysError99's WebApp, this will not return anything. You will need to retrieve value via `network_receive()` instead. The event will be pushed as text of JSON object, like below:
```json
{
  "res": "NATIVE_confirm",
  "name": {{dialog_name}},
  "data": {{true/false}}
}
```
4. `dialog_prompt(text:string, default:string)` Shows prompt dialog. This returns text, but if this runs on SysError99's WebApp, this will not return anything. You will need to retrieve value via `network_receive()` instead. The event will be pushed as text of JSON object, like below:
```json
{
  "res": "NATIVE_prompt",
  "name": {{dialog_name}},
  "data": {{user_input}}
}
```
5. `full_screen()` Triggers canvas full-screen mode for the canvas. Returns 1 (number) if full-screen is successful, and 0 (number) if failed. (unreliable if in `highDPI`)
6. `is_full_screen()` Checks if the screen is full-screen, 1 if true, and 0 if false. (unreliable if in `highDPI`)

### Local Storage
This category indicates functions for load and save strings into browser's local storage (Can be used with SysError99's WebApp)
1. `load_data(location:string)` Load file from storage. Returns string.
2. `save_data(location:string, data:string)` Save string to localstorage.

### Networking
This category indicates functions for communicating with a web server via WebSocket.
1. `network_open(addr:string)` Connect to a server with a specified address.
2. `network_receive()` Retreives any message that server have sent to the client. You should put this command inside `Step` loop to continuously retrieve anything from the server or connection status. Returns empty string when there is nothing happend. Returns connection status when there is a report of connection status. Returns string of data when there is some data received from a server.

Connection Status:
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
// Put this function inside 'Step' Event.
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
---

# Examples
This section shows an example of use cases of this extension

## Automatic scaling & rotation warning
Create an object, then put all of these codes for each sections.

1. Create:
```javascript
// Resolution
game_width = 1600;
game_height = 900;

surface_current_width = 1;
surface_current_height = 1;

window_width = game_width;
window_height = game_height;

// Incorrect orientation variables
browser_refreshed = false;
incorrect_orientation = false;

// Check incorrect orientation
if (browser_width / browser_height < 1)
    incorrect_orientation = true;

```

2. Step:
```javascript
// Any mouse interactions will make the game full-screen on broewser.
if (mouse_check_button_pressed(mb_left))
    full_screen();

// Resolution
if (window_width != browser_width ||
    window_height != browser_height) { 
    var browser_scale = browser_height / (game_height + 10);
    var width_scale = floor(browser_scale * game_width);
    
    if(width_scale > browser_width){
        browser_scale = browser_width / (game_width + 10);
        width_scale = floor(browser_scale * game_width);
    }
    
    var height_scale = floor(browser_scale * game_height);

    window_width = browser_width;
    window_height = browser_height;
    window_set_size(width_scale, height_scale);
    window_center();
}

// Surface scaling, referred from room size.
if (room_width != surface_current_width ||
    room_height != surface_current_height) {
    surface_current_width = room_width;
    surface_current_height = room_height;
    surface_resize(application_surface, surface_current_width, surface_current_height);
}

// Warn incorrect orientation
if (incorrect_orientation) {
    if (room != room_rotate) {
        prev_room = room;
        room_goto(room_rotate); /// go to the room that will tell user to rotate the screen.
    }
    
    if (browser_width / browser_height >= 1) {
        if (!browser_refreshed) { 
            browser_reload();
            browser_refreshed = true; // Stop the game to refresh the browser once again.
        }
    }
}

```

---
# Future Releases
In further release there will be some of more features supported, like IAP, and monetization. But that's just been very far and requires some of my requirements to fulfill it in. Still, there are a lot of work, but it will eventually happen when my demand rises up.
