let mesas = JSON.parse(localStorage.getItem("mesas")) || {};
let mesaActual = localStorage.getItem("mesaActual") || null;

const listaMesas = document.getElementById("listaMesas");
const nuevaMesa = document.getElementById("nuevaMesa");
const agregarMesa = document.getElementById("agregarMesa");
const terminarDia = document.getElementById("terminarDia");
const tituloMesa = document.getElementById("tituloMesa");
const producto = document.getElementById("producto");
const cantidad = document.getElementById("cantidad");
const precio = document.getElementById("precio");
const agregarPedido = document.getElementById("agregarPedido");
const tablaPedidos = document.getElementById("tablaPedidos");
const totalEl = document.getElementById("total");

// Render mesas
function actualizarMesas() {
  listaMesas.innerHTML = "";
  Object.keys(mesas).forEach(nombre => {
    const contenedor = document.createElement("div");
    contenedor.className = "d-flex align-items-center mb-2";

    const btnMesa = document.createElement("button");
    btnMesa.className = "btn btn-dark flex-grow-1 text-start";
    btnMesa.textContent = nombre;
    btnMesa.onclick = () => seleccionarMesa(nombre);

    const btnBorrar = document.createElement("button");
    // 🔽 acá van las líneas que mencionaste
    btnBorrar.className = "btn btn-danger btn-sm ms-2";
    btnBorrar.innerHTML = `<i class="bi bi-trash"></i> Eliminar`; 
    contenedor.classList.add("animate__animated", "animate__fadeInUp");   
    btnBorrar.onclick = () => eliminarMesa(nombre);

    contenedor.appendChild(btnMesa);
    contenedor.appendChild(btnBorrar);
    listaMesas.appendChild(contenedor);
  });
}


function eliminarMesa(nombre) {
  if (confirm(`¿Eliminar la mesa "${nombre}" y todos sus pedidos?`)) {
    delete mesas[nombre];
    if (mesaActual === nombre) {
      mesaActual = null;
      tituloMesa.textContent = "Selecciona una mesa";
      tablaPedidos.innerHTML = "";
      totalEl.textContent = "$0";
    }
    localStorage.setItem("mesas", JSON.stringify(mesas));
    actualizarMesas();
  }
}


// Seleccionar mesa
function seleccionarMesa(nombre) {
  mesaActual = nombre;
  localStorage.setItem("mesaActual", nombre);
  tituloMesa.textContent = `Mesa: ${nombre}`;
  renderPedidos();
}

// Render pedidos
// Render pedidos
function renderPedidos() {
  const pedidos = mesas[mesaActual] || [];
  tablaPedidos.innerHTML = "";

  if (pedidos.length === 0) {
    tablaPedidos.innerHTML = `<tr><td colspan="5" class="text-muted">No hay pedidos cargados</td></tr>`;
  } else {
    pedidos.forEach((p, i) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.producto}</td>
        <td>${p.cantidad}</td>
        <td>$${p.precio}</td>
        <td>$${p.cantidad * p.precio}</td>
        <td>
          <div class="d-flex justify-content-center gap-1">
            <button class="btn btn-sm btn-success rounded-circle" onclick="cambiarCantidad(${i}, 1)">
              <i class="bi bi-plus-lg"></i>
            </button>
            <button class="btn btn-sm btn-warning rounded-circle" onclick="cambiarCantidad(${i}, -1)">
              <i class="bi bi-dash-lg"></i>
            </button>
            <button class="btn btn-sm btn-danger rounded-circle" onclick="borrarPedido(${i})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      tablaPedidos.appendChild(fila);
    });
  }

  const total = pedidos.reduce((s, p) => s + p.cantidad * p.precio, 0);
  totalEl.textContent = `$${total}`;
  localStorage.setItem("mesas", JSON.stringify(mesas));
}

// Nueva función para sumar/restar cantidad
function cambiarCantidad(index, delta) {
  const pedido = mesas[mesaActual][index];
  pedido.cantidad = Math.max(1, pedido.cantidad + delta);
  renderPedidos();
}


// Agregar mesa
agregarMesa.onclick = () => {
  const nombre = nuevaMesa.value.trim();
  if (!nombre) return alert("Ingresá un nombre de mesa o cliente");
  if (mesas[nombre]) return alert("Esa mesa ya existe");
  mesas[nombre] = [];
  nuevaMesa.value = "";
  localStorage.setItem("mesas", JSON.stringify(mesas));
  actualizarMesas();
};

// Agregar pedido
agregarPedido.onclick = () => {
  if (!mesaActual) return alert("Seleccioná una mesa primero");
  const prod = producto.value.trim();
  const cant = parseInt(cantidad.value);
  const prec = parseFloat(precio.value);
  if (!prod || isNaN(cant) || isNaN(prec)) return alert("Completá todos los campos");

  mesas[mesaActual].push({ producto: prod, cantidad: cant, precio: prec });
  producto.value = cantidad.value = precio.value = "";
  renderPedidos();
};

// Editar pedido
function editarPedido(i) {
  const pedido = mesas[mesaActual][i];
  producto.value = pedido.producto;
  cantidad.value = pedido.cantidad;
  precio.value = pedido.precio;
  borrarPedido(i);
}

// Borrar pedido
function borrarPedido(i) {
  mesas[mesaActual].splice(i, 1);
  renderPedidos();
}

// Terminar día (borrar todo)
terminarDia.onclick = () => {
  if (confirm("¿Seguro que querés borrar todas las mesas y pedidos?")) {
    mesas = {};
    mesaActual = null;
    localStorage.clear();
    tituloMesa.textContent = "Selecciona una mesa";
    renderPedidos();
    actualizarMesas();
  }
};

// Iniciar
actualizarMesas();
if (mesaActual) seleccionarMesa(mesaActual);
else renderPedidos();
