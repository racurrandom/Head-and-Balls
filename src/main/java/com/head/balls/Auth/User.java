package com.head.balls.Auth;

import java.util.Date;

public class User extends UserCredentials {
  
  private long lastSeen = 0;
  public static final long timeoutDuration = 20000L; //20s


  public User(UserCredentials info) {
    super(info.username, info.password);
  }

  public User(String username, String password) {
    super(username, password);
  }

  //Online check
  public void notifyOnline() {
    lastSeen = new Date().getTime();
  }

  public long idleTime() {
    return new Date().getTime() - lastSeen;
  }

  public boolean isOnline() {
    return idleTime() < timeoutDuration;
  }
}
