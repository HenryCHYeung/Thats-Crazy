# Rapid Rigs by Thats-Crazy  
Intro:  
If you're currently in the market for a new computer and you're finding yourself swamped by the vast array of choices, don't worry. Whether you're a dedicated gamer, a content creator, a business professional, or just in need of a dependable everyday PC, we've got your back. At Rapid Rigs, we firmly believe that the process of finding your ideal computer should be a breeze. That's precisely why we've put together a user-friendly platform that guides you through every step of the way, from pinpointing your unique requirements to piecing together your dream PC, we're here to make your computer buying experience a piece of cake.

## Characteristics of a valid PC
This is based on our dataset.
CPU performance score is based on the Cinebench R23 Multi-core.
GPU performance score is based on the 3DMark Time Spy Benchmark.
This project is not intended for public use. Therefore the results generated may not be 100% accurate. However, we have tried our best to make sure that every PC generated by this website is valid.
The user is allowed to choose the use case of their PC (production or gaming), the amount of storage (500 GB, 1 TB, or 2 TB) and their budget.

For production PC, CPU is chosen first. Then, the GPU is chosen based on the performance score of the CPU.
The performance score of the GPU must be <= to the performance score of the CPU. As such, the minimum CPU
performance score for a production PC is the same as the minimum GPU performance score in the dataset. The
GPU performance score must not exceed the maximum CPU performance score. In addition, the GPU must not have 
a performance score that is over 3500 points lower than the CPU score.
(min(CPU.PS) = min(GPU.PS), max(GPU.PS) <= max(CPU.PS), CPU.PS - 3500 <= GPU.PS <= CPU.PS)

For gaming PC, GPU is chosen first. Then, the CPU is chosen based on the performance score of the GPU. This
is the same as above, except the other way around. The minimum GPU score is the same as the minimum CPU score.
The CPU performance score must not exceed the maximum GPU performance score. In addition, the CPU must not 
have a performance score that is over 3500 points lower than the GPU score.
(min(GPU.PS) = min(CPU.PS), max(CPU.PS) <= max(GPU.PS), GPU.PS - 3500 <= CPU.PS <= GPU.PS)

If the chosen CPU has TDP > 100, add CPU cooler.

After CPU and GPU, the PSU is chosen. The PSU must have a wattage that is >= than the sum of TDP of CPU and
GPU. (PSU.W >= CPU.TDP + GPU.TDP)

Motherboard is next. The motherboard must have a socket that matches that of the CPU. (MB.SO = CPU.SO)

RAM is next. RAM must have a memory type that matches the chosen motherboard. (RAM.MT = MB.MT)

Storage is chosen based on user input. (capacity = 500 GB, 1 TB, or 2 TB)

Case has no restrictions.

For more information about the algorithm. Please look at `algorithm_pseudo_code.txt`.
