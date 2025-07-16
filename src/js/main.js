/**
 * Main logic of the Event Management application
 */

// Sample data (simulated, ideally from an API)
const events = [
    {
        id: 1,
        title: "FRANQUICIAS DIGITALES4",
        description: "¡Descubre las mejores oportunidades de negocios en el mundo digital en nuestro evento FRANQUICIAS DIGITALES!",
        date: "2024-10-26",
        location: "Bogotá",
        maxAttendees: 200,
        price: 150,
        category: "conferencia",
    },
    {
        id: 2,
        title: "WEBCONGRESS COLOMBIA 2025",
        description: "Dates and Place are not yet confirmed. Stay tuned for the final info. Email camila@webcongress.com if you have questions Follow @webcongress",
        date: "2024-11-15",
        location: "Espacio Co-working Tech Hub",
        maxAttendees: 50,
        price: 80,
        category: "taller",
    },
    {
        id: 4,
        title: "Cybersecurity Bank & Government Colombia 2025",
        description: "Regresa a Bogotá el único evento de Ciberseguridad que reúne a la comunidad Cyber para Ejecutivos de los Bancos y Gobierno de Colombia",
        date: "2025-01-20",
        location: "Bogota Marriott Hotel",
        maxAttendees: 500,
        price: 0,
        category: "webinar",
    },
]

const attendees = [
    { id: 1, name: "Ana García", email: "ana@example.com" },
    { id: 2, name: "Luis Fernández", email: "luis@example.com" },
    { id: 3, name: "Sofía Pérez", email: "sofia@example.com" },
]

let registrations = [
    { id: 1, attendeeId: 1, eventId: 1, registrationDate: "2024-09-01T10:00:00Z" },
    { id: 2, attendeeId: 2, eventId: 1, registrationDate: "2024-09-05T11:30:00Z" },
    { id: 3, attendeeId: 2, eventId: 2, registrationDate: "2024-09-10T14:00:00Z" },
    { id: 4, attendeeId: 3, eventId: 3, registrationDate: "2024-09-15T09:00:00Z" },
]


const auth = window.auth

/**
 * Load home page (Dashboard)
 */
function loadHomePage() {
    console.log("Cargando página de inicio (Dashboard)...")

    // Update statistics
    document.getElementById("total-events").textContent = events.length
    document.getElementById("total-attendees").textContent = attendees.length
    document.getElementById("total-enrollments").textContent = registrations.length

    // Show recent events
    displayHomeEvents()
}

/**
 * Show events on the home page (dashboard)
 */
function displayHomeEvents() {
    const eventsList = document.getElementById("home-events-list")
    if (!eventsList) return

    eventsList.innerHTML = ""

    // Show the 3 closest events or the first 3 if there are no future dates
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const upcomingEvents = sortedEvents.filter((event) => new Date(event.date) >= new Date()).slice(0, 3)
    const eventsToShow = upcomingEvents.length > 0 ? upcomingEvents : sortedEvents.slice(0, 3)

    eventsToShow.forEach((event) => {
        const registeredCount = registrations.filter((r) => r.eventId === event.id).length
        const isRegistered =
            auth.isLoggedIn() &&
            registrations.some((r) => r.eventId === event.id && r.attendeeId === auth.getCurrentUser().id)
        const canRegister =
            !isRegistered && registeredCount < event.maxAttendees && auth.getCurrentUser()?.role === "attendee"

        const eventDiv = document.createElement("div")
        eventDiv.className = "event-card"
        eventDiv.innerHTML = `
      <div class="event-header">
        <h3 class="event-title">${event.title}</h3>
        <span class="event-category">${event.category}</span>
      </div>
      <div class="event-body">
        <p class="event-description">${event.description}</p>
        <div class="event-meta">
          <div class="event-date">
            <i class="fas fa-calendar-alt"></i>
            <span>${event.date}</span>
          </div>
          <div class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${event.location}</span>
          </div>
          <div class="event-capacity">
            <i class="fas fa-users"></i>
            <span>${registeredCount}/${event.maxAttendees}</span>
          </div>
        </div>
        <div class="event-price">$${event.price}</div>
        <div class="event-actions">
          ${auth.isAdmin()
                ? `
            <button class="btn-edit" onclick="editEvent(${event.id})">Editar</button>
            <button class="btn-delete" onclick="deleteEvent(${event.id})">Eliminar</button>
          `
                : `
            ${canRegister
                    ? `<button class="btn-register" onclick="registerForEvent(${event.id})">Registrarse</button>`
                    : isRegistered
                        ? `<button class="btn-primary" disabled>Registrado</button>`
                        : `<button class="btn-secondary" disabled>Sin cupo</button>`
                }
          `
            }
        </div>
      </div>
    `
        eventsList.appendChild(eventDiv)
    })
}

/**
 * Load events page
 */
function loadEventsPage() {
    console.log("Cargando página de eventos...")
    displayEvents(events)
    populateEventFilters()
}

/**
 * Show events in the main events list
 */
function displayEvents(eventsToShow) {
    const eventsList = document.getElementById("events-list")
    const noEvents = document.getElementById("no-events")
    const eventsCountSpan = document.getElementById("events-count")

    if (!eventsList) return

    if (eventsToShow.length === 0) {
        eventsList.innerHTML = ""
        if (noEvents) noEvents.classList.remove("hidden")
        if (eventsCountSpan) eventsCountSpan.textContent = "0 eventos encontrados"
        return
    }

    if (noEvents) noEvents.classList.add("hidden")
    eventsList.innerHTML = ""
    if (eventsCountSpan) eventsCountSpan.textContent = `${eventsToShow.length} eventos encontrados`

    eventsToShow.forEach((event) => {
        const registeredCount = registrations.filter((r) => r.eventId === event.id).length
        const isRegistered =
            auth.isLoggedIn() &&
            registrations.some((r) => r.eventId === event.id && r.attendeeId === auth.getCurrentUser().id)
        const canRegister =
            !isRegistered && registeredCount < event.maxAttendees && auth.getCurrentUser()?.role === "attendee"

        const eventDiv = document.createElement("div")
        eventDiv.className = "event-card"
        eventDiv.innerHTML = `
      <div class="event-header">
        <h3 class="event-title">${event.title}</h3>
        <span class="event-category">${event.category}</span>
      </div>
      <div class="event-body">
        <p class="event-description">${event.description}</p>
        <div class="event-meta">
          <div class="event-date">
            <i class="fas fa-calendar-alt"></i>
            <span>${event.date}</span>
          </div>
          <div class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${event.location}</span>
          </div>
          <div class="event-capacity">
            <i class="fas fa-users"></i>
            <span>${registeredCount}/${event.maxAttendees}</span>
          </div>
        </div>
        <div class="event-price">$${event.price}</div>
        <div class="event-actions">
          ${auth.isAdmin()
                ? `
              <button class="btn-edit" onclick="editEvent(${event.id})">Editar</button>
              <button class="btn-delete" onclick="deleteEvent(${event.id})">Eliminar</button>
            `
                : `
              ${canRegister
                    ? `<button class="btn-register" onclick="registerForEvent(${event.id})">Registrarse</button>`
                    : isRegistered
                        ? `<button class="btn-primary" disabled>Registrado</button>`
                        : `<button class="btn-secondary" disabled>Sin cupo</button>`
                }
            `
            }
        </div>
      </div>
    `
        eventsList.appendChild(eventDiv)
    })
}

/**
 * Fill in the event filters
 */
function populateEventFilters() {
    const categoryFilter = document.getElementById("category-filter")
    const priceFilter = document.getElementById("price-filter")
    const availableSpotsFilter = document.getElementById("available-spots-filter")

    // Reset filters on page load
    if (categoryFilter) categoryFilter.value = ""
    if (priceFilter) priceFilter.value = ""
    if (availableSpotsFilter) availableSpotsFilter.value = ""
}

/**
 * Filter events by search term, category, price, and availability
 */
function filterEvents() {
    const searchTerm = document.getElementById("search-events").value.toLowerCase()
    const category = document.getElementById("category-filter").value
    const priceRange = document.getElementById("price-filter").value
    const availableSpots = document.getElementById("available-spots-filter")?.value // Puede no existir para asistentes

    const filtered = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm)

        const matchesCategory = category === "" || event.category === category

        const matchesPrice =
            priceRange === "" ||
            (priceRange === "0-50" && event.price >= 0 && event.price <= 50) ||
            (priceRange === "50-150" && event.price > 50 && event.price <= 150) ||
            (priceRange === "150+" && event.price > 150)

        const registeredCount = registrations.filter((r) => r.eventId === event.id).length
        const spotsLeft = event.maxAttendees - registeredCount
        const matchesAvailableSpots =
            !auth.isAdmin() ||
            availableSpots === "" ||
            (availableSpots === "yes" && spotsLeft > 0) ||
            (availableSpots === "no" && spotsLeft <= 0)

        return matchesSearch && matchesCategory && matchesPrice && matchesAvailableSpots
    })

    displayEvents(filtered)
}

/**
 * Configure event listeners specific to the event page.
 * Called by the router after loading the page HTML.
 */
function setupEventsPageListeners() {
    const eventForm = document.getElementById("event-form")
    if (eventForm) {
        eventForm.addEventListener("submit", (e) => {
            e.preventDefault()
            addEvent()
        })
    }

    const searchEventsInput = document.getElementById("search-events")
    if (searchEventsInput) {
        searchEventsInput.addEventListener("keyup", filterEvents)
    }

    const categoryFilter = document.getElementById("category-filter")
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterEvents)
    }

    const priceFilter = document.getElementById("price-filter")
    if (priceFilter) {
        priceFilter.addEventListener("change", filterEvents)
    }

    const availableSpotsFilter = document.getElementById("available-spots-filter")
    if (availableSpotsFilter) {
        availableSpotsFilter.addEventListener("change", filterEvents)
    }


    const closeModalBtn = document.querySelector("#add-event-modal .btn-secondary")
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", hideAddEventForm)
    }
}

/**
 * Display add/edit event form
 */
function showAddEventForm(eventId = null) {
    const modal = document.getElementById("add-event-modal")
    const form = document.getElementById("event-form")
    const modalTitle = modal.querySelector("h2")

    if (eventId) {
        const event = events.find((e) => e.id === eventId)
        if (event) {
            modalTitle.textContent = "Editar Evento"
            document.getElementById("event-title").value = event.title
            document.getElementById("event-description").value = event.description
            document.getElementById("event-date").value = event.date
            document.getElementById("event-location").value = event.location
            document.getElementById("event-max-attendees").value = event.maxAttendees
            document.getElementById("event-price").value = event.price
            form.dataset.eventId = eventId
        }
    } else {
        modalTitle.textContent = "Nuevo Evento"
        form.reset()
        delete form.dataset.eventId
    }
    modal.classList.remove("hidden")
}

/**
 * Hide add/edit event form
 */
function hideAddEventForm() {
    document.getElementById("add-event-modal").classList.add("hidden")
    document.getElementById("event-form").reset()
    delete document.getElementById("event-form").dataset.eventId
}

/**
 * Add or update event
 */
function addEvent() {
    const form = document.getElementById("event-form")
    const eventId = form.dataset.eventId

    const title = document.getElementById("event-title").value
    const description = document.getElementById("event-description").value
    const date = document.getElementById("event-date").value
    const location = document.getElementById("event-location").value
    const maxAttendees = Number.parseInt(document.getElementById("event-max-attendees").value)
    const price = Number.parseFloat(document.getElementById("event-price").value)

    // Validations
    if (!title || !description || !date || !location || isNaN(maxAttendees) || isNaN(price)) {
        alert("Por favor completa todos los campos del evento correctamente.")
        return
    }
    if (maxAttendees <= 0) {
        alert("La capacidad máxima de asistentes debe ser un número positivo.")
        return
    }
    if (price < 0) {
        alert("El precio no puede ser negativo.")
        return
    }

    if (eventId) {
        // Edit existing event
        const eventIndex = events.findIndex((e) => e.id === Number(eventId))
        if (eventIndex > -1) {
            events[eventIndex] = {
                ...events[eventIndex],
                title,
                description,
                date,
                location,
                maxAttendees,
                price,
            }
            alert("Evento actualizado exitosamente")
        }
    } else {
        // Add new event
        const newEvent = {
            id: events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1,
            title,
            description,
            date,
            location,
            maxAttendees,
            price,
            category: "conferencia",
        }
        events.push(newEvent)
        alert("Evento agregado exitosamente")
    }

    displayEvents(events)
    hideAddEventForm()
}

/**
 * Edit event
 */
function editEvent(eventId) {
    showAddEventForm(eventId)
}

/**
 * Delete event
 */
function deleteEvent(eventId) {
    if (confirm("¿Estás seguro de eliminar este evento? Esto también eliminará todos sus registros.")) {
        const index = events.findIndex((e) => e.id === eventId)
        if (index > -1) {
            events.splice(index, 1)
            // También eliminar registros asociados a este evento
            const initialRegistrationsLength = registrations.length
            registrations = registrations.filter((r) => r.eventId !== eventId)
            if (registrations.length < initialRegistrationsLength) {
                console.log(
                    `Eliminados ${initialRegistrationsLength - registrations.length} registros para el evento ${eventId}.`,
                )
            }
            displayEvents(events)
            alert("Evento eliminado")
        }
    }
}

/**
 * Register for the event
 */
function registerForEvent(eventId) {
    if (!auth.isLoggedIn()) {
        alert("Debes iniciar sesión para registrarte en un evento.")
        window.router.navigate("login")
        return
    }
    if (auth.isAdmin()) {
        alert("Los organizadores no pueden registrarse en eventos.")
        return
    }

    const event = events.find((e) => e.id === eventId)
    const currentUser = auth.getCurrentUser()

    if (!event || !currentUser) return

    const alreadyRegistered = registrations.some((r) => r.attendeeId === currentUser.id && r.eventId === event.id)
    if (alreadyRegistered) {
        alert("Ya estás registrado en este evento.")
        return
    }

    const currentAttendees = registrations.filter((r) => r.eventId === event.id).length
    if (currentAttendees >= event.maxAttendees) {
        alert("Este evento ya no tiene cupo disponible.")
        return
    }

    if (confirm(`¿Quieres registrarte en: ${event.title}?`)) {
        const newRegistration = {
            id: registrations.length > 0 ? Math.max(...registrations.map((r) => r.id)) + 1 : 1,
            attendeeId: currentUser.id,
            eventId: event.id,
            registrationDate: new Date().toISOString(),
        }
        registrations.push(newRegistration)
        alert(`Te has registrado en: ${event.title}`)
        // Update the event view to reflect the status change
        displayEvents(events)
    }
}

/**
 * Load attendees page
 */
function loadAttendeesPage() {
    console.log("Cargando página de asistentes...")
    displayAttendees(attendees)
    populateAttendeeFilters()
    updateAttendeeStats()
}

/**
 * Show attendees
 */
function displayAttendees(attendeesToShow) {
    const attendeesList = document.getElementById("attendees-list")
    const noAttendees = document.getElementById("no-attendees")

    if (!attendeesList) return

    if (attendeesToShow.length === 0) {
        attendeesList.innerHTML = ""
        if (noAttendees) noAttendees.classList.remove("hidden")
        return
    }

    if (noAttendees) noAttendees.classList.add("hidden")
    attendeesList.innerHTML = ""

    attendeesToShow.forEach((attendee) => {
        const attendeeRegistrations = registrations.filter((r) => r.attendeeId === attendee.id)
        const registeredEventTitles = attendeeRegistrations.map((r) => {
            const event = events.find((e) => e.id === r.eventId)
            return event ? event.title : "Evento desconocido"
        })

        const attendeeDiv = document.createElement("div")
        attendeeDiv.className = "attendee-card"
        attendeeDiv.innerHTML = `
      <h3>${attendee.name}</h3>
      <p><strong>Email:</strong> ${attendee.email}</p>
      <p><strong>Eventos Registrados:</strong> ${registeredEventTitles.join(", ")}</p>
      <p><strong>Total Eventos:</strong> ${registeredEventTitles.length}</p>
    `
        attendeesList.appendChild(attendeeDiv)
    })
}

/**
 * Fill in the attendee filters
 */
function populateAttendeeFilters() {
    const eventFilterSelect = document.getElementById("event-filter")
    if (eventFilterSelect) {
        eventFilterSelect.innerHTML = '<option value="">Todos los eventos</option>'
        events.forEach((event) => {
            eventFilterSelect.innerHTML += `<option value="${event.id}">${event.title}</option>`
        })
    }
    // Reset other filters if they existn
    const statusFilter = document.getElementById("status-filter")
    if (statusFilter) statusFilter.value = ""
}

/**
 * Update attendee statistics on the attendees page.
 */
function updateAttendeeStats() {
    const totalUniqueAttendees = new Set(registrations.map((r) => r.attendeeId)).size
    const totalRegistrationsCount = registrations.length
    const avgRegistrations = totalUniqueAttendees > 0 ? (totalRegistrationsCount / totalUniqueAttendees).toFixed(1) : 0

    document.getElementById("total-unique-attendees").textContent = totalUniqueAttendees
    document.getElementById("total-registrations-count").textContent = totalRegistrationsCount
    document.getElementById("avg-registrations").textContent = avgRegistrations
}

/**
 * Filtra asistentes por término de búsqueda y evento
 */
function filterAttendees() {
    const searchTerm = document.getElementById("search-attendees").value.toLowerCase()
    const eventId = document.getElementById("event-filter").value

    const filtered = attendees.filter((attendee) => {
        const matchesSearch =
            attendee.name.toLowerCase().includes(searchTerm) || attendee.email.toLowerCase().includes(searchTerm)

        const matchesEvent =
            eventId === "" || registrations.some((r) => r.attendeeId === attendee.id && r.eventId === Number(eventId))

        return matchesSearch && matchesEvent
    })

    displayAttendees(filtered)
}

/**
 * Called by the router after loading the HTML page.
 * Called by the router after loading the page HTML.
 */
function setupAttendeesPageListeners() {
    const searchAttendeesInput = document.getElementById("search-attendees")
    if (searchAttendeesInput) {
        searchAttendeesInput.addEventListener("keyup", filterAttendees)
    }
    const eventFilter = document.getElementById("event-filter")
    if (eventFilter) {
        eventFilter.addEventListener("change", filterAttendees)
    }
}

// Exposing global functions to HTML
window.loadHomePage = loadHomePage
window.loadEventsPage = loadEventsPage
window.loadAttendeesPage = loadAttendeesPage
window.filterEvents = filterEvents
window.showAddEventForm = showAddEventForm
window.hideAddEventForm = hideAddEventForm
window.addEvent = addEvent
window.editEvent = editEvent
window.deleteEvent = deleteEvent
window.registerForEvent = registerForEvent
window.filterAttendees = filterAttendees
window.setupEventsPageListeners = setupEventsPageListeners
window.setupAttendeesPageListeners = setupAttendeesPageListeners

// Initialize the application when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("Aplicación: Inicializando...")
    // The router handles initial navigation
    console.log("Aplicación: Inicializada correctamente")
})
