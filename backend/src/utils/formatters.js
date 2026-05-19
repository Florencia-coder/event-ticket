/**
 * Formatea un usuario para respuestas, excluyendo datos sensibles
 */
const formatUser = (user) => {
    const { password_hash, ...userWithoutPassword } = user.toJSON ? user.toJSON() : user;
    return userWithoutPassword;
};

/**
 * Formatea múltiples usuarios
 */
const formatUsers = (users) => {
    return users.map(user => formatUser(user));
};

export { formatUser, formatUsers };
