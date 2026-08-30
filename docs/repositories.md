# Repositories

Repositories kapseln ausschließlich den Datenbankzugriff.

Sie enthalten:

- SQL
- Parameter
- Rückgabewerte

Sie enthalten keine:

- Businesslogik
- Validierung
- HTTP-Antworten
- Analytics-Logik


## Transaktionen

Repository-Funktionen, die Teil eines gemeinsamen Schreibvorgangs
sein können, akzeptieren optional einen PostgreSQL-Client.

Ohne übergebenen Client verwenden sie den normalen Connection Pool.
Innerhalb einer Transaktion wird derselbe Client an alle beteiligten
Repositories weitergereicht.


## PageViews Repository

Das PageViews-Repository kapselt den Zugriff auf einzelne Seitenaufrufe.

Ein PageView gehört immer genau zu einer Session.

Aktuell unterstützt das Repository:

- das Anlegen eines PageViews
- das Laden aller PageViews einer Session