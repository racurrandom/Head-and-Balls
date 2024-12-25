package com.head.balls.Auth;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private static ArrayList<String> online = new ArrayList<>();
  private static Map<String, User> users = new HashMap<String, User>();


  public AuthController() {
    //Load users
    loadUsers();
  }


  
   /*$   /$$   /$$     /$$ /$$
  | $$  | $$  | $$    |__/| $$
  | $$  | $$ /$$$$$$   /$$| $$
  | $$  | $$|_  $$_/  | $$| $$
  | $$  | $$  | $$    | $$| $$
  | $$  | $$  | $$ /$$| $$| $$
  |  $$$$$$/  |  $$$$/| $$| $$
   \______/    \___/  |__/|_*/

  public static String encode(String input) {
    try {
      //Create instance for hashing using SHA256
      MessageDigest hasher = MessageDigest.getInstance("SHA-256");
  
      //digest() method called to calculate message digest of an input and return array of byte
      byte[] hash = hasher.digest(input.getBytes(StandardCharsets.UTF_8));
  
      //Convert byte array of hash into digest
      BigInteger number = new BigInteger(1, hash);
  
      //Convert the digest into hex value
      StringBuilder hexString = new StringBuilder(number.toString(16));
  
      //Pad with leading zeros
      while (hexString.length() < 32) hexString.insert(0, '0');
  
      //Return encrypted string
      return hexString.toString();
    } catch (NoSuchAlgorithmException e) {
      //Error
      throw new RuntimeException("Error while encoding password");
    }
  }

  public static boolean isLogged(HttpSession session) {
    return users.containsKey(session.getAttribute("username"));
  }

  public static String getUsername(HttpSession session) {
    //Return username, null if not logged in
    return (String) session.getAttribute("username");
  }

  public static User getUser(String username) {
    //Check if user exists
    if (!users.containsKey(username)) throw new InvalidCredentialsException("User does not exists");
    
    //Return user
    return users.get(username);
  }

  public static User getUser(HttpSession session) {
    //Return user
    return getUser(getUsername(session));
  }



    /*$$$$$            /$$ /$$
   /$$__  $$          | $$|__/
  | $$  \ $$ /$$$$$$$ | $$ /$$ /$$$$$$$   /$$$$$$ 
  | $$  | $$| $$__  $$| $$| $$| $$__  $$ /$$__  $$
  | $$  | $$| $$  \ $$| $$| $$| $$  \ $$| $$$$$$$$
  | $$  | $$| $$  | $$| $$| $$| $$  | $$| $$_____/
  |  $$$$$$/| $$  | $$| $$| $$| $$  | $$|  $$$$$$$
   \______/ |__/  |__/|__/|__/|__/  |__/ \______*/

  @PostMapping("/notify")
  public ResponseEntity<String> notify(HttpSession session) {
    //Check logged
    checkIfLogged(session);

    //Get user
    User user = getUser(session);

    //Notify user is still online
    user.notifyOnline();
    notifyOnline(user.getUsername());

    //Print online users
    printOnlineUsers();

    //All good
    return ResponseEntity.ok("User still online");
  }

  private void notifyOnline(String username) {
    //User was already online -> Remove it from list
    if (online.contains(username)) online.remove(username);
    
    //Add user to online list (at first position)
    online.add(0, username);
  }

  private void removeInactiveUsers() {
    //Loop users
    for (int i = online.size() - 1; i >= 0; i--) {
      //Get user
      User user = users.get(online.get(i));
      
      //Online -> Stop since users following notified online after him
      if (user.isOnline()) return;
    }
  }

  private void printOnlineUsers() {
    //Remove inactive users
    removeInactiveUsers();

    //Print divider
    System.out.println("_______________");

    //Print users
    for (int i = 0; i < online.size(); i++) {
      //Get user
      User user = users.get(online.get(i));

      //Print it
      System.out.println(user.getUsername() + " · " + user.idleTime() + "/" + User.timeoutDuration);
    }
  }



    /*$$$$$  /$$                           /$$
   /$$__  $$| $$                          | $$
  | $$  \__/| $$$$$$$   /$$$$$$   /$$$$$$$| $$   /$$
  | $$      | $$__  $$ /$$__  $$ /$$_____/| $$  /$$/
  | $$      | $$  \ $$| $$$$$$$$| $$      | $$$$$$/ 
  | $$    $$| $$  | $$| $$_____/| $$      | $$_  $$ 
  |  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \  $$
   \______/ |__/  |__/ \_______/ \_______/|__/  \_*/
  
  public static void checkIfLogged(HttpSession session) {
    //Throws an error if not logged in

    //Not logged in
    if (!isLogged(session)) throw new InvalidCredentialsException("Not logged in");
  }

  @GetMapping("/check")
  public String check(HttpSession session) {
    //Check logged
    checkIfLogged(session);

    //Get user
    User user = getUser(session);

    //Notify user is still online
    notifyOnline(user.getUsername());

    //Return username
    return user.getUsername();
  }

  @PutMapping("/update")
  public ResponseEntity<String> update(HttpSession session, @Valid @RequestBody UserCredentials credentials) {
    //Check logged
    checkIfLogged(session);

    //Check if user is valid
    credentials.checkValid();

    //Get user
    User user = getUser(session);

    //Encode password
    String encodedPassword = encode(credentials.getPassword());

    //Update user
    user.setPassword(encodedPassword);
    saveUsers();

    //Login (save session)
    saveSession(session, user.getUsername());

    //All good
    return ResponseEntity.ok("User registered successfully");
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
    if (users.containsKey(credentials.getUsername()))
      throw new InvalidCredentialsException("User already exists");

    //Get encoded password
    String encodedPassword = encode(credentials.getPassword());
    
    //Save encoded password
    credentials.setPassword(encodedPassword);

    //Save user
    users.put(credentials.getUsername(), new User(credentials));
    saveUsers();

    //Login (save session)
    saveSession(session, credentials.getUsername());

    //All good
    return ResponseEntity.ok("User registered successfully");
  }

  @DeleteMapping("/delete")
  public ResponseEntity<String> delete(HttpSession session) {
    //Check logged
    checkIfLogged(session);

    //Get user
    User user = getUser(session);

    //Delete user
    users.remove(user.getUsername());
    saveUsers();

    //Logout
    logout(session);

    //All good
    return ResponseEntity.ok("User deleted successfully");
  }



   /*$                           /$$
  | $$                          |__/
  | $$        /$$$$$$   /$$$$$$  /$$ /$$$$$$$ 
  | $$       /$$__  $$ /$$__  $$| $$| $$__  $$
  | $$      | $$  \ $$| $$  \ $$| $$| $$  \ $$
  | $$      | $$  | $$| $$  | $$| $$| $$  | $$
  | $$$$$$$$|  $$$$$$/|  $$$$$$$| $$| $$  | $$
  |________/ \______/  \____  $$|__/|__/  |__/
                       /$$  \ $$
                      |  $$$$$$/
                       \_____*/

  @PostMapping("/login")
  public ResponseEntity<String> login(HttpSession session, @Valid @RequestBody UserCredentials credentials) {
    //Check if user is valid
    credentials.checkValid();

    //Get user
    User user = getUser(credentials.getUsername());
    if (user.isOnline()) throw new RuntimeException("User is already online");

    //Get encoded password
    String encodedPassword = encode(credentials.getPassword());

    //Invalid user
    if (!encodedPassword.equals(user.getPassword())) 
      throw new InvalidCredentialsException("Invalid user credentials");

    //Save session
    saveSession(session, credentials.getUsername());

    //All good
    return ResponseEntity.ok("Logged in successfully");
  }
  
  private void saveSession(HttpSession session, String username) {
    //Save username in session
    session.setAttribute("username", username);

    //Update user online timestamp
    User user = users.get(username);
    user.notifyOnline();
    
    //Notify user as online
    notifyOnline(username);
  }
  
  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpSession session) {
    //Check logged
    checkIfLogged(session);

    //Invalidate session
    session.setAttribute("username", null);
    session.invalidate();

    //Remove user from online list
    online.remove(getUsername(session));
 
    //All good
    return ResponseEntity.ok("Logged out successfully");
  }



    /*$$$$$   /$$                                                     
   /$$__  $$ | $$                                                     
  | $$  \__//$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$ 
  |  $$$$$$|_  $$_/   /$$__  $$ /$$__  $$|____  $$ /$$__  $$ /$$__  $$
   \____  $$ | $$    | $$  \ $$| $$  \__/ /$$$$$$$| $$  \ $$| $$$$$$$$
   /$$  \ $$ | $$ /$$| $$  | $$| $$      /$$__  $$| $$  | $$| $$_____/
  |  $$$$$$/ |  $$$$/|  $$$$$$/| $$     |  $$$$$$$|  $$$$$$$|  $$$$$$$
   \______/   \___/   \______/ |__/      \_______/ \____  $$ \_______/
                                                   /$$  \ $$
                                                  |  $$$$$$/
                                                   \_____*/

  @SuppressWarnings("unchecked")
  private void loadUsers() {
    //Log
    System.out.println("Loading users file...");

    //Try to load users
    try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("users.sav"))) {
      users = (HashMap<String, User>) ois.readObject();
    } catch (IOException | ClassNotFoundException e) {
      System.err.println("Error loading users file: " + e.getMessage());
    }
  }

  private void saveUsers() {
    //Log
    System.out.println("Saving users file...");

    //Try to save users
    try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("users.sav"))) {
      oos.writeObject(users);
    } catch (IOException e) {
      System.err.println("Error saving users file: " + e.getMessage());
    }
  }
}