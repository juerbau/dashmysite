CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE sites (
                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                       name VARCHAR(100) NOT NULL,
                       domain VARCHAR(255) NOT NULL UNIQUE,

                       site_key UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
                       api_secret_hash TEXT NOT NULL,

                       is_active BOOLEAN NOT NULL DEFAULT TRUE,

                       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE sessions (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                          site_id BIGINT NOT NULL
                              REFERENCES sites(id)
                                  ON DELETE CASCADE,

                          match_key UUID,

                          started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                          last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                          entry_path TEXT NOT NULL,

                          referrer_domain VARCHAR(255),
                          referrer_type VARCHAR(30) NOT NULL DEFAULT 'direct',

                          browser VARCHAR(50),
                          operating_system VARCHAR(50),
                          device_type VARCHAR(20) NOT NULL DEFAULT 'unknown',

                          language VARCHAR(10),
                          country CHAR(2),

                          pageview_count INTEGER NOT NULL DEFAULT 1,

                          CONSTRAINT sessions_pageview_count_positive
                              CHECK (pageview_count > 0),

                          CONSTRAINT sessions_referrer_type_valid
                              CHECK (
                                  referrer_type IN (
                                                    'direct',
                                                    'search',
                                                    'social',
                                                    'external',
                                                    'internal',
                                                    'unknown'
                                      )
                                  ),

                          CONSTRAINT sessions_device_type_valid
                              CHECK (
                                  device_type IN (
                                                  'desktop',
                                                  'mobile',
                                                  'tablet',
                                                  'bot',
                                                  'unknown'
                                      )
                                  )
);


CREATE TABLE page_views (
                            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                            session_id UUID NOT NULL
                                REFERENCES sessions(id)
                                    ON DELETE CASCADE,

                            pathname TEXT NOT NULL,

                            visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_sessions_site_started
    ON sessions (site_id, started_at DESC);


CREATE INDEX idx_sessions_active_match
    ON sessions (site_id, match_key, last_seen_at DESC)
    WHERE match_key IS NOT NULL;


CREATE INDEX idx_page_views_session
    ON page_views (session_id);


CREATE INDEX idx_page_views_visited
    ON page_views (visited_at DESC);


CREATE INDEX idx_page_views_session_visited
    ON page_views (session_id, visited_at);


CREATE INDEX idx_page_views_path_visited
    ON page_views (pathname, visited_at DESC);