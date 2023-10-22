CREATE DATABASE PCPartsDB
USE PCPartsDB
Create Table CPUParts(
	useCase VarChar(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	name VarChar(max) NOT NULL,
	price Numeric(6,2) NOT NULL,
	performance_score Integer NOT NULL
);
Create Table GPUParts(
	useCase VarChar(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	name VarChar(max) NOT NULL,
	price Numeric(6,2) NOT NULL,
	performance_score Integer NOT NULL
);
Create Table RAMParts(
	useCase VarChar(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	name VarChar(max) NOT NULL,
	price Numeric(6,2) NOT NULL,
	performance_score Integer NOT NULL
);
Create Table STORAGEParts(
	useCase VarChar(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	name VarChar(max) NOT NULL,
	price Numeric(6,2) NOT NULL,
	performance_score Integer NOT NULL
);
Create Table PSUParts(
	useCase VarChar(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	name VarChar(max) NOT NULL,
	price Numeric(6,2) NOT NULL,
	performance_score Integer NOT NULL
);
Create Table CASEParts(
	useCase VarChar(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	name VarChar(max) NOT NULL ,
	price Numeric(6,2) NOT NULL,
);
Create Table MOTHERBOARDParts(
	useCase VarChar(30) NOT NULL,
	quality VarChar(30) NOT NULL,
	partType VarChar(30) NOT NULL,
	name VarChar(max) NOT NULL,
	price Numeric(6,2) NOT NULL,
);