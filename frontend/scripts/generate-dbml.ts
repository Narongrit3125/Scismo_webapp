import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface TableInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface ConstraintInfo {
  constraint_name: string;
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
}

async function generateDBML() {
  try {
    console.log('🔍 Connecting to database...');

    // Get all tables
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    console.log(`📊 Found ${tables.length} tables`);

    let dbml = `// Generated DBML from PostgreSQL Database\n`;
    dbml += `// Generated at: ${new Date().toISOString()}\n`;
    dbml += `// Database: SMO Web Application\n\n`;

    // For each table, get columns and constraints
    for (const table of tables) {
      const tableName = table.tablename;
      
      console.log(`📋 Processing table: ${tableName}`);

      // Get columns
      const columns = await prisma.$queryRaw<TableInfo[]>`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = ${tableName}
        ORDER BY ordinal_position;
      `;

      // Get primary keys
      const primaryKeys = await prisma.$queryRaw<{ column_name: string }[]>`
        SELECT a.attname as column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = ${tableName}::regclass AND i.indisprimary;
      `;

      const pkColumns = primaryKeys.map(pk => pk.column_name);

      // Start table definition
      dbml += `Table ${tableName} {\n`;

      // Add columns
      for (const col of columns) {
        let columnDef = `  ${col.column_name} ${mapDataType(col.data_type)}`;

        // Add constraints
        const constraints: string[] = [];
        
        if (pkColumns.includes(col.column_name)) {
          constraints.push('pk');
        }
        
        if (col.is_nullable === 'NO') {
          constraints.push('not null');
        }
        
        if (col.column_default) {
          if (col.column_default.includes('now()')) {
            constraints.push('default: `now()`');
          } else if (col.column_default.includes('true')) {
            constraints.push('default: true');
          } else if (col.column_default.includes('false')) {
            constraints.push('default: false');
          }
        }

        if (constraints.length > 0) {
          columnDef += ` [${constraints.join(', ')}]`;
        }

        dbml += columnDef + '\n';
      }

      dbml += '}\n\n';
    }

    // Get all foreign key relationships
    console.log('🔗 Processing relationships...');
    
    const foreignKeys = await prisma.$queryRaw<ConstraintInfo[]>`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public';
    `;

    // Add relationships
    if (foreignKeys.length > 0) {
      dbml += '// Relationships\n';
      for (const fk of foreignKeys) {
        dbml += `Ref: ${fk.table_name}.${fk.column_name} > ${fk.foreign_table_name}.${fk.foreign_column_name}\n`;
      }
    }

    // Write to file
    const outputPath = path.join(__dirname, '..', 'database.dbml');
    fs.writeFileSync(outputPath, dbml);

    console.log('✅ DBML file generated successfully!');
    console.log(`📄 File location: ${outputPath}`);
    console.log('\n🌐 You can visualize this at: https://dbdiagram.io/');
    console.log('   Just paste the DBML content into the editor');

  } catch (error) {
    console.error('❌ Error generating DBML:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function mapDataType(pgType: string): string {
  const typeMap: { [key: string]: string } = {
    'character varying': 'varchar',
    'character': 'char',
    'timestamp without time zone': 'timestamp',
    'timestamp with time zone': 'timestamptz',
    'integer': 'int',
    'bigint': 'bigint',
    'smallint': 'smallint',
    'boolean': 'boolean',
    'text': 'text',
    'json': 'json',
    'jsonb': 'jsonb',
    'uuid': 'uuid',
    'date': 'date',
    'numeric': 'decimal',
    'real': 'float',
    'double precision': 'double',
    'bytea': 'binary',
    'ARRAY': 'array',
  };

  return typeMap[pgType.toLowerCase()] || pgType;
}

// Run the script
generateDBML()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
