const API_URL = CONFIG.API_URL;
const giftList = document.getElementById("gift-list");

// Cargar regalos desde Google Sheets
async function fetchGifts() {
  try {
    const res = await fetch(API_URL);
    const gifts = await res.json();
    renderGifts(gifts);
  } catch (err) {
    giftList.innerHTML = "<li>Error al cargar la lista de regalos.</li>";
    console.error(err);
  }
}

// Mostrar lista de regalos en pantalla
function renderGifts(gifts) {
  giftList.innerHTML = "";

  gifts.forEach((gift) => {
    const li = document.createElement("li");

    const tomado = gift.tomado === true || gift.tomado === "TRUE";

    li.innerHTML = `
      <span>${gift.nombre}</span>
      <button 
        ${tomado ? "disabled" : ""}
        onclick="takeGift(${gift.id}, '${gift.nombre}')">
        ${tomado ? "Ya fue tomado" : "Lo llevo"}
      </button>
    `;

    giftList.appendChild(li);
  });
}

// Marcar regalo como tomado
async function takeGift(id, nombre) {
  const tomado_por = prompt(`¿Cuál es tu nombre para confirmar que llevarás "${nombre}"?`);
  if (!tomado_por) return;

  try {
    const formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("tomado_por", tomado_por);

    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors", // Solución CORS
      body: formData,
    });

    alert("¡Gracias! Tu regalo ha sido marcado 🎁");
    fetchGifts(); // Recarga lista actualizada
  } catch (err) {
    alert("Hubo un error al guardar tu selección.");
    console.error(err);
  }
}

// Enviar regalo personalizado
document.getElementById("custom-gift-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("customGiftName").value.trim();
  const tomado_por = document.getElementById("customGiverName").value.trim();

  if (!nombre || !tomado_por) {
    alert("Por favor llena ambos campos.");
    return;
  }

  const nuevoId = Date.now(); // ID único basado en timestamp

  try {
    const formData = new URLSearchParams();
    formData.append("id", nuevoId);
    formData.append("nombre", nombre);
    formData.append("tomado_por", tomado_por);

    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors", // Solución CORS
      body: formData,
    });

    // Mostrar mensaje mientras se actualiza
    document.getElementById("custom-gift-form").reset();
    const mensaje = document.createElement("li");
    mensaje.textContent = "🎁 Tu regalo fue agregado. Actualizando la lista...";
    giftList.innerHTML = "";
    giftList.appendChild(mensaje);

    // Esperar 2 segundos antes de recargar lista
    setTimeout(() => {
      fetchGifts();
    }, 2000);
  } catch (err) {
    alert("Hubo un error al agregar el regalo.");
    console.error(err);
  }
});

// Iniciar al cargar la página
fetchGifts();
