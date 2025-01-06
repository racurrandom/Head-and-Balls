package com.head.balls.Lobby;

import java.io.IOException;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.head.balls.Auth.Auth;

public class Lobby {

  //Websocket protocol (types)
  public static final String CHARACTERS_INIT = "CI";
  public static final String CHARACTERS_SKIN = "CS";
  public static final String CHARACTERS_READY = "CR";
  public static final String GAME_INIT = "GI";
  public static final String GAME_PLAYER = "GP";        //Player position & velocity
  public static final String GAME_BALL = "GB";          //Ball position & velocity
  public static final String GAME_KICK = "GK";          //Player kicked ball
  public static final String GAME_ANIMATE = "GA";       //Play kick animation
  public static final String GAME_GOAL = "GG";          //Player scoared a goal
  public static final String GAME_RESET = "GR";         //Reset map
  public static final String GAME_POWERSPAWN = "GS";    //Spawn powerup
  public static final String GAME_POWERUSE = "GU";      //Use powerup
  public static final String ERROR_DISCONNECTED = "ED"; //Error, one user disconnected
  
  //Lobby usernames & websocket sessions
  private String host = "";
  private WebSocketSession hostSession;
  private String noob = "";
  private WebSocketSession noobSession;

  //Util
  private final ObjectMapper mapper = new ObjectMapper();
  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

  //Scenes
  private CharactersInfo characters;
  private GameInfo game;

  
  //Constructor
  Lobby(String host) {
    this.host = host;
  }

  public void OnEnd(boolean isError) {
    //Close sockets
    try {
      if (hostSession.isOpen()) {
        //Tell user an error ocurred
        if (isError) sendMessage(hostSession, ERROR_DISCONNECTED);
        //Close socket
        else hostSession.close();
      }
    } catch (Exception e) {
      System.out.println("Error closing host socket: " + e.getMessage());
    }
    try {
      if (noobSession.isOpen()) {
        //Tell user an error ocurred
        if (isError) sendMessage(noobSession, ERROR_DISCONNECTED);
        //Close socket
        else noobSession.close();
      }
    } catch (Exception e) {
      System.out.println("Error closing noob socket: " + e.getMessage());
    }

    //Stop scheduled tasks
    if (game != null) {
      if (game.scheduledPowerup != null) game.scheduledPowerup.cancel(true);
      if (game.scheduledEnd != null) game.scheduledEnd.cancel(true);
    }

    //Log lobby ended
    System.out.println("Lobby ended " + (isError ? "with error" : "without error"));
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

  public WebSocketSession getSession(String id) {
    return hostSession.getId().equals(id) ? hostSession : noobSession;
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
    //Socket is closed
    if (!session.isOpen()) return;

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

  public void sendMessage(WebSocketSession session, String type) {
    //Send message
    try {
      synchronized(session) {
        session.sendMessage(new TextMessage(type));
      }
    } catch (IOException e) {
      System.out.println(e.getMessage());
    }
  }

  public void handleMessage(String id, TextMessage message) {
    //Check if message is from host
    boolean isHost = hostSession.getId().equals(id);

    //Get message contents
    String content = message.getPayload();
    
    //Invalid message
    if (content.length() < 2) return;

    //Get type & data
    String type = content.substring(0, 2);
    String data = content.substring(2);

    //Check type
    switch (type) {
      //Characters
      case CHARACTERS_SKIN:
        onSkinChange(isHost, data);
        break;
      case CHARACTERS_READY:
        onReadyChange(isHost, data);
        break;
      //Game
      case GAME_PLAYER:
        onPlayerUpdate(isHost, data);
        break;
      case GAME_BALL:
        onBallUpdate(isHost, data);
        break;
      case GAME_KICK:
        onBallKick(isHost);
        break;
      case GAME_ANIMATE:
        onAnimateKick(isHost);
        break;
      case GAME_GOAL:
        onGoal(isHost);
        break;
      case GAME_POWERSPAWN:
        onPowerSpawn();
        break;
      case GAME_POWERUSE:
        onPowerPick(isHost);
        break;
    }
  }

  //Characters scene
  public class CharactersInfo {
    public int hostSkin = -1;
    public boolean hostReady = false;
    public int noobSkin = -1;
    public boolean noobReady = false;

    public CharactersInfo() {
      //Select random skins
      Random rand = new Random();
      hostSkin = rand.nextInt(4) + 1;
      noobSkin = rand.nextInt(4) + 1;
    }
  }

  private void initCharacters() {
    //Create characters info
    characters = new CharactersInfo();

    String initData = "{ \"p1\":{ \"username\":\"" + host + "\", \"skin\":" + characters.hostSkin + " }, \"p2\":{ \"username\":\"" + noob + "\", \"skin\":" + characters.noobSkin + " } }";
    sendMessage(hostSession, CHARACTERS_INIT, initData);
    sendMessage(noobSession, CHARACTERS_INIT, initData);
  }

  private void onSkinChange(boolean isHost, String data) {
    //Parse skin index
    int skin = Integer.parseInt(data);

    //Skin is does not exist
    if (skin < 1 || skin > 4) 
      throw new RuntimeException("Skin " + skin + " does not exist.");

    //Change skin
    if (isHost) 
      characters.hostSkin = skin;
    else 
      characters.noobSkin = skin;

    //Send change to other player
    sendMessage(getSession(!isHost), CHARACTERS_SKIN, skin);
  }
  
  private void onReadyChange(boolean isHost, String data) {
    //Parse ready
    boolean ready = Boolean.parseBoolean(data);

    //Change skin
    if (isHost) 
      characters.hostReady = ready;
    else 
      characters.noobReady = ready;

    //Send change to other player
    sendMessage(getSession(!isHost), CHARACTERS_READY, ready);

    //Both ready
    if (characters.hostReady && characters.noobReady) initGame();
  }

  //Game scene
  public class GameInfo {
    //Duration in ms (match duration + wait before results scene)
    public static final long duration = 60000 + 3000;
    public ScheduledFuture<?> scheduledEnd;
    //Map variant
    public float mapVariantX = 0;
    public float mapVariantY = 0;
    public float mapVariantAngle = 0;
    //Ball
    public boolean ballLastIsHost = true;
    //Powerup
    public boolean hasPowerup = false;
    public ScheduledFuture<?> scheduledPowerup;

    
    public GameInfo(Lobby lobby) {
      //End lobby on game finished
      scheduledEnd = scheduler.schedule(() -> {
        LobbyController.endLobby(lobby, false);
      }, duration, TimeUnit.MILLISECONDS);
    }

    //Map variant
    public String createMapVariant() {
      mapVariantX = 640 + ThreadLocalRandom.current().nextFloat(-450, 450 + 1);
      mapVariantY = 250 + ThreadLocalRandom.current().nextFloat(-50, 50 + 1);
      mapVariantAngle = ThreadLocalRandom.current().nextFloat(-30, 30 + 1) * (float) Math.PI / 180;
      return "{ \"x\":" + mapVariantX + ", \"y\":" + mapVariantY + ", \"angle\":" + mapVariantAngle + " }";
    }
  }

  private void initGame() {
    //Create game
    game = new GameInfo(this);

    //Start Powerup generation
    onPowerSpawn();

    //Create & send map variant
    String initData = "{ \"variant\":" + game.createMapVariant() + " }";
    sendMessage(hostSession, GAME_INIT, initData);
    sendMessage(noobSession, GAME_INIT, initData);
  }

  private void onPlayerUpdate(boolean isHost, String data) {
    //Resend message to other player
    sendMessage(getSession(!isHost), GAME_PLAYER, data);
  }

  private void onBallUpdate(boolean isHost, String data) {
    //Not the last player to touch the ball
    if (isHost != game.ballLastIsHost) return;

    //Resend message to other player
    sendMessage(getSession(!isHost), GAME_BALL, data);
  }

  private void onBallKick(boolean isHost) {
    //Save host as last to touch ball
    game.ballLastIsHost = isHost;
  }

  private void onAnimateKick(boolean isHost) {
    //Resend message to other player
    sendMessage(getSession(!isHost), GAME_ANIMATE);
  }
  
  private void onGoal(boolean isHost) {
    //Resend message to other players
    int goal = isHost ? 1 : 2;
    sendMessage(getSession(true), GAME_GOAL, goal);
    sendMessage(getSession(false), GAME_GOAL, goal);

    //Wait for reset
    scheduler.schedule(() -> {
      //Create new map variant & send reset
      String mapVariant = game.createMapVariant();
      sendMessage(getSession(true), GAME_RESET, mapVariant);
      sendMessage(getSession(false), GAME_RESET, mapVariant);
    }, 2000, TimeUnit.MILLISECONDS);
  }

  private void onPowerSpawn() {
    //Waiting for a powerup to spawn
    if (game.hasPowerup) return;

    //Powerup delay
    int delay = 10000;

    //Powerup position
    float posX = 1280f * 0.2f + ThreadLocalRandom.current().nextFloat(0,  (1280f * 0.6f) + 1f);
    float posY = 250 + ThreadLocalRandom.current().nextFloat(-50, 50 + 1);

    //Powerup type
    int type = ThreadLocalRandom.current().nextInt(0, 4 + 1);

    //Create message
    String data = "{ \"x\":" + posX + ", \"y\":" + posY +", \"type\":" + type + " }";

    //Wait to send the message
    game.hasPowerup = true;
    game.scheduledPowerup = scheduler.schedule(() -> {
      game.hasPowerup = false;
      sendMessage(getSession(true), GAME_POWERSPAWN, data);
      sendMessage(getSession(false), GAME_POWERSPAWN, data);
    }, delay, TimeUnit.MILLISECONDS);
  }

  private void onPowerPick(boolean isHost) {
    sendMessage(getSession(true), GAME_POWERUSE);
    sendMessage(getSession(false), GAME_POWERUSE);
  }
}