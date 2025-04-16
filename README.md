
# 🎁 Baby Shower Gift List

Una aplicación web simple hecha con HTML, CSS y JavaScript puro, pensada para que los invitados a un baby shower puedan ver una lista de regalos y marcar cuál llevarán.  
Todos pueden ver en tiempo real qué regalos ya han sido tomados, gracias a una integración con Google Sheets como backend.

---

## ✨ Funcionalidades

- Lista de regalos visible para todos.
- Botón “Lo llevo”.
- Estado en tiempo real sincronizado con Google Sheets.
- Fácil de personalizar y desplegar.
- Ideal para compartir por WhatsApp, correo o redes.

---

## 🌐 Demo

[https://babyshower.dycdigital.com.co](https://babyshower.dycdigital.com.co)

---

## 📦 Estructura del proyecto

```
babyshower-giftlist/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🚀 Cómo usar este proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/babyshower-giftlist.git
```

Reemplaza `TU_USUARIO` con tu nombre real en GitHub.

---

## 🔌 Conectar con Google Sheets como Backend

### Paso 1: Crear la hoja de cálculo

1. Ve a [https://sheets.new](https://sheets.new)
2. Nombra la hoja como `Regalos Baby Shower`
3. En la primera fila (encabezado), pon estas columnas:

```
id | nombre | tomado | tomado_por
```

4. Agrega algunos regalos como ejemplo:

```
1  | Pañales RN                 | FALSE |
2  | Ropita recién nacido       | FALSE |
3  | Toallitas húmedas          | FALSE |
```

---

### Paso 2: Crear el API en Google Apps Script

1. Desde la hoja de cálculo, ve a `Extensiones → Apps Script`
2. Borra el contenido y pega este código:

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

  return ContentService.createTextOutput(JSON.stringify(regalos)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const params = JSON.parse(e.postData.contents);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == params.id) {
      sheet.getRange(i + 1, 3).setValue(true); // tomado
      sheet.getRange(i + 1, 4).setValue(params.tomado_por); // tomado_por
      break;
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
}
```

3. Guarda el script con el nombre `API Baby Shower`.

---

### Paso 3: Publicar la API

1. Haz clic en `Implementar → Implementaciones → Nueva implementación`.
2. Tipo: **Aplicación web**
3. Descripción: `API regalos`
4. Ejecutar como: **Tú mismo**
5. Quién tiene acceso: **Cualquiera (incluso anónimo)**
6. Haz clic en **Implementar**
7. Copia la URL de despliegue (será algo como `https://script.google.com/macros/s/AKfyc.../exec`)

---

### Paso 4: Actualiza tu archivo `script.js`

Una vez tengas la URL del API, reemplaza tu archivo `script.js` por el nuevo que consultará y actualizará en tiempo real.

(Pendiente: el próximo paso del README tendrá el nuevo `script.js` que usará la API).

---

## 🙌 Créditos

Hecho con cariño por y para futuros padres 💕  
Con tecnologías 100% abiertas: HTML + CSS + JavaScript + Google Sheets.

---

## 📄 Licencia

MIT. Puedes usarlo, modificarlo y compartirlo libremente.
