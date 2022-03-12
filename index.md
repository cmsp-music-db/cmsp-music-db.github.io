## CMSP Music DB

Extremely simple (hopefully)...

<link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css"> 
<table id="table" class="display" style="width:100%">
</table>



<div id="js">
 <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
 <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
 <script>
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
          continue;
        case '\n':
          terminate_row();
          continue;
        case '\r':
          continue;
        case ',':
          terminate_col();
          continue;       
      }
    } else if(str[i] == '\"') { // If we are in a quote and we got a quote char, we get out
      if(str[i - 1] === '\\' || str[i - 1] === '\"') { // Escape char
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

                                
$(document).ready(function() {
  $.get(csv_data_url, (data, status) => {
    parse = parse_csv(data);
    $('#table').DataTable({
	    data: parsed,
	    columns: [
        { title: "Composer" },
        { title: "Arranger / Transcriber" },
        { title: "Title" },
        { title: "Edition" },
        { title: "Instrumentation" },
        { title: "Editor" }
	    ]
    });
  });
});
                                

 </script>
</div>
