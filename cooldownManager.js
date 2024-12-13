// cooldownManager.js
const cooldowns = new Map();

function checkCooldown(userId, commandName, baseCooldown = 3000, extendedCooldown = 5000) {
    const key = `${userId}-${commandName}`;
    const now = Date.now();
    const userCooldown = cooldowns.get(key) || { count: 0, timestamp: 0 };

    if (now - userCooldown.timestamp > extendedCooldown) {
        // Si pasa el tiempo extendido, reinicia el cooldown
        cooldowns.set(key, { count: 1, timestamp: now });
        return 0; // No hay penalización inicial
    }

    if (userCooldown.count >= 2 && now - userCooldown.timestamp <= baseCooldown) {
        // Si excede 2 veces en un intervalo menor al baseCooldown, aplica extendedCooldown
        userCooldown.timestamp = now; // Actualiza el timestamp
        cooldowns.set(key, userCooldown);
        return extendedCooldown; // Penalización extendida
    }

    if (userCooldown.count < 2) {
        // Incrementa el contador de usos si aún no llega al límite
        userCooldown.count += 1;
        userCooldown.timestamp = now;
        cooldowns.set(key, userCooldown);
        return baseCooldown; // Penalización base
    }

    return baseCooldown; // Penalización estándar
}

module.exports = {
    checkCooldown,
};
