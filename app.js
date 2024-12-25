let nombreUsuario = '';
let seleccionDias = [];

// Función para mostrar el calendario
function verCalendario() {
  nombreUsuario = document.getElementById("nombre").value;

  if (nombreUsuario) {
    // Esconde el formulario y muestra el calendario
    document.getElementById("formulario").style.display = 'none';
    document.getElementById("calendario").style.display = 'block';

    // Inicializa el calendario solo si aún no está inicializado
    $('#calendar').fullCalendar('destroy'); // Esto destruye cualquier instancia anterior
    $('#calendar').fullCalendar({
      events: function(start, end, timezone, callback) {
        let events = [];
        let currentMonth = moment().format('YYYY-MM');

        // Obtiene los eventos del mes actual desde localStorage
        let turnos = JSON.parse(localStorage.getItem('turnos')) || {};
        let mesTurnos = turnos[currentMonth] || {};
        
        // Convertimos los turnos a eventos del calendario
        for (let fecha in mesTurnos) {
          let data = mesTurnos[fecha];
          if (data) {
            events.push({
              title: `${data.nombre} - ${data.turnos.length} persona(s)`,
              start: fecha,
              allDay: true,
              color: data.turnos.length >= 5 ? 'red' : 'green',
              id: fecha
            });
          }
        }

        callback(events);
      },
      dayClick: function(date, jsEvent, view) {
        let selectedDate = date.format();
        if (seleccionDias.length < 4 && !seleccionDias.includes(selectedDate)) {
          seleccionDias.push(selectedDate);
          alert(`Has seleccionado ${date.format('YYYY-MM-DD')}`);
        } else if (seleccionDias.includes(selectedDate)) {
          alert(`Ya has seleccionado este día.`);
        } else {
          alert(`Puedes seleccionar solo 4 días.`);
        }
      }
    });
  } else {
    alert("Por favor ingresa tu nombre.");
  }
}

// Función para registrar los turnos en localStorage
function registrarTurnos() {
  if (seleccionDias.length !== 4) {
    alert("Debes seleccionar exactamente 4 días.");
    return;
  }

  let currentMonth = moment().format('YYYY-MM');
  let fechaTurnos = seleccionDias.map(d => moment(d).format('YYYY-MM-DD'));

  // Obtener los turnos del mes actual desde localStorage
  let turnos = JSON.parse(localStorage.getItem('turnos')) || {};
  let mesTurnos = turnos[currentMonth] || {};

  // Verifica si ya se ha registrado el nombre este mes
  for (let fecha in mesTurnos) {
    let data = mesTurnos[fecha];
    if (data.nombre === nombreUsuario) {
      alert("Ya te has registrado este mes.");
      return;
    }
  }

  // Registrar los turnos en localStorage
  fechaTurnos.forEach(fecha => {
    if (!mesTurnos[fecha]) {
      mesTurnos[fecha] = { turnos: [], nombre: nombreUsuario };
    }

    let turnosDia = mesTurnos[fecha].turnos;

    if (turnosDia.length < 5) {
      turnosDia.push({ nombre: nombreUsuario });
      alert(`Turno registrado para el día ${fecha}`);
    } else {
      alert(`El día ${fecha} ya tiene el cupo completo.`);
    }
  });

  // Guardar en localStorage
  turnos[currentMonth] = mesTurnos;
  localStorage.setItem('turnos', JSON.stringify(turnos));

  // Reset form and calendar
  document.getElementById("nombre").value = '';
  seleccionDias = [];
  $('#calendar').fullCalendar('destroy');
  document.getElementById("formulario").style.display = 'block';
  document.getElementById("calendario").style.display = 'none';
}
