// Obtiene la lista de usuarios desde el almacenamiento local o la inicializa vacía
let users = JSON.parse(localStorage.getItem('users')) || [];

// Define el ID actual basado en el último usuario registrado para evitar duplicados
let currentId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

// Verifica si existe el usuario administrador, si no, lo crea y lo almacena
if (!users.some(u => u.usuario === 'admin')) {
    users.push({ id: 0, nombre: 'Administrador', usuario: 'admin', password: 'Admin@123', rol: 'Administrador' });
    localStorage.setItem('users', JSON.stringify(users));
}

// Evento para manejar el inicio de sesión
// Se ejecuta cuando el formulario de login es enviado
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    // Obtiene los valores ingresados por el usuario
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Busca un usuario que coincida con las credenciales ingresadas
    const userFound = users.find(u => u.usuario === user && u.password === pass);
    if (userFound) {
        localStorage.setItem('loggedUser', JSON.stringify(userFound)); // Guarda el usuario en el almacenamiento local

        // Redirige a la página correspondiente según el rol
        if (userFound.rol === 'Administrador') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'inicio.html';
        }
    } else {
        document.getElementById('loginMessage').textContent = 'Usuario o contraseña incorrectos.';
    }
});

// Evento para manejar el registro de usuarios
document.getElementById('userForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtiene los valores ingresados en el formulario de registro
    const nombre = document.getElementById('nombre').value;
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('passwordUser').value;

    // Verifica si el usuario ya está registrado
    if (users.some(u => u.usuario === usuario)) {
        document.getElementById('errorMessage').textContent = 'El usuario ya está registrado.';
        return;
    }

    // Valida la contraseña antes de registrar el usuario
    if (!validatePassword(password)) {
        document.getElementById('errorMessage').textContent = 'La contraseña debe tener máximo 10 caracteres, una mayúscula y un carácter especial.';
        return;
    }

    // Crea un nuevo usuario y lo agrega a la lista
    const newUser = { id: currentId++, nombre, usuario, password, rol: 'Usuario' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('userForm').reset();
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
});

// Función para validar la contraseña según los requisitos
function validatePassword(password) {
    return password.length <= 10 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

// Función para cargar y mostrar la lista de usuarios en una tabla
function loadUserTable() {
    const tbody = document.getElementById('userTable');
    if (tbody) {
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = `<tr>
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.rol}</td>
                <td>${user.password}</td>
                <td>
                    ${user.rol !== 'Administrador' ? `<button onclick="editUser(${user.id})">Editar</button>` : ''}
                    ${user.rol !== 'Administrador' ? `<button onclick="deleteUser(${user.id})">Eliminar</button>` : ''}
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
        updateProgressBar();
    }
}

// Función para editar un usuario
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        const newName = prompt('Nuevo nombre:', user.nombre);
        if (newName) {
            user.nombre = newName;
            localStorage.setItem('users', JSON.stringify(users));
            loadUserTable();
        }
    }
}

// Función para eliminar un usuario
function deleteUser(id) {
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    loadUserTable();
}

// Función para actualizar la barra de progreso según la cantidad de usuarios registrados
function updateProgressBar() {
    const progress = document.getElementById('progressBar');
    if (progress) {
        const maxUsers = 10;
        const percentage = (users.length / maxUsers) * 100;
        progress.style.width = percentage + '%';
    }
}

// Función para cerrar sesión y redirigir al login
function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
}

// Protege la página de administración, redirigiendo si el usuario no es administrador
if (window.location.pathname.includes('admin.html')) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (!loggedUser || loggedUser.rol !== 'Administrador') {
        window.location.href = 'index.html';
    } else {
        loadUserTable();
    }
}

// Simulación de carga de progreso al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    let progressBar = document.getElementById("progressBar");
    let width = 0;
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width += 10;
            progressBar.style.width = width + "%";
        }
    }, 300);
});

// Simulación de acciones de botones en la tabla
document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
        alert("Editar usuario...");
    });
});

document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas eliminar este usuario?")) {
            alert("Usuario eliminado.");
        }
    });
});

// Función que se ejecuta al hacer clic en el botón "Cerrar Sesión"
function logout() {
    alert("Cerrando sesión..."); // Muestra un mensaje emergente
    window.location.href = "login.html"; // Redirige a la página de inicio de sesión
}
document.addEventListener("DOMContentLoaded", function () {
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const carouselInner = document.querySelector(".carousel-inner");
    const images = document.querySelectorAll(".carousel-inner img");
    let index = 0;

    function updateCarousel() {
        const offset = -index * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }

    nextButton.addEventListener("click", function () {
        index = (index + 1) % images.length;
        updateCarousel();
    });

    prevButton.addEventListener("click", function () {
        index = (index - 1 + images.length) % images.length;
        updateCarousel();
    });
});