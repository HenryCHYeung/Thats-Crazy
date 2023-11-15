const express = require("express");
const cors = require("cors");
const sqlite = require("sqlite3");
const PORT = process.env.PORT || 3001;  // PORT depends on environment, or 3001 if there is none
const app = express();

app.use(express.json());      // Allows incoming requests to be recognized as JSON objects
app.use(express.urlencoded({ extended: true }));        // Allows incoming HTML forms and URL-encoded data to be parsed
app.use(cors());              // Allows frontend to make requests to access the APIs here

var min_sum_of_price = 0;     // sum of cheapest compatible parts

// Connects to local database
let db = new sqlite.Database('./PCPartsDB.db', function(err) {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database");
});

// Reads from local database ("select" statements usually)
async function db_all(query, params) {
	return new Promise(function(resolve, reject) {
		db.all(query, params, function(error, rows) {
			if (error) return reject(error);
			resolve(rows);
		});
	});
}

// Find the cheapest PC possible based on chosen purpose and storage
async function findMinPC(purpose, storage) {
  let cheapest_CPU, cheapest_GPU;
  
  if (purpose == "Production") {        // If production, choose CPU then GPU
    let min_GPU_PS =  await db_all('SELECT PerformanceScore FROM GPU ORDER BY PerformanceScore LIMIT 1', []);
    let CPU_query = 'SELECT * FROM CPU WHERE PerformanceScore >= ? ORDER BY Price LIMIT 1';
    cheapest_CPU = await db_all(CPU_query, [min_GPU_PS[0].PerformanceScore]);
    let cheapest_CPU_PS = cheapest_CPU[0].PerformanceScore;
    let GPU_query = 'SELECT * FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? ORDER BY Price LIMIT 1';
    cheapest_GPU = await db_all(GPU_query, [cheapest_CPU_PS, cheapest_CPU_PS - 3500]);
  }
  if (purpose == "Gaming") {            // If gaming, choose GPU then CPU
    let min_CPU_PS =  await db_all('SELECT PerformanceScore FROM CPU ORDER BY PerformanceScore LIMIT 1', []);
    let GPU_query = 'SELECT * FROM GPU WHERE PerformanceScore >= ? ORDER BY Price LIMIT 1';
    cheapest_GPU = await db_all(GPU_query, [min_CPU_PS[0].PerformanceScore]);
    let cheapest_GPU_PS = cheapest_GPU[0].PerformanceScore;
    let CPU_query = 'SELECT * FROM CPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? ORDER BY Price LIMIT 1';
    cheapest_CPU = await db_all(CPU_query, [cheapest_GPU_PS, cheapest_GPU_PS - 3500]);
  }
  
  let PSU_query = 'SELECT * FROM PSU WHERE Wattage >= ? ORDER BY Price LIMIT 1';        // Choose cheapest PSU
  let cheapest_PSU = await db_all(PSU_query, [cheapest_CPU[0].TDP + cheapest_GPU[0].TDP]);

  let MB_query = 'SELECT * FROM Motherboard WHERE Socket = ? ORDER BY PRICE LIMIT 1';    // Choose cheapest motherboard
  let cheapest_MB = await db_all(MB_query, [cheapest_CPU[0].Socket]);
  
  let RAM_query = 'SELECT * FROM RAM WHERE MemoryType = ? ORDER BY PRICE LIMIT 1';      // Choose cheapest RAM
  let cheapest_RAM = await db_all(RAM_query, [cheapest_MB[0].MemoryType]);
  
  let storage_query = 'SELECT * FROM Storage WHERE Capacity = ? ORDER BY PRICE LIMIT 1';    // Choose cheapest Storage
  let cheapest_Storage = await db_all(storage_query, [storage]);
  
  let case_query = 'SELECT * FROM Cases ORDER BY PRICE LIMIT 1';      // Choose cheapest Case
  let cheapest_Case = await db_all(case_query, []);
  min_sum_of_price = cheapest_CPU[0].Price + cheapest_GPU[0].Price + cheapest_PSU[0].Price + cheapest_MB[0].Price +
                      cheapest_RAM[0].Price + cheapest_Storage[0].Price + cheapest_Case[0].Price;   // Price of cheapest PC

  let parts_List = {
    CPU: cheapest_CPU[0],
    GPU: cheapest_GPU[0],
    PSU: cheapest_PSU[0],
    Motherboard: cheapest_MB[0],
    RAM: cheapest_RAM[0],
    Storage: cheapest_Storage[0],
    Case: cheapest_Case[0]
  };
  console.log("min_sum_of_price: " + min_sum_of_price);
  return parts_List;
}

// Build production PC (Find CPU first)
async function productionPC(storage, budget, cheapest_PC) {
  let min_sum_of_others = min_sum_of_price - cheapest_PC.CPU.Price;   // Sum of every component except CPU (used to get CPU list)
  let CPU_query = 'SELECT * FROM CPU WHERE Price <= ? AND PerformanceScore >= ? ORDER BY PerformanceScore DESC';
  let list_CPU = await db_all(CPU_query, [budget - min_sum_of_others, cheapest_PC.GPU.PerformanceScore]);
  let list_GPU, min_GPU_price, list_PSU, list_MB, list_RAM, list_storage, list_case;
  let selected_CPU, selected_GPU, selected_PSU, selected_MB, selected_RAM, selected_storage, selected_case, selected_cooler;

  for (i = 0; i < list_CPU.length; i++) {
    min_sum_of_others = min_sum_of_price - cheapest_PC.CPU.Price;     // Reset min_sum_of_others for every CPU in list
    min_sum_of_others += list_CPU[i].Price;       // Recalculate sum of every component but with current CPU price
    min_sum_of_others -= cheapest_PC.GPU.Price;   // Sum of every component except GPU (used to get GPU list)
    let CPU_PS = list_CPU[i].PerformanceScore;
    let GPU_query = 'SELECT * FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY PerformanceScore DESC';
    list_GPU = await db_all(GPU_query, [CPU_PS, CPU_PS - 3500, budget - min_sum_of_others]);
    if (list_GPU.length == 0) continue;       // If list is empty (no GPU meets criteria of current CPU), move on to next CPU

    // Get highest TDP within the GPUs that fit the conditions (so that all potential PSUs will be valid)
    let GPU_query2 = 'SELECT TDP FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY TDP DESC';
    let GPU_by_TDP = await db_all(GPU_query2, [CPU_PS, CPU_PS - 3500, budget - min_sum_of_others]);
    let max_TDP = GPU_by_TDP[0].TDP;
    let GPU_query3 = 'SELECT Price FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY Price ASC';
    min_GPU_price = await db_all(GPU_query3, [CPU_PS, CPU_PS - 3500, budget - min_sum_of_others]);
    min_sum_of_others += min_GPU_price[0].Price;     // Add minimum GPU price to sum of minimum components
    
    min_sum_of_others -= cheapest_PC.PSU.Price;     // Sum of every component except PSU (used to get PSU list)
    let PSU_query = 'SELECT * FROM PSU WHERE Wattage >= ? AND Price <= ? ORDER BY Price DESC';
    list_PSU = await db_all(PSU_query, [list_CPU[i].TDP + max_TDP, budget - min_sum_of_others]);
    if (list_PSU.length == 0) continue;       // If list is empty (no PSU meets criteria of current CPU), move on to next CPU
    min_sum_of_others += list_PSU[list_PSU.length - 1].Price;     // Add minimum PSU price to sum of minimum components
    
    min_sum_of_others -= cheapest_PC.Motherboard.Price;    // Sum of every component except motherboard
    let MB_query = 'SELECT * FROM Motherboard WHERE Socket = ? AND Price <= ? ORDER BY Price DESC';
    list_MB = await db_all(MB_query, [list_CPU[i].Socket, budget - min_sum_of_others]);
    if (list_MB.length == 0) continue;       // If list is empty (no motherboard meets criteria of current CPU), move on to next CPU
    min_sum_of_others += list_MB[list_MB.length - 1].Price;     // Add minimum motherboard price to sum of minimum components

    min_sum_of_others -= cheapest_PC.RAM.Price;      // Sum of every component except RAM
    let RAM_query = 'SELECT * FROM RAM WHERE Price <= ? ORDER BY Price DESC';
    list_RAM = await db_all(RAM_query, [budget - min_sum_of_others]);
    if (list_RAM.length == 0) continue;       // If list is empty (no RAM meets criteria of current CPU), move on to next CPU
    min_sum_of_others += list_RAM[list_RAM.length - 1].Price;   // Add minimum RAM price to sum of minimum components

    min_sum_of_others -= cheapest_PC.Storage.Price;    // Sum of every component except Storage
    let storage_query = 'SELECT * FROM Storage WHERE Capacity = ? AND Price <= ? ORDER BY Price DESC';
    list_storage = await db_all(storage_query, [storage, budget - min_sum_of_others]);
    if (list_storage.length == 0) continue;       // If list is empty (no storage meets criteria of current CPU), move on to next CPU
    min_sum_of_others += list_storage[list_storage.length - 1].Price;   // Add minimum storage price to sum of minimum components

    min_sum_of_others -= cheapest_PC.Case.Price;    // Sum of every component except Case
    let case_query = 'SELECT * FROM Cases WHERE Price <= ? ORDER BY Price DESC';
    list_case = await db_all(case_query, [budget - min_sum_of_others]);
    if (list_case.length == 0) continue;       // If list is empty (no case meets criteria of current CPU), move on to next CPU
    min_sum_of_others += list_case[list_case.length - 1].Price;     // Add minimum case price to sum of minimum components
    
    // min_sum_of_others is now the sum of minimum components with current CPU (including current CPU)
    if (min_sum_of_others > budget) continue;   // If the cheapest PC with selected CPU exceeds budget, move on to next CPU

    if (list_CPU[i].TDP >= 100) {       // If CPU has TDP >= 100, a cooler must be added
      let cooler_query = 'SELECT * FROM CPUCooler LIMIT 1';     // Our dataset only has one cooler for now
      let cooler = await db_all(cooler_query, []);
      if (cooler[0].Price + min_sum_of_others > budget) continue;   // If adding cooler exceeds budget, CPU is invalid. Move on
      min_sum_of_others += cooler[0].Price;                         // Otherwise include it
      selected_cooler = cooler[0];
    }

    min_sum_of_price = min_sum_of_others;       // Set minimum price to global variable to be used for other parts
    min_sum_of_others -= list_CPU[i].Price;
    selected_CPU = list_CPU[i];
    break;      // If code makes it here, it means the CPU meets all necessary requirements. No need to look further
  }
  if (selected_CPU == undefined) {    // Undefined means no CPUs meet the requirements. Thus no PCs can be built
    console.log("No PC available");
    return "No PC available based on specifications. That's crazy!";
  }
  selected_GPU = getSuitablePart(min_GPU_price[0].Price, list_GPU, budget);
  selected_PSU = getSuitablePart(list_PSU[list_PSU.length - 1].Price, list_PSU, budget);
  selected_MB = getSuitablePart(list_MB[list_MB.length - 1].Price, list_MB, budget);
  
  let new_list_RAM = [];
  for (j = 0; j < list_RAM.length; j++) {
    if (list_RAM[j].MemoryType == selected_MB.MemoryType) {       // Make sure RAM is compatible with chosen motherboard
      new_list_RAM.push(list_RAM[j]);         // new_list_RAM should still be sorted by price in descending order
    }
  }
  selected_RAM = getSuitablePart(list_RAM[list_RAM.length - 1].Price, new_list_RAM, budget);
  selected_storage = getSuitablePart(list_storage[list_storage.length - 1].Price, list_storage, budget);
  selected_case = getSuitablePart(list_case[list_case.length - 1].Price, list_case, budget);
  console.log(selected_CPU);
  console.log(selected_GPU);
  console.log(selected_PSU);
  console.log(selected_MB);
  console.log(selected_RAM);
  console.log(selected_storage);
  console.log(selected_case);
  console.log(selected_cooler);
  let sum = selected_CPU.Price + selected_GPU.Price + selected_PSU.Price + selected_MB.Price + selected_RAM.Price + 
            selected_storage.Price + selected_case.Price + selected_cooler.Price;
  console.log(sum);
  console.log(min_sum_of_price);
}

// cheapest_price is the price of the cheapest compatible part, partList is the list of compatible parts, ordered by "quality"
// partList will never be empty because this function is only executed if there are valid lists
function getSuitablePart(cheapest_price, partList, budget) {
  let min_sum_of_others = min_sum_of_price - cheapest_price;
  let chosen_part;
  let loop_count = 0;
  for (i = 0; i < partList.length; i++) {
    loop_count += 1;
    if (partList[i].Price + min_sum_of_others <= budget) {    // Find first part in list that fits in budget
      chosen_part = partList[i];
      min_sum_of_price = min_sum_of_others + chosen_part.Price;     // Reset min_sum_of_price to account for new part
      return chosen_part;
    }
  }
}

// Recommendation algorithm (implementation of the psuedo-code)
async function recommendation(purpose, storage, budget, cheapest_PC) {
  if (purpose == "Production") {
    productionPC(storage, budget, cheapest_PC);
  }
  
}

app.post("/finished", async function(req, res) {
  let choice = req.body.userChoice;
  let storage = req.body.selectedStorage;
  let budget = req.body.selectedPrice;
  let cheapest_PC = await findMinPC(choice, storage);
  recommendation(choice, storage, budget, cheapest_PC);
  res.json(cheapest_PC);
});

// Server will run on PORT
app.listen(PORT, function() {
  console.log(`Server listening on ${PORT}`);
});

// Closes connection to database (Commented out to prevent connection from closing immediately)
// db.close(function(err) {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log("Connection to database is closed");
// })