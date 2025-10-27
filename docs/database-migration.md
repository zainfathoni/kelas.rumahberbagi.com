# Database Migration: MySQL to SQLite

This document describes the process of migrating production database dumps from
MySQL to SQLite format.

## Overview

The project uses three SQLite databases:

- `prisma/dev.db` - Development database
- `prisma/test.db` - Testing database
- `prisma/prod.db` - Production database with real data from MySQL dumps

The production database is generated from MySQL dump files located in
`prisma/dumps/main/` and converted to SQLite-compatible format in
`prisma/dumps/prod/`.

## Directory Structure

```
prisma/
├── dev.db                  # Development SQLite database
├── test.db                 # Testing SQLite database
├── prod.db                 # Production SQLite database (generated)
├── dumps/
│   ├── main/              # Original MySQL dumps (gitignored, NOT committed)
│   │   ├── metadata
│   │   ├── kelas.User-schema.sql
│   │   ├── kelas.User.00001.sql
│   │   ├── kelas.Course-schema.sql
│   │   ├── kelas.Course.00001.sql
│   │   ├── kelas.Chapter-schema.sql
│   │   ├── kelas.Chapter.00001.sql
│   │   ├── kelas.Lesson-schema.sql
│   │   ├── kelas.Lesson.00001.sql
│   │   ├── kelas.Attachment-schema.sql
│   │   ├── kelas.Attachment.00001.sql
│   │   ├── kelas.Subscription-schema.sql
│   │   ├── kelas.Subscription.00001.sql
│   │   ├── kelas.Transaction-schema.sql
│   │   └── kelas.Transaction.00001.sql
│   └── prod/              # Converted SQLite dumps (generated, not committed)
│       └── [same files as main, converted to SQLite]
├── schema.prisma          # Prisma schema for MySQL (original)
└── schema.sqlite.prisma   # Prisma schema for SQLite
```

## Migration Process

### Step 1: Copy and Convert Dump Files

The MySQL dump files are copied from `dumps/main/` to `dumps/prod/` and
converted to SQLite-compatible format using the `convert-dumps.js` script.

### Step 2: Create Database Schema

The SQLite database is created using Prisma with the `schema.sqlite.prisma`
schema file:

```bash
DATABASE_URL="file:./prod.db" npx prisma db push --schema=prisma/schema.sqlite.prisma --skip-generate
```

### Step 3: Import Data

The converted SQL dump files are imported into the SQLite database in the
correct order to respect foreign key constraints:

1. User (no dependencies)
2. Course (depends on User)
3. Chapter (depends on Course)
4. Lesson (depends on Chapter)
5. Attachment (depends on Lesson)
6. Subscription (depends on User and Course)
7. Transaction (depends on User and Course)

## Conversion Details

### MySQL to SQLite SQL Syntax Conversions

The `convert-dumps.js` script handles the following conversions:

#### 1. Backticks to Double Quotes

- **MySQL**: `` `column_name` ``
- **SQLite**: `"column_name"`

#### 2. Table and Column Name Quoting

Ensures reserved keywords are properly quoted:

- Table: `Transaction` → `"Transaction"`
- Column: `order` → `"order"`

#### 3. MySQL-Specific Syntax Removal

Removes MySQL-specific table options:

- `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
- `ENGINE=InnoDB`
- `DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`

#### 4. DateTime Format Conversion

Converts MySQL datetime format to ISO 8601 (required by Prisma SQLite):

- **MySQL**: `2022-03-02 02:45:32.591`
- **SQLite/Prisma**: `2022-03-02T02:45:32.591Z`

### Important Considerations

#### Reserved Keywords

SQLite has different reserved keywords than MySQL. The following are quoted in
the conversion:

- `order` (Column name in Chapter and Lesson)
- `Transaction` (Table name)

#### DateTime Format

Prisma's SQLite adapter requires ISO 8601 datetime format
(`YYYY-MM-DDTHH:MM:SS.sssZ`). This is critical for Prisma Studio to work
correctly.

#### NULL Values

MySQL NULL values are preserved as SQLite NULL during conversion.

#### Foreign Keys

SQLite foreign keys are disabled during data insertion
(`PRAGMA foreign_keys = OFF`) and re-enabled after (`PRAGMA foreign_keys = ON`)
to avoid constraint violations during bulk inserts.

## How to Regenerate prod.db

If you need to regenerate the production database from the MySQL dumps:

### 1. Delete the existing database

```bash
rm prisma/prod.db
```

### 2. Copy dumps from main to prod

```bash
cp -r prisma/dumps/main prisma/dumps/prod
```

### 3. Run the conversion script

```bash
node scripts/convert-mysql-dumps.js
```

This script:

- Reads all `.sql` files from `prisma/dumps/prod/`
- Applies MySQL-to-SQLite conversions
- Writes the converted files back

### 4. Create the database schema

```bash
DATABASE_URL="file:./prod.db" npx prisma db push --schema=prisma/schema.sqlite.prisma --skip-generate
```

### 5. Import the data

```bash
sqlite3 prisma/prod.db << 'EOF'
PRAGMA foreign_keys = OFF;

.read prisma/dumps/prod/kelas.User.00001.sql
.read prisma/dumps/prod/kelas.Course.00001.sql
.read prisma/dumps/prod/kelas.Chapter.00001.sql
.read prisma/dumps/prod/kelas.Lesson.00001.sql
.read prisma/dumps/prod/kelas.Attachment.00001.sql
.read prisma/dumps/prod/kelas.Subscription.00001.sql
.read prisma/dumps/prod/kelas.Transaction.00001.sql

PRAGMA foreign_keys = ON;
EOF
```

### 6. Verify the data

```bash
sqlite3 prisma/prod.db << 'EOF'
SELECT 'User' as table_name, COUNT(*) as row_count FROM "User"
UNION ALL
SELECT 'Course', COUNT(*) FROM "Course"
UNION ALL
SELECT 'Chapter', COUNT(*) FROM "Chapter"
UNION ALL
SELECT 'Lesson', COUNT(*) FROM "Lesson"
UNION ALL
SELECT 'Attachment', COUNT(*) FROM "Attachment"
UNION ALL
SELECT 'Subscription', COUNT(*) FROM "Subscription"
UNION ALL
SELECT 'Transaction', COUNT(*) FROM "Transaction";
EOF
```

Expected output:

```
User|220
Course|1
Chapter|18
Lesson|45
Attachment|5
Subscription|93
Transaction|95
```

## Scripts

### convert-dumps.js

Converts MySQL SQL dump files to SQLite-compatible format.

**Features:**

- Converts backticks to double quotes
- Quotes table and column names
- Removes MySQL-specific syntax
- Converts datetime format to ISO 8601

**Usage:**

```bash
node convert-dumps.js
```

### import-dumps.js

Node.js script for importing data (alternative to sqlite3 CLI). Currently
requires the `sqlite3` npm package which is not installed.

## Troubleshooting

### Error: "Inconsistent column data: Conversion failed" in Prisma Studio

This error occurs when datetime values are not in ISO 8601 format. Ensure the
conversion script properly converted all datetime values by checking:

```bash
sqlite3 prisma/prod.db "SELECT createdAt FROM \"User\" LIMIT 1;"
```

Should return: `2022-03-02T02:45:32.591Z`

### Foreign Key Constraint Errors

If you encounter foreign key constraint errors during data import:

1. Ensure `PRAGMA foreign_keys = OFF;` is set before inserting data
2. Import in the correct order (User → Course → Chapter → Lesson → Attachment,
   Subscription, Transaction)
3. Check that all referenced IDs exist in parent tables

### Missing Tables

If tables are not created, verify the `schema.sqlite.prisma` file exists and the
Prisma command was executed correctly.

## Environment Variables

For production database operations:

```bash
DATABASE_URL="file:./prod.db"
```

This is temporarily set when running Prisma commands. The main `.env` file uses
`file:./dev.db` for development.

## Git Ignore

The following are ignored by git:

- `/prisma/prod.db` - Generated database file
- `/prisma/dumps/prod/` - Converted dump files (can be regenerated)

The original `/prisma/dumps/main/` directory is gitignored and NOT committed to
the repository. The directory structure is tracked using `.gitkeep` files.
