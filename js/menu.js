// this trick can be done only one time :p
window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

/**
 * The function logs an error message to the console.
 * @param error - The error parameter is a variable representing the object or error message that
 * is passed to the onError function. It can be any type of error, such as a syntax error, a runtime error,
 * or an error generated by a function.
 */
function onError(error) {
  console.log(`Error: ${error}`);
}

// -----------------------------------------------------------------------
// Logica para el guardado y cargue del estado de los menus
// -----------------------------------------------------------------------
let ultimoBotonClick;
function setMenuEstado() {
  let menuEstado = {
    menu: document.querySelector(".nav-link.active").id,
    ultimoBoton: ultimoBotonClick,
    mesesAdicionales: document.querySelector("#mesesAdicionales").value,
  };

  browser.storage.local.set({
    menuEstado: menuEstado,
  });
}

function getMenuEstado() {
  return browser.storage.local.get("menuEstado");
}

document.addEventListener("DOMContentLoaded", function () {
  // restauramos el estado de los items selecccionados antriormenete en el menu
  getMenuEstado().then((data) => {
    if (document.querySelector(`#${data.menuEstado?.menu}`)) {
      document.querySelector(`#${data.menuEstado.menu}`)?.click();
      document
        .querySelectorAll(".tab-pane")
        ?.forEach((el) => el.classList.add("fade"));
    } else {
      document.querySelector("#menuTitulada").click();
    }

    if (document.querySelector("#mesesAdicionales")) {
      document.querySelector("#mesesAdicionales").value =
        data.menuEstado.mesesAdicionales;
    }

    ultimoBotonClick = data.menuEstado?.boton;
  });
});

window.addEventListener("blur", function () {
  setMenuEstado();
});
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// functions for writing and reading data in memory
// -----------------------------------------------------------------------
function setExcelData(data) {
  browser.storage.local.set({
    excel_data: data,
  });
}

function getExcelData() {
  return browser.storage.local.get("excel_data");
}

function setDocumentoData(data) {
  browser.storage.local.set({
    documento_data: data,
  });
}

function getDocumentoData() {
  return browser.storage.local.get("documento_data");
}

// -----------------------------------------------------------------------

function send(tabs) {
  document.getElementById("success").style.display = "none";
  document.getElementById("error").style.display = "none";

  let data = {
    cedula: "",
    nombre: "",
    contrato: "",
    contrato_fecha_inicio: "",
    contrato_fecha_fin: "",
    supervisor: "",
    cargo_tipo: "",
  };

  let fields = document.getElementById("excel_row").value;
  if (fields !== null && fields !== "") {
    fields = fields.split("\t").map((v) => {
      return v.trim();
    });

    if (fields.length >= 11) {
      data.cedula = fields[0];
      data.nombre = fields[1];
      data.contrato = fields[2];
      data.contrato_fecha_inicio = fields[4];
      data.contrato_fecha_fin = fields[5];
      data.supervisor = fields[7];
      data.cargo_tipo = fields[10];

      browser.tabs
        .sendMessage(tabs[0].id, { action: "pasteData", data: data })
        .catch(onError);
    }
  }
}

function send2(tabs) {
  browser.tabs
    .sendMessage(tabs[0].id, { action: "completeFields" })
    .catch(onError);
}

function send3(tabs) {
  browser.tabs
    .sendMessage(tabs[0].id, { action: "completeFieldsPaso4" })
    .catch(onError);
}

/**
 * The  eventoAmbiente  function takes a series of tabs, extracts data from an Excel row, and sends a
 * message to a content script with the extracted data.
 * @param tabs - The  tabs  parameter is an array of objects representing the tabs that are
 * currently open in the browser. Each object in the array contains information about a
 * specific tab, such as its ID, URL, and title.
 */
function eventoAmbiente(tabs) {
  let data = {
    ficha: "",
    colegio: "",
    resultado: "",
    actividad: "",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
    dias: {
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
    },
    total_horas: "",
  };

  //obtener el valor de ingresado en el campo de texto (una fila de excel)
  let fields = document.getElementById("excel_row").value;
  /* El código anterior verifica si la variable 'campos' no es nula ni es una cadena vacía. */
  if (fields !== null && fields !== "") {
    fields = fields.split("\t").map((v) => {
      return v.trim();
    });

    if (fields.length >= 16) {
      data.ficha = fields[0];
      data.colegio = fields[2];
      data.resultado = fields[3];
      data.actividad = fields[4]
        .trim()
        .replace(/\s{2,}/g, " ")
        .substring(0, 199);
      data.fecha_inicio = fields[5];
      data.fecha_fin = fields[6];
      data.hora_inicio = fields[7].split(":");
      data.hora_fin = fields[8].split(":");
      data.dias.lunes = fields[9];
      data.dias.martes = fields[10];
      data.dias.miercoles = fields[11];
      data.dias.jueves = fields[12];
      data.dias.viernes = fields[13];
      data.dias.savado = fields[14];
      data.total_horas = fields[15];

      data.hora_inicio = `${data.hora_inicio[0]}:${data.hora_inicio[1]}`;
      data.hora_fin = `${data.hora_fin[0]}:${data.hora_fin[1]}`;

      data.mesesAdicionales = document.querySelector("#mesesAdicionales").value;

      setExcelData(data);

      browser.tabs
        .sendMessage(tabs[0].id, { action: "eventoAmbiente", data: data })
        .catch(onError);
    }
  } else {
    getExcelData().then((value) => {
      if (value.excel_data != null) {
        browser.tabs
          .sendMessage(tabs[0].id, {
            action: "eventoAmbiente",
            data: value.excel_data,
          })
          .catch(onError);
      }
    });
  }
}

function eventoAmbienteLargo(tabs) {
  let data = {
    ficha: "",
    colegio: "",
    resultado: "",
    actividad: "",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
    dias: {
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
    },
    total_horas: "",
  };

  let fields = document.getElementById("excel_row").value;
  if (fields !== null && fields !== "") {
    fields = fields.split("\t").map((v) => {
      return v.trim();
    });

    if (fields.length >= 16) {
      data.ficha = fields[0];
      data.colegio = fields[2];
      data.resultado = fields[9];
      data.actividad = fields[8]
        .trim()
        .replace(/\s{2,}/g, " ")
        .substring(0, 199);
      data.fecha_inicio = fields[4];
      data.fecha_fin = fields[5];
      data.hora_inicio = fields[6].split(":");
      data.hora_fin = fields[7].split(":");
      data.dias.lunes = fields[10];
      data.dias.martes = fields[11];
      data.dias.miercoles = fields[12];
      data.dias.jueves = fields[13];
      data.dias.viernes = fields[14];
      data.dias.savado = fields[15];
      data.total_horas = fields[16];

      data.hora_inicio = `${data.hora_inicio[0]}:${data.hora_inicio[1]}`;
      data.hora_fin = `${data.hora_fin[0]}:${data.hora_fin[1]}`;

      data.mesesAdicionales = document.querySelector("#mesesAdicionales").value;

      setExcelData(data);

      browser.tabs
        .sendMessage(tabs[0].id, { action: "eventoAmbiente", data: data })
        .catch(onError);
    }
  } else {
    getExcelData().then((value) => {
      if (value.excel_data != null) {
        browser.tabs
          .sendMessage(tabs[0].id, {
            action: "eventoAmbiente",
            data: value.excel_data,
          })
          .catch(onError);
      }
    });
  }
}

function eventoTitulada(tabs) {
  let data = {
    ficha: "",
    ambiente: "",
    actividad: "",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
    dias: {
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false,
    },
    ins_documento: "",
    ins_nombre: "",
    dias_raw: "",
  };

  let fields = document.getElementById("excel_row").value;
  if (fields !== null && fields !== "") {
    fields = fields.split("\t").map((v) => {
      return v.trim();
    });

    console.log(fields.length, fields);
    if (fields.length >= 19) {
      data.ficha = fields[8];
      data.ambiente = fields[10];
      data.actividad = fields[16]
        .trim()
        .replace(/\s{2,}/g, " ")
        .substring(0, 199);
      data.fecha_inicio = fields[14];
      data.fecha_fin = fields[15];
      data.hora_inicio = fields[12].split(":");
      data.hora_fin = fields[13].split(":");
      data.ins_documento = fields[0];
      data.ins_nombre = fields[1];
      data.dias_raw = fields[9];
      data.trimestre_inicio = fields[17];
      data.trimestre_fin = fields[18];
      data.ficha_fin = fields[5];

      data.dias_raw.split(",").forEach((element) => {
        switch (Number(element)) {
          case 1:
            data.dias.lunes = true;
            break;
          case 2:
            data.dias.martes = true;
            break;
          case 3:
            data.dias.miercoles = true;
            break;
          case 4:
            data.dias.jueves = true;
            break;
          case 5:
            data.dias.viernes = true;
            break;
          case 6:
            data.dias.sabado = true;
            break;
          default:
            break;
        }
      });

      data.hora_inicio = `${data.hora_inicio[0]}:${data.hora_inicio[1]}`;
      data.hora_fin = `${data.hora_fin[0] - 1}:59`;

      let fechaFinTrimestre = data.trimestre_fin.split("/");
      fechaFinTrimestre = new Date(
        fechaFinTrimestre[2],
        fechaFinTrimestre[1] - 1,
        fechaFinTrimestre[0]
      );

      let fechaFinFicha = data.ficha_fin.split("/");
      fechaFinFicha = new Date(
        fechaFinFicha[2],
        fechaFinFicha[1] - 1,
        fechaFinFicha[0]
      );

      if (fechaFinTrimestre > fechaFinFicha) {
        data.trimestre_fin = data.ficha_fin;
      }

      /*if(data.trimestre_fin == data.fecha_fin){
				fechaFinTrimestre = data.trimestre_fin.split('/');
				fechaFinTrimestre = new Date(fechaFinTrimestre[2], (fechaFinTrimestre[1] - 1), (fechaFinTrimestre[0] - 1));

				data.fecha_fin = [
					(fechaFinTrimestre.getDate()),
					(fechaFinTrimestre.getMonth()+1),
					fechaFinTrimestre.getFullYear(),
				].join('/');

				// data.trimestre_fin = data.fecha_fin;
			}*/

      // console.log(data);
      setExcelData(data);

      // console.log(data);
      browser.tabs
        .sendMessage(tabs[0].id, { action: "eventoTitulada", data: data })
        .catch(onError);
    }
  } else {
    getExcelData().then((value) => {
      if (value.excel_data != null) {
        browser.tabs
          .sendMessage(tabs[0].id, {
            action: "eventoTitulada",
            data: value.excel_data,
          })
          .catch(onError);
      }
    });
  }
}

function resaltarTextoTablas(tabs) {
  let documento = document.getElementById("excel_row").value.trim();
  if (documento !== null && documento !== "") {
    let data = {
      documento: documento,
    };

    setDocumentoData(data);

    browser.tabs
      .sendMessage(tabs[0].id, { action: "resaltarTextoTablas", data: data })
      .catch(onError);
  } else {
    getDocumentoData().then((value) => {
      if (value.documento_data != null) {
        browser.tabs
          .sendMessage(tabs[0].id, {
            action: "resaltarTextoTablas",
            data: value.documento_data,
          })
          .catch(onError);
      }
    });
  }
}

// -------------------------------------------------------------------------------------------------------------------------
// listeners
// -------------------------------------------------------------------------------------------------------------------------
document.getElementById("paso1").addEventListener("click", (e) => {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(send)
    .catch(onError);
});

document.getElementById("paso3").addEventListener("click", (e) => {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(send2)
    .catch(onError);
});

document.getElementById("paso4").addEventListener("click", (e) => {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(send3)
    .catch(onError);
});

document.getElementById("eventoAmbiente").addEventListener("click", (e) => {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(eventoAmbiente)
    .catch(onError);
});

document
  .getElementById("eventoAmbienteLargo")
  .addEventListener("click", (e) => {
    browser.tabs
      .query({ currentWindow: true, active: true })
      .then(eventoAmbienteLargo)
      .catch(onError);
  });

document.getElementById("eventoTitulada").addEventListener("click", (e) => {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(eventoTitulada)
    .catch(onError);
});

document
  .getElementById("resaltarTextoTablas")
  .addEventListener("click", (e) => {
    browser.tabs
      .query({ currentWindow: true, active: true })
      .then(resaltarTextoTablas)
      .catch(onError);
  });

// add the auto-close window feature to all buttons in the extension
document.querySelectorAll("button").forEach((element) => {
  element.addEventListener("click", (e) => {
    ultimoBotonClick = element.id;
    setMenuEstado();
    // arreglo hasta que se me ocurra una mejor manera
    // TODO: encontrar una manera de cerrar el popup sin que queden promesas sin resolver...
    setTimeout(() => {
      window.close();
    }, 2_00);
  });
});

document.querySelector("#mesesAdicionales").addEventListener("input", (e) => {
  if (!isNaN(e.target.value)) {
    let date = new Date();
    let mesActual = date.getMonth() + 1;
    let mesFuturo = Number(mesActual) + Number(e.target.value);

    console.log(mesFuturo);
    if (mesFuturo > 12 || mesFuturo == mesActual) {
      e.target.value = null;
    }
  } else {
    e.target.value = null;
  }
});
// -------------------------------------------------------------------------------------------------------------------------
