import 'dotenv/config';
import AppDataSource from './data-source';

async function run() {
  try {
    await AppDataSource.initialize();
    const executed = await AppDataSource.runMigrations();
    console.log(
      executed.length > 0
        ? `Ran ${executed.length} migration(s): ${executed.map((m) => m.name).join(', ')}`
        : 'No pending migrations.',
    );
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void run();
