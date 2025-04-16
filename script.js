// script.js
const API_URL = CONFIG.API_URL;

const giftList = document.getElementById("gift-list");

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

async function takeGift(id, nombre) {
  const tomado_por = prompt(`¿Cuál es tu nombre para confirmar que llevarás "${nombre}"?`);
  if (!tomado_por) return;

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ id, tomado_por }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    alert("¡Gracias! Tu regalo ha sido marcado 🎁");
    fetchGifts(); // Recarga lista actualizada
  } catch (err) {
    alert("Hubo un error al guardar tu selección.");
    console.error(err);
  }
}

// Inicializa
fetchGifts();
