
# 🎁 Baby Shower Gift List

Una aplicación web simple hecha con HTML, CSS y JavaScript puro, pensada para que los invitados a un baby shower puedan ver una lista de regalos y marcar cuál llevarán.  
Todos pueden ver en tiempo real qué regalos ya han sido tomados, gracias a una integración con Google Sheets como backend.

---

## ✨ Funcionalidades

- Lista de regalos visible para todos.
- Botón “Lo llevo”.
- Agregar regalos personalizados ("Otro regalo").
- Estado sincronizado en tiempo real con Google Sheets.
- No requiere backend propio.
- Carga y actualización dinámica sin recargar la página.
- Protección de la URL del API mediante archivo `env.js` no público.

---

## 📦 Estructura del proyecto

```
babyshower-giftlist/
├── index.html
├── style.css
├── script.js
├── env.js          # Contiene tu URL privada de la API (NO SE SUBE A GITHUB)
├── .gitignore
└── README.md
```

---

## 🚀 Cómo usar este proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/babyshower-giftlist.git
```

---

## 🔌 Conectar con Google Sheets como backend

### Paso 1: Crear hoja en Google Sheets

1. Ve a [https://sheets.new](https://sheets.new)
2. Agrega los encabezados en la primera fila:

```
id | nombre | tomado | tomado_por
```

---

### Paso 2: Crear el script en Apps Script

1. Ve a `Extensiones → Apps Script`
2. Borra todo y pega el siguiente código:

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
2. Tipo: **Aplicación web**
3. Ejecutar como: **Tú mismo**
4. Acceso: **Cualquiera, incluso anónimo**
5. Copia la URL generada

---

### Paso 4: Crear `env.js`

```js
// env.js
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/XXXXXX/exec"
};
```

> ⚠️ Agrega `env.js` al `.gitignore` para que no se suba a GitHub

---

## 🛡️ Evitar problemas de CORS

- Google Apps Script **no permite `POST` con JSON desde otros dominios**.
- Se usa `URLSearchParams` + `mode: "no-cors"` en `fetch()` para evitar errores.
- Esto **envía los datos correctamente**, aunque no podamos leer la respuesta.

---

## 🙌 Créditos

Hecho con cariño para futuros padres 💕  
Código 100% libre, sin frameworks, y fácil de personalizar.

---

## 📄 Licencia

MIT. Puedes usarlo, modificarlo y compartirlo libremente.
