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

// Implementation of psuedo-code to find PC (swap out each piece from the cheapest PC to find lists of suitable components)
// Suitable components means components that work with the chosen CPU/GPU. If none exists, choose another CPU/GPU
// Out of the suitable components, choose the cheapest parts to create the new cheapest PC with selected CPU/GPU
async function findParts(storage, budget, cheapest_PC, listType){
  let list_GPU, min_GPU_price, min_CPU_price, list_PSU, list_MB, list_RAM, list_storage, list_case;
  let selected_CPU, selected_GPU, selected_PSU, selected_MB, selected_RAM, selected_storage, selected_case, selected_cooler;
  let min_sum_of_others, list_CPU, first_TDP, max_TDP, list_length;
  if (listType==='CPU'){  // Get list of CPUs first if production
    min_sum_of_others = min_sum_of_price - cheapest_PC.CPU.Price; 
    let CPU_query = 'SELECT * FROM CPU WHERE Price <= ? AND PerformanceScore >= ? ORDER BY PerformanceScore DESC';
    list_CPU = await db_all(CPU_query, [budget - min_sum_of_others, cheapest_PC.GPU.PerformanceScore]);
    list_length = list_CPU.length;
  }
  if (listType==='GPU'){  // Get list of GPUs first if gaming
    min_sum_of_others = min_sum_of_price - cheapest_PC.GPU.Price; 
    let GPU_query = 'SELECT * FROM GPU WHERE Price <= ? AND PerformanceScore >= ? ORDER BY PerformanceScore DESC';
    list_GPU = await db_all(GPU_query, [budget - min_sum_of_others, cheapest_PC.CPU.PerformanceScore]);
    list_length = list_GPU.length;
  }

  for (i = 0; i < list_length; i++) {   // Loop through each CPU/GPU to get lists of all components that meet conditions
    if (listType==='CPU'){    
      min_sum_of_others = min_sum_of_price - cheapest_PC.CPU.Price;
      min_sum_of_others += list_CPU[i].Price; 
      min_sum_of_others -= cheapest_PC.GPU.Price;
      let CPU_PS = list_CPU[i].PerformanceScore;
      let GPU_query = 'SELECT * FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY PerformanceScore DESC';
      list_GPU = await db_all(GPU_query, [CPU_PS, CPU_PS - 3500, budget - min_sum_of_others]);
      if (list_GPU.length == 0) continue;       // No GPUs meets criteria for CPU--> current CPU is invalid

      // Get highest TDP within the GPUs that fit the conditions so that all potential PSUs will be valid
      let GPU_query2 = 'SELECT TDP FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY TDP DESC';
      let GPU_by_TDP = await db_all(GPU_query2, [CPU_PS, CPU_PS - 3500, budget - min_sum_of_others]);
      max_TDP = GPU_by_TDP[0].TDP;
      let GPU_query3 = 'SELECT Price FROM GPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY Price ASC';
      min_GPU_price = await db_all(GPU_query3, [CPU_PS, CPU_PS - 3500, budget - min_sum_of_others]);
      min_sum_of_others += min_GPU_price[0].Price;     // Add minimum GPU price to sum of minimum components
      first_TDP = list_CPU[i].TDP;

      // Motherboard has to match the CPU's memory type (which means CPU has to be known first to get the appropriate list)
      min_sum_of_others -= cheapest_PC.Motherboard.Price;
      let MB_query = 'SELECT * FROM Motherboard WHERE Socket = ? AND Price <= ? ORDER BY Price DESC';
      list_MB = await db_all(MB_query, [list_CPU[i].Socket, budget - min_sum_of_others]);
      if (list_MB.length == 0) continue;       // No motherboard meets criteria for CPU --> current CPU is invalid
      min_sum_of_others += list_MB[list_MB.length - 1].Price;     // Add minimum motherboard price to sum of minimum components
    }
    if (listType==='GPU'){    // Get CPU next if gaming (no motherboard yet as CPU is not known)
      min_sum_of_others = min_sum_of_price - cheapest_PC.GPU.Price;
      min_sum_of_others += list_GPU[i].Price; 
      min_sum_of_others -= cheapest_PC.CPU.Price; 
      let GPU_PS = list_GPU[i].PerformanceScore;
      let CPU_query = 'SELECT * FROM CPU WHERE PerformanceScore <= ? AND PerformanceScore >= ? AND Price <= ? ORDER BY PerformanceScore DESC';
      list_CPU = await db_all(CPU_query, [GPU_PS, GPU_PS - 3500, budget - min_sum_of_others]);
      if (list_CPU.length == 0) continue;       // No CPU meets criteria for GPU --> current GPU is invalid
  
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
        min_sum_of_others -= cheapest_PC.Motherboard.Price;

        let MB_query2 = 'SELECT * FROM Motherboard WHERE Socket = ? AND Price <= ? ORDER BY Price DESC';
        list_MB = await db_all(MB_query2, [list_CPU[k].Socket, budget - min_sum_of_others]);
        if (list_MB.length == 0) continue;       // No motherboard meets criteria for CPU --> current CPU is invalid
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

    // Choose motherboard to determine the list of RAMs since RAM depends on motherboard
    let temp_sum2 = min_sum_of_others;
    for (m = 0; m < list_MB.length; m++) {
      min_sum_of_others = temp_sum2 - list_MB[list_MB.length - 1].Price;
      min_sum_of_others += list_MB[m].Price;
      min_sum_of_others -= cheapest_PC.RAM.Price;

      let RAM_query = 'SELECT * FROM RAM WHERE MemoryType = ? AND Price <= ? ORDER BY Price DESC';
      list_RAM = await db_all(RAM_query, [list_MB[m].MemoryType, budget - min_sum_of_others]);
      console.log(list_RAM);
      if (list_RAM.length == 0) continue;   // No RAM meets criteria for motherboard --> current motherboard is invalid
      min_sum_of_others += list_RAM[list_RAM.length - 1].Price;   // Add minimum RAM price to sum of minimum components

      if (min_sum_of_others > budget) continue;
      selected_MB = list_MB[m];
      break;    // Motherboard meets all requirements. No need to look further
    }
    if (!selected_MB) continue;     // In case no motherboards fit, move on to next GPU to keep things simple
    
    // Swap out each part from cheapest PC, replace with new cheapest part that works with current CPU/GPU
    // If none exists, move on to next CPU/GPU
    min_sum_of_others -= cheapest_PC.PSU.Price; 
    let PSU_query = 'SELECT * FROM PSU WHERE Wattage >= ? AND Price <= ? ORDER BY Price DESC';
    list_PSU = await db_all(PSU_query, [first_TDP + max_TDP, budget - min_sum_of_others]);
    if (list_PSU.length == 0) continue;
    min_sum_of_others += list_PSU[list_PSU.length - 1].Price;

    min_sum_of_others -= cheapest_PC.Storage.Price; 
    let storage_query = 'SELECT * FROM Storage WHERE Capacity = ? AND Price <= ? ORDER BY Price DESC';
    list_storage = await db_all(storage_query, [storage, budget - min_sum_of_others]);
    if (list_storage.length == 0) continue; 
    min_sum_of_others += list_storage[list_storage.length - 1].Price;

    min_sum_of_others -= cheapest_PC.Case.Price;
    let case_query = 'SELECT * FROM Cases WHERE Price <= ? ORDER BY Price DESC';
    list_case = await db_all(case_query, [budget - min_sum_of_others]);
    if (list_case.length == 0) continue;
    min_sum_of_others += list_case[list_case.length - 1].Price;

    // For production, the available budget for cooler can only be determined at the end because the budget depends 
    // on the new cheapest PC with current CPU
    // For gaming, it is determined after CPU is chosen
    if (listType == "CPU" && list_CPU[i].TDP >= 100) {
      let cooler_query = 'SELECT * FROM CPUCooler LIMIT 1';     // Our dataset only has one cooler for now
      let cooler = await db_all(cooler_query, []);
      if (cooler[0].Price + min_sum_of_others > budget) continue;   // If adding cooler exceeds budget, CPU is invalid. Move on
      min_sum_of_others += cooler[0].Price;
      selected_cooler = cooler[0];
    }
    
    // min_sum_of_others is now the sum of minimum components with current CPU (including current CPU)
    if (min_sum_of_others > budget) continue;     // Just in case budget is exceeded

    min_sum_of_price = min_sum_of_others;       // Set minimum price to global variable to be used for other parts
    if (listType == "CPU") {
      selected_CPU = list_CPU[i];
    } else if (listType == "GPU") {
      selected_GPU = list_GPU[i];
    }
    break;      // If code makes it here, it means the CPU/GPU meets all necessary requirements. No need to look further
  }
  if (selected_CPU == undefined) {    // Undefined means no CPUs meet the requirements. Thus no PCs can be built
    console.log("No PC available");
    return undefined;
  }

  // Select the best of each component that fits the budget from each of the lists above
  if (listType == "CPU") {
    selected_GPU = getSuitablePart(min_GPU_price[0].Price, list_GPU, budget);
  }
  selected_PSU = getSuitablePart(list_PSU[list_PSU.length - 1].Price, list_PSU, budget);
  selected_RAM = getSuitablePart(list_RAM[list_RAM.length - 1].Price, list_RAM, budget);
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

// Returns the most expensive laptop that fits the budget and matches the purpose
async function getLaptop(budget, purpose) {
  let laptop_query = 'SELECT * FROM Laptop WHERE Price <= ? AND Category = ? ORDER BY Price DESC';
  let selected_laptop = await db_all(laptop_query, [budget, purpose]);
  return selected_laptop[0];
}

// For desktop, takes user inputs and use them to build the cheapest PC, then use that as a baseline to build the actual PC
// For laptop, choose best laptop that fits criteria
app.post("/finished", async function(req, res) {
  let type = req.body.selectedTypeOption;
  let choice = req.body.selectedUseOption;
  let budget = req.body.inputValue;
  let final_PC;

  if (type == "Desktop") {
    let storage = req.body.selectedSizeOption;
    let cheapest_PC = await findMinPC(choice, storage);

    if (choice == "Production") {
      final_PC = await findParts(storage, budget, cheapest_PC, 'CPU');    // Prioritize CPU if production
    } else if (choice == "Gaming") {
      final_PC = await findParts(storage, budget, cheapest_PC, 'GPU');    // Prioritize GPU if gaming
    }

  } else if (type == "Laptop") {
    final_PC = await getLaptop(budget, choice);
  }
  res.json(final_PC);
});

// Return all parts of the chosen component that are in the database
app.post("/parts", async function(req, res) {
  let chosen_part = req.body.part;
  let query = 'SELECT * FROM ' + chosen_part;
  let part_list = await db_all(query, []);
  res.json(part_list);
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
