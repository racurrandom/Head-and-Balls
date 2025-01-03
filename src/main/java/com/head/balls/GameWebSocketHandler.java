package com.head.balls;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.head.balls.Lobby.Lobby;
import com.head.balls.Lobby.LobbyController;

import java.util.*;


@Component
public class GameWebSocketHandler extends TextWebSocketHandler {

  private final Map<String, PlayerConnection> loginQueue = new HashMap<>();
  private final Map<String, PlayerConnection> players = new HashMap<>();


  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    //Already in queue (error?)
    if (loginQueue.containsKey(session.getId())) return;

    //Add player to login queue
    loginQueue.put(session.getId(), new PlayerConnection(session));
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    //Get id
    String id = session.getId();


    //Player is logged in -> Let its lobby handle the message
    if (players.containsKey(id)) {
      players.get(id).lobby.handleMessage(id, message);
      return;
    }


    //Not logged in -> Check if trying to login
    if (loginQueue.containsKey(id)) {
      //Get message contents
      String content = message.getPayload();
      
      //Invalid message
      if (content.length() <= 2) return;

      //Get type & data
      String type = content.substring(0, 2);
      String data = content.substring(2);

      //Type is CHARACTERS_INIT (init chatacters scene)
      if (type.equals(Lobby.CHARACTERS_INIT)) {
        //Remove player from login queue
        PlayerConnection player = loginQueue.remove(id);

        //Loggin player
        player.login(data);
        players.put(id, player);
      }
    }
  }
  
  @Override
  public void handleTransportError(WebSocketSession session, Throwable exception) {
    
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    //Get id
    String id = session.getId();

    //Player is not logged in
    if (!players.containsKey(id)) return;
    
    //Remove connection of player
    PlayerConnection player = players.remove(id);

    //End lobby
    LobbyController.endLobby(player.lobby);
  }


  //Classes
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
      try {
        //Get lobby & login websocket
        lobby = LobbyController.getLobby(username);
        isHost = lobby.getHost().equals(username);
        lobby.setSession(isHost, session);
        isLogged = true;
      } catch (Exception e) {
        System.out.println(e.getMessage());
      }
    }
  }
}