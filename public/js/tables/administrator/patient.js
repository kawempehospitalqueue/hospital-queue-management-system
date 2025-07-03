document.addEventListener("DOMContentLoaded", () => {
  const data = allPatients;

  let rowsPerPage = parseInt(document.getElementById("entriesPerPage").value);
  let currentPage = 1;
  const tableBody = document.querySelector("#dataTable tbody");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput");
  const entriesPerPageSelect = document.getElementById("entriesPerPage");
  const noResultsMessage = document.getElementById("noResultsMessage");

  let deleteForm; // To store the form to be submitted

  // Modal elements
  const deleteModal = document.getElementById("deleteModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  function renderTable(data, page = 1) {
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    if (paginatedData.length > 0) {
      paginatedData.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.patientNumber}</td>
          <td>${item.patientName}</td>
          <td>${item.phoneNumber}</td>
          <td>${new Date(item.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
          <td>${item.recievedBy.userName} (${item.recievedBy.role})</td>
          <td>${item.assignedTo}</td>
          <td>
            <div class="status-badge" style="color: ${item.patientCalled ? "#4aae48" : "#fba608"};">
              ${item.patientCalled ? "called" : "waiting"}
            </div>
          </td>
          <td>
            <div class="table-actions">
              <a class="action-btn view-btn" href="/view-patient/${item._id}"><i class="bi bi-eye"></i></a>
              <form method="POST" action="/delete-patient">
                <input type="hidden" name="id" value=${item._id}>
                <button class="action-btn del-btn" type="button"><i class="bi bi-trash"></i></button>
              </form>
            </div>
          </td>
        `;

        // Add event listener for delete button
        const delBtn = row.querySelector(".del-btn");
        const form = row.querySelector("form");

        delBtn.addEventListener("click", (e) => {
          e.preventDefault();
          deleteForm = form; // Store the form for submission after confirmation
          openDeleteModal(); // Open the confirmation modal
        });

        tableBody.appendChild(row);
      });
      noResultsMessage.style.display = "none";
    } else {
      noResultsMessage.style.display = "block";
    }

    renderPagination(data.length, page);
  }

  function renderPagination(totalItems, currentPage) {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("span");
      btn.className = `pagination-btn ${i === currentPage ? "active" : ""}`;
      btn.innerText = i;
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable(data, currentPage);
      });
      pagination.appendChild(btn);
    }
  }

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = data.filter(
      (item) =>
        item.patientNumber.toLowerCase().includes(searchTerm) ||
        item.patientName.toLowerCase().includes(searchTerm) ||
        item.phoneNumber.toLowerCase().includes(searchTerm) 
    );
    renderTable(filteredData, 1);
  });

  entriesPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(entriesPerPageSelect.value);
    renderTable(data, 1);
  });

  renderTable(data);

  // Modal functionality
  function openDeleteModal() {
    deleteModal.style.display = "block"; // Show modal
  }

  function closeDeleteModal() {
    deleteModal.style.display = "none"; // Hide modal
  }

  // Confirm delete action
  confirmDeleteBtn.addEventListener("click", () => {
    if (deleteForm) {
      deleteForm.submit(); // Submit the form if confirmed
    }
    closeDeleteModal();
  });

  // Cancel delete action
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  // Close modal if clicked outside of it
  window.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
  });
});
