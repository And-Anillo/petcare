document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/pet";

    // DOM elements
    const petsContainer = document.getElementById("pets-container");
    const addPetBtn = document.getElementById("add-pet-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const cancelPetFormBtn = document.getElementById("cancel-pet-form");
    const petFormModal = document.getElementById("pet-form-modal");
    const petForm = document.getElementById("pet-form");

    const petNameInput = document.getElementById("pet-name");
    const petTypeInput = document.getElementById("pet-type");
    const petAgeInput = document.getElementById("pet-age");
    const petImageInput = document.getElementById("pet-image");

    let editPetId = null; // Stores the ID when editing a pet

    // Show the modal form
    const openForm = () => {
        petFormModal.classList.remove("hidden");
        petFormModal.style.display = "flex";
    };

    // Hide and reset the modal form
    const closeForm = () => {
        petFormModal.classList.add("hidden");
        petFormModal.style.display = "none";
        petForm.reset();
        editPetId = null;
    };

    // Handle "Add Pet" button
    addPetBtn.addEventListener("click", () => {
        petForm.reset();
        editPetId = null;
        openForm();
    });

    // Handle "Cancel" button
    cancelPetFormBtn.addEventListener("click", () => {
        closeForm();
    });

    // Handle form submission (create or update)
    petForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const petData = {
            name: petNameInput.value.trim(),
            type: petTypeInput.value.trim(),
            age: parseInt(petAgeInput.value),
            image: petImageInput.value.trim() || "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg"
        };

        // Basic form validation
        if (!petData.name || !petData.type || isNaN(petData.age) || petData.age < 0) {
            alert("Please fill in all fields correctly.");
            return;
        }

        try {
            const url = editPetId ? `${API_URL}/${editPetId}` : API_URL;
            const method = editPetId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(petData)
            });

            if (!response.ok) throw new Error("Failed to save pet.");

            closeForm();   // Hide form after saving
            loadPets();    // Refresh pet list
        } catch (err) {
            alert("An error occurred while saving the pet.");
        }
    });

    // Fetch and display pets from the server
    async function loadPets() {
        try {
            const response = await fetch(API_URL);
            const pets = await response.json();

            petsContainer.innerHTML = ""; // Clear container

            if (pets.length === 0) {
                petsContainer.innerHTML = "<p>No pets registered.</p>";
                return;
            }

            pets.forEach((pet) => {
                const card = document.createElement("div");
                card.classList.add("pet-card");
                card.innerHTML = `
          <img src="${pet.image}" alt="Pet image" />
          <h3>${pet.name}</h3>
          <p><strong>Type:</strong> ${pet.type}</p>
          <p><strong>Age:</strong> ${pet.age} years</p>
          <div class="card-buttons">
            <button class="edit-btn" data-id="${pet.id}">Edit</button>
            <button class="delete-btn" data-id="${pet.id}">Delete</button>
          </div>
        `;
                petsContainer.appendChild(card);
            });
        } catch (err) {
            petsContainer.innerHTML = "<p>Error loading pets.</p>";
        }
    }

    // Handle Edit and Delete button clicks
    petsContainer.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        // Delete pet
        if (e.target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this pet?")) {
                try {
                    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                    loadPets();
                } catch {
                    alert("Failed to delete the pet.");
                }
            }
        }

        // Edit pet
        if (e.target.classList.contains("edit-btn")) {
            try {
                const res = await fetch(`${API_URL}/${id}`);
                const pet = await res.json();

                // Fill form with current pet data
                petNameInput.value = pet.name;
                petTypeInput.value = pet.type;
                petAgeInput.value = pet.age;
                petImageInput.value = pet.image;

                editPetId = pet.id;
                openForm();
            } catch {
                alert("Failed to load pet data.");
            }
        }
    });

    // Handle logout button
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../views/login.html";
    });

    // Show dashboard and load pets on page load
    document.getElementById("dashboard").classList.remove("hidden");
    loadPets();
});
