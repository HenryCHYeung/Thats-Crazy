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
  console.log(purpose+" "+storage);
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

  // Put these components together into an object
  const cheapest_pc = {
    CPU: cheapest_CPU[0],
    GPU: cheapest_GPU[0],
    PSU: cheapest_PSU[0],
    Motherboard: cheapest_MB[0],
    RAM: cheapest_RAM[0],
    Storage: cheapest_Storage[0],
    Case: cheapest_Case[0],
    Price: min_sum_of_price
  };
  console.log("min_sum_of_price: " + min_sum_of_price);
  return cheapest_pc;
}

// Implementation of psuedo-code to find PC
async function findParts(storage, budget, cheapest_PC, listType){
  let list_GPU, min_GPU_price, min_CPU_price, list_PSU, list_MB, list_RAM, list_storage, list_case;
  let selected_CPU, selected_GPU, selected_PSU, selected_MB, selected_RAM, selected_storage, selected_case, selected_cooler;
  let min_sum_of_others, list_CPU, first_TDP, max_TDP, list_length;
  if (listType==='CPU'){  // Get list of CPUs first if production
    min_sum_of_others = min_sum_of_price - cheapest_PC.CPU.Price;   // Sum of every component except CPU (used to get CPU list)
    let CPU_query = 'SELECT * FROM CPU WHERE Price <= ? AND PerformanceScore >= ? ORDER BY PerformanceScore DESC';
    list_CPU = await db_all(CPU_query, [budget - min_sum_of_others, cheapest_PC.GPU.PerformanceScore]);
    list_length = list_CPU.length;
  }
  if (listType==='GPU'){  // Get list of GPUs first if gaming
    min_sum_of_others = min_sum_of_price - cheapest_PC.GPU.Price;   // Sum of every component except GPU (used to get GPU list)
    let GPU_query = 'SELECT * FROM GPU WHERE Price <= ? AND PerformanceScore >= ? ORDER BY PerformanceScore DESC';
    list_GPU = await db_all(GPU_query, [budget - min_sum_of_others, cheapest_PC.CPU.PerformanceScore]);
    list_length = list_GPU.length;
  }

  for (i = 0; i < list_length; i++) {   // Loop through each CPU/GPU to get lists of all components that meet conditions
    if (listType==='CPU'){    // Get GPU next if production
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
      max_TDP = GPU_by_TDP[0].TDP;
      let GPU_query3 = 'SELECT Price FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY Price ASC';
      min_GPU_price = await db_all(GPU_query3, [CPU_PS, CPU_PS - 3500, budget - min_sum_of_others]);
      min_sum_of_others += min_GPU_price[0].Price;     // Add minimum GPU price to sum of minimum components
      first_TDP = list_CPU[i].TDP;

      // Motherboard has to match the CPU's memory type (which means CPU has to be known first to get the appropriate list)
      min_sum_of_others -= cheapest_PC.Motherboard.Price;    // Sum of every component except motherboard
      let MB_query = 'SELECT * FROM Motherboard WHERE Socket = ? AND Price <= ? ORDER BY Price DESC';
      list_MB = await db_all(MB_query, [list_CPU[i].Socket, budget - min_sum_of_others]);
      if (list_MB.length == 0) continue;       // If list is empty (no motherboard meets criteria of current CPU), move on to next CPU
      min_sum_of_others += list_MB[list_MB.length - 1].Price;     // Add minimum motherboard price to sum of minimum components
    }
    if (listType==='GPU'){    // Get CPU next if gaming (no motherboard yet as CPU is not known)
      min_sum_of_others = min_sum_of_price - cheapest_PC.GPU.Price;     // Reset min_sum_of_others for every GPU in list
      min_sum_of_others += list_GPU[i].Price;       // Recalculate sum of every component but with current GPU price
      min_sum_of_others -= cheapest_PC.CPU.Price;   // Sum of every component except CPU (used to get CPU list)
      let GPU_PS = list_GPU[i].PerformanceScore;
      let CPU_query = 'SELECT * FROM CPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY PerformanceScore DESC';
      list_CPU = await db_all(CPU_query, [GPU_PS, GPU_PS - 3500, budget - min_sum_of_others]);
      if (list_CPU.length == 0) continue;       // If list is empty (no CPU meets criteria of current GPU), move on to next GPU
  
      // Get highest TDP within the CPUs that fit the conditions (so that all potential PSUs will be valid)
      let CPU_query2 = 'SELECT TDP FROM CPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY TDP DESC';
      let CPU_by_TDP = await db_all(CPU_query2, [GPU_PS, GPU_PS - 3500, budget - min_sum_of_others]);
      max_TDP = CPU_by_TDP[0].TDP;
      let CPU_query3 = 'SELECT Price FROM CPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY Price ASC';
      min_CPU_price = await db_all(CPU_query3, [GPU_PS, GPU_PS - 3500, budget - min_sum_of_others]);
      min_sum_of_others += min_CPU_price[0].Price;     // Add minimum CPU price to sum of minimum components
      first_TDP = list_GPU[i].TDP;

      // Choose CPU so that the cooler and the list of motherboards can be determined
      let cooler;
      let temp_sum = min_sum_of_others;
      for (k = 0; k < list_CPU.length; k++) {
        min_sum_of_others = temp_sum - min_CPU_price[0].Price;
        min_sum_of_others += list_CPU[k].Price;
        min_sum_of_others -= cheapest_PC.Motherboard.Price;   // Sum of every component except motherboard

        let MB_query2 = 'SELECT * FROM Motherboard WHERE Socket = ? AND Price <= ? ORDER BY Price DESC';
        list_MB = await db_all(MB_query2, [list_CPU[k].Socket, budget - min_sum_of_others]);
        if (list_MB.length == 0) continue;       // If list is empty (no motherboard meets criteria of current CPU), move on to next CPU
        min_sum_of_others += list_MB[list_MB.length - 1].Price;     // Add minimum motherboard price to sum of minimum components
        
        if (list_CPU[k].TDP >= 100) {
          let cooler_query = 'SELECT * FROM CPUCooler LIMIT 1';     // Our dataset only has one cooler for now
          cooler = await db_all(cooler_query, []);
          cooler_price = cooler[0].Price;
          if (cooler[0].Price + min_sum_of_others > budget) continue;   // Adding cooler exceeds budget. Continue to next CPU
          min_sum_of_others += cooler[0].Price;
          selected_cooler = cooler[0];
        }
        if (min_sum_of_others > budget) continue;

        selected_CPU = list_CPU[k];
        break;      // CPU meets all requirements. No need to look further
      }
      if (!selected_CPU) continue;    // No CPUs work with current GPU, move on to next GPU
    }
    
    min_sum_of_others -= cheapest_PC.PSU.Price;     // Sum of every component except PSU (used to get PSU list)
    let PSU_query = 'SELECT * FROM PSU WHERE Wattage >= ? AND Price <= ? ORDER BY Price DESC';
    list_PSU = await db_all(PSU_query, [first_TDP + max_TDP, budget - min_sum_of_others]);
    if (list_PSU.length == 0) continue;       // If list is empty (no PSU meets criteria of current part), move on to next part
    min_sum_of_others += list_PSU[list_PSU.length - 1].Price;     // Add minimum PSU price to sum of minimum components

    min_sum_of_others -= cheapest_PC.RAM.Price;      // Sum of every component except RAM
    let RAM_query = 'SELECT * FROM RAM WHERE Price <= ? ORDER BY Price DESC';
    list_RAM = await db_all(RAM_query, [budget - min_sum_of_others]);
    if (list_RAM.length == 0) continue;       // If list is empty (no RAM meets criteria of current part), move on to next part
    min_sum_of_others += list_RAM[list_RAM.length - 1].Price;   // Add minimum RAM price to sum of minimum components

    min_sum_of_others -= cheapest_PC.Storage.Price;    // Sum of every component except Storage
    let storage_query = 'SELECT * FROM Storage WHERE Capacity = ? AND Price <= ? ORDER BY Price DESC';
    list_storage = await db_all(storage_query, [storage, budget - min_sum_of_others]);
    if (list_storage.length == 0) continue;      // If list is empty (no storage meets criteria of current part), move on to next part
    min_sum_of_others += list_storage[list_storage.length - 1].Price;   // Add minimum storage price to sum of minimum components

    min_sum_of_others -= cheapest_PC.Case.Price;    // Sum of every component except Case
    let case_query = 'SELECT * FROM Cases WHERE Price <= ? ORDER BY Price DESC';
    list_case = await db_all(case_query, [budget - min_sum_of_others]);
    if (list_case.length == 0) continue;       // If list is empty (no case meets criteria of current part), move on to next part
    min_sum_of_others += list_case[list_case.length - 1].Price;     // Add minimum case price to sum of minimum components

    // For production, the available budget for cooler can only be determined at the end.
    // For gaming, it is determined after CPU is chosen
    if (listType == "CPU" && list_CPU[i].TDP >= 100) {       // If CPU has TDP >= 100, a cooler must be added
      let cooler_query = 'SELECT * FROM CPUCooler LIMIT 1';     // Our dataset only has one cooler for now
      let cooler = await db_all(cooler_query, []);
      if (cooler[0].Price + min_sum_of_others > budget) continue;   // If adding cooler exceeds budget, CPU is invalid. Move on
      min_sum_of_others += cooler[0].Price;
      selected_cooler = cooler[0];
    }
    
    // min_sum_of_others is now the sum of minimum components with current CPU (including current CPU)
    if (min_sum_of_others > budget) continue;   // If the cheapest PC with selected part exceeds budget, move on to next part

    min_sum_of_price = min_sum_of_others;       // Set minimum price to global variable to be used for other parts
    if (listType == "CPU") {
      selected_CPU = list_CPU[i];
    } else if (listType == "GPU") {
      selected_GPU = list_GPU[i];
    }
    break;      // If code makes it here, it means the CPU/GPU meets all necessary requirements. No need to look further
  }
  if (listType == "CPU" && selected_CPU == undefined) {    // Undefined means no CPUs meet the requirements. Thus no PCs can be built
    console.log("No PC available");
    return undefined;
  }
  if (listType == "GPU" && selected_GPU == undefined) {    // Undefined means no GPUs meet the requirements. Thus no PCs can be built
    console.log("No PC available");
    return undefined;
  }
  // Select the best of each component that fits the budget from each of the lists above
  if (listType == "CPU") {
    selected_GPU = getSuitablePart(min_GPU_price[0].Price, list_GPU, budget);
  }
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
  
  // Put selected components together into an object
  const final_pc = {
    CPU: selected_CPU,
    GPU: selected_GPU,
    PSU: selected_PSU,
    Motherboard: selected_MB,
    RAM: selected_RAM,
    Storage: selected_storage,
    Case: selected_case,
    CPU_Cooler: selected_cooler,
    Price: min_sum_of_price
  };
  console.log(min_sum_of_price);
  return final_pc;
}

// Find best of each component that fits in budget
// partList will never be empty because this function is only executed if there are valid lists
function getSuitablePart(cheapest_price, partList, budget) {
  let min_sum_of_others = min_sum_of_price - cheapest_price;
  let chosen_part;

  for (i = 0; i < partList.length; i++) {
    if (partList[i].Price + min_sum_of_others <= budget) {    // Find first part in list that fits in budget
      chosen_part = partList[i];
      min_sum_of_price = min_sum_of_others + chosen_part.Price;     // Reset min_sum_of_price to account for new part
      return chosen_part;
    }
  }
}

// Takes user inputs and use them to build the cheapest PC, then use that as a baseline to build the actual PC
app.post("/finished", async function(req, res) {
  let choice = req.body.selectedUseOption;
  let storage = req.body.selectedSizeOption;
  let budget = req.body.inputValue;
  let cheapest_PC = await findMinPC(choice, storage);
  let final_PC;
  if (choice == "Production") {
    final_PC = await findParts(storage, budget, cheapest_PC, 'CPU');    // Prioritize CPU if production
  } else if (choice == "Gaming") {
    final_PC = await findParts(storage, budget, cheapest_PC, 'GPU');    // Prioritize GPU if gaming
  }
  res.json(final_PC);
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
