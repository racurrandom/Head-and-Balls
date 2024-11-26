![gdd](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/gdd.gif)  
![title](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/title.gif)  
![grupo4](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/grupo4.gif)  

# Equipo

Nuestro equipo está formado por:

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
[**12. Recursos**](#12-recursos)  
[**13. Licencia**](#13-licencia)

# 1. Introducción

Este es el documento de diseño de juego de **Head and Balls**. El videojuego para PC y navegador que se basa en un partido de fútbol 2D en vista lateral entre dos jugadores en el que cada uno trata de meterle gol al contrario a base de cabezazos y patadas.

| Plataforma | Target | Género | Nº Jugadores | Lanzamiento | Ventas | Pegi |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| PC | 10-30 años | Deportes | 2 | 2025 | In game | Pegi 12 |

# 2. Género y Temática

**Head and Balls** es un videojuego deportivo de fútbol uno contra uno, perteneciente al género de arcade deportivo. Este tipo de juegos prioriza la acción rápida y mecánicas simples sobre el realismo, ofreciendo una experiencia accesible y dinámica.

# 3. Concepto de juego

**Head and Balls** es un videojuego en el que controlamos a dos personajes muy cabezones.

El objetivo es ganar al otro jugador marcando el mayor número de goles en la portería enemiga, ya sea chutando el balón o dándole un cabezazo.

Consiste en un juego tipo **Head Soccer** de fútbol, en el cuál los jugadores serán los 4 desarrolladores del juego jugando un partido amistoso.

# 4. Características Generales

* **Planteamiento:** El juego tendrá un estilo cómico tanto en el apartado artístico como en el gameplay.  
* **Estrategia:** Utilizarás los cabezazos y patadas para impulsar la pelota y meterla en la portería del contrincante. De la misma manera evitarás que la pelota entre en tu portería bloqueándola con tu personaje.

# 5. Narrativa



# 6. Jugabilidad

En **Head and Balls**, las partidas comenzarán con cada jugador posicionado en lados opuestos de la pantalla frente a su portería.   

* **Partida:** Para jugar contra otro jugador hará falta empezar una partida. Estas partidas durarán una cantidad de tiempo preestablecida de 3 minutos y el jugador con mayor puntuación cuando acabe el tiempo gana.  
* **Puntos (Goles):** Las partidas se dividen en puntos. Cada punto durará una cantidad de tiempo indeterminada puesto que depende de cuanto tarden los jugadores en marcar dicho punto. En el caso de que ningún jugador haya marcado punto durante.  
* **Habilidades especiales:** Durante la partida aparecerán habilidades especiales que se activan cuando la pelota las golpee. Estas habilidades podrán tener efectos adversos para el contrincante, beneficiosos para el jugador que la active o simplemente modificar el estado de la partida.

# 7. Estilo visual

**Head and Balls** tendrá un estilo cartoon 2D desenfadado que acompañe al estilo del gameplay. La paleta de color se caracterizara por colores brillantes y llamativos y los diseños tanto de los personajes como del escenario simples y estilizadas.

![game](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_game.png)

# 8. Interfaz

El juego tomará como referencia para el estilo y diseño de sus interfaces juegos flash de hace años. Para los menus, el flujo que se seguirá es el siguiente:

![flow](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/Blank%20diagram.png)  

* **Menú principal:** desde el menú principal se podrá navegar a las pantallas de selección de personaje, de ajustes y de créditos.

![main](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_main.png)  

* **Selección de personajes:** desde la pantalla de selección de personajes existirá la opcion de continuar a la pantalla de juego.

![characters](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_characters.png)  

* **Juego:** desde la pantalla de juego se podrá volver al menú principal, al menú de opciones y a la pantalla de resultados.

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
* **Habilidades especiales:** Habilidades en forma de pompa colocadas por lugares aleatorios de la pantalla que los jugadores pueden obtener si chutan la bola y esta los toca. Algunas de ellas serán buenas y otras malas para el jugador:  
  * **Big ball (buena):** Hace crecer la bola durante un tiempo determinado.  
  * **Small ball (buena):** Hace decrecer la bola durante un tiempo determinado.  
  * **Bouncy ball (buena):** Incrementa la intensidad de rebote a la bola durante un tiempo determinado.  
  * **Freeze enemy (buena):** Paraliza al contrincante del último jugador que tocó la bola durante un tiempo determinado.  
  * **Freeze player (mala):** Paraliza al último jugador que tocó la bola durante un tiempo determinado.  

![game](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/sc_powerup_small.png)  
~ Imagen de la habilidad **Small ball**

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

# 12. Recursos

Recursos externos utilizados para el desarrollo del videojuego:

* **Música partido:** [Bensound - Brazil Samba](https://youtu.be/4xeyMOIo3Eg)
* **Efecto de sonido pitido:** [Action Soccer](https://www.sounds-resource.com/pc_computer/actionsoccer/)  

# 13. Licencia
 
Producto licenciado bajo la licencia **Apache 2.0**.
