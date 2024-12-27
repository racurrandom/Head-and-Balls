package com.head.balls.Auth;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  public AuthController() {
    //Init auth helper
    Auth.init();
  }



    /*$$$$$  /$$                           /$$
   /$$__  $$| $$                          | $$
  | $$  \__/| $$$$$$$   /$$$$$$   /$$$$$$$| $$   /$$
  | $$      | $$__  $$ /$$__  $$ /$$_____/| $$  /$$/
  | $$      | $$  \ $$| $$$$$$$$| $$      | $$$$$$/ 
  | $$    $$| $$  | $$| $$_____/| $$      | $$_  $$ 
  |  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \  $$
   \______/ |__/  |__/ \_______/ \_______/|__/  \_*/
  
  @GetMapping()
  public String check(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Get user
    User user = Auth.getUser(session);

    //Notify user is still online
    Auth.notifyOnline(user);

    //Return username
    return user.getUsername();
  }
 

  
    /*$$$$$                               /$$                    
   /$$__  $$                             |__/                    
  | $$  \__/  /$$$$$$   /$$$$$$$ /$$$$$$$ /$$  /$$$$$$  /$$$$$$$ 
  |  $$$$$$  /$$__  $$ /$$_____//$$_____/| $$ /$$__  $$| $$__  $$
   \____  $$| $$$$$$$$|  $$$$$$|  $$$$$$ | $$| $$  \ $$| $$  \ $$
   /$$  \ $$| $$_____/ \____  $$\____  $$| $$| $$  | $$| $$  | $$
  |  $$$$$$/|  $$$$$$$ /$$$$$$$//$$$$$$$/| $$|  $$$$$$/| $$  | $$
   \______/  \_______/|_______/|_______/ |__/ \______/ |__/  |_*/

  @PostMapping("/login")
  public ResponseEntity<String> login(HttpSession session, @Valid @RequestBody UserCredentials credentials) {
    //Check if user is valid
    credentials.checkValid();

    //Get user
    User user = Auth.getUser(credentials.getUsername());
    if (user.isOnline()) 
      throw new RuntimeException("User is already online");

    //Check if password is valid
    if (!Auth.encode(credentials.getPassword()).equals(user.getPassword())) 
      throw new InvalidCredentialsException("Invalid user credentials");

    //Login (save session)
    Auth.login(session, credentials.getUsername());

    //All good
    return ResponseEntity.ok("Logged in successfully");
  }
   
  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Get user
    User user = Auth.getUser(session);

    //Invalidate session
    session.setAttribute("username", null);
    session.invalidate();

    //Notify user as offline
    Auth.notifyOffline(user);

    //All good
    return ResponseEntity.ok("Logged out successfully");
  }
 
  @GetMapping("/users")
  public ArrayList<String> users(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Return users list
    return Auth.getOnlineUsers();
  }
  


    /*$$$$$                                  /$$     /$$                    
   /$$__  $$                                | $$    |__/                    
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
   \______/ |__/       \_______/ \_______/   \___/  |__/ \______/ |__/  |_*/

  @PostMapping("/register")
  public ResponseEntity<String> register(HttpSession session, @Valid @RequestBody UserCredentials credentials) {
    //Check if user is valid
    credentials.checkValid();

    //Check if exists
    Auth.errorIfExists(credentials.getUsername());

    //Encode password
    credentials.setPassword(Auth.encode(credentials.getPassword()));

    //Create user
    Auth.saveUser(new User(credentials));

    //Login (save session)
    Auth.login(session, credentials.getUsername());

    //All good
    return ResponseEntity.ok("User registered successfully");
  }

  @PutMapping("/update")
  public ResponseEntity<String> update(HttpSession session, @Valid @RequestBody UserCredentials credentials) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Check if user is valid
    credentials.checkValid();

    //Get user
    User user = Auth.getUser(session);

    //Encode password
    user.setPassword(Auth.encode(credentials.getPassword()));

    //Save user
    Auth.saveUser(user);

    //All good
    return ResponseEntity.ok("User registered successfully");
  }

  @DeleteMapping("/delete")
  public ResponseEntity<String> delete(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Get user
    User user = Auth.getUser(session);

    //Logout
    logout(session);

    //Delete user
    Auth.deleteUser(user);

    //All good
    return ResponseEntity.ok("User deleted successfully");
  }
}