const PrefixSchema =  require('../../schemas/prefixSchema.js');

async function getPrefix(guildId) {
  const data = await PrefixSchema.findOne({ guildId });
  return data ? data.prefix : '!'; // Si no hay prefijo, retorna '!' por defecto
}

module.exports = getPrefix;
