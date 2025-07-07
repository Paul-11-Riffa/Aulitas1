// /static/app.js - VERSIÓN FINAL COMENTADA Y MEJORADA

/**
 * =====================================================================================
 * FUNCIONES PARA MANEJAR LA INTERFAZ DE USUARIO (UI)
 * =====================================================================================
 */

/**
 * Genera las secciones de entrada para cada piso según el número que el usuario especifique.
 * Se activa al cargar la página y cada vez que el usuario cambia el valor del input "Número de Pisos".
 * --- MEJORA: Se ha añadido un límite máximo de 10 pisos ---
 */
function generarSeccionesPisos() {
    // Obtiene el input de número de pisos
    const numPisosInput = document.getElementById('numPisos');
    // Lee el valor y lo convierte a un número entero.
    let numPisos = parseInt(numPisosInput.value, 10);

    // --- ¡NUEVA VALIDACIÓN! ---
    // Limita el número máximo de pisos a 10.
    if (numPisos > 10) {
        alert("Para optimizar el rendimiento, se permite un máximo de 10 pisos.");
        numPisos = 10; // Limita el valor a 10
        numPisosInput.value = 10; // Actualiza el valor en el campo de entrada
    }
    // --- FIN DE LA VALIDACIÓN ---

    // Obtiene el contenedor principal donde se añadirán las secciones de los pisos.
    const container = document.getElementById('aulas-por-piso-container');
    // Limpia el contenido previo.
    container.innerHTML = '';

    if (numPisos > 0) {
        for (let i = 1; i <= numPisos; i++) {
            const pisoSection = document.createElement('div');
            pisoSection.className = 'piso-section';
            pisoSection.innerHTML = `
              <h4>Piso ${i}</h4>
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
              <button type="button" onclick="agregarFilaAula('aulas-piso-${i}-table', ${i})">
                Añadir Aula al Piso ${i}
              </button>
            `;
            container.appendChild(pisoSection);
        }
    }
}

/**
 * Agrega una nueva fila a la tabla de aulas de un piso específico.
 */
function agregarFilaAula(tableId, pisoNum) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const numAulasActual = tableBody.rows.length;
    const newRow = tableBody.insertRow();
    const nombreAulaPredeterminado = `P${pisoNum}_Aula_${numAulasActual + 1}`;

    // --- MEJORA: Se añade min="1" para no permitir números negativos ---
    newRow.innerHTML = `
      <td><input type="text" value="${nombreAulaPredeterminado}" /></td>
      <td><input type="number" placeholder="Ej: 45" min="1" /></td>
      <td><button class="remove-btn" onclick="eliminarFila(this)">Eliminar</button></td>
    `;
}

/**
 * Agrega una nueva fila a la tabla de grupos de estudiantes.
 */
function agregarFilaGrupo() {
    const tableBody = document.querySelector(`#grupos-table tbody`);
    const newRow = tableBody.insertRow();
    // --- MEJORA: Se añade min="1" para no permitir números negativos ---
    newRow.innerHTML = `
      <td><input type="text" placeholder="Ej: Cálculo I" /></td>
      <td><input type="number" placeholder="Ej: 35" min="1" /></td>
      <td><button class="remove-btn" onclick="eliminarFila(this)">Eliminar</button></td>
    `;
}


/**
 * Agrega una nueva fila a la tabla de horarios disponibles.
 */
function agregarFilaHorario() {
    const tableBody = document.querySelector(`#horarios-table tbody`);
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
      <td><input type="text" placeholder="Ej: 14:00-16:15" /></td>
      <td><button class="remove-btn" onclick="eliminarFila(this)">Eliminar</button></td>
    `;
}

/**
 * Elimina la fila (tr) que contiene el botón que fue presionado.
 * @param {HTMLElement} button - El botón "Eliminar" que fue clickeado.
 */
function eliminarFila(button) {
    button.closest("tr").remove();
}

/**
 * Actualiza el texto que muestra el valor actual de un slider.
 * @param {HTMLInputElement} slider - El elemento input de tipo "range" que cambió.
 */
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

// --- INICIALIZACIÓN DE LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Genera las secciones de pisos iniciales.
    generarSeccionesPisos();
    // 2. Inicializa los valores visuales de los sliders.
    updateSliderValue(document.getElementById('delta'));
    updateSliderValue(document.getElementById('lambda'));

    // --- MEJORA: Se añade un listener al input de pisos para validar en tiempo real ---
    document.getElementById('numPisos').addEventListener('change', generarSeccionesPisos);
});

// --- MANEJO DEL EVENTO DE RESOLVER ---
document.getElementById("solveBtn").addEventListener("click", () => {
    const solveButton = document.getElementById("solveBtn");
    const resultsDiv = document.getElementById("results");

    solveButton.disabled = true;
    solveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    resultsDiv.textContent = "Recolectando y validando datos...";
    resultsDiv.className = 'results-feedback';

    // (El resto de esta función no necesita cambios)
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
        resultsDiv.textContent = "Error: Debes definir al menos un aula, un grupo y un horario con datos válidos.";
        resultsDiv.className = 'results-feedback error';
        solveButton.disabled = false;
        solveButton.innerHTML = 'Resolver con Python';
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
            const error = new Error(responseData.error || 'Ocurrió un error desconocido');
            error.status = response.status;
            throw error;
        }
        return responseData;
    })
    .then((data) => {
        resultsDiv.className = 'results-feedback success';
        let output = `<strong>Estado:</strong> ${data.estado}\n`;
        if (data.valor_objetivo !== null) {
            output += `<strong>Valor Objetivo (Z):</strong> ${data.valor_objetivo.toFixed(2)}\n\n`;
        }
        output += "<strong>--- Asignaciones Óptimas ---</strong>\n";
        output += data.resultados.length > 0 ? data.resultados.join("\n") : "No se encontraron asignaciones.";
        resultsDiv.innerHTML = output.replace(/\n/g, '<br>');
    })
    .catch((error) => {
        console.error("Error en la solicitud:", error);
        resultsDiv.className = 'results-feedback error';
        resultsDiv.textContent = `Error: ${error.message}`;
    })
    .finally(() => {
        solveButton.disabled = false;
        solveButton.innerHTML = 'Resolver con Python';
    });
});