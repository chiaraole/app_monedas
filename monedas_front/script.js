/* ---------- CONFIG GLOBAL ---------- */
const API_BASE = "http://localhost:3000";   // puerto donde corre tu backend
let   usuario  = "X";                       // ID fijo para la demo
let   usuarioLogueado = false;

/* ---------- UTILIDAD: mostrar/ocultar pantallas ---------- */
function mostrarPantalla(id) {
  // si intenta entrar a secciones privadas sin login, lo bloqueamos
  const privadas = ["cuentas", "historial", "graficos", "seguridad", "notificaciones"];
  if (!usuarioLogueado && privadas.includes(id)) {
    alert("Debes iniciar sesión para acceder a esta sección.");
    return;
  }

  // oculta todas y muestra la solicitada
  document.querySelectorAll(".pantalla").forEach(sec => sec.classList.add("oculto"));
  document.getElementById(id).classList.remove("oculto");

  // acciones automáticas al entrar
  if (id === "cuentas")   cargarCuentas();
  if (id === "historial") cargarHistorial();
  if (id === "graficos")  actualizarGrafico();
}

/* ---------- LOGIN DEMO MUY SIMPLE ---------- */
function ingresarApp() {
  const usr = document.getElementById("loginUser").value.trim();
  if (!usr) { alert("Ingresa usuario"); return; }

  usuario = usr;           // en un proyecto real validarías credenciales
  usuarioLogueado = true;

  // habilita botones privados
  document.querySelectorAll("nav button.disabled").forEach(b => b.classList.remove("disabled"));

  mostrarPantalla("conversion");
}

/* ---------- CONVERSIÓN (POST /transfer) ---------- */
async function convertir() {
  const monto   = parseFloat(document.getElementById("amount").value);
  const fromCur = document.getElementById("from").value;
  const toCur   = document.getElementById("to").value;

  if (!monto || monto <= 0) { alert("Monto inválido"); return; }

  try {
    const res = await fetch(`${API_BASE}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromUser: usuario,
        toUser:   usuario,     // conversión interna
        amount:   monto,
        fromCur,
        toCur
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    document.getElementById("resultado").textContent =
      `${monto} ${fromCur} → ${data.converted} ${toCur} (tasa ${data.rate})`;

    cargarCuentas();
    cargarHistorial();
  } catch (err) {
    alert(err.message);
  }
}

/* ---------- SALDOS (GET /accounts/:id) ---------- */
async function cargarCuentas() {
  try {
    const res  = await fetch(`${API_BASE}/accounts/${usuario}`);
    const data = await res.json();
    const ul   = document.getElementById("cuentasLista");
    ul.innerHTML = `
      <li>💵 Soles (PEN): S/. ${data.pen}</li>
      <li>💲 Dólares (USD): $${data.usd}</li>
    `;
  } catch (err) {
    alert("No se pudo cargar saldos");
  }
}

/* ---------- HISTORIAL (GET /history/:id) ---------- */
async function cargarHistorial() {
  try {
    const res   = await fetch(`${API_BASE}/history/${usuario}`);
    const lista = await res.json();
    const cont  = document.getElementById("histList");
    const vacio = document.getElementById("histVacio");

    if (!lista.length) {
      cont.innerHTML = "";
      vacio.style.display = "block";
      return;
    }

    vacio.style.display = "none";
    cont.innerHTML = lista.map(tx => {
      const fecha = new Date(tx.ts).toLocaleString();
      return `<p>📅 ${fecha} – 💰 ${tx.amount} ${tx.fromCur} → ${tx.converted} ${tx.toCur}</p>`;
    }).join("");
  } catch (err) {
    alert("No se pudo cargar el historial");
  }
}

/* ---------- TASA RÁPIDA (GET /rate) ---------- */
async function actualizarGrafico() {
  const from = document.getElementById("grafFrom").value;
  const to   = document.getElementById("grafTo").value;
  const info = document.getElementById("grafInfo");

  if (from === to) {
    info.textContent = "Selecciona monedas distintas para ver la tasa.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/rate?from=${from}&to=${to}`);
    const { rate } = await res.json();
    info.textContent = `Tasa actual ${from} → ${to}: ${rate}`;
  } catch {
    info.textContent = "No se pudo obtener la tasa.";
  }
}

/* ---------- INICIO: muestra login ---------- */
mostrarPantalla("login");
