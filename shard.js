const { ShardingManager } = require("discord.js");

const shards = new ShardingManager("./index.js", {
    token: "MTIwMDY0NjE5NzMwNDYzMTMyNg.G-gHok.brXqDQQ_sgNmVq342a7bkHl7JvKigEv92enKeA",
    totalShards: "auto", // Discord.js calculará automáticamente el número de shards necesarios
});

shards.on("shardCreate", shard => {
    console.log(`[${new Date().toISOString()}] Shard lanzada #${shard.id}`);
});

// Lanza las shards
shards.spawn({
    amount: shards.totalShards,
    delay: 10000, // 10 segundos entre lanzamientos de shards
    timeout: -1, // Desactiva el límite de tiempo para el inicio de shards
}).catch(error => {
    console.error("Error al lanzar las shards:", error);
});
