 <script>
    let nombreUsuario = '';
    let seleccionDias = [];

    function verCalendario() {
      nombreUsuario = document.getElementById("nombre").value;

      if (nombreUsuario) {
        document.getElementById("formulario").style.display = 'none';
        document.getElementById("calendario").style.display = 'block';

        $('#calendar').fullCalendar('destroy'); 
        $('#calendar').fullCalendar({
          defaultView: 'month', // Solo muestra el mes actual
          selectable: true, // Permite la selección de días
          selectHelper: true,
          events: function(start, end, timezone, callback) {
            let events = [];
            let currentMonth = moment().format('YYYY-MM');

            let turnos = JSON.parse(localStorage.getItem('turnos')) || {};
            let mesTurnos = turnos[currentMonth] || {};
            
            for (let fecha in mesTurnos) {
              let data = mesTurnos[fecha];
              if (data) {
                events.push({
                  title: `${data.turnos.length} persona(s)`,
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
            let selectedDate = date.format('YYYY-MM-DD');
            let currentMonth = moment().format('YYYY-MM');
            let turnos = JSON.parse(localStorage.getItem('turnos')) || {};
            let mesTurnos = turnos[currentMonth] || {};

            if (mesTurnos[selectedDate] && mesTurnos[selectedDate].turnos.length >= 5) {
              alert("No hay cupos disponibles para este día.");
              return;
            }

            if (seleccionDias.length < 4 && !seleccionDias.includes(selectedDate)) {
              seleccionDias.push(selectedDate);
              alert(`Has seleccionado ${selectedDate}`);
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

    function registrarTurnos() {
      if (seleccionDias.length !== 4) {
        alert("Debes seleccionar exactamente 4 días.");
        return;
      }

      let currentMonth = moment().format('YYYY-MM');
      let turnos = JSON.parse(localStorage.getItem('turnos')) || {};
      let mesTurnos = turnos[currentMonth] || {};

      for (let fecha in mesTurnos) {
        let data = mesTurnos[fecha];
        if (data.turnos.some(turno => turno.nombre === nombreUsuario)) {
          alert("Ya te has registrado este mes.");
          return;
        }
      }

      seleccionDias.forEach(fecha => {
        if (!mesTurnos[fecha]) {
          mesTurnos[fecha] = { turnos: [] };
        }

        let turnosDia = mesTurnos[fecha].turnos;

        if (turnosDia.length < 5) {
          turnosDia.push({ nombre: nombreUsuario });
          alert(`Turno registrado para el día ${fecha}`);
        } else {
          alert(`El día ${fecha} ya tiene el cupo completo.`);
        }
      });

      turnos[currentMonth] = mesTurnos;
      localStorage.setItem('turnos', JSON.stringify(turnos));

      document.getElementById("nombre").value = '';
      seleccionDias = [];
      $('#calendar').fullCalendar('destroy');
      document.getElementById("formulario").style.display = 'block';
      document.getElementById("calendario").style.display = 'none';
    }
  </script>
</body>
</html>
