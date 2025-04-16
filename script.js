document.addEventListener("DOMContentLoaded", () => {
  const API_URL = CONFIG.API_URL;
  const giftList = document.getElementById("gift-list");

  // Aplicar tema
  if (typeof THEME !== 'undefined') {
    if (THEME.type === 'niño') {
      document.body.classList.add('theme-nino');
    } else if (THEME.type === 'niña') {
      document.body.classList.add('theme-nina');
    }
  }

  // Insertar nombre del bebé en el encabezado
  if (typeof BABYSHOWER_INFO !== 'undefined') {
    const nameElement = document.getElementById("baby-name");
    if (nameElement) {
      nameElement.textContent = BABYSHOWER_INFO.nombre || "";
    }
  }

  // Cargar regalos desde Google Sheets
  async function fetchGifts() {
    try {
      giftList.innerHTML = '<li class="text-center text-gray-500 animate-pulse">Cargando regalos...</li>';
      const res = await fetch(API_URL);
      const contentType = res.headers.get("Content-Type");

      if (!contentType || !contentType.includes("application/json")) {
        giftList.innerHTML = "<li>Error: la respuesta no es JSON válido.</li>";
        console.error("Respuesta inesperada:", await res.text());
        return;
      }

      const gifts = await res.json();
      renderGifts(gifts);
    } catch (err) {
      giftList.innerHTML = "<li>Error al cargar la lista de regalos.</li>";
      console.error("Error en fetchGifts:", err);
    }
  }

  function renderGifts(gifts) {
    giftList.innerHTML = "";

    gifts.forEach((gift) => {
      const li = document.createElement("li");
      const tomado = gift.tomado === true || gift.tomado === "TRUE";

      li.className = "bg-white shadow rounded-lg px-4 py-3 flex items-center justify-between";
      li.innerHTML = `
        <span>${gift.nombre}</span>
        <button
          ${tomado ? "disabled" : ""}
          onclick="takeGift(${gift.id}, '${gift.nombre}')"
          class="${tomado ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'} px-3 py-1 rounded"
        >
          ${tomado ? "Ya fue tomado" : "Lo llevo"}
        </button>
      `;

      giftList.appendChild(li);
    });
  }

  window.takeGift = async function (id, nombre) {
    const tomado_por = prompt(`¿Cuál es tu nombre para confirmar que llevarás "${nombre}"?`);
    if (!tomado_por) return;

    try {
      const formData = new URLSearchParams();
      formData.append("id", id);
      formData.append("tomado_por", tomado_por);

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      alert("¡Gracias! Tu regalo ha sido marcado 🎁");
      fetchGifts();
    } catch (err) {
      alert("Hubo un error al guardar tu selección.");
      console.error(err);
    }
  };

  document.getElementById("custom-gift-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("customGiftName").value.trim();
    const tomado_por = document.getElementById("customGiverName").value.trim();

    if (!nombre || !tomado_por) {
      alert("Por favor llena ambos campos.");
      return;
    }

    const nuevoId = Date.now();

    try {
      const formData = new URLSearchParams();
      formData.append("id", nuevoId);
      formData.append("nombre", nombre);
      formData.append("tomado_por", tomado_por);

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      document.getElementById("custom-gift-form").reset();
      const mensaje = document.createElement("li");
      mensaje.textContent = "🎁 Tu regalo fue agregado. Actualizando la lista...";
      giftList.innerHTML = "";
      giftList.appendChild(mensaje);

      setTimeout(() => {
        fetchGifts();
      }, 2000);
    } catch (err) {
      alert("Hubo un error al agregar el regalo.");
      console.error(err);
    }
  });

  fetchGifts();
});
