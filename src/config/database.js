// require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'gabrielmartins',
  database: 'gympoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
