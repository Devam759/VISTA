"""Utility script to purge data from all application tables."""

import os
from contextlib import suppress

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import ProgrammingError


def main() -> None:
    load_dotenv()
    db_uri = os.getenv("DATABASE_URL", "sqlite:///vista.db")
    engine = create_engine(db_uri)

    with engine.begin() as conn:
        dialect = engine.dialect.name
        if dialect == "sqlite":
            conn.execute(text("PRAGMA foreign_keys = OFF;"))

        inspector = inspect(engine)
        table_names = inspector.get_table_names()

        for table in table_names:
            if dialect == "sqlite":
                stmt = text(f"DROP TABLE IF EXISTS \"{table}\";")
            else:
                stmt = text(f"DROP TABLE IF EXISTS {table} CASCADE;")
            with suppress(ProgrammingError):
                conn.execute(stmt)

        if dialect == "sqlite":
            conn.execute(text("PRAGMA foreign_keys = ON;"))

    engine.dispose()
    print("All database tables dropped.")
if __name__ == "__main__":
    main()
