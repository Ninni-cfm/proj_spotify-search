# proj_spotify-search

_Source:_ https://github.com/Ninni-cfm/proj_spotify-search

_Demo:_ https://mysterious-bayou-22076.herokuapp.com/

---

## JS Express - CodeFlow Übung lev3_1: Spotify-search

**Aufgabenstellung**

-   Spotify ist ein cooler Musik-Streaming-Dienst, der einen einfachen Zugang zu einer Vielzahl an Musik anbietet, ohne dass man jemals ein Album kaufen müsste.
-   Heute werden wir eine Express-App erstellen, um Spotify nach Künstlern, Alben und Titeln zu durchsuchen. Außerdem wird es möglich sein, aus einer Vorschau, einige dieser Lieder abzuspielen.
-   https://www.figma.com/file/EICVI6XcvuLWUuhmstiKVT/Spotify?node-id=0%3A1
-   Es mag viel erscheinen, aber lass uns es in einzelne Schritte zerlegen!

---

**Der Schlüsselhelfer: spotify-web-api-node npm package**

Spotify eignet sich hervorragend für das Streaming von Musik aus der App, aber es gibt auch einen Webdienst, mit dem wir als Entwickler herumspielen können.

Für die Zwecke dieser Übung werden wir das Paket [spotify-web-api-node npm](https://www.npmjs.com/package/spotify-web-api-node) verwenden (dies ist der Link, der dich zur Dokumentation führt).
Wie wir aus der Dokumentation herauslesen können, bietet uns dieses Paket einfache Methoden, um Anfragen an Spotify zu stellen und uns Künstler, Alben, Titel und mehr zurückzugeben.

In dieser Übung haben wir zwei Hauptziele:

-   Wir werden unser Wissen über die GET-Methode anwenden und wann und warum wir req.query und req.params verwenden.
-   Wir werden üben, wie man die Dokumentation (insbesondere dieses npm-Pakets) liest und wie man die in der Dokumentation enthaltenen Beispiele verwendet, um alle Durchgänge erfolgreich abzuschließen.

<br>**Registrierung der Anwendung und Erhalt der Zugangsdaten**

Die Spotify-API benötigt eine clientId und ein clientSecret, um uns die Erlaubnis zu erteilen, Anfragen zu stellen und einige Daten zurückzubekommen. Um clientId und clientSecret zu erhalten, müssen wir unsere App auf der offiziellen Spotify Developers-Website registrieren (dies wird euch nicht in Rechnung gestellt, und es werden keine Kreditkarteninformationen benötigt). Lass uns die nachstehenden Schritte befolgen:

1. Navigiere zu Spotify Developers.
2. Klicke auf die Schaltfläche "Anmelden". Wenn du noch kein Konto hast, wirst du darum gebeten, eine kostenloses Konto zu erstellen.
3. Nachdem du dich angemeldet hast, klicke auf die Schaltfläche Create an App.

Die folgenden Bildschirme könnten veraltet sein, da Spotify ständig auf ihrer Oberfläche iteriert, aber das sollte dich nicht davon abhalten, diese Schritte abzuschließen.

4. Fülle die Felder aus und sende das Formular ab.

---

**I-Spotify API Setup**

In den nächsten Schritten erstellst du alle Dateien, die du benötigst. Bis jetzt hast du einige grundlegende Einstellungen in app.js, aber das reicht nicht ganz aus. Wie du dich erinnern kannst, müssen wir, um einige Pakete (einschließlich Express) in unserer Anwendung zu erhalten, diese in der Datei package.json haben. Beginnen wir also mit der Auflistung der Schritte:

1. Installieren wir alle Abhängigkeiten, die wir benötigen, um diese Anwendung erfolgreich auszuführen: npm install express ejs spotify-web-api-node dotenv
2. nodemon wird als eine dev-Abhängigkeit installiert (unsere Anwendung hängt nicht davon ab, aber es hilft uns im Entwicklungsprozess), was bedeutet, dass wir nodemon verwenden können, um die Anwendung mit: npm run dev auszuführen.
3. Innerhalb der Datei app.js brauchen wir diesen code Snippet: require spotify-web-api-node.
   const SpotifyWebApi = require('spotify-web-api-node');

4. Innerhalb der Datei index.js findest du die Stelle, an der du den folgenden Code einfügen solltest:
    ```
    const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
    });
    // Retrieve an access token
    spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    ```
5. ```
   const spotifyApi = new SpotifyWebApi({
       clientId: process.env.CLIENT_ID,
       clientSecret: process.env.CLIENT_SECRET
   });
   ```

<br>
Um zu vermeiden, dass unsere API-Schlüssel veröffentlicht werden, möchten wir diese nicht hinzufügen und übergeben. Wir werden dafür ein Paket namens dotenv verwenden. Dieses Paket wird ganz am Anfang von app.js importiert. Jetzt müsstest du nur noch deine Schlüssel in der .env-Datei hinzufügen. Fahre also fort und erstellen eine .env-Datei. Füge dann dort die folgenden Zeilen ein, wobei du den Text durch deine Anmeldedaten ersetzt.

```
    CLIENT_ID=your clientId goes here
    CLIENT_SECRET=your clientSecret goes here
```

⚡ Die .env bezieht sich auf die .gitignore-Datei, damit bist du auf der sicheren Seite!

🔥 Das Styling sollte das Letzte sein, worauf du dich konzentrierst. Die Funktionalität steht an erster Stelle! 🙏🏻

---

## 2 | Express Setup

Lass uns jetzt einen views-Ordner erstellen. Im Moment sollten wir die folgende Struktur von Ordnern und Dateien haben:

```
lab-express-spotify
      ├── index.js
      ├── package.json
      ├── package-lock.json
      ├── public
      │    ├── images
      │    └── stylesheets
      │         └── style.css
      └── views
```

Wie wir sehen können, haben wir in der App.js nun alle Pakete, die wir jetzt brauchen:

```
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
```

Wir sind nun startklar. Lass uns die Dokumentation [spotify-web-api-node öffnen](https://www.npmjs.com/package/spotify-web-api-node) und unsere Reise beginnen!

---

## 3 | Suche nach einem Künstler

Du kannst alle deine Routen in der app.js behalten, je nachdem wo es steht:

### Step 1 | Erstelle eine Homepage

Erstelle eine einfache Index-Route, die eine Homepage darstellt. Auf dieser Seite solltest du ein kleines Suchformular haben, das ein Eingabefeld mit dem Namen eines Künstlers und eine Schaltfläche hat, die die Anfrage absendet.

Dieses Formular sollte seine Anfrage an /artist-search richten (action="/artist-search", method="GET").
