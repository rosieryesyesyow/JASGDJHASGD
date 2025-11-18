document.addEventListener("DOMContentLoaded", () => {
  // Helper Functions

  const getStudents = () => JSON.parse(localStorage.getItem("students")) || [];
  const setStudents = (data) =>
    localStorage.setItem("students", JSON.stringify(data));

  const getTeachers = () => JSON.parse(localStorage.getItem("teachers")) || [];
  const setTeachers = (data) =>
    localStorage.setItem("teachers", JSON.stringify(data));

  // LOGIN FORM

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid credentials. Try admin / admin123");
      }
    });
  }

  // Redirect to login if accessing dashboard without login
  if (
    window.location.pathname.includes("dashboard") &&
    sessionStorage.getItem("isLoggedIn") !== "true"
  ) {
    window.location.href = "index.html";
  }

  // DASHBOARD STATS

  const statsDiv = document.getElementById("stats");
  if (statsDiv) {
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
        <h3>Students with Health Conditions</h3>
        <p>${allergyCount}</p>
      </div>
    `;
  }

  const statsDiv1 = document.getElementById("stats1");
  if (statsDiv1) {
    const teachers = getTeachers();
    const allergyCount = teachers.filter(
      (t) => t.allergies && t.allergies.trim() !== ""
    ).length;

    statsDiv1.innerHTML = `
       <div class="card">
         <h3>Total Teachers</h3>
         <p>${teachers.length}</p>
       </div>
       <div class="card">
         <h3>Teachers with Health Conditions</h3>
         <p>${allergyCount}</p>
       </div>
     `;
  }

  // ADD STUDENT FORM

  const addForm = document.getElementById("addStudentForm");
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect all form fields
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
      window.location.href = "student_list.html";
    });
  }

  // ADD TEACHER FORM

  const addTForm = document.getElementById("addTeacherForm");
  if (addTForm) {
    addTForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect all form fields
      const newTeacher = {
        teacherId: addTForm.teacherId.value.trim(),
        name: addTForm.name.value.trim(),
        department: addTForm.department.value.trim(),
        dob: addTForm.dob.value,
        address: addTForm.address.value.trim(),
        contact: addTForm.contact.value.trim(),
        height: addTForm.height.value.trim(),
        weight: addTForm.weight.value.trim(),
        blood: addTForm.blood.value.trim(),
        pastIllnesses: addTForm.pastIllnesses.value.trim(),
        allergies: addTForm.allergies.value.trim(),
        conditions: addTForm.conditions.value.trim(),
        vaccination: addTForm.vaccination.value.trim(),
      };

      const teachers = getTeachers();
      teachers.push(newTeacher);
      setTeachers(teachers);

      alert("Teacher added successfully!");
      addTForm.reset();
      window.location.href = "teacher_list.html";
    });
  }

  // STUDENT LIST PAGE

  const table = document.getElementById("studentTable");
  if (table) {
    const students = getStudents();
    const tbody = table.querySelector("tbody");
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
  }

  // TEACHER LIST PAGE
  const table1 = document.getElementById("teacherTable");
  if (table1) {
    const teachers = getTeachers();
    const tbody = table1.querySelector("tbody");
    tbody.innerHTML = teachers
      .map(
        (t, i) => `
      <tr>
        <td>${t.teacherId}</td>
        <td>${t.name}</td>
        <td>${t.contact}</td>
        <td>
          <button onclick="viewTeacher(${i})" class="btn-small">View</button>
          <button onclick="deleteTeacher(${i})" class="btn-small btn-danger">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  // VIEW STUDENT HEALTH RECORD

  if (window.location.pathname.includes("student_health")) {
    const index = new URLSearchParams(window.location.search).get("id");
    const student = getStudents()[index];

    if (student) {
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
    }
  }

  // VIEW TEACHER HEALTH RECORD

  if (window.location.pathname.includes("teacher_health")) {
    const index = new URLSearchParams(window.location.search).get("id");
    const teacher = getTeachers()[index];

    if (teacher) {
      const healthDiv1 = document.getElementById("healthTDetails");
      healthDiv1.innerHTML = `
        <h3>${teacher.name} (${teacher.department})</h3>
        <p><b>TeacherID:</b> ${teacher.teacherId}</p>
        <p><b>DOB:</b> ${teacher.dob}</p>
        <p><b>Address:</b> ${teacher.address}</p>
        <p><b>Contact:</b> ${teacher.contact}</p>
        <p><b>Height:</b> ${teacher.height}</p>
        <p><b>Weight:</b> ${teacher.weight}</p>
        <p><b>Blood Group:</b> ${teacher.blood}</p>
        <p><b>Past Illnesses:</b> ${teacher.pastIllnesses}</p>
        <p><b>Allergies:</b> ${teacher.allergies}</p>
        <p><b>Pre-existing Conditions:</b> ${teacher.conditions}</p>
        <p><b>Vaccination Status:</b> ${teacher.vaccination}</p>
      `;
    }
  }

  // ------------------------------
  // DATETIME (optional)
  // ------------------------------
  const datetime = document.getElementById("datetime");
  if (datetime) {
    setInterval(() => {
      datetime.textContent = new Date().toLocaleString();
    }, 1000);
  }
});

// ------------------------------
// GLOBAL FUNCTIONS
// ------------------------------
function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

function goTo(page) {
  window.location.href = page;
}

function viewStudent(index) {
  window.location.href = `student_health.html?id=${index}`;
}

function viewTeacher(index) {
  window.location.href = `teacher_health.html?id=${index}`;
}

function deleteStudent(index) {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    location.reload();
  }
}

function deleteTeacher(index) {
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  if (confirm("Are you sure you want to delete this teacher?")) {
    teachers.splice(index, 1);
    localStorage.setItem("teachers", JSON.stringify(teachers));
    location.reload();
  }
}
