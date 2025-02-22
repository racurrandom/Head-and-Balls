# Head and Balls
GDD · Grupo 4

# Enlace vídeo youtube
https://youtu.be/cXFi-6ERtsU

# Equipo

El equipo de **Head and Balls** está formado por:

- Víctor Cabello Pamukov
  - Correo: v.cabello.2022@alumnos.urjc.es
  - GitHub: [VictorCabelloDDV](https://github.com/VictorCabelloDDV/)

- Guillermo Sánchez González
  - Correo: g.sanchezg.2022@alumnos.urjc.es
  - GitHub: [gwill17](https://github.com/gwill17/)

- Alejandro Paniagua Moreno
  - Correo: a.paniagua.2022@alumnos.urjc.es
  - GitHub: [BOTPanzer](https://github.com/BOTPanzer/)

- Raúl Alfonso Pérez
  - Correo: r.alfnso.2022@alumnos.urjc.es
  - GitHub: [racurrandom](https://github.com/racurrandom/)

# Índice

[**0. Instrucciones**](#0-instrucciones)  
[**1. Introducción**](#1-introducción)  
[**2. Género y Temática**](#2-género-y-temática)  
[**3. Concepto de juego**](#3-concepto-de-juego)  
[**4. Características Generales**](#4-características-generales)  
[**5. Historia**](#5-historia)  
[**6. Jugabilidad**](#6-jugabilidad)  
[**7. Estilo visual**](#7-estilo-visual)  
[**8. Interfaz**](#8-interfaz)  
[**9. Mecánicas**](#9-mecánicas)  
[**10. Controles**](#10-controles)  
[**11. Audio**](#11-audio)  
[**12. Diagrama de Clases**](#12-diagrama-de-clases)  
[**13. Protocolo WebSocket**](#13-protocolo-websocket)  
[**14. Recursos**](#14-recursos)  
[**15. Licencia**](#15-licencia)

# 0. Instrucciones

Para iniciar el servidor, se puede hacer uso del archivo ```run.bat``` o del comando ```java -jar "head-and-balls-1.0.jar"``` mediante el terminal.

# 1. Introducción

Este es el documento de diseño de juego de **Head and Balls**, un videojuego de fútbol 2D en vista lateral, desarrollado para PC y navegadores. En este título, dos jugadores compiten uno contra uno para marcar goles en la portería contraria utilizando cabezazos y patadas en un entorno rápido y cómico.

El juego está dirigido a un público joven y competitivo, con edades comprendidas entre los 12 y los 30 años. Diseñado para ofrecer diversión inmediata y accesible, se inspira en clásicos del género arcade deportivo.

| Plataforma | Target | Género | Nº Jugadores | Lanzamiento | Ventas | Pegi |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| PC y navegador | 12-30 años | Deportes | 2 | 2025 | In game | Pegi 12 |

# 2. Género y Temática

**Head and Balls** pertenece al género de arcade deportivo, centrándose en partidos de fútbol uno contra uno. Este tipo de juegos priorizan la acción trepidante, las mecánicas accesibles y rápidas, y un enfoque más ligero y divertido frente al realismo.

La temática del juego combina el espíritu competitivo del fútbol con un estilo cómico y desenfadado. Los personajes, con sus cabezas desproporcionadamente grandes, y las físicas exageradas aportan un toque humorístico, garantizando que cada partida sea caótica y divertida.

Inspirado en títulos como *Head Soccer* y *Soccer Physics*, **Head and Balls** busca destacar en el género ofreciendo una experiencia perfecta para partidas casuales y competitivas entre amigos.

# 3. Concepto de juego

En **Head and Balls**, los jugadores controlan a personajes cabezones en partidos de fútbol uno contra uno en un escenario 2D. El objetivo principal es marcar más goles que el oponente, utilizando cabezazos, patadas y movimientos estratégicos para controlar el balón y superar al rival.

El gameplay se centra en la simplicidad y el dinamismo, haciendo que sea fácil de aprender pero desafiante de dominar. Además, los personajes están inspirados en los propios desarrolladores del juego, añadiendo un toque personal y único al diseño. Cada partido está diseñado para generar situaciones hilarantes debido a las físicas exageradas y los movimientos caricaturescos.

# 4. Características Generales

* **Planteamiento:** El juego adopta un tono cómico, tanto en su apartado artístico como en el gameplay. Las animaciones exageradas, los efectos visuales llamativos y los movimientos humorísticos son clave para transmitir este estilo.  
* **Estrategia:** Los jugadores deben utilizar cabezazos, patadas y el posicionamiento táctico para controlar el balón, marcar goles y defender su portería. La simplicidad de las mecánicas garantiza que cualquiera pueda aprender a jugar rápidamente, mientras que la velocidad y la precisión necesarias para ganar introducen un nivel competitivo.

* **Duración y Rejugabilidad:** Las partidas están diseñadas para ser cortas, ideales para sesiones rápidas y repetidas. La simplicidad del juego, combinada con su enfoque en el humor y la competencia, asegura una alta rejugabilidad, especialmente en un entorno multijugador local o en línea.

# 5. Narrativa

Un grupo de cuatro amigos paseaba por las calles de Madrid cuando, de repente, una bola cayó del cielo y los golpeó. Para su sorpresa, la bola pertenecía a Cristiano Ronaldo.

Cristiano, demostrando su simpatía, se disculpó por el incidente y les ofreció una oportunidad única: jugar un partido en un estadio profesional. Los amigos, emocionados por la propuesta, no pudieron rechazarla y decidieron organizar unas pachangas amistosas el siguiente sábado.

Este encuentro casual dio inicio a una experiencia inolvidable, donde la diversión, la amistad y las risas serían las auténticas protagonistas.

# 6. Jugabilidad

En **Head and Balls**, las partidas se desarrollan en un escenario 2D con dos jugadores posicionados en lados opuestos de la pantalla, cada uno defendiendo su portería.

**Inicio de Partida**

Para comenzar, los jugadores deberán iniciar una partida, donde se enfrentarán en un partido amistoso uno contra uno. Cada partida tiene una duración preestablecida de 1 minutos, y el objetivo es marcar el mayor número de goles posible antes de que termine el tiempo.

**Sistema de Puntos y Reglas**

* **Duración del Juego:** Cada partido consta de un único periodo de 1 minutos.

* **Marcador y Resultado:** Los jugadores sumarán puntos marcando goles en la portería rival. Al finalizar el tiempo, el jugador con más puntos será declarado ganador.

* **Empates:** Si ambos jugadores tienen el mismo número de goles al terminar la partida, el partido se considerará empatado.

**Habilidades Especiales**

Durante el desarrollo de la partida en Head and Balls, aparecerán habilidades especiales que pueden ser activadas al golpear la pelota contra ellas. Estas habilidades introducen un elemento estratégico y caótico al juego, proporcionando una variedad dinámica de efectos durante cada partida.

**Las Habilidades:**

* **Bouncy Ball**

* **Small Ball**

* **Big Ball**

* **Freeze Player**

* **Freeze Enemy**

Estas habilidades, explicadas posteriormente en el documento, introducen variedad y dinamismo, haciendo que cada partida sea impredecible y única.


# 7. Arte y estilo visual

Como se he mencionado previamente, **Head and Balls** tendrá un estilo cartoon 2D desenfadado que acompañe al estilo del gameplay. La paleta de color se caracterizara por colores brillantes y llamativos y los diseños tanto de los personajes como del escenario simples y estilizadas.

**Assets:**

* **Balón:**  
  ![ball](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/ball.png)

* **Botas:**  
  ![cleats](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/zapato.png)

* **Marcador:**  
  ![board](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/Marcador.png)

* **Portería:**  
  ![goal](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/goal.png)

* **Habilidades especiales:**  
  | Bouncy Ball | Small Ball | Big Ball | Freeze Player | Freeze Enemy |
  | :---- | :---- | :---- | :---- | :---- |
  | ![Bouncy Ball](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/powerBouncyBall.png) | ![Small Ball](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/powerSmallBall.png) | ![Big Ball](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/powerBigBall.png) | ![Freeze Player](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/powerIce.png) | ![Freeze Enemy](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/powerIceBad.png) | 

* **In-game:**  
  ![game](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_game.png)

# 8. Interfaces

El juego tomará como referencia para el estilo y diseño de sus interfaces juegos flash de hace años. Para los menus, el flujo que se seguirá es el siguiente:

**Diagrama de flujo**

![flow](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/Blank%20diagram.png)  

* **Menú principal:** desde el menú principal se podrá navegar a las pantallas de selección de personaje, de ajustes, de créditos y de cuenta mediante los botones de jugar, opciones, creditos e icono de cuenta respectivamente.

![main](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_main.png)  

* **Menú cuenta:** desde el menú de cuenta el usuario podrá iniciar sesión o, en caso de no tener una cuenta, crearla. Una vez este su sesión iniciada, este podrá borrar su cuenta, actualizar sus datos o cerrar sesión desde 3 botones especiales.

![account1](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_account1.png)  

![account2](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_account2.png)  

* **Chat:** si se trata de jugar y se elege el modo online, se abrira un chat donde el jugador podrá chatear con otros jugadores conectados a la vez.

![chat](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_chat.png)  

* **Selección de personajes:** desde la pantalla de selección de personajes se continuará a la pantalla de juego una vez seleccionen ambos jugadores que están listos.

![characters](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_characters.png)  

* **Juego:** desde la pantalla de juego se podrá volver al menú principal mediante el botón de atras (esquina superior izquierda), al menú de opciones con el botón de tuerca (esquina superior derecha) y a la pantalla de resultados tras acabar el tiempo.

![game](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_game.png)  

* **Resultados:** desde la pantalla de resultados se podrá volver al menú principal.

![results](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_results.png)  

* **Ajustes:** desde la pantalla de ajustes se podrá volver al menú principal o a la pantalla de juego, dependiendo de donde se abrieron.

![options](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_options.png)  

* **Creditos:** desde la pantalla de creditos se podrá volver al menú principal.

![credits](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_credits.png)  


# 9. Mecánicas

Las mecánicas en **Head and Balls** son sencillas y están diseñadas para brindar una experiencia rápida, accesible y cómica. A continuación, se detallan las acciones básicas que los jugadores podrán realizar y las reglas que rigen el desarrollo del juego:

* **Chutar y dar cabezazos:** Los jugadores serán capaces de chutar o dar un cabezazo a la bola para propulsarla en dirección de la portería enemiga.  

* **Variaciones del mapa:** El mapa tendrá formas geométricas colocadas por el cielo que interferirán con la dirección de la bola. Además, cada vez que se marque un gol cambiarán de posición y rotación para que no se note repetitivo.  

* **Habilidades especiales:** Habilidades en forma de pompa colocadas por lugares aleatorios de la pantalla que los jugadores pueden obtener si chutan la bola y esta los toca. 

Algunas de ellas serán buenas y otras malas para el jugador:  
  * **Big ball (buena):** Hace crecer la bola durante un tiempo determinado. 

  * **Small ball (buena):** Hace decrecer la bola durante un tiempo determinado.  

  * **Bouncy ball (buena):** Incrementa la intensidad de rebote a la bola durante un tiempo determinado.  

  * **Freeze enemy (buena):** Paraliza al contrincante del último jugador que tocó la bola durante un tiempo determinado.  

  * **Freeze player (mala):** Paraliza al último jugador que tocó la bola durante un tiempo determinado.  

![game](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_powerup_small.png)  
*Imagen de la habilidad **Small ball***

# 10. Controles

Basandonos en otros juegos flash como **Fireboy and Watergirl** o **Head Soccer**, los controles del juego serán sencillos y permitirán la jugabilidad de 2 jugadores en local mediante un solo teclado.

| Controles |  |
| ----- | :---- |
| **Moverse horizontalmente** | **P1:** A y D<br>**P2:** Flecha izquierda y derecha |
| **Saltar** | **P1:** W<br>**P2:** Flecha arriba |
| **Chutar el balón** | **P1:** S<br>**P2:** Flecha abajo

# 11. Audio

**Head and Balls** tendrá una banda sonora compuesta por 2 canciones, una en los menús y otra en la pantalla de juego. Además, se añadirán sonidos para determinadas interacciones como el chute de la bola, indicadores del estado de la partida al comenzar o terminar. 

Una cosa que separa **Head and Balls** de otros juegos es que los personajes tendrán sus propias voces y hablarán lineas de voz cuando metan un gól.

* **Música:**  
  * **Pantalla de inicio:** El main theme del juego, una melodía animada y cómica, sonará en la pantalla de inicio para establecer el tono humorístico de **Head and Balls**.  
  * **Durante la partida:** Se escuchará música de ambiente con un ritmo dinámico que simula la atmósfera de un partido de fútbol. La música cambiará ligeramente según la intensidad del juego.  
* **Sonidos:**  
  * **Efectos de sonido:** Sonidos como contacto con la pelota, golpes entre personajes, comienzo/final del partido, gol marcado…  
  * **Líneas de voz de personajes:** Cada personaje tendrá líneas de voz únicas y divertidas que se reproducirán al marcar un gol, añadiendo humor y personalidad al juego.

# 12. Diagrama de clases

![Class Diagram](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/ClassDiagram.png)

El diagrama muestra la estructura y las relaciones entre las clases principales de la aplicación desarrollada con **Spring Boot**. La clase central *App* (en rojo), anotada con *@SpringBootApplication*, actúa como **punto de entrada** del sistema, inicializando y gestionando componentes clave como los **controladores** (*AuthController, ChatController, TestController*), las configuraciones (SecurityConfig y CustomSessionListener) y el manejador global de excepciones (*GlobalExceptionHandler*).

Los **controladores** (en azul), anotados con *@RestController*, tienen una relación de asociación (líneas sólidas) con la entidad *User* (en amarillo, modelo de datos) porque utilizan esta clase para manejar información de usuario. *AuthController* también lanza excepciones específicas (*InvalidCredentialsException* y *UserNotFoundException*, en rosa), lo que se refleja con líneas etiquetadas como **"Lanza"**. Estas excepciones son manejadas por *GlobalExceptionHandler* (en verde, *@RestControllerAdvice*), que tiene una relación de **asociación** con dichas excepciones, etiquetada como **"Maneja"**.

Además, **existen relaciones** de dependencia (líneas discontinuas con flechas) entre *App* y las configuraciones (*SecurityConfig y CustomSessionListener, anotadas con @Configuration y @WebListener*), porque son cargadas en el contexto de Spring. *ChatController* tiene una **dependencia** con *AuthController* para verificar sesiones de usuario, reflejando una colaboración entre controladores. En conjunto, estas relaciones muestran una arquitectura organizada en capas, donde los controladores gestionan la lógica HTTP, las configuraciones definen el comportamiento global de la aplicación, y el manejo de excepciones garantiza un funcionamiento robusto y consistente.

La nueva funcionalidad introduce una arquitectura basada en WebSockets para soportar comunicación en tiempo real entre jugadores en partidas multijugador. Esta ampliación complementa la API REST existente para proporcionar una experiencia sincronizada y ágil en las partidas.

El manejador principal de WebSockets es la clase GameWebSocketHandler, que gestiona las conexiones de los jugadores, recibe mensajes del cliente, y sincroniza el estado del juego en tiempo real. Este manejador colabora estrechamente con Lobby, que representa las salas de juego y contiene la lógica específica de las partidas. Además, se utiliza la clase PlayerConnection para rastrear las sesiones activas de los jugadores y sus asociaciones con las salas.

El flujo de conexión es el siguiente:

Los jugadores establecen una conexión WebSocket, que es gestionada por GameWebSocketHandler.
Los mensajes enviados por los jugadores son procesados y delegados al Lobby correspondiente.
El estado del juego (movimientos, interacciones) se sincroniza entre los jugadores mediante mensajes en tiempo real.
Al desconectarse un jugador, el sistema actualiza el estado del juego y termina la conexión asociada.

# 13. Protocolo WebSocket

Para el protocolo de los WebSockets usamos los 2 primeros caracteres como código indicador de qué es el mensaje. Estos 2 caracteres los dividimos, siendo el primero el que indica la escena y el segundo la accion de la escena.

| Código | Escena | Acción | Qué hace |
| -------- | -------- | ------- | ------- |
| CI | Characters | Init | Inicia la escena de Characters |
| CS | Characters | Skin | Indica que se cambió la skin |
| CR | Characters | Ready | Indica que se cambió el estado de "listo" |
| GI | Game | Init | Inicia la escena de Game desde Characters |
| GP | Game | Player | Manda la posición y velocidad del jugador |
| GB | Game | Ball | Manda la posición y velocidad del la bola |
| GK | Game | Kick | Indica que la bola fue chutada |
| GA | Game | Animate | Manda un mensaje diciendo que se reproduzca la animación de patada |
| GG | Game | Goal | Indica que se marcó un gol en la porteria del que mando el mensaje |
| GR | Game | Reset map | Resetea el mapa |
| GS | Game | Spawn powerup | Indica que se spawnee un powerup |
| GU | Game | Use powerup | Indica que un powerup se usó |
| ED | Error | Disconnected | Indica que el otro usuario se desconectó y abre la escena de error |

# 14. Recursos

Recursos externos utilizados para el desarrollo del videojuego:

* **Música partido:** [Bensound - Brazil Samba](https://youtu.be/4xeyMOIo3Eg)
* **Efecto de sonido pitido:** [Action Soccer](https://www.sounds-resource.com/pc_computer/actionsoccer/)  
* **Butacas del fondo in-game:** [Butacas in-game](https://www.freepik.com/free-vector/realistic-stadium-tribune-composition-with-isolated-front-back-views-rows-with-red-plastic-seats-vector-illustration_43869155.htm)

# 15. Licencia
 
Producto licenciado bajo la licencia **Apache 2.0**.
