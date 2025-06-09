USE [comrel_master]
GO

/****** Object:  Table [dbo].[request_master]    Script Date: 05/06/2025 2:35:51 pm ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[request_master](
	[request_id] [int] IDENTITY(1,1) NOT NULL,
	[request_status] [varchar](255) NOT NULL,
	[comm_Area] [varchar](255) NOT NULL,
	[comm_Act] [varchar](255) NOT NULL,
	[date_Time] [varchar](255) NOT NULL,
	[comm_Venue] [varchar](255) NOT NULL,
	[comm_Guest] [varchar](255) NULL,
	[comm_Docs] [varchar](255) NULL,
	[comm_Emps] [varchar](255) NULL,
	[comm_Benef] [varchar](255) NULL,
	[created_by] [varchar](255) NULL,
	[created_at] [varchar](255) NULL,
	[updated_by] [varchar](255) NULL,
	[updated_at] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


