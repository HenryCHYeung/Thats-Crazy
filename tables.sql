-- useCase: Production or gaming
-- quality: HighEnd or LowEnd
-- partType: CPU, GPU, RAM, Storage, PSU, Case, Motherboard
-- partName: Name of the part
-- price: $0 to $9999.99
-- performance_score: rating from 0 to 100, or NULL if there is no performance

Create Table if not exists Parts(
	useCase VARCHAR(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	partName VarChar(255) NOT NULL,
	price Numeric(6,2) NOT NULL,
	performance_score Integer
);