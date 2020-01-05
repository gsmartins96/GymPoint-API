require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: 'gabrielmartins',
  database: 'gympoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
