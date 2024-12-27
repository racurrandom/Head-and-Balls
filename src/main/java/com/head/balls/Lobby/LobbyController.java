package com.head.balls.Lobby;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/lobby")
public class LobbyController {

  @GetMapping()
  public String getLobby(HttpSession session) {
    return "";
  }

  @PostMapping("/create")
  public void create(HttpSession session) {
    
  }

  @PostMapping("/join")
  public void join(HttpSession session) {
    
  }
}
