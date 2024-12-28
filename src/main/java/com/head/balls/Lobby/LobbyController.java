package com.head.balls.Lobby;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.head.balls.Auth.Auth;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/lobby")
public class LobbyController {

  private static Map<String, Lobby> lobbies = new HashMap<String, Lobby>();


  @PostMapping("/create")
  public ResponseEntity<String> create(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Create lobby
    createLobby(Auth.getUsername(session));

    //All good
    return ResponseEntity.ok("Created successfully");
  }

  @PostMapping("/join")
  public ResponseEntity<String> join(HttpSession session, @RequestParam String host) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Join lobby
    joinLobby(host, Auth.getUsername(session));

    //All good
    return ResponseEntity.ok("Joined successfully");
  }

  @PostMapping("/leave")
  public ResponseEntity<String> leave(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Leave lobby
    leaveLobby(Auth.getUsername(session));

    //All good
    return ResponseEntity.ok("Joined successfully");
  }


  private Lobby getLobby(String username) {
    //Check if host is in lobby
    if (!lobbies.containsKey(username))
      throw new RuntimeException("User is not in a lobby");

    //Return lobby
    return lobbies.get(username);
  }

  private void createLobby(String username) {
    //Already in a lobby
    errorIfInLobby(username);

    //Create lobby with username as host
    lobbies.put(username, new Lobby(username));
  }

  private void joinLobby(String host, String noob) {
    //Already in a lobby
    errorIfInLobby(noob);

    //Get host lobby
    Lobby lobby = getLobby(host);

    //Join lobby
    lobby.join(noob);
    lobbies.put(noob, lobby);
  }

  private void leaveLobby(String username) {
    //Not in a lobby
    errorIfNotInLobby(username);

    //Get lobby
    Lobby lobby = getLobby(username);

    //Lobby is full -> Game already started
    if (lobby.isFull())
      throw new RuntimeException("Can't leave the lobby if the game has started");
    
    //User isn't host
    if (!lobby.isHost(username))
      throw new RuntimeException("Cant leave the lobby if you are not the host");

    //Leave lobby
    lobbies.remove(username);
  }


  private void errorIfInLobby(String username) {
    if (lobbies.containsKey(username))
      throw new RuntimeException("User already in lobby");
  }
  
  private void errorIfNotInLobby(String username) {
    if (!lobbies.containsKey(username))
      throw new RuntimeException("User already in lobby");
  }
}
