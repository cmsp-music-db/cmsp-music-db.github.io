const csv_data_url = 'https://raw.githubusercontent.com/cmsp-music-db/cmsp-music-db.github.io/main/data.csv';

// Convoluted hand-crafted shitty csv parser lmao
function parse_csv(str) {
  let in_quote = false;
  let rows = [];
  let row = [];
  let column = "";

  // A few helper functions
  const terminate_row = () => {
    row.push(column);
    column = "";

    rows.push(row);
    row = [];
  };

  const terminate_col = () => {
    row.push(column);
    column = "";
  };

  for (let i = 0; i < str.length; i++) {
    if (!in_quote) {
      switch (str[i]) {
        case '\"':
          in_quote = true;
          continue;
        case '\n':
          console.log(`Newline @ ${i}. String as of ${i - 5}-${i}: ${str.substr(i - 5, 5)}`);
          terminate_row();
          continue;
        case '\r':
          continue;
        case ',':
          terminate_col();
          continue;
      }
    } else if (str[i] == '\"') { // If we are in a quote and we got a quote char, we get out
      if (str[i - 1] === '\\' || str[i - 1] === '\"') { // Escape char
        column += '\"';
        continue;
      }

      in_quote = false;
      continue;
    }

    column += str[i];
  }

  return rows;
}


$(document).ready(function () {
  $.get(csv_data_url, (data, status) => {
    const parsed = parse_csv(data);
    const columns = parsed[0].map(function (e) {
      return { title: e };
    });

    parsed.splice(0, 1); // Remove first row
    console.log(parsed);
    $('#table').DataTable({
      responsive: true,
      data: parsed,
      columns
    });
  });
});

