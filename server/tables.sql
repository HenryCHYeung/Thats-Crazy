Create Table if not exists CPU(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL,
  Socket VarChar(100) NOT NULL,
  TDP TINYINT(100) NOT NULL,
	PerformanceScore Integer NOT NULL
);
Create Table if not exists GPU(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL,
  TDP TINYINT(100) NOT NULL,
	PerformanceScore Integer NOT NULL
);
Create Table if not exists RAM(
  Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL,
  MemoryType VarChar(100) NOT NULL
);
Create Table if not exists Storage(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL,
  Capacity VarChar(100) NOT NULL
);
Create Table if not exists PSU(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL,
  Wattage SMALLINT(100) NOT NULL
);
Create Table if not exists Cases(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL
);
Create Table if not exists Motherboard(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL,
  Socket VarChar(100) NOT NULL,
  MemoryType VarChar(100) NOT NULL
);
Create Table if not exists CPUCooler(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL
);

Create Table if not exists Laptop(
	Name VarChar(100) PRIMARY KEY,
	Price Numeric(6,2) NOT NULL,
	Storage VarChar(100) NOT NULL,
	Category VarChar(100) NOT NULL
);