package com.head.balls.Lobby;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.head.balls.Auth.Auth;
import com.head.balls.Auth.User;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/lobby")
public class LobbyController {

  private static Map<String, Lobby> lobbies = new HashMap<String, Lobby>();


  @PostMapping("/create")
  public ResponseEntity<String> create(HttpSession session) {
    //Get host
    User user = Auth.getUser(session);

    //Already in a lobby
    errorIfInLobby(user.getUsername());

    //Create lobby
    lobbies.put(user.getUsername(), new Lobby(user.getUsername(), null));

    //All good
    return ResponseEntity.ok("Created successfully");
  }

  @PostMapping("/join")
  public ResponseEntity<String> join(HttpSession session, @RequestParam String host) {
    //Get host
    User user = Auth.getUser(session);

    //Already in a lobby
    errorIfInLobby(user.getUsername());

    //Check if host is in lobby
    if (!lobbies.containsKey(host))
      throw new RuntimeException("Host not in a lobby");

    //Get host lobby
    Lobby lobby = getLobby(host);

    //Join lobby
    lobby.noob = user.getUsername();
    lobbies.put(lobby.noob, lobby);

    //All good
    return ResponseEntity.ok("Joined successfully");
  }

  private Lobby getLobby(String username) {
    //Check if host is in lobby
    if (!lobbies.containsKey(username))
      throw new RuntimeException("Host is not in a lobby");

    //Return lobby
    return lobbies.get(username);
  }

  private void errorIfInLobby(String username) {
    if (lobbies.containsKey(username))
      throw new RuntimeException("User already in lobby");
  }
}
