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
  
  for(let i = 0; i < str.length; i++) {
    if(!in_quote) {
      switch(str[i]) {
        case '\"':
          in_quote = true;
          break;
        case '\n':
          terminate_row();
          break;
        case '\r':
          continue;
        case ',':
          terminate_col();
      }
    } else if(str[i] == '\"') { // If we are in a quote and we got a quote char, we get out
      if(str[i - 1] === '\\' || str[i - 1] === '\"') { // Escape char
        column += '\"';
        continue;
      }
      
      in_quote = false;
    }
    
    column += str[i];
  }
}

$.get(csv_data_url, (data, status) => {
  console.log(parse_csv(data));
  $('#table').html(data);
});
