export const SQL_SCHEMA = `
        -- Clients that have accessed this system
        DROP TABLE IF EXISTS Client CASCADE;
        CREATE TABLE Client (
            clientId                SERIAL PRIMARY KEY,
            clientUsername          TEXT NOT NULL,
            clientDeviceId          TEXT NOT NULL,
            clientDeviceType        TEXT,
            clientLastSeenApprox    DATE DEFAULT CURRENT_DATE,
            clientDeviceInfo        TEXT
        );
        ALTER SEQUENCE Client_clientId_seq RESTART WITH 1;
        DROP INDEX IF EXISTS ClientIndex;
        CREATE UNIQUE INDEX ClientIndex ON Client (clientUsername, clientDeviceId);

        -- List of collections
        DROP TABLE IF EXISTS Collection CASCADE;
        CREATE TABLE Collection (
            collectionId                BIGSERIAL PRIMARY KEY ,
            clientId                    INTEGER NOT NULL,
            collectionBackendId         TEXT NOT NULL,
            collectionDisplayName       TEXT NOT NULL,
            collectionEASType           INTEGER NOT NULL,
            collectionBackendParentId   TEXT DEFAULT '0',

            FOREIGN KEY (clientId) REFERENCES Client(clientId) ON DELETE CASCADE
        );
        ALTER SEQUENCE Collection_CollectionId_seq RESTART WITH 1;
        DROP INDEX IF EXISTS CollectionIndex;
        CREATE UNIQUE INDEX CollectionIndex ON Collection (clientId, collectionBackendId);
`;