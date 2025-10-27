/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

const dumpsDir = path.join(__dirname, '..', 'prisma', 'dumps', 'prod')

// Function to convert MySQL SQL to SQLite SQL
function convertMySQLToSQLite(content) {
  let converted = content

  // Replace MySQL backticks with SQLite double quotes
  converted = converted.replace(/`/g, '"')

  // Quote unquoted column names in INSERT statements
  // Matches patterns like: INSERT INTO Table(col1,col2,...) or INSERT INTO "Table"(col1,col2,...)
  // and converts to: INSERT INTO "Table"("col1","col2",...) or INSERT INTO "Table"("col1","col2",...)
  converted = converted.replace(
    /INSERT INTO (["`]?[^`"(]+["`]?)\(([^)]+)\)/g,
    (match, tableName, columns) => {
      // Quote table name if not already quoted
      let quotedTableName = tableName.trim()
      if (!quotedTableName.startsWith('"')) {
        quotedTableName = `"${quotedTableName}"`
      }

      // Quote column names
      const quotedColumns = columns
        .split(',')
        .map((col) => {
          col = col.trim()
          if (!col.startsWith('"')) {
            return `"${col}"`
          }
          return col
        })
        .join(',')
      return `INSERT INTO ${quotedTableName}(${quotedColumns})`
    }
  )

  // Remove MySQL-specific table options
  // Remove: CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  converted = converted.replace(/\s+CHARACTER SET [^\s]+ COLLATE [^\s]+/g, '')

  // Remove: ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  converted = converted.replace(
    /\s+ENGINE=InnoDB\s+DEFAULT CHARSET=[^\s]+\s+COLLATE=[^;]+;/g,
    ';'
  )

  // Remove: DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  converted = converted.replace(
    /\s+DEFAULT CHARSET=[^\s]+\s+COLLATE=[^;]+;/g,
    ';'
  )

  // Handle datetime format conversion
  // Convert MySQL datetime format (YYYY-MM-DD HH:MM:SS.mmm) to ISO 8601 (YYYY-MM-DDTHH:MM:SS.mmmZ)
  // Match datetime strings in VALUES like: ("2022-03-02 02:45:32.591",...)
  converted = converted.replace(
    /"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}\.\d{3})"/g,
    '"$1T$2Z"'
  )

  return converted
}

// Get all SQL files from the prod directory
const files = fs.readdirSync(dumpsDir).filter((file) => file.endsWith('.sql'))

console.log(`Found ${files.length} SQL files to convert`)

files.forEach((file) => {
  const filePath = path.join(dumpsDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  const converted = convertMySQLToSQLite(content)

  fs.writeFileSync(filePath, converted, 'utf-8')
  console.log(`✓ Converted ${file}`)
})

console.log('\nAll dump files converted to SQLite format!')
