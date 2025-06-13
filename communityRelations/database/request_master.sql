USE [comrel_master]
GO

/****** Object:  Table [dbo].[request_master]    Script Date: 11/06/2025 3:44:31 pm ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[request_master](
	[request_id] [int] IDENTITY(1,1) ,
	[request_status] [varchar](255) ,
	[comment_id] [varchar](255) ,
	[comm_Area] [varchar](255) ,
	[comm_Act] [varchar](255) ,
	[date_Time] [varchar](255) L,
	[comm_Venue] [varchar](255) ,
	[comm_Guest] [varchar](255) ,
	[comm_Docs] [varchar](max) ,
	[comm_Emps] [varchar](255) ,
	[comm_Benef] [varchar](255) ,
	[created_by] [varchar](255) ,
	[created_at] [varchar](255) ,
	[updated_by] [varchar](255) ,
	[updated_at] [varchar](255) ,
PRIMARY KEY CLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


