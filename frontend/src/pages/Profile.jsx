import { useState } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { useUpdateUser, useUpdatePassword } from '../hooks/useAuth';
import './profile.css';

function Profile() {
    const { user, logout, updateUser } = useAuth();
    const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();
    const { mutate: updatePasswordMutation, isPending: isUpdatingPassword } = useUpdatePassword();

    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);

    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        email: user?.email || '',
        celular: user?.celular || '',
        fecha_nacimiento: user?.fecha_nacimiento || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateUserMutation(
            { userId: user.id, userData: formData },
            {
                onSuccess: (data) => {
                    updateUser(data.user);
                    setEditMode(false);
                },
            }
        );
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        updatePasswordMutation(
            {
                userId: user.id,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            },
            {
                onSuccess: () => {
                    setPasswordMode(false);
                    setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    });
                    alert('Contraseña actualizada correctamente');
                },
            }
        );
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-title">Mi Perfil</h1>
                    <p className="profile-subtitle">
                        Gestiona tu información personal
                    </p>
                </div>

                {/* Información del usuario */}
                <div className="profile-card">
                    <h2 className="card-title">Información Personal</h2>

                    {!editMode ? (
                        <div className="profile-info">
                            <div className="info-group">
                                <label>Nombre</label>
                                <p>{user?.nombre}</p>
                            </div>
                            <div className="info-group">
                                <label>Apellido</label>
                                <p>{user?.apellido}</p>
                            </div>
                            <div className="info-group">
                                <label>Email</label>
                                <p>{user?.email}</p>
                            </div>
                            <div className="info-group">
                                <label>Celular</label>
                                <p>{user?.celular}</p>
                            </div>
                            <div className="info-group">
                                <label>Fecha de Nacimiento</label>
                                <p>{user?.fecha_nacimiento}</p>
                            </div>
                            <button
                                className="profile-btn"
                                onClick={() => setEditMode(true)}
                            >
                                Editar Perfil
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="profile-form">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Celular</label>
                                <input
                                    type="tel"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="profile-btn profile-btn--save"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button
                                    type="button"
                                    className="profile-btn profile-btn--cancel"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Seguridad */}
                <div className="profile-card">
                    <h2 className="card-title">Seguridad</h2>

                    {!passwordMode ? (
                        <button
                            className="profile-btn"
                            onClick={() => setPasswordMode(true)}
                        >
                            Cambiar Contraseña
                        </button>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="profile-form">
                            <div className="form-group">
                                <label>Contraseña Actual</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="profile-btn profile-btn--save"
                                    disabled={isUpdatingPassword}
                                >
                                    {isUpdatingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                                </button>
                                <button
                                    type="button"
                                    className="profile-btn profile-btn--cancel"
                                    onClick={() => setPasswordMode(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Logout */}
                <div className="profile-card">
                    <button
                        className="profile-btn profile-btn--logout"
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
