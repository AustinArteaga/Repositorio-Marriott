// Tabla tarifaria exacta según especificaciones
const TARIFAS_EXACTAS = [
  { desde: 50, hasta: 99, tarifa: 0.091, costoBase: 0 },
  { desde: 100, hasta: 149, tarifa: 0.093, costoBase: 4.55 },
  { desde: 150, hasta: 199, tarifa: 0.095, costoBase: 9.2 },
  { desde: 200, hasta: 249, tarifa: 0.097, costoBase: 13.95 },
  { desde: 250, hasta: 299, tarifa: 0.099, costoBase: 18.8 },
  { desde: 300, hasta: 349, tarifa: 0.101, costoBase: 23.75 },
  { desde: 350, hasta: 404, tarifa: 0.103, costoBase: 28.8 },
  { desde: 405, hasta: 699, tarifa: 0.105, costoBase: 39.73 },
  { desde: 700, hasta: 999, tarifa: 0.1285, costoBase: 77.63 },
  { desde: 1000, hasta: 1499, tarifa: 0.145, costoBase: 121.13 },
  { desde: 1500, hasta: 1999, tarifa: 0.1709, costoBase: 206.58 },
  { desde: 2000, hasta: 2499, tarifa: 0.2752, costoBase: 344.18 },
  { desde: 2500, hasta: 3500, tarifa: 0.436, costoBase: 562.18 },
  { desde: 3501, hasta: Number.POSITIVE_INFINITY, tarifa: 0.6812, costoBase: 1244.06 },
]

// ⚡ CONFIGURACIÓN DE POWER AUTOMATE - URL CORREGIDA
const POWER_AUTOMATE_URL =
  "https://default7235b983940447368527b8c69d3ffe.77.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b87208e2a51c40489cbc3acd2fb8358a/triggers/manual/paths/invoke/?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xnRomK-ltbqgaIBOYCWDNE0udC8m6551o6hACuG9CKY"

// 📱 CONFIGURACIÓN DE WHATSAPP
const WHATSAPP_NUMBER = "593980910905"
const WHATSAPP_MESSAGE =
  "¡Hola! Estoy interesado en recibir más información de los sistemas fotovoltaicos. ¿Me pueden ayudar?"

// Variables globales para elementos DOM
let elementos = {}
let datosCalculados = null

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  inicializarElementos()
  configurarEventListeners()
})

function inicializarElementos() {
  elementos = {
    // Formulario
    nombre: document.getElementById("nombre"),
    tipoCliente: document.getElementById("tipoCliente"),
    celular: document.getElementById("celular"),
    email: document.getElementById("email"),
    ciudad: document.getElementById("ciudad"),
    consumoMensual: document.getElementById("consumoMensual"),
    calcularBtn: document.getElementById("calcularBtn"),
    // Alertas
    errorAlert: document.getElementById("error-alert"),
    errorList: document.getElementById("error-list"),
    // Resultados
    resultados: document.getElementById("resultados"),
    clienteInfo: document.getElementById("cliente-info"),
    // Situación Actual
    consumoMensualDisplay: document.getElementById("consumo-mensual-display"),
    costoMensualSinSfv: document.getElementById("costo-mensual-sin-sfv"),
    consumoAnual: document.getElementById("consumo-anual"),
    costoAnualSinSfv: document.getElementById("costo-anual-sin-sfv"),
    // Sistema Fotovoltaico
    tamanoSfv: document.getElementById("tamano-sfv"),
    precioInversion: document.getElementById("precio-inversion"),
    produccionAnual: document.getElementById("produccion-anual"),
    produccionMensual: document.getElementById("produccion-mensual"),
    cantidadPaneles: document.getElementById("cantidad-paneles"),
    areaRequerida: document.getElementById("area-requerida"),
    // Con Sistema Solar
    nuevoConsumoMensual: document.getElementById("nuevo-consumo-mensual"),
    nuevoCostoMensual: document.getElementById("nuevo-costo-mensual"),
    ahorroMensual: document.getElementById("ahorro-mensual"),
    ahorroAnual: document.getElementById("ahorro-anual"),
    ahorroporcentaje: document.getElementById("ahorro-porcentaje"),
    // Tiempo de Retorno
    tiempoRetorno: document.getElementById("tiempo-retorno"),
    retornoDescription: document.getElementById("retorno-description"),
    metricPorcentaje: document.getElementById("metric-porcentaje"),
    metricAhorro: document.getElementById("metric-ahorro"),
    metricArea: document.getElementById("metric-area"),
    // Botones de acción
    generarPdfBtn: document.getElementById("generarPdfBtn"),
    whatsappBtn: document.getElementById("whatsappBtn"),
    // Modal de ayuda
    verConsumoLink: document.getElementById("verConsumoLink"),
    consumoModal: document.getElementById("consumoModal"),
    closeModal: document.getElementById("closeModal"),
    planillaImage: document.getElementById("planillaImage"),
  }
}

function configurarEventListeners() {
  elementos.calcularBtn.addEventListener("click", calcularAhorro)
  elementos.generarPdfBtn.addEventListener("click", generarPDF)
  elementos.whatsappBtn.addEventListener("click", abrirWhatsApp)

  // Modal de ayuda para consumo
  elementos.verConsumoLink.addEventListener("click", (e) => {
    e.preventDefault()
    mostrarModalConsumo()
  })

  elementos.closeModal.addEventListener("click", cerrarModalConsumo)

  // Cerrar modal al hacer clic fuera
  elementos.consumoModal.addEventListener("click", (e) => {
    if (e.target === elementos.consumoModal) {
      cerrarModalConsumo()
    }
  })

  // Cerrar modal con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elementos.consumoModal.style.display === "block") {
      cerrarModalConsumo()
    }
  })

  // Ampliar imagen al hacer clic
  elementos.planillaImage.addEventListener("click", () => {
    window.open("/images/FOTO_DE_PLANILLA.png", "_blank")
  })

  // Enter key en campos de input
  elementos.nombre.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calcularAhorro()
  })
  elementos.consumoMensual.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calcularAhorro()
  })
  elementos.celular.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calcularAhorro()
  })
  elementos.email.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calcularAhorro()
  })
  elementos.ciudad.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calcularAhorro()
  })

  // Validación en tiempo real para el celular
  elementos.celular.addEventListener("input", (e) => {
    // Solo permitir números
    e.target.value = e.target.value.replace(/[^0-9]/g, "")
  })
}

// 🖼️ FUNCIONES DEL MODAL DE AYUDA
function mostrarModalConsumo() {
  elementos.consumoModal.style.display = "block"
  document.body.style.overflow = "hidden" // Prevenir scroll del body
}

function cerrarModalConsumo() {
  elementos.consumoModal.style.display = "none"
  document.body.style.overflow = "auto" // Restaurar scroll del body
}

// 📄 FUNCIÓN PARA GENERAR PDF
function generarPDF() {
  if (!datosCalculados) {
    mostrarNotificacion("❌ No hay datos para generar el PDF", "error")
    return
  }

  try {
    mostrarNotificacion("📄 Generando informe PDF...", "info")

    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    // Configuración de colores
    const primaryColor = [255, 158, 26] // Naranja
    const textColor = [55, 65, 81] // Gris oscuro
    const accentColor = [16, 185, 129] // Verde

    // HEADER DEL PDF
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, "F")

    // Logo y título
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("☀️ INFORME SOLAR", 20, 25)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Sistema de Ahorro Fotovoltaico", 20, 32)

    // Fecha
    const fecha = new Date().toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    doc.text(`Fecha: ${fecha}`, 140, 32)

    // INFORMACIÓN DEL CLIENTE
    let yPos = 55
    doc.setTextColor(...textColor)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("INFORMACIÓN DEL CLIENTE", 20, yPos)

    yPos += 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Nombre: ${datosCalculados.nombre}`, 20, yPos)
    doc.text(`Tipo: ${datosCalculados.tipoCliente}`, 110, yPos)

    yPos += 7
    doc.text(`Celular: ${datosCalculados.celular}`, 20, yPos)
    doc.text(`Ciudad: ${datosCalculados.ciudad}`, 110, yPos)

    yPos += 7
    doc.text(`Email: ${datosCalculados.email}`, 20, yPos)

    // SITUACIÓN ACTUAL
    yPos += 20
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("SITUACIÓN ENERGÉTICA ACTUAL", 20, yPos)

    yPos += 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Consumo mensual: ${formatearNumero(datosCalculados.consumo, 0)} kWh`, 20, yPos)
    doc.text(`Consumo anual: ${formatearNumero(datosCalculados.consumoAnualSinSFV, 0)} kWh`, 110, yPos)

    yPos += 7
    doc.text(`Costo mensual: ${formatearMoneda(datosCalculados.costoMensualSinSFV)}`, 20, yPos)
    doc.text(`Costo anual: ${formatearMoneda(datosCalculados.costoAnualSinSFV)}`, 110, yPos)

    // SISTEMA FOTOVOLTAICO PROPUESTO
    yPos += 20
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("SISTEMA FOTOVOLTAICO PROPUESTO", 20, yPos)

    yPos += 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Tamaño del sistema: ${formatearNumero(datosCalculados.tamanoSFV)} kWp`, 20, yPos)
    doc.text(`Cantidad de paneles: ${datosCalculados.cantidadPaneles} unidades`, 110, yPos)

    yPos += 7
    doc.text(`Área requerida: ${formatearNumero(datosCalculados.areaRequerida)} m²`, 20, yPos)
    doc.text(`Producción anual: ${formatearNumero(datosCalculados.produccionAnualSFV, 0)} kWh`, 110, yPos)

    yPos += 7
    doc.text(`Producción mensual: ${formatearNumero(datosCalculados.produccionMensualSFV, 0)} kWh`, 20, yPos)

    // INVERSIÓN Y AHORROS
    yPos += 20
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("INVERSIÓN Y AHORROS", 20, yPos)

    yPos += 10
    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.text(`Inversión estimada: ${formatearMoneda(datosCalculados.precioInversion)}`, 20, yPos)

    yPos += 10
    doc.setFontSize(11)
    doc.setTextColor(...accentColor)
    doc.text(`Ahorro mensual: ${formatearMoneda(datosCalculados.ahorroMensual)}`, 20, yPos)
    doc.text(`Ahorro anual: ${formatearMoneda(datosCalculados.ahorroAnual)}`, 110, yPos)

    yPos += 7
    doc.text(`Porcentaje de ahorro: ${formatearNumero(datosCalculados.ahorroAnualPorcentaje, 1)}%`, 20, yPos)

    // TIEMPO DE RETORNO - DESTACADO
    yPos += 20
    doc.setFillColor(255, 247, 237)
    doc.rect(15, yPos - 5, 180, 25, "F")

    doc.setTextColor(...primaryColor)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("⏰ TIEMPO DE RETORNO", 20, yPos + 5)

    doc.setFontSize(24)
    doc.text(`${formatearNumero(datosCalculados.tiempoRetorno, 1)} AÑOS`, 20, yPos + 15)

    // NUEVA SITUACIÓN CON SISTEMA SOLAR
    yPos += 35
    doc.setTextColor(...textColor)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("NUEVA SITUACIÓN CON SISTEMA SOLAR", 20, yPos)

    yPos += 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Nuevo consumo mensual: ${formatearNumero(datosCalculados.nuevoConsumoMensual, 0)} kWh`, 20, yPos)
    doc.text(`Nuevo costo mensual: ${formatearMoneda(datosCalculados.nuevoCostoMensualSFV)}`, 110, yPos)

    // FOOTER
    yPos = 280
    doc.setFillColor(...primaryColor)
    doc.rect(0, yPos, 210, 17, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text("Para más información, contáctanos al +593 98 091 0905", 20, yPos + 10)
    doc.text("¡Invierte en energía solar y ahorra desde el primer día!", 110, yPos + 10)

    // GUARDAR PDF
    const nombreArchivo = `Informe_Solar_${datosCalculados.nombre.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(nombreArchivo)

    mostrarNotificacion("✅ PDF generado exitosamente", "success")
  } catch (error) {
    console.error("Error generando PDF:", error)
    mostrarNotificacion("❌ Error al generar el PDF", "error")
  }
}

// 📱 FUNCIÓN PARA ABRIR WHATSAPP
function abrirWhatsApp() {
  const mensajeCodificado = encodeURIComponent(WHATSAPP_MESSAGE)
  const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`

  // Abrir en nueva ventana
  window.open(urlWhatsApp, "_blank")

  mostrarNotificacion("📱 Redirigiendo a WhatsApp...", "info")
}

function validarCelular(celular) {
  // Debe tener exactamente 12 dígitos y empezar con 593
  const regex = /^593\d{9}$/
  return regex.test(celular)
}

function validarEmail(email) {
  // Validación básica de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// 📤 FUNCIÓN PARA ENVIAR DATOS A POWER AUTOMATE
async function enviarDatosAPowerAutomate(datos) {
  try {
    const payload = {
      fechaCalculo: new Date().toISOString(),
      nombre: datos.nombre || "Prueba",
      tipoCliente: datos.tipoCliente || "Residencial",
      celular: datos.celular || "593999999999",
      email: datos.email || "prueba@test.com",
      ciudad: datos.ciudad || "Quito",
      consumoMensual: datos.consumo || 0,
      ahorroAnual: datos.ahorroAnual || 0,
      tiempoRetorno: datos.tiempoRetorno || 0,
      timestampPrueba: Date.now(),
    }

    mostrarNotificacion("📤 Guardando cotización...", "info")

    fetch(POWER_AUTOMATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (response.ok) {
          mostrarNotificacion("✅ Cotización guardada exitosamente", "success")
        } else {
          mostrarNotificacion("⚠️ Error al guardar cotización", "error")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        mostrarNotificacion("⚠️ Error de conexión al guardar", "error")
      })
  } catch (error) {
    console.error("Error general:", error)
    mostrarNotificacion("❌ Error general en el proceso", "error")
  }
}

// 🔔 FUNCIÓN PARA MOSTRAR NOTIFICACIONES
function mostrarNotificacion(mensaje, tipo) {
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion notificacion-${tipo}`
  notificacion.innerHTML = `
    <div class="notificacion-content">
      <span>${mensaje}</span>
      <button class="notificacion-close">&times;</button>
    </div>
  `

  document.body.appendChild(notificacion)

  setTimeout(() => {
    if (notificacion.parentNode) {
      notificacion.parentNode.removeChild(notificacion)
    }
  }, 5000)

  notificacion.querySelector(".notificacion-close").addEventListener("click", () => {
    if (notificacion.parentNode) {
      notificacion.parentNode.removeChild(notificacion)
    }
  })
}

function calcularCostoProgresivo(consumo) {
  if (consumo <= 0) return 0
  if (consumo < 50) return 0

  for (let i = 0; i < TARIFAS_EXACTAS.length; i++) {
    const tramo = TARIFAS_EXACTAS[i]
    if (consumo >= tramo.desde && consumo <= tramo.hasta) {
      let costoTotal = 0
      let rangoAnterior = 0

      if (tramo.desde === 50) {
        costoTotal = consumo * tramo.tarifa
      } else if (tramo.desde === 100) {
        rangoAnterior = 50
        const consumoEnRango = consumo - rangoAnterior
        costoTotal = consumoEnRango * tramo.tarifa + tramo.costoBase
      } else if (tramo.desde === 150) {
        rangoAnterior = 100
        const consumoEnRango = consumo - rangoAnterior
        costoTotal = consumoEnRango * tramo.tarifa + tramo.costoBase
      } else if (tramo.desde === 200) {
        rangoAnterior = 150
        const consumoEnRango = consumo - rangoAnterior
        costoTotal = consumoEnRango * tramo.tarifa + tramo.costoBase
      } else if (tramo.desde === 250) {
        rangoAnterior = 200
        const consumoEnRango = consumo - rangoAnterior
        costoTotal = consumoEnRango * tramo.tarifa + tramo.costoBase
      } else if (tramo.desde === 300) {
        rangoAnterior = 250
        const consumoEnRango = consumo - rangoAnterior
        costoTotal = consumoEnRango * tramo.tarifa + tramo.costoBase
      } else if (tramo.desde === 350) {
        rangoAnterior = 300
        const consumoEnRango = consumo - rangoAnterior
        costoTotal = consumoEnRango * tramo.tarifa + tramo.costoBase
      } else if (tramo.desde === 405) {
        rangoAnterior = 350
        const consumoEnRango = consumo - rangoAnterior
        costoTotal = consumoEnRango * tramo.tarifa + tramo.costoBase
      } else {
        const consumoEnRango = consumo - tramo.desde
        costoTotal = tramo.costoBase + consumoEnRango * tramo.tarifa
      }

      return costoTotal
    }
  }

  return 0
}

function validarFormulario() {
  const errores = []

  if (!elementos.nombre.value.trim()) {
    errores.push("El nombre del cliente es obligatorio")
  }

  if (!elementos.tipoCliente.value) {
    errores.push("Debe seleccionar el tipo de cliente")
  }

  const celular = elementos.celular.value.trim()
  if (!celular) {
    errores.push("El número celular es obligatorio")
  } else if (!validarCelular(celular)) {
    errores.push("El número celular debe tener 12 dígitos y empezar con 593 (ej: 593987654321)")
  }

  const email = elementos.email.value.trim()
  if (!email) {
    errores.push("El correo electrónico es obligatorio")
  } else if (!validarEmail(email)) {
    errores.push("El correo electrónico no tiene un formato válido")
  }

  if (!elementos.ciudad.value.trim()) {
    errores.push("La ciudad es obligatoria")
  }

  const consumo = Number.parseFloat(elementos.consumoMensual.value)
  if (!elementos.consumoMensual.value || isNaN(consumo) || consumo <= 0) {
    errores.push("El consumo mensual debe ser mayor a 0")
  }

  if (errores.length > 0) {
    mostrarErrores(errores)
    return false
  } else {
    ocultarErrores()
    return true
  }
}

function mostrarErrores(errores) {
  elementos.errorList.innerHTML = ""
  errores.forEach((error) => {
    const li = document.createElement("li")
    li.textContent = error
    elementos.errorList.appendChild(li)
  })
  elementos.errorAlert.style.display = "block"
  elementos.errorAlert.scrollIntoView({ behavior: "smooth", block: "center" })
}

function ocultarErrores() {
  elementos.errorAlert.style.display = "none"
}

async function calcularAhorro() {
  if (!validarFormulario()) return

  const nombre = elementos.nombre.value.trim()
  const tipoCliente = elementos.tipoCliente.value
  const celular = elementos.celular.value.trim()
  const email = elementos.email.value.trim()
  const ciudad = elementos.ciudad.value.trim()
  const consumo = Number.parseFloat(elementos.consumoMensual.value)

  // Cálculos
  const costoMensualSinSFV = calcularCostoProgresivo(consumo)
  const consumoAnualSinSFV = consumo * 12
  const costoAnualSinSFV = costoMensualSinSFV * 12
  const tamanoSFV = (consumoAnualSinSFV / 18000) * 13.75
  const precioInversion = tamanoSFV * 1000 * 1.1
  const produccionAnualSFV = tamanoSFV * 1080
  const produccionMensualSFV = produccionAnualSFV / 12
  const nuevoConsumoMensual = Math.max(0, consumo - produccionMensualSFV)
  const nuevoCostoMensualSFV = calcularCostoProgresivo(nuevoConsumoMensual)
  const nuevoCostoAnualSFV = nuevoCostoMensualSFV * 12
  const ahorroAnual = costoAnualSinSFV - nuevoCostoAnualSFV
  const ahorroMensual = costoMensualSinSFV - nuevoCostoMensualSFV
  const ahorroAnualPorcentaje = costoAnualSinSFV > 0 ? (ahorroAnual / costoAnualSinSFV) * 100 : 0
  const tiempoRetorno = ahorroAnual > 0 ? precioInversion / ahorroAnual : 0
  const cantidadPaneles = Math.ceil((tamanoSFV * 1000) / 480)
  const areaRequerida = cantidadPaneles * 2.2

  // Guardar datos calculados globalmente
  datosCalculados = {
    nombre,
    tipoCliente,
    celular,
    email,
    ciudad,
    consumo,
    costoMensualSinSFV,
    tamanoSFV,
    precioInversion,
    consumoAnualSinSFV,
    costoAnualSinSFV,
    produccionAnualSFV,
    produccionMensualSFV,
    nuevoConsumoMensual,
    nuevoCostoMensualSFV,
    ahorroMensual,
    ahorroAnual,
    ahorroAnualPorcentaje,
    tiempoRetorno,
    cantidadPaneles,
    areaRequerida,
  }

  // Enviar datos a Power Automate
  await enviarDatosAPowerAutomate(datosCalculados)

  // Mostrar resultados
  mostrarResultados(datosCalculados)
}

function mostrarResultados(datos) {
  // Header de resultados con información del cliente
  elementos.clienteInfo.innerHTML = `
    <div style="margin-bottom: 0.5rem;">
      <strong>${datos.nombre}</strong> - Cliente ${datos.tipoCliente}
    </div>
    <div class="cliente-info-grid">
      <div class="cliente-info-item">
        <div class="cliente-info-label">Celular</div>
        <div class="cliente-info-value">${datos.celular}</div>
      </div>
      <div class="cliente-info-item">
        <div class="cliente-info-label">Email</div>
        <div class="cliente-info-value">${datos.email}</div>
      </div>
      <div class="cliente-info-item">
        <div class="cliente-info-label">Ciudad</div>
        <div class="cliente-info-value">${datos.ciudad}</div>
      </div>
    </div>
  `

  // Situación Actual
  elementos.consumoMensualDisplay.textContent = `${formatearNumero(datos.consumo, 0)} kWh`
  elementos.costoMensualSinSfv.textContent = formatearMoneda(datos.costoMensualSinSFV)
  elementos.consumoAnual.textContent = `${formatearNumero(datos.consumoAnualSinSFV, 0)} kWh`
  elementos.costoAnualSinSfv.textContent = formatearMoneda(datos.costoAnualSinSFV)

  // Sistema Fotovoltaico
  elementos.tamanoSfv.textContent = `${formatearNumero(datos.tamanoSFV)} kWp`
  elementos.precioInversion.textContent = formatearMoneda(datos.precioInversion)
  elementos.produccionAnual.textContent = `${formatearNumero(datos.produccionAnualSFV, 0)} kWh`
  elementos.produccionMensual.textContent = `${formatearNumero(datos.produccionMensualSFV, 0)} kWh`
  elementos.cantidadPaneles.textContent = `${datos.cantidadPaneles} unidades`
  elementos.areaRequerida.textContent = `${formatearNumero(datos.areaRequerida)} m²`

  // Con Sistema Solar
  elementos.nuevoConsumoMensual.textContent = `${formatearNumero(datos.nuevoConsumoMensual, 0)} kWh`
  elementos.nuevoCostoMensual.textContent = formatearMoneda(datos.nuevoCostoMensualSFV)
  elementos.ahorroMensual.textContent = formatearMoneda(datos.ahorroMensual)
  elementos.ahorroAnual.textContent = formatearMoneda(datos.ahorroAnual)
  elementos.ahorroporcentaje.textContent = `${formatearNumero(datos.ahorroAnualPorcentaje, 1)}%`

  // Tiempo de Retorno
  if (datos.tiempoRetorno > 0) {
    elementos.tiempoRetorno.textContent = `${formatearNumero(datos.tiempoRetorno, 1)} años`
    elementos.retornoDescription.innerHTML = `Tu inversión se recuperará en aproximadamente <strong>${datos.tiempoRetorno.toFixed(1)} años</strong>`
  } else {
    elementos.tiempoRetorno.textContent = "NA"
    elementos.retornoDescription.innerHTML = `<strong>No aplica</strong> - El sistema no genera suficiente ahorro`
  }

  // Métricas
  elementos.metricPorcentaje.textContent = `${formatearNumero(datos.ahorroAnualPorcentaje, 1)}%`
  elementos.metricAhorro.textContent = formatearMoneda(datos.ahorroAnual)
  elementos.metricArea.textContent = `${formatearNumero(datos.areaRequerida)} m²`

  // Mostrar sección de resultados
  elementos.resultados.style.display = "block"

  // Scroll suave a los resultados
  elementos.resultados.scrollIntoView({ behavior: "smooth", block: "start" })
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(valor)
}

function formatearNumero(valor, decimales = 2) {
  return new Intl.NumberFormat("es-EC", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor)
}
