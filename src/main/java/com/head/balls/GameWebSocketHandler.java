package com.head.balls;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.head.balls.Lobby.Lobby;
import com.head.balls.Lobby.LobbyController;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;


@Component
public class GameWebSocketHandler extends TextWebSocketHandler {

  private final Map<String, PlayerConnection> loginQueue = new HashMap<>();
  private final Map<String, PlayerConnection> players = new HashMap<>();

  private final ObjectMapper mapper = new ObjectMapper();
  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

  public static final char SCENE_CHARACTERS = 'c';
  public static final char MENU_GAME = 'g';

  public static final char TYPE_INIT = 'i';


  private static class PlayerConnection {
    public WebSocketSession session;
    public boolean isHost;
    public Lobby lobby;

    private boolean isLogged = false;
    

    PlayerConnection(WebSocketSession session) {
      this.session = session;
    }

    public void login(String username) {
      //Already logged
      if (isLogged) return;

      //Login
      lobby = LobbyController.getLobby(username);
      isHost = lobby.getHost() == username;
    }
  }



  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    //Add player to login queue
    loginQueue.put(session.getId(), new PlayerConnection(session));

    System.out.println(session.getAttributes().size());
    session.getAttributes().forEach((key, value) -> {
      System.out.println("Key : " + key + " Value : " + value);
    });
  }



  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    try {
      //Get message contents
      String payload = message.getPayload();

      //Get scene, type & data
      char scene = payload.charAt(0);
      char type = payload.charAt(1);
      String data = payload.length() > 2 ? payload.substring(2) : "";

      //Check scene
      switch (scene) {

         /*$$$$$  /$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$$$$$$ 
        /$$__  $$| $$  | $$ /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$|__  $$__/| $$_____/| $$__  $$
       | $$  \__/| $$  | $$| $$  \ $$| $$  \ $$| $$  \ $$| $$  \__/   | $$   | $$      | $$  \ $$
       | $$      | $$$$$$$$| $$$$$$$$| $$$$$$$/| $$$$$$$$| $$         | $$   | $$$$$   | $$$$$$$/
       | $$      | $$__  $$| $$__  $$| $$__  $$| $$__  $$| $$         | $$   | $$__/   | $$__  $$
       | $$    $$| $$  | $$| $$  | $$| $$  \ $$| $$  | $$| $$    $$   | $$   | $$      | $$  \ $$
       |  $$$$$$/| $$  | $$| $$  | $$| $$  | $$| $$  | $$|  $$$$$$/   | $$   | $$$$$$$$| $$  | $$
        \______/ |__/  |__/|__/  |__/|__/  |__/|__/  |__/ \______/    |__/   |________/|__/  |_*/
        
        case SCENE_CHARACTERS: {
          switch (type) {
            //Login
            case TYPE_INIT:
              //Get player
              PlayerConnection player = loginQueue.get(session.getId());
              if (player == null) return;

              //Loggin player
              player.login(data);
              break;
          }
          break;
        }
        
          /*$$$$$   /$$$$$$  /$$      /$$ /$$$$$$$$
         /$$__  $$ /$$__  $$| $$$    /$$$| $$_____/
        | $$  \__/| $$  \ $$| $$$$  /$$$$| $$      
        | $$ /$$$$| $$$$$$$$| $$ $$/$$ $$| $$$$$   
        | $$|_  $$| $$__  $$| $$  $$$| $$| $$__/   
        | $$  \ $$| $$  | $$| $$\  $ | $$| $$      
        |  $$$$$$/| $$  | $$| $$ \/  | $$| $$$$$$$$
         \______/ |__/  |__/|__/     |__/|_______*/

        case MENU_GAME: {
          //Other types
          //PlayerConnection player = players.get(session.getId());
          break;
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
  
  private void sendMessage(WebSocketSession session, String type, Object data) {
    try {
      //Prepare message
      String message = type;
      if (data != null) message += mapper.writeValueAsString(data);

      //Send it
      synchronized (session) {
        session.sendMessage(new TextMessage(message));
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  
  
  
  @Override
  public void handleTransportError(WebSocketSession session, Throwable exception) {
    
  }



  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {

  }
}