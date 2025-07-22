// 📤 FUNCIÓN PARA ENVIAR DATOS A POWER AUTOMATE (SIN ESPERAR RESPUESTA)
async function enviarDatosAPowerAutomate(datos) {
  try {
    console.log("📤 Enviando datos a Power Automate...")

    const payload = {
      // Información del Cliente
      fechaCalculo: new Date().toISOString(),
      nombre: datos.nombre,
      tipoCliente: datos.tipoCliente,
      celular: datos.celular,
      email: datos.email,
      ciudad: datos.ciudad,

      // Datos de Consumo
      consumoMensual: datos.consumo,
      consumoAnual: datos.consumoAnualSinSFV,
      costoMensualActual: datos.costoMensualSinSFV,
      costoAnualActual: datos.costoAnualSinSFV,

      // Sistema Fotovoltaico
      tamanoSistema: datos.tamanoSFV,
      precioInversion: datos.precioInversion,
      produccionAnual: datos.produccionAnualSFV,
      produccionMensual: datos.produccionMensualSFV,
      cantidadPaneles: datos.cantidadPaneles,
      areaRequerida: datos.areaRequerida,

      // Ahorros
      nuevoConsumoMensual: datos.nuevoConsumoMensual,
      nuevoCostoMensual: datos.nuevoCostoMensualSFV,
      ahorroMensual: datos.ahorroMensual,
      ahorroAnual: datos.ahorroAnual,
      ahorroAnualPorcentaje: datos.ahorroAnualPorcentaje,
      tiempoRetorno: datos.tiempoRetorno,
    }

    const POWER_AUTOMATE_URL = "https://your-power-automate-url.com" // Declare POWER_AUTOMATE_URL here
    const mostrarNotificacion = (message, type) => {
      // Implement mostrarNotificacion function here
      console.log(`Notification: ${message} (${type})`)
    }

    // 🚀 ENVÍO SIN ESPERAR RESPUESTA
    fetch(POWER_AUTOMATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        console.log("✅ Datos enviados a Power Automate")
        mostrarNotificacion("✅ Cotización guardada exitosamente", "success")
      })
      .catch((error) => {
        console.error("❌ Error al enviar datos:", error)
        mostrarNotificacion("⚠️ Error al guardar cotización", "error")
      })

    // 🎯 MOSTRAR NOTIFICACIÓN INMEDIATA (sin esperar confirmación)
    mostrarNotificacion("📤 Guardando cotización...", "info")
  } catch (error) {
    console.error("❌ Error de conexión:", error)
    mostrarNotificacion("⚠️ Error de conexión al guardar", "error")
  }
}
