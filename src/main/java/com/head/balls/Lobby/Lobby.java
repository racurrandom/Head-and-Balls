package com.head.balls.Lobby;

import java.io.IOException;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
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
  public static final String GAME_PLAYER = "GP";  //Player position & velocity
  public static final String GAME_BALL = "GB";    //Ball position & velocity
  public static final String GAME_KICK = "GK";    //Player kicked ball
  public static final String GAME_ANIMATE = "GA"; //Play kick animation
  public static final String GAME_GOAL = "GG";    //Player scoared a goal
  public static final String GAME_RESET = "GR";   //Reset map
  
  //Lobby usernames & websocket sessions
  private String host = "";
  private WebSocketSession hostSession;
  private String noob = "";
  private WebSocketSession noobSession;

  //Util
  private final ObjectMapper mapper = new ObjectMapper();
  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

  //Characters info
  private CharactersInfo characters;

  //Game info
  private GameInfo game;

  
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
      synchronized (session) {
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
    //Map variant
    float mapVariantX = 0;
    float mapVariantY = 0;
    float mapVariantAngle = 0;
    //Ball
    boolean ballLastIsHost = true;

    
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
    game = new GameInfo();

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
}