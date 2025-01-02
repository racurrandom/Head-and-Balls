package com.head.balls.Lobby;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.head.balls.Auth.Auth;

public class Lobby {

  //Websocket protocol (types)
  public static final String CHARACTERS_INIT = "CI";
  public static final String CHARACTERS_SKIN = "CS";
  public static final String GAME_INIT = "GI";
  
  //Lobby usernames & websocket sessions
  private String host = "";
  private WebSocketSession hostSession;
  private String noob = "";
  private WebSocketSession noobSession;

  //Util
  private final ObjectMapper mapper = new ObjectMapper();
  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

  //Skin data 
  private int hostSkin = -1;
  private int noobSkin = -1;

  //Game info
  //bomba

  
  //Constructor
  Lobby(String host) {
    this.host = host;
  }

  //Getters & setters
  public String getHost() {
    return host;
  }

  public String getNoob() {
    return noob;
  }

  public WebSocketSession getSession(boolean isHost) {
    return isHost ? hostSession : noobSession;
  }

  public void setSession(boolean isHost, WebSocketSession session) {
    //Already ready
    if (isReady()) return;

    //Update session value
    if (isHost)
      hostSession = session;
    else
      noobSession = session;
    
    //Both ready -> Start game
    if (isReady()) initCharacters();
  }

  //Users
  public void join(String username) {
    //Lobby is full
    if (isFull())
      throw new RuntimeException("Lobby is already full");

    //User is already in the lobby
    if (contains(username))
      throw new RuntimeException("User is already in the lobby");

    //Join
    noob = username;
  }

  public boolean contains(String username) {
    return host.equals(username) || noob.equals(username);
  }

  public boolean isFull() {
    return !host.equals("") && !noob.equals("");
  }

  public boolean isActive() {
    try {
      return Auth.getUser(host).isOnline() && Auth.getUser(noob).isOnline();
    } catch (Exception e) {
      return false;
    }
  }
  
  public boolean isReady() {
    return hostSession != null && noobSession != null;
  }

  //WebSockets
  public void sendMessage(WebSocketSession session, String type, Object data) {
    //No data
    if (data == null) return;

    //Send message
    try {
      String message = type + mapper.writeValueAsString(data);
      synchronized (session) {
        session.sendMessage(new TextMessage(message));
      }
    } catch (IOException e) {
      System.out.println(e.getMessage());
    }
  }

  public void handleMessage(TextMessage message) {
    //Get message contents
    String content = message.getPayload();
    
    //Invalid message
    if (content.length() <= 2) return;

    //Get type & data
    String type = content.substring(0, 2);
    String data = content.substring(2);

    //Check type
    switch (type) {
      default:
        break;

      case "CS":
        changeSkin(data);
        break;
    }
  }

  //Characters scene
  private void initCharacters() {
    sendMessage(hostSession, CHARACTERS_INIT, "hi host");
    sendMessage(noobSession, CHARACTERS_INIT, "hi noob");
  }

  private void changeSkin(String _data){
    String[] data = _data.split(":");
    boolean host;
    switch (data[0]) {
      case "host":
        host = true;
        break;
      
      case "noob":
        host = false;
        break;

      default:
      //Receiver does not exist
      throw new RuntimeException("Error on skin receiver name");
    }
    int skin = Integer.parseInt(data[1]);

    //Skin is does not exist
    if(skin <= 0 || skin > 4) 
    throw new RuntimeException("Skin "+skin+" does not exist.");

    //Change skin
    if(host) hostSkin = skin;
    else noobSkin = skin;

    //Send change to other player
    sendMessage(host ? noobSession : hostSession, CHARACTERS_SKIN, skin);
  }

  //Game classes
  public class PlayerInfo {}
}