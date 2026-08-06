# Pulse – Architektur

## Ziel

Pulse ist eine kleine, selbst gehostete und datensparsame
Analytics-Anwendung für Websites.

Pulse erfasst Besuche und Seitenaufrufe, ohne Menschen dauerhaft
über mehrere Besuche hinweg wiederzuerkennen.

## Leitprinzipien

1. Pulse beobachtet Besuche, nicht Menschen.
2. Analytics darf niemals vom angebundenen Projekt abhängen.
3. Der Ausfall von Pulse darf eine angebundene Website niemals beeinträchtigen.
4. Es werden nur Daten gespeichert, die einer festgelegten Auswertung dienen.
5. Rohe IP-Adressen werden nicht gespeichert.
6. Es werden keine langfristigen Besucherprofile angelegt.

## Systemarchitektur

Pulse ist eine eigenständige Next.js-Anwendung.

Die Anwendung enthält:

- das Admin-Dashboard
- die öffentliche Tracking-API
- die serverseitige Datenbankanbindung
- Authentifizierung und Zugriffsschutz
- Analytics-Auswertungen

## Infrastruktur

- Next.js App Router
- JavaScript
- Tailwind CSS
- Node.js
- PostgreSQL
- Nginx als Reverse Proxy
- selbst gehostet auf einem IONOS-VPS
- geplante Adresse: pulse.node-test.de


Pulse verwendet PostgreSQL als relationale Datenbank.

Die Datenbank läuft lokal auf dem VPS und ist nicht direkt über das Internet erreichbar.

Zugriff erhält ausschließlich die Pulse-Anwendung.

## Komponenten

### Angebundene Website

Eine angebundene Website erfasst einen Seitenwechsel und sendet diesen
zunächst an eine eigene serverseitige Route.

Diese Route ergänzt serverseitig verfügbare Informationen und leitet das
Ereignis authentifiziert an Pulse weiter.

### Pulse API

Öffentlicher Endpunkt:

POST /api/v1/events

Die API:

- authentifiziert die angebundene Website
- validiert eingehende Daten
- filtert bekannte Bots
- normalisiert technische Informationen
- ordnet den Aufruf einer aktiven Session zu
- speichert den Seitenaufruf

### Pulse Dashboard

Das Dashboard stellt unter anderem dar:

- Besuche
- Seitenaufrufe
- Seitenaufrufe pro Besuch
- Verlauf nach Zeitraum
- häufig aufgerufene Seiten
- Einstiegsseiten
- Referrer
- Geräteklassen
- Browser
- Betriebssysteme
- Sprachen
- Länder

## Datenmodell

Pulse verwendet zunächst drei Tabellen:

- sites
- sessions
- page_views

Beziehungen:

sites 1:n sessions
sessions 1:n page_views

## Nicht-Ziele

Pulse erstellt keine:

- langfristigen Besucherkennungen
- werbeorientierten Nutzerprofile
- websiteübergreifenden Profile
- Marketing-Funnels
- personenbezogenen Auswertungen
- Speicherung roher IP-Adressen

# Datenbank

## PostgreSQL

Pulse verwendet eine lokal auf dem VPS betriebene PostgreSQL-Datenbank.

- Version: PostgreSQL 16
- Datenbank: `pulse`
- Anwendungsrolle: `pulse_app`
- PostgreSQL lauscht ausschließlich auf `127.0.0.1:5432`
- Externe Datenbankverbindungen sind nicht erlaubt
- Lokale TCP-Verbindungen verwenden `scram-sha-256`
- Die Rolle `pulse_app` besitzt keine administrativen PostgreSQL-Rechte

## Schema

Das produktive Schema liegt in:

`sql/schema.sql`

Es enthält zunächst die Tabellen:

- `sites`
- `sessions`
- `page_views`


## Aktueller Stand

Das initiale Schema wurde erfolgreich auf dem VPS eingespielt.

### Tabellen

- `sites`
- `sessions`
- `page_views`

### Beziehungen

- Eine Website besitzt mehrere Sessions.
- Eine Session besitzt mehrere Pageviews.
- Beim Löschen einer Website werden ihre Sessions und Pageviews ebenfalls gelöscht.
- Beim Löschen einer Session werden ihre Pageviews ebenfalls gelöscht.

### Indizes

Die Datenbank enthält Indizes für:

- Sessions nach Website und Startzeit
- aktive Session-Zuordnung über den temporären Match-Key
- Pageviews nach Session
- Pageviews nach Zeitpunkt
- Pageviews nach Pfad und Zeitpunkt



