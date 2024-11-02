![gdd](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/gdd.gif)  
![title](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/title.gif)  
![grupo4](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/grupo4.gif)  

# Integrantes

Víctor Cabello Pamukov
- Correo: v.cabello.2022@alumnos.urjc.es
- GitHub: [VictorCabelloDDV](https://github.com/VictorCabelloDDV/)

Guillermo Sánchez González
- Correo: g.sanchezg.2022@alumnos.urjc.es
- GitHub: [gwill17](https://github.com/gwill17/)

Alejandro Paniagua Moreno
- Correo: a.paniagua.2022@alumnos.urjc.es
- GitHub: [BOTPanzer](https://github.com/BOTPanzer/)

Raúl Alfonso Pérez
- Correo: r.alfnso.2022@alumnos.urjc.es
- GitHub: [racurrandom](https://github.com/racurrandom/)

# Índice

[**Introducción**](#introducción)  
[**Género y Temática**](#género-y-temática)  
[**Concepto de juego**](#concepto-de-juego)  
[**Características Generales**](#características-generales)  
[**Jugabilidad**](#jugabilidad)  
[**Estilo visual**](#estilo-visual)  
[**Interfaz**](#interfaz)  
[**Mecánicas**](#mecánicas)  
[**Controles**](#controles)  
[**Audio**](#audio)

# Introducción

Este es el documento de diseño de juego de *Head and Balls*. El videojuego para PC que se basa en un partido de fútbol 2D en vista lateral entre dos jugadores en el que cada uno trata de meterle gol al contrario a base de cabezazos y patadas.

| Plataforma | Target | Género | Nº Jugadores | Lanzamiento | Ventas | Pegi |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| PC | 10-30 años | Deportes | 2 | 2025 | In game | Pegi 7 |

# Género y Temática

*Head and Balls* es un videojuego deportivo de fútbol uno contra uno, perteneciente al género de arcade deportivo. Este tipo de juegos prioriza la acción rápida y mecánicas simples sobre el realismo, ofreciendo una experiencia accesible y dinámica.

# Concepto de juego

*Head and Balls* es un videojuego en el que controlamos a dos personajes muy cabezones.

El objetivo es ganar al otro jugador marcando gol en la portería enemiga, ya sea chutando el balón o dándole un cabezazo.

Consiste en un juego tipo *Head Soccer* de fútbol, en el cuál los jugadores serán los 4 desarrolladores del juego jugando un partido amistoso.

# Características Generales

* **Planteamiento:** El juego tendrá un estilo cómico tanto en el apartado artístico como en el gameplay.  
* **Estrategia:** Utilizarás los cabezazos y patadas para impulsar la pelota y meterla en la portería del contrincante. De la misma manera evitarás que la pelota entre en tu portería bloqueándola con tu personaje.

# Jugabilidad

Las partidas de *Head and Balls* comienzan con cada jugador posicionado en lados opuestos de la pantalla frente a su portería.   
	

* **Partida:** Para jugar contra otro jugador hará falta empezar una partida. Estas partidas durarán una cantidad de tiempo preestablecida de 3 minutos y el jugador con mayor puntuación cuando acabe el tiempo gana.  
* **Puntos (Goles):** Las partidas se dividen en puntos. Cada punto durará una cantidad de tiempo indeterminada puesto que depende de cuanto tarden los jugadores en marcar dicho punto. En el caso de que ningún jugador haya marcado punto durante.  
* **Habilidades especiales:** Durante la partida aparecerán habilidades especiales que se activan cuando la pelota las golpee. Estas habilidades podrán tener efectos adversos para el contrincante, beneficiosos para el jugador que la active o simplemente modificar el estado de la partida.

# Estilo visual

*Head and Balls* tendrá un estilo cartoon 2D desenfadado que acompañe al estilo del gameplay. La paleta de color se caracterizara por colores brillantes y llamativos y los diseños tanto de los personajes como del escenario simples y estilizadas.

![game](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/game.png)

# Interfaz

El juego tomará como referencia juegos flash de hace años para diseñar sus interfaces.

![ui main](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/ui_main.png)
![ui game](https://raw.githubusercontent.com/racurrandom/Head-and-Balls/main/gdd/ui_game.png)

# Mecánicas

Las mecánicas en *Head and Balls* son sencillas y están diseñadas para brindar una experiencia rápida, accesible y cómica. A continuación, se detallan las acciones básicas que los jugadores podrán realizar y las reglas que rigen el desarrollo del juego:

* **Chutar:** Los jugadores serán capaces de chutar la bola para propulsarla en dirección de la portería enemiga.  
* **Habilidades especiales:** Habilidades en forma de pompa colocadas por lugares aleatorios de la pantalla que los jugadores pueden obtener si chutan la bola y esta los toca:  
  * **Big ball:** Hace crecer la bola durante un tiempo determinado.  
  * **Bouncy ball:** Incrementa la intensidad de rebote a la bola durante un tiempo determinado.  
  * **Big goal:** Hace crecer la portería durante un tiempo determinado.  
  * **Small baller:** Hace pequeño al enemigo durante un tiempo determinado.  
  * **Yiha\!:** Un avión con sombrero de vaquero baja del cielo y marca gol por el jugador.  
  * **Polen:** Stunea al jugador enemigo durante 3 segundos. 

# Controles

Los controles del juego serán sencillos y permitirán la jugabilidad de 2 jugadores en local.

| Controles |  |
| ----- | :---- |
| **Moverse horizontalmente** | **P1:** A y D<br>**P2:** Flecha izquierda y derecha |
| **Saltar** | **P1:** W<br>**P2:** Flecha arriba |
| **Chutar el balón** | **P1:** S<br>**P2:** Flecha abajo

# Audio

* **Música:**  
  * **Pantalla de inicio:** El main theme del juego, una melodía animada y cómica, sonará en la pantalla de inicio para establecer el tono humorístico de Head and Balls.  
  * **Durante la partida:** Se escuchará música de ambiente con un ritmo dinámico que simula la atmósfera de un partido de fútbol. La música cambiará ligeramente según la intensidad del juego.  
* **Sonidos:**  
  * **Efectos de sonido:** Sonidos como contacto con la pelota, golpes entre personajes, comienzo/final del partido, gol marcado…  
  * **Líneas de voz de personajes:** Cada personaje tendrá una línea de voz única y divertida que se reproducirá al marcar un gol, añadiendo humor y personalidad al juego.

# Licencia
 
**Producto licenciado bajo la licencia Apache 2.0.**
