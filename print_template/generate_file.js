const fs = require("fs");
const path = require("path");
const html_template_list = path.join(__dirname, "list_template.html");
const html_template_tab = path.join(__dirname, "tab_template.html");
const dest_link = path.join(__dirname, "print.html");

let final = "";

async function database(db, command) {
  return await new Promise((resolve, reject) => {
    db.all(command, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function generate_list(db, list_id) {
  const all_task = await database(
    db,
    "SELECT * FROM tasks WHERE list_id = " + list_id,
  );
  let html = fs.readFileSync(html_template_list, "utf-8");
  all_task.forEach((task) => {
    let task_html = "<tr>";
    task_html += "<td>" + task.name + "</td>";
    task_html += "<td>" + task.description + "</td>";
    if (task.date !== "") {
      const date = new Date(task.date);
      let day;
      let month;
      let minutes;
      let hours;
      if (date.getDate() <= 10) {
        day = "0" + date.getDate();
      } else {
        day = date.getDate();
      }
      if (date.getMonth() <= 10) {
        month = "0" + date.getMonth();
      } else {
        month = date.getMonth();
      }
      if (date.getHours() <= 10) {
        hours = "0" + date.getHours();
      } else {
        hours = date.getHours();
      }
      if (date.getMinutes() <= 10) {
        minutes = "0" + date.getMinutes();
      } else {
        minutes = date.getMinutes();
      }
      task_html +=
        "<td>" +
        day +
        "-" +
        month +
        "-" +
        date.getFullYear() +
        " " +
        hours +
        ":" +
        minutes +
        "</td>";
    } else {
      task_html += "<td>Pas de date d'echeance</td>";
    }
    task_html += "</tr>";
    final += task_html;
  });

  const response = html.replace("{{task}}", final);

  fs.writeFileSync(dest_link, response);

  final = "";
  return dest_link;
}

async function generate_tab(db, tab_id) {
  const lists = await database(
    db,
    "SELECT * FROM lists WHERE tab_id = " + tab_id,
  );
  let html = fs.readFileSync(html_template_tab, "utf-8");
  lists.forEach(async (list) => {
    const all_task = await database(
      db,
      "SELECT * FROM tasks WHERE list_id = " + list.id,
    );
    let response_list = "<div class='list-title'>" + list.name + "</div>";
    response_list += "<table class='task-list'>";
    response_list += "<thead>";
    response_list += "<tr>";
    response_list += "<th>Tache</th>";
    response_list += "<th>Description</th>";
    response_list += "<th>Date d'echeance</th>";
    response_list += "</tr>";
    response_list += "</thead>";
    response_list += "<tbody>";
    all_task.forEach((task) => {
      let task_html = "<tr>";
      task_html += "<td>" + task.name + "</td>";
      task_html += "<td>" + task.description + "</td>";
      if (task.date !== "") {
        const date = new Date(task.date);
        let day;
        let month;
        let minutes;
        let hours;
        if (date.getDate() <= 10) {
          day = "0" + date.getDate();
        } else {
          day = date.getDate();
        }
        if (date.getMonth() <= 10) {
          month = "0" + date.getMonth();
        } else {
          month = date.getMonth();
        }
        if (date.getHours() <= 10) {
          hours = "0" + date.getHours();
        } else {
          hours = date.getHours();
        }
        if (date.getMinutes() <= 10) {
          minutes = "0" + date.getMinutes();
        } else {
          minutes = date.getMinutes();
        }
        task_html +=
          "<td>" +
          day +
          "-" +
          month +
          "-" +
          date.getFullYear() +
          " " +
          hours +
          ":" +
          minutes +
          "</td>";
      } else {
        task_html += "<td>Pas de date d'echeance</td>";
      }
      task_html += "</tr>";
      response_list += task_html;
    });
    response_list += "</tbody></table>";
    final += response_list
  });

  setTimeout(function () {
    const response = html.replace("{{list}}", final);
    fs.writeFileSync(dest_link, response);
    final = "";
  }, 500);
  return dest_link;
}

module.exports = { generate_list, generate_tab };
