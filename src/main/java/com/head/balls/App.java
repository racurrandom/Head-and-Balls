package com.head.balls;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;


@EnableWebSocket
@SpringBootApplication
public class App implements WebSocketConfigurer {

	private final GameWebSocketHandler gameWebSocketHandler;

	public App(GameWebSocketHandler gameWebSocketHandler) {
		this.gameWebSocketHandler = gameWebSocketHandler;
	}

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
    System.err.println("\nSERVER LOADED SUCCESFULLY\n");
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry
      .addHandler(gameWebSocketHandler, "/ws")
			.setAllowedOrigins("*");
	}

	@Bean
	public GameWebSocketHandler getGameWebSocketHandler() {
		return new GameWebSocketHandler();
	}
}
