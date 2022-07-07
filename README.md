<div id="top"></div>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/jaroddurkin/FantasyBot">
    <img src="img/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">FantasyBot</h3>

  <p align="center">
    A chat application to view personalized fantasy football data.
    <br />
    <a href="https://github.com/jaroddurkin/FantasyBot"><strong>View project website</strong></a>
    <br />
    <br />
    <a href="https://github.com/jaroddurkin/FantasyBot/issues">Report Bug / Request Features</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#public-bot">Public Bot</a>
    </li>
    <li>
      <a href="#self-hosting">Self-Hosting</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



## About The Project

[![product-screenshot]](./img/readme_about.png)

FantasyBot is an application for Discord and Slack (with more coming soon) that allows you to view fantasy football data within the scope of the chat. Using an interface of commands, users can configure between ESPN Fantasy Football leagues (more services coming soon).

Information such as records, playoff seeding, current scores, and rosters are all available throughout this app.

Two options to use this app, you can use the publicly hosted application (join links also coming soon), or there are instructions below to self-host the app.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [Node.js](https://nodejs.org/en/)
* [Discord.js](https://discord.js.org/)
* [Bolt](https://api.slack.com/bolt)
* [PostgreSQL](https://www.postgresql.org/)
* [Docker](https://www.docker.com/)
* [Jest](https://jestjs.io/)
* [Axios](https://axios-http.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Public Bot

Public links for both the Discord Bot and the Slack Bot will be ready in a future release. For usage now, feel free to self-host the bot(s).

<p align="right">(<a href="#top">back to top</a>)</p>

## Self-Hosting

Feel free to self-host this bot, in case you would like your own support for private leagues.

### Prerequisites

* Docker
  ```sh
  docker pull node:18-buster-slim
  docker build -t fantasybot .
  ```
* PostgreSQL
  * Host a Postgres database any way you like (AWS, Docker)
  * Store the connection string in an environment variable `PG_CONNECTION`.
* Node.js (for development)
  ```sh
  npm install
  node DiscordBot.js
  node SlackBot.js
  ```

### Installation

1. Create a [Discord Bot](https://discord.com/developers/docs/intro) or a [Slack Bot](https://api.slack.com/tools/slack-developer-tools)
2. Copy Discord Bot Token + Client ID, and Slack Token + App Token into environment variables shown as in `dev.bash`.
3. Run Postgres database somewhere and store the connection URL in the proper environment variable.
4. (Optional) Store your ESPN credentials in COOKIE_VALUE. Copy espn_s2 and SWID from your browser's cookies.
5. Run update-discord.js to create all commands for your discord bot, and also create them in the Slack app portal.
6. Run `docker compose up` to start the apps together

<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap

- [ ] Sleeper Support (v0.2)
- [ ] Private ESPN Leagues for Public Bot (v0.3)
  - [ ] Public Bot Deployment
- [ ] Yahoo Support (v0.4)

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Jarod Durkin - [@jaroddurkin](https://twitter.com/jaroddurkin) - jarod@durkin.app

<p align="right">(<a href="#top">back to top</a>)</p>

[forks-shield]: https://img.shields.io/github/forks/jaroddurkin/FantasyBot.svg?style=for-the-badge
[forks-url]: https://github.com/jaroddurkin/FantasyBot/network/members
[stars-shield]: https://img.shields.io/github/stars/jaroddurkin/FantasyBot.svg?style=for-the-badge
[stars-url]: https://github.com/jaroddurkin/FantasyBot/stargazers
[issues-shield]: https://img.shields.io/github/issues/jaroddurkin/FantasyBot.svg?style=for-the-badge
[issues-url]: https://github.com/jaroddurkin/FantasyBot/issues
[license-shield]: https://img.shields.io/github/license/jaroddurkin/FantasyBot.svg?style=for-the-badge
[license-url]: https://github.com/jaroddurkin/FantasyBot/blob/master/LICENSE.txt
[product-screenshot]: ./img/readme_about.png
