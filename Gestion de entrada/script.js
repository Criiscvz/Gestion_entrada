// Función para cambiar entre pestañas de login y registro
function showTab(tabId) {
  // Ocultar todas las pestañas
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((tab) => {
    tab.classList.remove("active")
  })

  // Desactivar todos los botones de pestaña
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((button) => {
    button.classList.remove("active")
  })

  // Mostrar la pestaña seleccionada
  document.getElementById(tabId).classList.add("active")

  // Activar el botón correspondiente
  const activeButton = document.querySelector(`.tab-btn[onclick="showTab('${tabId}')"]`)
  if (activeButton) {
    activeButton.classList.add("active")
  }
}

// Función para inicializar usuarios de ejemplo
function initializeUsers() {
  // Forzar la inicialización de usuarios cada vez
  // Crear usuarios de ejemplo con los nuevos datos proporcionados
  const demoUsers = [
    {
      name: "Cristhian Chavez",
      email: "Cristhianchavez@live.uleam.edu.ec",
      password: "contraceña123",
      faculty: "ingenieria",
      semester: "5",
      userType: "estudiante",
      vehicles: [
        {
          make: "Toyota",
          model: "Corolla",
          plate: "ABC-123",
          color: "Gris",
          year: 2020,
          type: "automovil",
        },
      ],
    },
    {
      name: "José Alonso",
      email: "JoseAlonso@live.uleam.edu.ec",
      password: "profesor456",
      faculty: "ciencias",
      semester: "",
      userType: "profesor",
      vehicles: [
        {
          make: "Honda",
          model: "Civic",
          plate: "XYZ-789",
          color: "Azul",
          year: 2018,
          type: "automovil",
        },
      ],
    },
    {
      name: "Administrador",
      email: "admin@live.uleam.edu.ec",
      password: "admin789",
      faculty: "",
      semester: "",
      userType: "admin",
      vehicles: [],
    },
  ]

  // Guardar usuarios en localStorage
  localStorage.setItem("users", JSON.stringify(demoUsers))
  console.log("Usuarios inicializados:", demoUsers)
}

// Función para validar el formato de correo electrónico
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

// Función para validar que el nombre solo contenga letras y caracteres especiales permitidos
function validateName(name) {
  const re = /^[A-Za-zÀ-ÿ\s\-']+$/
  return re.test(name)
}

// Función para mostrar mensajes de error
function displayError(inputId, message) {
  const input = document.getElementById(inputId)
  if (input) {
    // Eliminar mensajes de error previos
    const previousError = input.parentNode.querySelector(".error-message")
    if (previousError) {
      previousError.remove()
    }

    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.textContent = message

    input.parentNode.appendChild(errorDiv)
    input.style.borderColor = "#e74c3c"

    // Hacer que el input se sacuda ligeramente para llamar la atención
    input.classList.add("shake-animation")
    setTimeout(() => {
      input.classList.remove("shake-animation")
    }, 500)
  }
}

// Función para mostrar mensajes en contenedores de mensaje
function displayMessage(containerId, message, type = "error") {
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = `<div class="message ${type}">${message}</div>`

    // Limpiar el mensaje después de 5 segundos si es de éxito
    if (type === "success") {
      setTimeout(() => {
        container.innerHTML = ""
      }, 5000)
    }
  }
}

// Función para limpiar mensajes de error
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message")
  errorMessages.forEach((msg) => msg.remove())

  const inputs = document.querySelectorAll("input, select")
  inputs.forEach((input) => {
    input.style.borderColor = ""
  })
}

// Función para intentar iniciar sesión
function attemptLogin() {
  // Limpiar mensajes de error previos
  clearErrorMessages()

  // Obtener valores de los campos
  const email = document.getElementById("login-email").value.trim()
  const password = document.getElementById("login-password").value.trim()

  // Validar campos
  let isValid = true

  // Validar email
  if (!email) {
    displayError("login-email", "El correo electrónico es obligatorio")
    isValid = false
  } else if (!validateEmail(email)) {
    displayError("login-email", "Formato de correo electrónico inválido")
    isValid = false
  }

  // Validar contraseña
  if (!password) {
    displayError("login-password", "La contraseña es obligatoria")
    isValid = false
  } else if (password.length < 6) {
    displayError("login-password", "La contraseña debe tener al menos 6 caracteres")
    isValid = false
  }

  // Si hay errores de validación, detener el proceso
  if (!isValid) {
    return
  }

  // Obtener usuarios del localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  console.log("Usuarios disponibles:", users)

  // Buscar usuario por email (insensible a mayúsculas/minúsculas)
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  console.log("Usuario encontrado:", user)

  // Verificar si el usuario existe y la contraseña es correcta
  if (user && user.password === password) {
    // Guardar información del usuario actual en sessionStorage
    sessionStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
        userType: user.userType,
        faculty: user.faculty,
        semester: user.semester,
      }),
    )

    // Mostrar mensaje de éxito
    displayMessage("login-message", `Inicio de sesión exitoso. Bienvenido, ${user.name}!`, "success")

    // Redirigir según el tipo de usuario después de un breve retraso
    setTimeout(() => {
      if (user.userType === "admin") {
        window.location.href = "admin.html"
      } else {
        window.location.href = "user.html"
      }
    }, 1000)
  } else {
    // Mostrar mensaje de error
    if (!user) {
      displayMessage("login-message", "El correo electrónico no está registrado")
      console.error("Correo no encontrado:", email)
    } else {
      displayMessage("login-message", "Contraseña incorrecta")
    }
  }
}

// Función para registrar un nuevo usuario
function registerUser() {
  // Limpiar mensajes de error previos
  clearErrorMessages()

  // Obtener valores de los campos
  const name = document.getElementById("register-name-page").value.trim()
  const email = document.getElementById("register-email-page").value.trim()
  const faculty = document.getElementById("register-faculty-page").value
  const semester = document.getElementById("register-semester-page").value
  const userType = document.getElementById("user-type-page").value
  const password = document.getElementById("register-password-page").value.trim()
  const confirmPassword = document.getElementById("register-password-confirm-page").value.trim()

  // Validar campos
  let isValid = true

  // Validar nombre
  if (!name) {
    displayError("register-name-page", "El nombre es obligatorio")
    isValid = false
  } else if (!validateName(name)) {
    displayError("register-name-page", "El nombre solo debe contener letras, espacios, guiones y apóstrofes")
    isValid = false
  }

  // Validar email
  if (!email) {
    displayError("register-email-page", "El correo electrónico es obligatorio")
    isValid = false
  } else if (!validateEmail(email)) {
    displayError("register-email-page", "Formato de correo electrónico inválido")
    isValid = false
  } else {
    // Verificar si el email ya está registrado
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      displayError("register-email-page", "Este correo electrónico ya está registrado")
      isValid = false
    }
  }

  // Validar facultad
  if (!faculty) {
    displayError("register-faculty-page", "Debe seleccionar una facultad")
    isValid = false
  }

  // Validar semestre (solo para estudiantes)
  if (userType === "estudiante" && !semester) {
    displayError("register-semester-page", "Debe seleccionar un semestre")
    isValid = false
  }

  // Validar tipo de usuario
  if (!userType) {
    displayError("user-type-page", "Debe seleccionar un tipo de usuario")
    isValid = false
  }

  // Validar contraseña
  if (!password) {
    displayError("register-password-page", "La contraseña es obligatoria")
    isValid = false
  } else if (password.length < 6) {
    displayError("register-password-page", "La contraseña debe tener al menos 6 caracteres")
    isValid = false
  }

  // Validar confirmación de contraseña
  if (!confirmPassword) {
    displayError("register-password-confirm-page", "Debe confirmar la contraseña")
    isValid = false
  } else if (password !== confirmPassword) {
    displayError("register-password-confirm-page", "Las contraseñas no coinciden")
    isValid = false
  }

  // Si hay errores de validación, detener el proceso
  if (!isValid) {
    return
  }

  // Crear nuevo usuario
  const newUser = {
    name,
    email,
    password,
    faculty,
    semester: userType === "estudiante" ? semester : "",
    userType,
    vehicles: [],
  }

  // Obtener usuarios existentes
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Agregar nuevo usuario
  users.push(newUser)

  // Guardar usuarios actualizados
  localStorage.setItem("users", JSON.stringify(users))

  // Guardar información del usuario actual en sessionStorage
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      name: newUser.name,
      email: newUser.email,
      userType: newUser.userType,
      faculty: newUser.faculty,
      semester: newUser.semester,
    }),
  )

  // Mostrar mensaje de éxito
  displayMessage("register-message", "Registro exitoso. Redirigiendo...", "success")

  // Redirigir a la página de usuario después de un breve retraso
  setTimeout(() => {
    window.location.href = "user.html"
  }, 2000)
}

// Función para cargar información del usuario en la página de perfil
function loadUserProfile() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

  if (!currentUser) {
    // Si no hay usuario logueado, redirigir al login
    window.location.href = "login.html"
    return
  }

  // Actualizar información del perfil
  const profileName = document.getElementById("profile-name")
  const profileInfo = document.getElementById("profile-info")

  if (profileName) {
    profileName.textContent = currentUser.name
  }

  if (profileInfo) {
    let infoText = `${currentUser.userType === "estudiante" ? "Estudiante" : "Profesor"} | ${currentUser.email}`
    if (currentUser.userType === "estudiante" && currentUser.semester) {
      infoText += ` | ${currentUser.semester}º Semestre`
    }
    profileInfo.textContent = infoText
  }

  // Cargar vehículos del usuario
  loadUserVehicles()
}

// Función para cargar los vehículos del usuario
function loadUserVehicles() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
  const vehiclesContainer = document.getElementById("vehicles-container")

  if (!currentUser || !vehiclesContainer) {
    return
  }

  // Obtener usuarios del localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Buscar usuario actual
  const user = users.find((u) => u.email.toLowerCase() === currentUser.email.toLowerCase())

  if (!user || !user.vehicles || user.vehicles.length === 0) {
    // No hay vehículos registrados
    vehiclesContainer.innerHTML =
      '<p class="no-vehicles">No tienes vehículos registrados. Utiliza el botón "Agregar Vehículo" para registrar uno.</p>'
    return
  }

  // Generar HTML para cada vehículo
  let vehiclesHTML = ""

  user.vehicles.forEach((vehicle, index) => {
    vehiclesHTML += `
      <div class="vehicle-card">
        <div class="vehicle-image">
          <img src="https://via.placeholder.com/300x200?text=${vehicle.make}+${vehicle.model}" alt="${vehicle.make} ${vehicle.model}">
        </div>
        <div class="vehicle-details">
          <h4>${vehicle.make} ${vehicle.model}</h4>
          <p><strong>Placa:</strong> ${vehicle.plate}</p>
          <p><strong>Color:</strong> ${vehicle.color}</p>
          <p><strong>Año:</strong> ${vehicle.year}</p>
          <div class="vehicle-actions">
            <button class="btn btn-small btn-warning" onclick="editVehicle(${index})">Editar</button>
            <button class="btn btn-small btn-danger" onclick="deleteVehicle(${index})">Eliminar</button>
          </div>
        </div>
      </div>
    `
  })

  vehiclesContainer.innerHTML = vehiclesHTML
}

// Función para cerrar sesión
function logout() {
  // Eliminar información del usuario actual
  sessionStorage.removeItem("currentUser")

  // Redirigir al login
  window.location.href = "login.html"
}

// Función para buscar usuarios (simulada)
function searchUsers() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()
  console.log("Buscando usuarios con el término:", searchTerm)
  // Aquí iría la lógica real de búsqueda
  alert("Búsqueda simulada para: " + searchTerm)
}

// Funci��n para guardar vehículo y redirigir a la página de usuario
function saveVehicleAndRedirect() {
  // Aquí iría la lógica real para guardar el vehículo
  alert("Vehículo guardado correctamente")
  window.location.href = "user.html"
}

// Función para guardar perfil y redirigir a la página de usuario
function saveProfileAndRedirect() {
  // Aquí iría la lógica real para guardar el perfil
  alert("Perfil actualizado correctamente")
  window.location.href = "user.html"
}

// Inicializar la página
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar usuarios de ejemplo
  initializeUsers()

  // Agregar validación en tiempo real para el campo de nombre
  const nameInput = document.getElementById("register-name-page")
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      if (this.value && !validateName(this.value)) {
        this.setCustomValidity("Solo se permiten letras, espacios, guiones y apóstrofes")
        this.style.borderColor = "red"
      } else {
        this.setCustomValidity("")
        this.style.borderColor = ""
      }
    })
  }

  // Agregar validación en tiempo real para los campos de correo
  const emailInputs = document.querySelectorAll("input[type='email']")
  emailInputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value && !validateEmail(this.value)) {
        this.setCustomValidity("Formato de correo electrónico inválido")
        this.style.borderColor = "red"
      } else {
        this.setCustomValidity("")
        this.style.borderColor = ""
      }
    })
  })

  // Si estamos en la página de perfil de usuario, cargar información
  if (window.location.pathname.includes("user.html")) {
    loadUserProfile()
  }

  // Agregar evento para cerrar sesión
  const logoutLinks = document.querySelectorAll("a[href='login.html']")
  logoutLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Solo para los enlaces en el header cuando el usuario está logueado
      if (sessionStorage.getItem("currentUser") && !window.location.pathname.includes("login.html")) {
        e.preventDefault()
        logout()
      }
    })
  })

  // Agregar evento al botón de inicio de sesión
  const loginButton = document.getElementById("login-button")
  if (loginButton) {
    loginButton.addEventListener("click", attemptLogin)

    // También permitir iniciar sesión con Enter en los campos
    const loginForm = document.getElementById("login-form")
    if (loginForm) {
      loginForm.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          attemptLogin()
        }
      })
    }
  }

  // Agregar evento al botón de registro
  const registerButton = document.querySelector(".form-actions .btn-primary")
  if (registerButton && window.location.pathname.includes("register.html")) {
    registerButton.addEventListener("click", registerUser)

    // También permitir registrarse con Enter en los campos
    const registerForm = document.getElementById("register-form-page")
    if (registerForm) {
      registerForm.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          registerUser()
        }
      })
    }
  }
})
