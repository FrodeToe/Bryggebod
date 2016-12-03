# ISY Viewer

BIM viewer.

## Beskrivelse

Basert på følgende [tutorial](https://github.com/Autodesk-Forge/data.management-nodejs-integration.box).

### Appen

Appen er publisert på [Heroku](https://isyviewer.herokuapp.com).

## Installasjon

### Krav

- Autodesk developer credentials
- [NodeJS](https://nodejs.org/en/) (vi bruker siste versjon 7.2.0)
- npm - Node Package Manager (vi bruker siste versjon 4.0.2)
- Editor/utviklermiljø: Så langt har vi brukt kommandolinjeverktøy i form av [Git Bash for Winwdows](https://git-for-windows.github.io/)
- Github-konto

### Oppsett av app i Forge

Opprett en Autodesk-konto og få developer credentials. Lag en ny app i [Autodesk Forge](https://developer.autodesk.com/) og legg til alle API-er. Angi <b>https://isyviewer.herokuapp.com/api/forge/callback/oauth</b> som Callback URL. Noter ned Client ID og Client Secret for appen.

### Kjøre prosjektet lokalt

Installer <b>NodeJS</b> og <b>Git Bash for Windows</b>. Åpne Git Bash som administrator og kjør kommandoen under for å sjekke versjonsnummeret til NodeJS:

    node -v

Kjør deretter kommandoen under for å sjekke versjonsnummeret til package manager:

	npm -v

For å være sikker på at du har siste versjon av npm kan du kjøre kommandoen:

	npm install npm@latest -g

Åpne Git Bash og naviger til ditt ønskede lokale workspace, for eks: <b>C:\Workspace</b>. Kjør kommandoen under for å lage lokal kopi av Github-repository-et: 

    git clone https://github.com/torjuss/isyviewer.git

Naviger inn i prosjektet: 

    cd isyviewer

Kjør kommandoen under for å installere alle eksterne biblioteker som trengs. Disse bibliotekene er listet opp under "dependencies" i fila <b>package.json</b>:

    npm install

Dersom alt gikk greit kan du nå starte prosjektet og teste ved å bruke ClientID og ClientSecret fra appen som du oppretta i Autodesk Forge:

    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>> 
    export FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    npm run dev 

Alternativt kan du lage en kopi av fila <b>server/config_.js</b> og kalle kopien for <b>config.js</b>. I denne kopien kan du putte inn ClientID og ClientSecret direkte i stedet for å bruke miljøvariabler. Det er viktig å benytte disse filnavnene siden de er hardkodet. For å starte kan du nå kjøre:

	node start.js

	eller

	npm start