
# 🎁 Baby Shower Gift List

Una aplicación web simple hecha con HTML, CSS y JavaScript puro, pensada para que los invitados a un baby shower puedan ver una lista de regalos, marcar cuál llevarán y agregar otros.  
Incluye personalización de tema (niño o niña), encabezado especial con datos del evento y conexión con Google Sheets como backend.

Demo: https://babyshower.dycdigital.com.co/

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

### Paso 1: Crear hoja de cálculo

1. Ve a [https://sheets.new](https://sheets.new)
2. En la primera fila, escribe los siguientes encabezados:

```
id | nombre | tomado | tomado_por
```

3. A partir de la segunda fila, agrega tu lista de regalos personalizados.  
   Asegúrate de que la columna "tomado" esté en `FALSE` para que los regalos estén disponibles.  
   Ejemplo:

```
1 | Pañales RN              | FALSE | 
2 | Ropita recién nacido    | FALSE | 
3 | Toallitas húmedas       | FALSE |
4 | Cobija suave            | FALSE |
```

🔔 **Este es solo un ejemplo.** Puedes modificar los nombres y la cantidad de regalos según tu preferencia.

---

### Paso 2: Crear el Apps Script desde la hoja de cálculo

1. En esa misma hoja de cálculo, haz clic en el menú superior:  
   `Extensiones → Apps Script`

2. Se abrirá una nueva pestaña con el editor de scripts. Borra todo el contenido inicial y **pega el siguiente código:**

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

3. Guarda el proyecto con el nombre que quieras (por ejemplo: `API Baby Shower`)

---

### Paso 3: Publicar como Web App

1. En la parte superior derecha, haz clic en `Implementar → Nueva implementación`
2. En "Tipo de implementación" selecciona **Aplicación web**
3. Configura así:
   - Descripción: `API regalos`
   - Ejecutar como: **Tú mismo**
   - Quién tiene acceso: **Cualquiera**
4. Haz clic en **Implementar**
5. Copia la URL generada y pégala en tu archivo `env.js`

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
