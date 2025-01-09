package com.head.balls.Auth;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.head.balls.Messages;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@SuppressWarnings("unchecked")
public class Auth {

  private static ArrayList<String> online = new ArrayList<>();
  private static Map<String, User> users = new HashMap<String, User>();


  public static void init() {
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
      throw new RuntimeException(Messages.authEncodeError);
    }
  }

  public static String getUsername(HttpSession session) {
    //Return username, null if not logged in
    return (String) session.getAttribute("username");
  }

  public static User getUser(String username) {
    //Check if user exists
    errorIfNotExists(username);
    
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

  public static void notifyOnline(@Valid User user) {
    //Notify user is online
    user.notifyOnline();

    //Get username
    String username = user.getUsername();

    //User was already online -> Remove it from list
    if (online.contains(username)) online.remove(username);
    
    //Add user to online list (at first position)
    online.add(0, username);
  }

  public static void notifyOffline(@Valid User user) {
    //Notify user is online
    user.notifyOffline();

    //Get username
    String username = user.getUsername();

    //User was already online -> Remove it from list
    if (online.contains(username)) online.remove(username);
  }

  private static void removeInactiveUsers() {
    //Loop users
    for (int i = online.size() - 1; i >= 0; i--) {
      //Get user
      User user = users.get(online.get(i));
      
      //Online -> Stop since users following notified online after him
      if (user.isOnline()) return;

      //Offline -> Remove user
      notifyOffline(user);
    }
  }

  public static ArrayList<String> getOnlineUsers() {
    //Remove inactive users
    removeInactiveUsers();

    //Return a copy of the online users list
    return (ArrayList<String>) online.clone();
  }

  public static void printOnlineUsers() {
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


  
    /*$$$$$                               /$$                    
   /$$__  $$                             |__/                    
  | $$  \__/  /$$$$$$   /$$$$$$$ /$$$$$$$ /$$  /$$$$$$  /$$$$$$$ 
  |  $$$$$$  /$$__  $$ /$$_____//$$_____/| $$ /$$__  $$| $$__  $$
   \____  $$| $$$$$$$$|  $$$$$$|  $$$$$$ | $$| $$  \ $$| $$  \ $$
   /$$  \ $$| $$_____/ \____  $$\____  $$| $$| $$  | $$| $$  | $$
  |  $$$$$$/|  $$$$$$$ /$$$$$$$//$$$$$$$/| $$|  $$$$$$/| $$  | $$
   \______/  \_______/|_______/|_______/ |__/ \______/ |__/  |_*/

  public static boolean isLogged(HttpSession session) {
    return users.containsKey(session.getAttribute("username"));
  }

  public static void errorIfNotLogged(HttpSession session) {
    //Not logged in
    if (!isLogged(session)) 
      throw new InvalidCredentialsException(Messages.authNotLoggedIn);
  }

  public static void login(HttpSession session, @Valid String username) {
    //Save username in session
    session.setAttribute("username", username);

    //Notify user as online
    notifyOnline(getUser(username));
  }



    /*$$$$$                                  /$$     /$$                    
   /$$__  $$                                | $$    |__/                    
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
   \______/ |__/       \_______/ \_______/   \___/  |__/ \______/ |__/  |_*/

  public static boolean userExists(String username) {
    return users.containsKey(username);
  }

  public static void errorIfExists(String username) {
    //Check if exists
    if (userExists(username)) 
      throw new InvalidCredentialsException(Messages.userExists);
  }

  public static void errorIfNotExists(String username) {
    //Check if exists
    if (!userExists(username)) 
      throw new InvalidCredentialsException(Messages.userNotExists);
  }

  public static void saveUser(@Valid User user) {
    users.put(user.getUsername(), user);
    saveUsers();
  }

  public static void deleteUser(@Valid User user) {
    users.remove(user.getUsername());
    saveUsers();
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

  private static void loadUsers() {
    //Log
    System.out.println("Loading users file...");

    users = new HashMap<String, User>();

    //Load users (json)
    try (BufferedReader br = new BufferedReader(new FileReader("users.json"))) {
      //Read text
      StringBuilder sb = new StringBuilder();
      String line = br.readLine();
      while (line != null) {
          sb.append(line);
          sb.append(System.lineSeparator());
          line = br.readLine();
      }
      String everything = sb.toString();
      
      //Parse json
      users = new Gson().fromJson(everything, new TypeToken<HashMap<String, User>>(){}.getType());
    } catch (IOException e) {
      System.err.println("Error loading users file: " + e.getMessage());
    }

    /*//Load users (sav)
    try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("users.sav"))) {
      users = (HashMap<String, User>) ois.readObject();
    } catch (IOException | ClassNotFoundException e) {
      System.err.println("Error loading users file: " + e.getMessage());
    }*/
  }

  private static void saveUsers() {
    //Log
    System.out.println("Saving users file...");

    //Save users (json)
    try (FileWriter myWriter = new FileWriter("users.json")) {
      myWriter.write(new GsonBuilder().setPrettyPrinting().create().toJson(users));
      myWriter.close();
    } catch (IOException e) {
      System.err.println("Error saving users file: " + e.getMessage());
    }

    /*//Save users (sav)
    try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("users.sav"))) {
      oos.writeObject(users);
    } catch (IOException e) {
      System.err.println("Error saving users file: " + e.getMessage());
    }*/
  }
}
