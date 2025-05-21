let usuarioLogueado = false;

function mostrarPantalla(id) {
    const seccionesPrivadas = ['cuentas', 'historial', 'graficos', 'seguridad', 'notificaciones'];
    const menu = document.getElementById('menu');
  
    // Mostrar u ocultar el menú según la pantalla activa
    if (id === 'login' || id === 'registro') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'flex';
    }
  
    // Bloquear acceso a secciones privadas si no hay login
    if (!usuarioLogueado && seccionesPrivadas.includes(id)) {
      alert("Debes iniciar sesión para acceder a esta sección.");
      return;
    }
  
    document.querySelectorAll('.pantalla').forEach(p => p.classList.add('oculto'));
    document.getElementById(id).classList.remove('oculto');
    if (id === 'graficos') {
        actualizarGrafico();}
    // Habilita botones
    document.querySelectorAll('nav button').forEach(btn => {
        if (btn.innerText !== 'Login / Registro') {
        btn.classList.remove('disabled');
        }
    });
    
  }
  
  function actualizarGrafico() {
    const from = document.getElementById('grafFrom').value;
    const to = document.getElementById('grafTo').value;
    const grafInfo = document.getElementById('grafInfo');
    const grafImagen = document.getElementById('grafImagen');
  
    if (from === to) {
      grafInfo.innerText = "Selecciona monedas distintas para ver el gráfico.";
      grafImagen.src = "";
      return;
    }
  
    grafInfo.innerText = `Gráfico de ${from} a ${to} — Simulación 7 días`;
  
    const textos = {
        "PENUSD": `<p><strong>Gráfico de PEN a USD</strong> <span style="color:#b00020">−0.29%</span> (1Y)</p>
                   <p>sol peruano a Dólar estadounidense</p>
                   <p>🟢 1 PEN = 0.269823 USD – 21 abr 2025, 22:39 UTC</p>`,
        "USDPEN": `<p><strong>Gráfico de USD a PEN</strong> <span style="color:#008000">+0.30%</span> (1Y)</p>
                   <p>Dólar estadounidense a sol peruano</p>
                   <p>🟢 1 USD = 3.70613 PEN – 21 abr 2025, 22:39 UTC</p>`,
        "PENEUR": `<p><strong>Gráfico de PEN a EUR</strong> <span style="color:#b00020">−7.69%</span> (1Y)</p>
                   <p>sol peruano a Euro</p>
                   <p>🟢 1 PEN = 0.234265 EUR – 21 abr 2025, 22:38 UTC</p>`,
        "EURPEN": `<p><strong>Gráfico de EUR a PEN</strong> <span style="color:#008000">+8.33%</span> (1Y)</p>
                   <p>Euro a sol peruano</p>
                   <p>🟢 1 EUR = 4.2685 PEN – 21 abr 2025, 22:39 UTC</p>`,
        "USDEUR": `<p><strong>Gráfico de USD a EUR</strong> <span style="color:#b00020">−7.43%</span> (1Y)</p>
                   <p>Dólar estadounidense a Euro</p>
                   <p>🟢 1 USD = 0.86814 EUR – 21 abr 2025, 22:35 UTC</p>`,
        "EURUSD": `<p><strong>Gráfico de EUR a USD</strong> <span style="color:#008000">+6.77%</span> (1Y)</p>
                   <p>Euro a Dólar estadounidense</p>
                   <p>🟢 1 EUR = 1.1512 USD – 21 abr 2025, 22:40 UTC</p>`
      };
    
      grafTexto.innerHTML = textos[`${from}${to}`] || "";
      
    // Datos simulados aleatorios para efecto visual
    const datos = Array.from({ length: 7 }, () => (Math.random() * 0.5 + 3).toFixed(2));
  
    const chartConfig = {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: `${from}/${to}`,
            data: datos,
            borderColor: '#0061ff',
            fill: true,
            backgroundColor: 'rgba(0,97,255,0.1)'
          }]
        },
        options: {
          scales: { y: { beginAtZero: false } },
          plugins: { legend: { display: false } }
        }
      };
      
      const url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
      
  
    grafImagen.src = url;
  }
  
  
  
  // Simular login (sin validar contra base de datos)
  function ingresarApp() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
  
    if (user && pass) {
      usuarioLogueado = true;
      mostrarPantalla('conversion');
  
      // Habilita botones
      document.querySelectorAll('nav button').forEach(btn => {
        if (btn.innerText !== 'Login / Registro') {
          btn.classList.remove('disabled');
        }
      });
  
      // Oculta el botón de login
      document.getElementById('loginBtn').style.display = 'none';
    } else {
      alert("Por favor ingresa usuario y contraseña.");
    }
  }
  
  
  
  // Simular conversión de moneda
  function convertir() {
    const amount = parseFloat(document.getElementById('amount').value);
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
  
    if (isNaN(amount) || amount <= 0) {
      document.getElementById('resultado').innerText = "Ingresa un monto válido.";
      return;
    }
  
    const tasas = {
      PEN: { USD: 0.27, EUR: 0.25 },
      USD: { PEN: 3.70, EUR: 0.93 },
      EUR: { PEN: 4.10, USD: 1.07 }
    };
  
    if (from === to) {
      document.getElementById('resultado').innerText = "No es necesaria la conversión.";
      return;
    }
  
    const tasa = tasas[from][to];
    const resultado = (amount * tasa).toFixed(2);
    document.getElementById('resultado').innerText = `Recibirás: ${resultado} ${to}`;
  }
  
  // Mostrar login al cargar la app
  mostrarPantalla('login');


  window.addEventListener('DOMContentLoaded', () => {
    mostrarPantalla('conversion');
  });
  
  
  