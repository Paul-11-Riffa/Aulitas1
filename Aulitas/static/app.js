// /static/app.js - VERSIÓN CON PESTAÑAS Y NUEVO DISEÑO

/**
 * =====================================================================================
 * NUEVA LÓGICA PARA NAVEGACIÓN POR PESTAÑAS
 * =====================================================================================
 */
function openTab(evt, tabName) {
    // Ocultar todo el contenido de las pestañas
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Desactivar todos los botones de las pestañas
    const tablinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Mostrar la pestaña actual y marcar el botón como activo
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


/**
 * =====================================================================================
 * FUNCIONES PARA MANEJAR LA INTERFAZ DE USUARIO (UI) - SIN CAMBIOS MAYORES
 * =====================================================================================
 */

function generarSeccionesPisos() {
    const numPisosInput = document.getElementById('numPisos');
    let numPisos = parseInt(numPisosInput.value, 10);

    if (numPisos > 10) {
        alert("Para optimizar el rendimiento, se permite un máximo de 10 pisos.");
        numPisos = 10;
        numPisosInput.value = 10;
    }

    const container = document.getElementById('aulas-por-piso-container');
    container.innerHTML = '';

    if (numPisos > 0) {
        for (let i = 1; i <= numPisos; i++) {
            const pisoSection = document.createElement('div');
            pisoSection.className = 'piso-section';
            pisoSection.innerHTML = `
              <h4>Estructura del Piso ${i}</h4>
              <table id="aulas-piso-${i}-table">
                <thead>
                  <tr>
                    <th>Nombre del Aula</th>
                    <th>Capacidad</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
              <button type="button" class="secondary-btn" onclick="agregarFilaAula('aulas-piso-${i}-table', ${i})">
                Añadir Aula al Piso ${i}
              </button>
            `;
            container.appendChild(pisoSection);
        }
    }
}

function agregarFilaAula(tableId, pisoNum) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const numAulasActual = tableBody.rows.length;
    const newRow = tableBody.insertRow();
    const nombreAulaPredeterminado = `P${pisoNum}_AULA_${numAulasActual + 1}`;

    newRow.innerHTML = `
      <td><input type="text" value="${nombreAulaPredeterminado}" /></td>
      <td><input type="number" placeholder="Ej: 45" min="1" /></td>
      <td><button class="remove-btn" onclick="eliminarFila(this)">Eliminar</button></td>
    `;
}

function agregarFilaGrupo() {
    const tableBody = document.querySelector(`#grupos-table tbody`);
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
      <td><input type="text" placeholder="Ej: CALC-101" /></td>
      <td><input type="number" placeholder="Ej: 35" min="1" /></td>
      <td><button class="remove-btn" onclick="eliminarFila(this)">Eliminar</button></td>
    `;
}

function agregarFilaHorario() {
    const tableBody = document.querySelector(`#horarios-table tbody`);
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
      <td><input type="text" placeholder="Ej: LUN_14:00-16:15" /></td>
      <td><button class="remove-btn" onclick="eliminarFila(this)">Eliminar</button></td>
    `;
}

function eliminarFila(button) {
    button.closest("tr").remove();
}

function updateSliderValue(slider) {
    const displayId = `${slider.id}-value`;
    const display = document.getElementById(displayId);
    if (display) {
        display.textContent = slider.id === 'delta' ? `${slider.value}%` : slider.value;
    }
}

/**
 * =====================================================================================
 * LÓGICA PRINCIPAL DE LA APLICACIÓN
 * =====================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    generarSeccionesPisos();
    updateSliderValue(document.getElementById('delta'));
    updateSliderValue(document.getElementById('lambda'));
    document.getElementById('numPisos').addEventListener('change', generarSeccionesPisos);
});

document.getElementById("solveBtn").addEventListener("click", () => {
    const solveButton = document.getElementById("solveBtn");
    const resultsDiv = document.getElementById("results");

    solveButton.disabled = true;
    solveButton.innerHTML = 'Computando...';
    resultsDiv.textContent = "> Recolectando y validando datos de todas las etapas...";
    resultsDiv.className = '';

    function recolectarAulas() {
        const aulas = [];
        document.querySelectorAll('.piso-section tbody tr').forEach(row => {
            const nombreInput = row.querySelector('input[type="text"]');
            const capacidadInput = row.querySelector('input[type="number"]');
            const nombre = nombreInput.value.trim();
            const capacidad = parseInt(capacidadInput.value, 10);
            if (nombre && !isNaN(capacidad) && capacidad > 0) {
                aulas.push({nombre, capacidad});
            }
        });
        return aulas;
    }

    function recolectarGrupos() {
        const data = [];
        document.querySelectorAll('#grupos-table tbody tr').forEach(row => {
            const nombreInput = row.querySelector('input[type="text"]');
            const tamanoInput = row.querySelector('input[type="number"]');
            const nombre = nombreInput.value.trim();
            const tamano = parseInt(tamanoInput.value, 10);
            if (nombre && !isNaN(tamano) && tamano > 0) {
                data.push({nombre, tamano});
            }
        });
        return data;
    }

    function recolectarHorarios() {
        const data = [];
        document.querySelectorAll('#horarios-table tbody tr').forEach(row => {
            const input = row.querySelector("input[type='text']");
            const horario = input.value.trim();
            if (horario) {
                data.push(horario);
            }
        });
        return data;
    }

    const aulas = recolectarAulas();
    const grupos = recolectarGrupos();
    const horarios = recolectarHorarios();
    const parametros = {
        delta: parseFloat(document.getElementById("delta").value) / 100,
        lambda: parseFloat(document.getElementById("lambda").value),
    };

    if (aulas.length === 0 || grupos.length === 0 || horarios.length === 0) {
        resultsDiv.textContent = "> ERROR: Se requieren datos válidos en las etapas 1, 2 y 3 para la simulación.";
        resultsDiv.className = 'error';
        solveButton.disabled = false;
        solveButton.innerHTML = 'Ejecutar Simulación';
        return;
    }

    const payload = {aulas, grupos, horarios, parametros};

    fetch("/solve", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    })
    .then(async (response) => {
        const responseData = await response.json();
        if (!response.ok) {
            const error = new Error(responseData.error || 'Error de comunicación con el servidor.');
            error.status = response.status;
            throw error;
        }
        return responseData;
    })
    .then((data) => {
        resultsDiv.className = 'success';
        let output = `> ESTADO: ${data.estado}\n`;
        if (data.valor_objetivo !== null) {
            output += `> VALOR OBJETIVO (Z): ${data.valor_objetivo.toFixed(2)}\n\n`;
        }
        output += "--- [INICIO DE ASIGNACIONES ÓPTIMAS] ---\n";
        output += data.resultados.length > 0 ? data.resultados.join("\n") : "No se encontraron asignaciones viables.";
        output += "\n--- [FIN DE ASIGNACIONES ÓPTIMAS] ---";
        resultsDiv.innerHTML = output;
    })
    .catch((error) => {
        console.error("Error en la solicitud:", error);
        resultsDiv.className = 'error';
        resultsDiv.textContent = `> ERROR DE EJECUCIÓN: ${error.message}`;
    })
    .finally(() => {
        solveButton.disabled = false;
        solveButton.innerHTML = 'Ejecutar Simulación';
    });
});