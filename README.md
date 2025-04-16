
# 🎁 Baby Shower Gift List

Una aplicación web simple hecha con HTML, CSS y JavaScript puro, pensada para que los invitados a un baby shower puedan ver una lista de regalos, marcar cuál llevarán y agregar otros.  
Incluye personalización de tema (niño o niña), encabezado especial con datos del evento y conexión con Google Sheets como backend.

---

## ✨ Funcionalidades

- Lista de regalos visible y actualizable.
- Botón “Lo llevo” que marca regalos como tomados.
- Agregar regalos personalizados por los invitados.
- Personalización del tema: niña o niño.
- Encabezado dinámico con nombre del bebé, fecha, hora y lugar.
- Conexión con Google Sheets como backend (sin frameworks).
- Carga dinámica sin recargar la página.
- CORS solucionado con `no-cors`.

---

## 📦 Estructura del proyecto

```
babyshower-giftlist/
├── index.html
├── style.css
├── script.js
├── env.js             # Contiene la URL privada de tu API de Google Sheets (NO se sube a GitHub)
├── config.js          # Contiene personalización visual y del evento
├── .gitignore
└── README.md
```

---

## 🛠️ Personalización del evento (`config.js`)

```js
const THEME = {
  type: "niña", // "niña" o "niño"
};

const BABYSHOWER_INFO = {
  nombre: "Emilia",
  dia: "Lunes",
  fecha: "16 de Diciembre",
  hora: "4 P.M.",
  lugar: "Calle 123 #45-67, Ciudad"
};
```

Este archivo permite ajustar los colores, el título del encabezado y los datos del evento.

---

## 🔐 Configuración de API (`env.js`)

```js
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/TU_API_KEY/exec"
};
```

Este archivo debe estar en el `.gitignore` para evitar exponer la URL.

---

## 🔌 Conectar con Google Sheets como backend

### Paso 1: Crear hoja

1. Ve a [https://sheets.new](https://sheets.new)
2. Agrega los encabezados en la primera fila:

```
id | nombre | tomado | tomado_por
```

---

### Paso 2: Apps Script

1. `Extensiones → Apps Script`
2. Pega este código:

```javascript
const SHEET_NAME = 'Hoja 1';

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const regalos = data.map(row => {
    let regalo = {};
    headers.forEach((header, index) => regalo[header] = row[index]);
    return regalo;
  });

  return ContentService.createTextOutput(JSON.stringify(regalos))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const params = e.parameter;

  const id = params.id;
  const nombre = params.nombre || null;
  const tomado_por = params.tomado_por;
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.getRange(i + 1, 3).setValue(true);
      sheet.getRange(i + 1, 4).setValue(tomado_por);
      return ContentService.createTextOutput(JSON.stringify({ status: 'updated' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (nombre) {
    sheet.appendRow([id, nombre, true, tomado_por]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'added' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'error' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

### Paso 3: Publicar como Web App

1. `Implementar → Nueva implementación`
2. Tipo: Aplicación web
3. Ejecutar como: **Tú mismo**
4. Acceso: **Cualquiera**
5. Copia la URL y colócala en `env.js`

---

## 🛡️ Seguridad y buenas prácticas

- `env.js` está en `.gitignore`, así tu URL no se publica.
- El proyecto es 100% HTML + CSS + JS puro, sin dependencias.

---

## 🙌 Créditos

Hecho con cariño para futuros padres 💕  
Código abierto, fácil de usar, compartir y personalizar.

---

## 📄 Licencia

MIT. Puedes usarlo, modificarlo y compartirlo libremente.
