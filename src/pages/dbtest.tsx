import { useState, useEffect } from 'react';
import mysql from 'mysql2/promise';

export default function DbTest() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const connection = await mysql.createConnection({
          host: '192.250.229.162',
          port: 3306,
          user: 'nisapoti_nis',
          password: 'Alvin@2025',
          database: 'nisapoti_nis'
        });

        const [tables] = await connection.query('SHOW TABLES');
        setResult(tables);
        await connection.end();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    testConnection();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Database Test</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
