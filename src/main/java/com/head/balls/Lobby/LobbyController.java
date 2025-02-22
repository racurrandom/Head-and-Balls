package com.head.balls.Lobby;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.head.balls.GameWebSocketHandler;
import com.head.balls.Messages;
import com.head.balls.Auth.Auth;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/lobby")
public class LobbyController {

  private static final Map<String, Lobby> lobbies = new HashMap<String, Lobby>();
  private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
  private static ScheduledFuture<?> scheduledFuture;


  @GetMapping
  public LobbyInfo inLobby(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Get username
    String username = Auth.getUsername(session);

    //Not in a lobby
    if (!lobbies.containsKey(username)) 
      return new LobbyInfo("", "", 0);

    //Get lobby
    Lobby lobby = getLobby(username);

    //All good
    return new LobbyInfo(lobby.getHost(), lobby.getNoob(), lobby.isFull() ? 2 : 1);
  }

  @PostMapping("/create")
  public ResponseEntity<String> create(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Create lobby
    createLobby(Auth.getUsername(session));

    //All good
    return ResponseEntity.ok(Messages.lobbyCreated);
  }

  @PostMapping("/join")
  public ResponseEntity<String> join(HttpSession session, @RequestParam String host) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Join lobby
    joinLobby(host, Auth.getUsername(session));

    //All good
    return ResponseEntity.ok(Messages.lobbyJoined);
  }

  @PostMapping("/leave")
  public ResponseEntity<String> leave(HttpSession session) {
    //Check logged
    Auth.errorIfNotLogged(session);

    //Leave lobby
    leaveLobby(Auth.getUsername(session));

    //All good
    return ResponseEntity.ok(Messages.lobbyLeft);
  }


  public static Lobby getLobby(String username) {
    //Check if host is in lobby
    if (!lobbies.containsKey(username))
      throw new RuntimeException(Messages.lobbyNotInLobby);

    //Return lobby
    return lobbies.get(username);
  }

  private void createLobby(String username) {
    //Already in a lobby
    errorIfInLobby(username);

    //Create lobby with username as host
    lobbies.put(username, new Lobby(username));

    //Schedule
    if (lobbies.size() == 1) {
      //Create task
      Runnable task = () -> {
        //Get lobby keys
        ArrayList<String> keys = new ArrayList<>();
        for (String key: lobbies.keySet()) keys.add(key);

        //Remove inactive lobbies
        for (String key: keys) {
          Lobby lobby = lobbies.get(key);
          if (lobby.isFull() && !lobby.isActive()) lobbies.remove(key);
        }

        //Stop loop if no more lobbies
        if (lobbies.size() == 0) scheduledFuture.cancel(true);
      };

      //Schedule task
      scheduledFuture = scheduler.scheduleAtFixedRate(task, 5, 5, TimeUnit.SECONDS);
    }
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
      throw new RuntimeException(Messages.lobbyGameStarted);
    
    //User isn't host
    if (!lobby.getHost().equals(username))
      throw new RuntimeException(Messages.lobbyNotHost);

    //Leave lobby
    lobbies.remove(username);

    //No lobbies
    if (lobbies.size() <= 0) scheduledFuture.cancel(true);
  }

  public static void endLobby(Lobby lobby, boolean isError) {
    //Invalid lobby
    if (lobby == null) return;

    //Remove host
    if (lobbies.containsKey(lobby.getHost())) {
      lobbies.remove(lobby.getHost());
      GameWebSocketHandler.playerDisconnected(lobby.getSession(true));
    }
    
    //Remove noob
    if (lobbies.containsKey(lobby.getNoob())) {
      lobbies.remove(lobby.getNoob());
      GameWebSocketHandler.playerDisconnected(lobby.getSession(false));
    }

    //No lobbies
    if (lobbies.size() <= 0) scheduledFuture.cancel(true);

    //Destroy lobby
    lobby.OnEnd(isError);
  }


  private void errorIfInLobby(String username) {
    if (lobbies.containsKey(username))
      throw new RuntimeException(Messages.lobbyInLobby);
  }
  
  private void errorIfNotInLobby(String username) {
    if (!lobbies.containsKey(username))
      throw new RuntimeException(Messages.lobbyNotInLobby);
  }


  public record LobbyInfo(String host, String noob, int users) {
    public String getHost() { return host; }
    public String getNoob() { return noob; }
    public int getUsers() { return users; }
  }
}
