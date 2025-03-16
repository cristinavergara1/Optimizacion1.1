// Referencias a los elementos de la interfaz
const contadorInput = document.getElementById("contador-input");
const btnSiguiente = document.getElementById("siguiente");
const btnReiniciar = document.getElementById("reiniciar");
const regDireccionesInput = document.getElementById("reg-direcciones-input");
const regDatosInput = document.getElementById("reg-datos-input");
const regInstruccionesInput = document.getElementById("reg-instrucciones-input");
const decodificadorInput = document.getElementById("decodificador-input");
const regEntradasInput = document.getElementById("reg-entrada-input");
const acumuladorInput = document.getElementById("acumulador-input");

const inputs = [contadorInput, regDireccionesInput, regDatosInput, regInstruccionesInput, 
                decodificadorInput, regEntradasInput, acumuladorInput];
inputs.forEach(input => {
  input.style.outline = "none";
});
const style = document.createElement('style');
style.textContent = `
  input:focus {
    color: black !important;
    border: 3px solid orange !important;
  }
`;
document.head.appendChild(style);

// Memoria inicial
const memoriaInicial = {
  "0000": "00110001",
  "0001": "00110100",
  "0010": "01100000",
  "0100": "00110010"
};

let memoria = { ...memoriaInicial };
let contador = 0;
let paso = 0;
let programaTerminado = false;

const operaciones = {
  "0011": "+",
  "0110": "M",
};

btnSiguiente.addEventListener("click", () => {
  if (programaTerminado) {
    alert("El programa ha terminado. Presiona 'Reiniciar' para comenzar de nuevo.");
    return;
  }

  document.querySelectorAll("#tabla-memoria table td").forEach((td) => {
    td.style.backgroundColor = "";
    td.style.border = "";
  });

  switch (paso) {
    case 0:
      contadorInput.value = contador.toString(2).padStart(4, "0");
      contadorInput.focus();
      paso++;
      break;
    case 1:
      regDireccionesInput.value = contador.toString(2).padStart(4, "0");
      regDireccionesInput.focus();
      paso++;
      break;
    case 2:
      contador++;
      contadorInput.value = contador.toString(2).padStart(4, "0");
      contadorInput.focus();
      paso++;
      break;
    case 3:
      regDatosInput.value = memoria[regDireccionesInput.value] || "00000000";
      regDatosInput.focus();
      resaltarCeldaMemoria(regDireccionesInput.value);
      paso++;
      break;
    case 4:
      regInstruccionesInput.value = regDatosInput.value;
      regInstruccionesInput.focus();
      paso++;
      break;
      case 5:
  decodificadorInput.value = operaciones[regInstruccionesInput.value.slice(0, 4)] || "";
  decodificadorInput.focus();
  paso++;
  break;

case 6:
  regDireccionesInput.value = regInstruccionesInput.value.slice(4);
  regDireccionesInput.focus();
  paso++;
  break;

case 7:
  document.querySelectorAll("#tabla-memoria table tr").forEach((fila) => {
    fila.style.border = "";
  });
  
  // Si es operación M (guardar), usar valor del acumulador
  if (decodificadorInput.value === "M") {
    // Para M, mostrar el valor del acumulador en el registro de datos
    regDatosInput.value = acumuladorInput.value || "00000000";
    regDatosInput.focus();
    
    resaltarCeldaMemoria("0000");
    paso = 10;
    // Damos un pequeño tiempo para que se visualice el registro de datos
    setTimeout(() => {
      // Simulamos un clic en el botón siguiente para continuar al paso 10
      btnSiguiente.click();
    }, 500); // Esperamos 500ms para que sea visible
    
    return; // Importante: salimos de la función para no continuar con el resto del código
  } else {
    // Comportamiento normal para otras operaciones
    regDatosInput.value = memoria[regDireccionesInput.value] || "00000000";
    regDatosInput.focus();
    resaltarCeldaMemoria(regDireccionesInput.value);
    paso++;
  }
  break;
    case 8:
      regEntradasInput.value = regDatosInput.value.slice(4);
      regEntradasInput.focus();
      paso++;
      break;
    case 9:
      acumuladorInput.value = (
        parseInt(regEntradasInput.value, 2) +
        parseInt(acumuladorInput.value || "0000", 2)
      )
        .toString(2)
        .padStart(8, "0");
      acumuladorInput.focus();
      paso++;
      break;
      case 10:
  if (decodificadorInput.value === "M") {
    // Limpiar cualquier resaltado previo
    document.querySelectorAll("#tabla-memoria table tr").forEach((fila) => {
      fila.style.border = "";
    });
    
    // Guardar en memoria posición 0000
    memoria["0000"] = acumuladorInput.value || "00000000";
    
    // Actualizar la visualización
    const fila = buscarFilaPorDireccion("0000");
    if (fila) {
      fila.style.border = "3px solid red";
      fila.querySelector("td:nth-child(2)").textContent = acumuladorInput.value || "00000000";
    }
    
    // Terminar el programa
    programaTerminado = true;
      } else {
        paso = 0;
      }
      break;}})



function resaltarCeldaMemoria(direccion) {
  // Remover resaltado de todas las filas antes de aplicar uno nuevo
  document.querySelectorAll("#tabla-memoria table tr").forEach((fila) => {
    fila.style.backgroundColor = ""; // Restaurar color original
    fila.style.border = ""; // Eliminar borde
  });

  const fila = buscarFilaPorDireccion(direccion);
  if (fila) {
    fila.style.border = "3px solid red";
  }
}

btnReiniciar.addEventListener("click", () => {
  contador = 0;
  paso = 0;
  programaTerminado = false;
  memoria = { ...memoriaInicial };

  contadorInput.value = "";
  regDireccionesInput.value = "";
  regDatosInput.value = "";
  regInstruccionesInput.value = "";
  decodificadorInput.value = "";
  regEntradasInput.value = "";
  acumuladorInput.value = "";

  actualizarTablaMemoria();

  alert("El programa se ha reiniciado. Presiona 'Siguiente paso' para empezar de nuevo.");
});

function buscarFilaPorDireccion(direccion) {
  const filas = document.querySelectorAll("#tabla-memoria table tr");

  for (let i = 1; i < filas.length; i++) {
    const celdaDireccion = filas[i].querySelector("td:first-child");
    if (celdaDireccion && celdaDireccion.textContent.trim() === direccion) {
      return filas[i];
    }
  }

  return null;
}

function actualizarTablaMemoria() {
  const filas = document.querySelectorAll("#tabla-memoria table tr");
  filas.forEach((fila, index) => {
    if (index > 0) {
      const direccion = fila.querySelector("td:nth-child(1)").textContent.trim();
      fila.querySelector("td:nth-child(2)").textContent = memoria[direccion] || "00000000";
      fila.style.border = "none";
    }
  });
}