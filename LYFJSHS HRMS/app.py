from flask import Flask, render_template, request, redirect, url_for, session, flash
import mysql.connector

app = Flask(__name__)
app.secret_key = "supersecretkey"

# ---------------------- DATABASE CONFIG ---------------------- #
db = mysql.connector.connect(
    host="localhost",
    user="root",          # default XAMPP user
    password="",          # leave empty unless you set one
    database="student_health"
)


# ---------------------- ROUTES ---------------------- #

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if username == "admin" and password == "admin123":
            session["logged_in"] = True
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid credentials. Try admin / admin123", "danger")
    return render_template("index.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/dashboard")
def dashboard():
    if not session.get("logged_in"):
        return redirect(url_for("login"))

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    total_students = len(students)
    allergy_count = len([s for s in students if s["allergies"]])
    cursor.close()

    return render_template(
        "dashboard.html",
        total_students=total_students,
        allergy_count=allergy_count,
    )


@app.route("/add_student", methods=["GET", "POST"])
def add_student():
    if not session.get("logged_in"):
        return redirect(url_for("login"))

    if request.method == "POST":
        data = (
            request.form["studentID"],
            request.form["name"],
            request.form["class"],
            request.form["dob"],
            request.form["parentContact"],
            request.form["bloodGroup"],
            request.form["allergies"],
            request.form["conditions"],
            request.form["vaccination"],
            request.form["emergencyContact"],
        )

        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO students (studentID, name, class, dob, parentContact, bloodGroup, allergies, conditions, vaccination, emergencyContact)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, data)
        db.commit()
        cursor.close()

        flash("Student added successfully!", "success")
        return redirect(url_for("student_list"))

    return render_template("add_student.html")


@app.route("/students")
def student_list():
    if not session.get("logged_in"):
        return redirect(url_for("login"))

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    cursor.close()
    return render_template("student_list.html", students=students)


@app.route("/student/<int:id>")
def student_health(id):
    if not session.get("logged_in"):
        return redirect(url_for("login"))

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE id = %s", (id,))
    student = cursor.fetchone()
    cursor.close()

    if not student:
        return "Student not found", 404

    return render_template("student_health.html", student=student)


@app.route("/delete_student/<int:id>")
def delete_student(id):
    if not session.get("logged_in"):
        return redirect(url_for("login"))

    cursor = db.cursor()
    cursor.execute("DELETE FROM students WHERE id = %s", (id,))
    db.commit()
    cursor.close()

    flash("Student deleted successfully!", "success")
    return redirect(url_for("student_list"))


# ---------------------- RUN SERVER ---------------------- #
if __name__ == "__main__":
    app.run(debug=True)
