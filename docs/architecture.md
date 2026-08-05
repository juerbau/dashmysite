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