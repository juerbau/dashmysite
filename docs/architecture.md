# DashMySite – Architektur

## Ziel

DashMySite ist eine kleine, selbst gehostete und datensparsame
Analytics-Anwendung für Websites.

DashMySite erfasst Besuche und Seitenaufrufe, ohne Menschen dauerhaft
über mehrere Besuche hinweg wiederzuerkennen.

## Leitprinzipien

1. DashMySite beobachtet Besuche, nicht Menschen.
2. Analytics darf niemals vom angebundenen Projekt abhängen.
3. Der Ausfall von DashMySite darf eine angebundene Website niemals beeinträchtigen.
4. Es werden nur Daten gespeichert, die einer festgelegten Auswertung dienen.
5. Rohe IP-Adressen werden nicht gespeichert.
6. Es werden keine langfristigen Besucherprofile angelegt.

## Systemarchitektur

DashMySite ist eine eigenständige Next.js-Anwendung.

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
- geplante Adresse: DashMySite.node-test.de


DashMySite verwendet PostgreSQL als relationale Datenbank.

Die Datenbank läuft lokal auf dem VPS und ist nicht direkt über das Internet erreichbar.

Zugriff erhält ausschließlich die DashMySite-Anwendung.

## Komponenten

### Angebundene Website

Eine angebundene Website erfasst einen Seitenwechsel und sendet diesen
zunächst an eine eigene serverseitige Route.

Diese Route ergänzt serverseitig verfügbare Informationen und leitet das
Ereignis authentifiziert an DashMySite weiter.

### DashMySite API

Öffentlicher Endpunkt:

POST /api/v1/events

Die API:

- authentifiziert die angebundene Website
- validiert eingehende Daten
- filtert bekannte Bots
- normalisiert technische Informationen
- ordnet den Aufruf einer aktiven Session zu
- speichert den Seitenaufruf

### DashMySite Dashboard

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

DashMySite verwendet zunächst drei Tabellen:

- sites
- sessions
- page_views

Beziehungen:

sites 1:n sessions
sessions 1:n page_views

## Nicht-Ziele

DashMySite erstellt keine:

- langfristigen Besucherkennungen
- werbeorientierten Nutzerprofile
- websiteübergreifenden Profile
- Marketing-Funnels
- personenbezogenen Auswertungen
- Speicherung roher IP-Adressen

# Datenbank

## PostgreSQL

DashMySite verwendet eine lokal auf dem VPS betriebene PostgreSQL-Datenbank.

- Version: PostgreSQL 16
- Datenbank: `DashMySite`
- Anwendungsrolle: `DashMySite_app`
- PostgreSQL lauscht ausschließlich auf `127.0.0.1:5432`
- Externe Datenbankverbindungen sind nicht erlaubt
- Lokale TCP-Verbindungen verwenden `scram-sha-256`
- Die Rolle `DashMySite_app` besitzt keine administrativen PostgreSQL-Rechte

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


## Tracking-Workflow

Ein Seitenaufruf wird über `trackPageView()` verarbeitet.

Der Workflow:

1. ermittelt die registrierte Website,
2. sucht eine aktive Session anhand des temporären Match-Keys,
3. legt bei Bedarf eine neue Session an,
4. speichert den PageView,
5. aktualisiert bei bestehenden Sessions `last_seen_at`
   und `pageview_count`.

Session- und PageView-Schreibvorgänge erfolgen gemeinsam
innerhalb einer PostgreSQL-Transaktion.


## Session-Zuordnung

DashMySite verwendet keine dauerhafte Besucher-ID.

Eine angebundene Website erzeugt für den aktuellen Request einen
temporären HMAC-Match-Key aus:

- Client-IP
- User-Agent
- Tageskennung
- website-spezifischem geheimem Schlüssel

Die rohe IP-Adresse wird nicht an DashMySite übertragen oder gespeichert.

Der Match-Key dient ausschließlich dazu, mehrere Pageviews innerhalb
eines kurzfristigen Besuchs derselben Session zuzuordnen.
