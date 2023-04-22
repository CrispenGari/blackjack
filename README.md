### `backjack`

This is an online interactive online game build using `trpc` with `fastify`, `react-native` and `nextjs`.

<p align="center">
<img src="/logo.png" alt="logo" width="200"/>
</p>

This is the folder structure of the `blackjack` mono repo.

```
📁 packages
 |---📁 server
 |---📁 web
 |--- 📁 mobile
📁 prisma
📁 assets
 |---📁 cards
          |---📁 back
          |---📁 jacks
          |---📁 png
          |---📁 svg
```

The following are the back covers that players can select before starting the game:

<p align="center">
    <img src="/assets/cards/back/black.png" alt="logo" width="100"/>
    <img src="/assets/cards/back/blue.png" alt="logo" width="100"/>
    <img src="/assets/cards/back/red.png" alt="logo" width="100"/>
    <img src="/assets/cards/back/purple.png" alt="logo" width="100"/>
    <img src="/assets/cards/back/orange.png" alt="logo" width="100"/>
    <img src="/assets/cards/back/green.png" alt="logo" width="100"/>
</p>

### Testing the Game

These instructions shows how to test this game locally. You can follow the `README` files in respective packages:

1. [`server`](/packages/server/README.md)
2. [`web`](/packages/web/README.md)
3. [`mobile`](/packages/mobile/README.md)
4. [`prisma`](/prisma/README.md)

After you have installed the dependencies of each package you can start the game by navigating to the root directory which is the `blackjack` and run the following command:

```shell
yarn start
```

This will start all teh packages in parallel. And you will be able to test them.

### uis

In this section I will show the screenshots of the UI of the `web` and `mobile` version of the game.

#### 1. mobile

1. auth screens

<p align="center">
<img src="/images/mobile/1.jpeg" width="200" alt="demo"/>
<img src="/images/mobile/2.jpeg" width="200" alt="demo"/>
<img src="/images/mobile/3.jpeg" width="200" alt="demo"/>

</p>

2. app/game screens

<p align="center">
<img src="/images/mobile/4.jpeg" width="200" alt="demo"/>
<img src="/images/mobile/5.jpeg" width="200" alt="demo"/>
<img src="/images/mobile/6.jpeg" width="200" alt="demo"/>
<img src="/images/mobile/7.jpeg" width="200" alt="demo"/>
<img src="/images/mobile/8.jpeg" width="200" alt="demo"/>
</p>

#### 1. web

1. auth screens

<p align="center">
<img src="/images/web/0.jpg" width="50%" alt="demo"/>
<img src="/images/web/2.jpg" width="50%" alt="demo"/>
</p>

2. app/game screens
<p align="center">
<img src="/images/web/3.jpg" width="50%" alt="demo"/>
<img src="/images/web/4.jpg" width="50%" alt="demo"/>
<img src="/images/web/5.jpg" width="50%" alt="demo"/>
<img src="/images/web/6.jpg" width="50%" alt="demo"/>
<img src="/images/web/7.jpg" width="50%" alt="demo"/>
<img src="/images/web/8.jpg" width="50%" alt="demo"/>
<img src="/images/web/9.jpg" width="50%" alt="demo"/>
<img src="/images/web/10.jpg" width="50%" alt="demo"/>
</p>

### How to use the game?

`blackjack` is an online game that allows users to play remotely. So here is how you can use the game.

1. you need an account with `nickname` and `password`
2. you can create a single instance of `engine`/`environment` that you can play with your friend.
3. the creator of the `engine` is the engine admin and he has the authority to:
   - remove `gamers`
   - `start` and stop the `game`
4. other players can play as regular users within the game `engine`.
5. real time updates are given to those `gamers` that are in a certain game environment or `engine`
6. regular users and even the admin can leave the engine anytime they want to.
7. when the game is completed the results are shown to every connected `gamer` with positions `nicknames` and `points`
8. During starting of the game the admin can select the card they want to use as a `blackjack` and also the `backcover` for `anonymous` cards.
9. gamers within the engine can also chat using the `chat` platform.

### Game Rules

Everyone has a chance to win the game. Here is how the game is played:

1. Since it is a multiple player game, every `gammer` has a number and the playing `turns` moves in `ascending` order of numbers meaning:
   _ player number 1 plays first.
   _ the last player will play last

   > Note that the maximum number of players allowed to be in a game `engine` or `environment` are `5` players and `minimum` for the game to be able to start are `2` players.

2. You match cards that have same name for example a `Q` and a `Q`, a `2` and a `2`, it doesn't mater which `Q` is it it can be of `hearts`, `clubs`, `spades` or `diamonds`. Here is an example of matching cards.

<p>
<img src="/assets/cards/png/4_of_clubs.png" alt="card" width="200"/>
<img src="/assets/cards/png/4_of_hearts.png" alt="card" width="200"/>
</p>

So to match these cards you just need to click the `first` card and `click` the next one, then your cards will be updated.

3. In the event that your matching cards are finished you click the `DONE` button so that the next player in ascending will play next.

4. After all the matching cards has been finished on all the gamers, now gamers can start picking up the `cards` for the `next` ascending player. When you see that you picked the`matching` card you can match and click `DONE` button so that the next player will also pick from whoever he should pick from.

> Note that if you pick a card, as an important rule if the card match play it and click the `DONE` button if not just click the `DONE` button so that next players get their chances.

5. The process will be looped till all the cards are finished. The player that will be left with `JACK_OF_CLUBS` or `JACK_OF_SPADES` will loose the game, here are the jacks that we are talking about.

<p>
    <img src="/assets/cards/png/j_of_clubs.png" alt="card" width="200"/>
    <img src="/assets/cards/png/j_of_spades.png" alt="card" width="200"/>
</p>

### Credits

I give credits to [this](https://code.google.com/archive/p/vector-playing-cards/downloads) website where i got the `.svg` and `.png` cards image faces from.

### License

In this project I'm using the `MIT` license which reads as follows:

---

MIT License

Copyright (c) 2023 crispengari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
