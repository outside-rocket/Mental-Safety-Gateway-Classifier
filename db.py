import sqlite3

conn = sqlite3.connect("dashboard.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM predictions ORDER BY id DESC")
rows = cursor.fetchall()

print(f"\nTotal Records: {len(rows)}\n")

print("-" * 140)
print(f"{'ID':<5}{'Risk':<6}{'Conf':<10}{'Time':<22}{'Query'}")
print("-" * 140)

for row in rows:
    id_, query, risk, confidence, action, timestamp = row

    print(
        f"{id_:<5}"
        f"{risk:<6}"
        f"{confidence:<10.4f}"
        f"{timestamp:<22}"
        f"{query}"
    )

print("-" * 140)

conn.close()
