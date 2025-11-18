document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------
  // HELPER FUNCTIONS
  // ------------------------------
  const getStudents = () => JSON.parse(localStorage.getItem("students")) || [];
  const setStudents = (data) =>
    localStorage.setItem("students", JSON.stringify(data));

  const showPage = (pageId) => {
    document
      .querySelectorAll("section")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById(pageId + "-page").classList.add("active");
    if (pageId === "dashboard") renderDashboard();
    if (pageId === "student-list") renderStudentList();
  };

  // ------------------------------
  // DATETIME
  // ------------------------------
  const datetime = document.getElementById("datetime");
  if (datetime)
    setInterval(
      () => (datetime.textContent = new Date().toLocaleString()),
      1000
    );

  // ------------------------------
  // DASHBOARD
  // ------------------------------
  const renderDashboard = () => {
    const statsDiv = document.getElementById("stats");
    const students = getStudents();
    const allergyCount = students.filter(
      (s) => s.allergies && s.allergies.trim() !== ""
    ).length;

    statsDiv.innerHTML = `
      <div class="card">
        <h3>Total Students</h3>
        <p>${students.length}</p>
      </div>
      <div class="card">
        <h3>Students with Allergies</h3>
        <p>${allergyCount}</p>
      </div>
    `;
  };

  // ------------------------------
  // ADD STUDENT FORM
  // ------------------------------
  const addForm = document.getElementById("addStudentForm");
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newStudent = {
        studentLRN: addForm.studentLRN.value.trim(),
        name: addForm.name.value.trim(),
        class: addForm.class.value.trim(),
        dob: addForm.dob.value,
        address: addForm.address.value.trim(),
        parentContact: addForm.parentContact.value.trim(),
        emergencyContact: addForm.emergencyContact.value.trim(),
        height: addForm.height.value.trim(),
        weight: addForm.weight.value.trim(),
        blood: addForm.blood.value.trim(),
        pastIllnesses: addForm.pastIllnesses.value.trim(),
        allergies: addForm.allergies.value.trim(),
        conditions: addForm.conditions.value.trim(),
        vaccination: addForm.vaccination.value.trim(),
      };
      const students = getStudents();
      students.push(newStudent);
      setStudents(students);
      alert("Student added successfully!");
      addForm.reset();
      showPage("student-list");
    });
  }

  // ------------------------------
  // STUDENT LIST
  // ------------------------------
  const renderStudentList = () => {
    const table = document.getElementById("studentTable");
    const tbody = table.querySelector("tbody");
    const students = getStudents();

    tbody.innerHTML = students
      .map(
        (s, i) => `
      <tr>
        <td>${s.studentLRN}</td>
        <td>${s.name}</td>
        <td>${s.class}</td>
        <td>
          <button onclick="viewStudent(${i})" class="btn-small">View</button>
          <button onclick="deleteStudent(${i})" class="btn-small btn-danger">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  };

  // ------------------------------
  // VIEW STUDENT HEALTH
  // ------------------------------
  window.viewStudent = (index) => {
    const student = getStudents()[index];
    if (!student) return;
    const healthDiv = document.getElementById("healthDetails");
    healthDiv.innerHTML = `
      <h3>${student.name} (${student.class})</h3>
      <p><b>LRN:</b> ${student.studentLRN}</p>
      <p><b>DOB:</b> ${student.dob}</p>
      <p><b>Address:</b> ${student.address}</p>
      <p><b>Parent Contact:</b> ${student.parentContact}</p>
      <p><b>Emergency Contact:</b> ${student.emergencyContact}</p>
      <p><b>Height:</b> ${student.height}</p>
      <p><b>Weight:</b> ${student.weight}</p>
      <p><b>Blood Group:</b> ${student.blood}</p>
      <p><b>Past Illnesses:</b> ${student.pastIllnesses}</p>
      <p><b>Allergies:</b> ${student.allergies}</p>
      <p><b>Pre-existing Conditions:</b> ${student.conditions}</p>
      <p><b>Vaccination Status:</b> ${student.vaccination}</p>
    `;
    showPage("student-health");
  };

  // ------------------------------
  // DELETE STUDENT
  // ------------------------------
  window.deleteStudent = (index) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const students = getStudents();
    students.splice(index, 1);
    setStudents(students);
    renderStudentList();
  };

  // ------------------------------
  // GLOBAL FUNCTIONS
  // ------------------------------
  window.logout = () => {
    sessionStorage.clear();
    alert("Logged out!");
    // Optional: hide everything or reload page
  };
  window.goTo = showPage;

  // Initial load
  renderDashboard();
});
