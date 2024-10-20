export default () => ({
    port: parseInt(process.env.PORT, 10) || 2500,
    database: {
      url:
        process.env.DATABASE_URL ||
        'mysql://root:root@localhost:3306/valorant',
    },
  });
  