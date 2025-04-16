// Validación y Animaciones JS - Formulario Gamer 2025

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario-gamer");
    const email = document.getElementById("email");
    const nombre = document.getElementById("nombre");
    const foto = document.getElementById("foto");
    const juegos = document.querySelectorAll(".juego-checkbox");
    const plataforma = document.getElementById("plataforma");
    const acepto = document.getElementById("acepto");
    const btnEnviar = document.getElementById("btn-enviar");
    const btnBorrar = document.getElementById("btn-borrar");
    const contador = document.getElementById("contador");
    const nivel = document.getElementById("nivel");
    const nivelTexto = document.getElementById("nivel-texto");
    const previewFoto = document.getElementById("preview-foto");
    const feedbackEmail = document.getElementById("feedback-email");
    const juegosError = document.getElementById("juegos-error");
  
    // === Texto dinámico para el slider de habilidad ===
    const niveles = ["Noob", "Principiante", "Intermedio", "Avanzado", "Pro"];
    nivel.addEventListener("input", () => {
      nivelTexto.textContent = niveles[nivel.value - 1];
    });
  
  // === Reglas de compatibilidad Juego-Plataforma ===
  const compatibilidad = {
    valorant: ["PC"],
    lol: ["PC"],
    smash: ["Consola"],
    rocket: ["PC", "Consola"],
  };

  // === Obtener juegos seleccionados
  function obtenerJuegosSeleccionados() {
    return [...juegos]
      .filter(j => j.checked)
      .map(j => ({ id: j.id, nombre: j.value }));
  }

  // === Actualizar visibilidad de las plataformas válidas
  function actualizarPlataformasDisponibles() {
    const juegosSeleccionados = obtenerJuegosSeleccionados();

    if (juegosSeleccionados.length === 0) {
      // Si no hay juegos seleccionados, mostrar todas
      [...plataforma.options].forEach(opt => opt.disabled = false);
      return;
    }

    const plataformasValidas = new Set(["PC", "Consola", "Movil"]);

    juegosSeleccionados.forEach(({ id }) => {
      const opcionesJuego = compatibilidad[id];
      if (opcionesJuego) {
        plataformasValidas.forEach(p => {
          if (!opcionesJuego.includes(p)) {
            plataformasValidas.delete(p);
          }
        });
      }
    });

    // Mostrar solo las opciones válidas
    [...plataforma.options].forEach(opt => {
      if (opt.value === "") {
        opt.disabled = false; // opción por defecto
      } else {
        opt.disabled = !plataformasValidas.has(opt.value);
      }
    });

    // Resetear selección si la actual es inválida
    if (plataforma.value && !plataformasValidas.has(plataforma.value)) {
      plataforma.value = "";
    }
  }

  // Obtener nombre del juego desde el checkbox
  function obtenerJuegosSeleccionados() {
    return [...juegos]
      .filter(j => j.checked)
      .map(j => ({ id: j.id, nombre: j.value }));
  }

  function validarCompatibilidadJuegoPlataforma() {
    const juegosSeleccionados = obtenerJuegosSeleccionados();
    const plataformaSeleccionada = plataforma.value;
    let compatible = true;
    let mensaje = "";

    juegosSeleccionados.forEach(({ id, nombre }) => {
      const opcionesValidas = compatibilidad[id];
      if (opcionesValidas && !opcionesValidas.includes(plataformaSeleccionada)) {
        compatible = false;
        mensaje += `❌ ${nombre} no está disponible en ${plataformaSeleccionada}\n`;
      }
    });

    if (!compatible) {
      juegosError.textContent = mensaje.trim();
    } else {
      juegosError.textContent = "";
    }

    return compatible;
  }

    // === Validaciones ===
    function validarEmail() {
      const valido = /^[\w.-]+@[\w.-]+\.(com|net|gg|io)$/i.test(email.value);
      feedbackEmail.innerHTML = valido ? "✔️ Válido" : "❌ Email inválido";
      return valido;
    }
  
    function validarNombre() {
      return nombre.value.trim().length > 0;
    }
  
    function validarFoto() {
      const file = foto.files[0];
      if (!file) return false;
      const extOK = ["image/jpeg", "image/png"].includes(file.type);
      const sizeOK = file.size <= 2 * 1024 * 1024;
      if (!extOK || !sizeOK) {
        previewFoto.innerHTML = `<p class='error'>Archivo inválido</p>`;
        return false;
      }
      const reader = new FileReader();
      reader.onload = e => previewFoto.innerHTML = `<img src="${e.target.result}" alt="avatar" />`;
      reader.readAsDataURL(file);
      return true;
    }
  
    function validarJuegos() {
      const hayJuegos = [...juegos].some(j => j.checked);
      juegosError.textContent = hayJuegos ? "" : "Seleccioná al menos un juego.";
      return hayJuegos;
    }
  
    function validarPlataforma() {
      return plataforma.value !== "";
    }
  
    function validarAcepto() {
      return acepto.checked;
    }
  
    function validarFormulario() {
      const todoOK =
        validarEmail() &&
        validarNombre() &&
        validarFoto() &&
        validarJuegos() &&
        validarPlataforma() &&
        validarAcepto() &&
        validarCompatibilidadJuegoPlataforma();
      btnEnviar.disabled = !todoOK;
      return todoOK;
    }
  
    // === Evento submit con animación ===
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!validarFormulario()) return;
  
      form.classList.add("form-exito");
      setTimeout(() => {
        const registrados = +localStorage.getItem("inscriptosGamer") + 1 || 1;
        localStorage.setItem("inscriptosGamer", registrados);
        contador.textContent = `Inscripciones registradas: ${registrados}`;
        alert("✅ ¡Te registraste al Torneo Gamer 2025!");
        form.reset();
        previewFoto.innerHTML = "";
        feedbackEmail.innerHTML = "";
        nivelTexto.textContent = "Intermedio";
        form.classList.remove("form-exito");
        validarFormulario();
      }, 1000);
    });
  
    // === Reset ===
    btnBorrar.addEventListener("click", () => {
      previewFoto.innerHTML = "";
      feedbackEmail.innerHTML = "";
      juegosError.textContent = "";
      nivelTexto.textContent = "Intermedio";
      validarFormulario();
    });
  
    // === Eventos ===
    [email, nombre, foto, plataforma, acepto, nivel].forEach(e => e.addEventListener("input", validarFormulario));
    
    juegos.forEach(j => j.addEventListener("change", () => {
      validarFormulario();
      actualizarPlataformasDisponibles();
    }));
    

    // === Contador inicial ===
    contador.textContent = `Inscripciones registradas: ${localStorage.getItem("inscriptosGamer") || 0}`;
  });
