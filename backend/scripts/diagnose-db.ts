
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Diagnostic Script ---');
  console.log('Connecting to database...');
  
  try {
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
    // Get all tables
    const tables: { table_name: string }[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    console.log(`\nFound ${tables.length} tables in public schema:\n`);

    const schemaLines: string[] = [];

    for (const t of tables) {
      const tableName = t.table_name;
      // Skip internal prisma migrations table if desired, but user asked for "all tables"
      
      console.log(`Analyzing table: ${tableName}`);
      
      const columns: { column_name: string, data_type: string, is_nullable: string }[] = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position;
      `;

      schemaLines.push(`CREATE TABLE "${tableName}" (`);
      const colDefs = columns.map(c => {
        return `  "${c.column_name}" ${c.data_type.toUpperCase()}${c.is_nullable === 'NO' ? ' NOT NULL' : ''}`;
      });
      schemaLines.push(colDefs.join(',\n'));
      schemaLines.push(`);\n`);
      
      // Get row count
      try {
        // Unsafe query here is fine for diagnostic script on trusted input (table name from schema)
        // We use $queryRawUnsafe because table name cannot be parameterized in identifiers
        const countResult = await prisma.$queryRawUnsafe<{ count: bigint }[]>(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const count = typeof countResult[0].count === 'bigint' ? countResult[0].count.toString() : countResult[0].count;
        console.log(`  -> Rows: ${count}`);
      } catch (e) {
        console.log(`  -> Could not count rows: ${e}`);
      }
    }

    console.log('\n--- Generated SQL Schema (Approximate) ---\n');
    console.log(schemaLines.join('\n'));

  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
