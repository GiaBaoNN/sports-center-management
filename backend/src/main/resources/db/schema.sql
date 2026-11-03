/*
Sports Center Management System
FINAL DATABASE - aligned with SCMS functional requirements
Target: Microsoft SQL Server

Authentication:
- Phone is the login identifier.
- Username, full_name and email are profile information.
- The column is named password to match the ERD, but the application
  must store a BCrypt password hash in this column, never plaintext.

Payment:
- Membership registration / renewal only.
- Payment methods: Cash, MoMo.
*/

IF DB_ID(N'SportsCenterDB') IS NULL
BEGIN
    CREATE DATABASE SportsCenterDB;
END
GO

USE SportsCenterDB;
GO

IF OBJECT_ID(N'dbo.vw_ClassScheduleCapacity', N'V') IS NOT NULL DROP VIEW dbo.vw_ClassScheduleCapacity;
IF OBJECT_ID(N'dbo.vw_ActiveMemberships', N'V') IS NOT NULL DROP VIEW dbo.vw_ActiveMemberships;
GO

/* Clean rebuild - use only for an empty/development database. */
IF OBJECT_ID(N'dbo.TrainingResults', N'U') IS NOT NULL DROP TABLE dbo.TrainingResults;
IF OBJECT_ID(N'dbo.SupportRequests', N'U') IS NOT NULL DROP TABLE dbo.SupportRequests;
IF OBJECT_ID(N'dbo.AuditLogs', N'U') IS NOT NULL DROP TABLE dbo.AuditLogs;
IF OBJECT_ID(N'dbo.Notifications', N'U') IS NOT NULL DROP TABLE dbo.Notifications;
IF OBJECT_ID(N'dbo.Attendance', N'U') IS NOT NULL DROP TABLE dbo.Attendance;
IF OBJECT_ID(N'dbo.ClassRegistrations', N'U') IS NOT NULL DROP TABLE dbo.ClassRegistrations;
IF OBJECT_ID(N'dbo.Schedules', N'U') IS NOT NULL DROP TABLE dbo.Schedules;
IF OBJECT_ID(N'dbo.TrainingPlans', N'U') IS NOT NULL DROP TABLE dbo.TrainingPlans;
IF OBJECT_ID(N'dbo.Invoices', N'U') IS NOT NULL DROP TABLE dbo.Invoices;
IF OBJECT_ID(N'dbo.Payments', N'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID(N'dbo.Classes', N'U') IS NOT NULL DROP TABLE dbo.Classes;
IF OBJECT_ID(N'dbo.Rooms', N'U') IS NOT NULL DROP TABLE dbo.Rooms;
IF OBJECT_ID(N'dbo.Sports', N'U') IS NOT NULL DROP TABLE dbo.Sports;
IF OBJECT_ID(N'dbo.Memberships', N'U') IS NOT NULL DROP TABLE dbo.Memberships;
IF OBJECT_ID(N'dbo.MembershipPackages', N'U') IS NOT NULL DROP TABLE dbo.MembershipPackages;
IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL DROP TABLE dbo.Users;
GO

/* =========================================================
   1. USER
   ========================================================= */
CREATE TABLE dbo.Users (
    user_id       INT IDENTITY(1,1) PRIMARY KEY,
    username      VARCHAR(50) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    full_name     NVARCHAR(100) NOT NULL,
    email         VARCHAR(255) NULL,
    phone         VARCHAR(15) NOT NULL,
    role          VARCHAR(20) NOT NULL,
    is_active     BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT 1,

    CONSTRAINT UQ_Users_Username UNIQUE (username),
    CONSTRAINT UQ_Users_Phone UNIQUE (phone),

    CONSTRAINT CK_Users_Phone
        CHECK (phone NOT LIKE '%[^0-9]%' AND LEN(phone) BETWEEN 10 AND 11),

    CONSTRAINT CK_Users_Role
        CHECK (role IN ('Manager', 'Coach', 'Member', 'Receptionist'))
);
GO

/* =========================================================
   1A. NOTIFICATION
   One user can receive many notifications.
   ========================================================= */
CREATE TABLE dbo.Notifications (
    notification_id   INT IDENTITY(1,1) PRIMARY KEY,
    user_id           INT NOT NULL,
    title             NVARCHAR(150) NOT NULL,
    message           NVARCHAR(1000) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    created_at        DATETIME2 NOT NULL
                      CONSTRAINT DF_Notifications_CreatedAt DEFAULT SYSDATETIME(),
    is_read           BIT NOT NULL
                      CONSTRAINT DF_Notifications_IsRead DEFAULT 0,
    read_at           DATETIME2 NULL,

    CONSTRAINT FK_Notifications_User
        FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id)
);
GO

CREATE INDEX IX_Notifications_UserReadCreated
    ON dbo.Notifications(user_id, is_read, created_at DESC);
GO


/* =========================================================
   1B. AUDIT LOGS - FE-31
   Records important system actions for manager review.
   ========================================================= */
CREATE TABLE dbo.AuditLogs (
    audit_log_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    actor_user_id INT NULL,
    action_type VARCHAR(80) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NULL,
    details NVARCHAR(2000) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_AuditLogs_CreatedAt DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AuditLogs_Actor FOREIGN KEY (actor_user_id) REFERENCES dbo.Users(user_id)
);
GO
CREATE INDEX IX_AuditLogs_CreatedAt ON dbo.AuditLogs(created_at DESC);
CREATE INDEX IX_AuditLogs_Actor ON dbo.AuditLogs(actor_user_id, created_at DESC);
GO

/* =========================================================
   1C. SUPPORT REQUESTS - FE-39
   ========================================================= */
CREATE TABLE dbo.SupportRequests (
    support_request_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    member_id INT NOT NULL,
    received_by INT NULL,
    subject NVARCHAR(150) NOT NULL,
    description NVARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_SupportRequests_Status DEFAULT 'Open',
    created_at DATETIME2 NOT NULL CONSTRAINT DF_SupportRequests_CreatedAt DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NULL,
    resolution NVARCHAR(2000) NULL,
    CONSTRAINT FK_SupportRequests_Member FOREIGN KEY (member_id) REFERENCES dbo.Users(user_id),
    CONSTRAINT FK_SupportRequests_Receptionist FOREIGN KEY (received_by) REFERENCES dbo.Users(user_id),
    CONSTRAINT CK_SupportRequests_Status CHECK (status IN ('Open', 'InProgress', 'Resolved', 'Closed'))
);
GO
CREATE INDEX IX_SupportRequests_StatusCreated ON dbo.SupportRequests(status, created_at DESC);
CREATE INDEX IX_SupportRequests_Member ON dbo.SupportRequests(member_id, created_at DESC);
GO

/* =========================================================
   2. MEMBERSHIP_PACKAGE
   ========================================================= */
CREATE TABLE dbo.MembershipPackages (
    package_id      INT IDENTITY(1,1) PRIMARY KEY,
    name            NVARCHAR(100) NOT NULL,
    description     NVARCHAR(500) NULL,
    duration_days   INT NOT NULL,
    price           DECIMAL(18,2) NOT NULL,
    is_active       BIT NOT NULL
                    CONSTRAINT DF_MembershipPackages_IsActive DEFAULT 1,

    CONSTRAINT UQ_MembershipPackages_Name UNIQUE (name),
    CONSTRAINT CK_MembershipPackages_Duration CHECK (duration_days > 0),
    CONSTRAINT CK_MembershipPackages_Price CHECK (price >= 0)
);
GO

/* =========================================================
   3. MEMBERSHIP
   ========================================================= */
CREATE TABLE dbo.Memberships (
    membership_id   BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id          INT NOT NULL,
    package_id       INT NOT NULL,
    start_date       DATE NOT NULL,
    end_date         DATE NOT NULL,
    status           VARCHAR(20) NOT NULL
                     CONSTRAINT DF_Memberships_Status DEFAULT 'Pending',

    CONSTRAINT FK_Memberships_User
        FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id),

    CONSTRAINT FK_Memberships_Package
        FOREIGN KEY (package_id) REFERENCES dbo.MembershipPackages(package_id),

    CONSTRAINT CK_Memberships_Dates
        CHECK (end_date >= start_date),

    CONSTRAINT CK_Memberships_Status
        CHECK (status IN ('Active', 'Expired', 'Pending', 'Cancelled'))
);
GO

CREATE INDEX IX_Memberships_User
    ON dbo.Memberships(user_id, start_date DESC);

CREATE INDEX IX_Memberships_Status
    ON dbo.Memberships(status);

/* Only one ACTIVE membership for one user. */
CREATE UNIQUE INDEX UX_Memberships_OneActive
    ON dbo.Memberships(user_id)
    WHERE status = 'Active';
GO

/* =========================================================
   4. ROOM
   ========================================================= */
CREATE TABLE dbo.Rooms (
    room_id        INT IDENTITY(1,1) PRIMARY KEY,
    room_name      NVARCHAR(100) NOT NULL,
    max_capacity   INT NOT NULL,
    location       NVARCHAR(255) NULL,

    CONSTRAINT UQ_Rooms_Name UNIQUE (room_name),
    CONSTRAINT CK_Rooms_Capacity CHECK (max_capacity > 0)
);
GO

/* =========================================================
   5. SPORT
   ========================================================= */
CREATE TABLE dbo.Sports (
    sport_id      INT IDENTITY(1,1) PRIMARY KEY,
    name          NVARCHAR(100) NOT NULL,
    description   NVARCHAR(500) NULL,

    CONSTRAINT UQ_Sports_Name UNIQUE (name)
);
GO

/* =========================================================
   6. CLASS
   No CLASS.capacity: capacity comes from ROOM.max_capacity.
   ========================================================= */
CREATE TABLE dbo.Classes (
    class_id       INT IDENTITY(1,1) PRIMARY KEY,
    class_name     NVARCHAR(150) NOT NULL,
    sport_id       INT NOT NULL,
    room_id        INT NOT NULL,
    coach_id       INT NOT NULL,
    status         VARCHAR(20) NOT NULL
                   CONSTRAINT DF_Classes_Status DEFAULT 'Upcoming',

    CONSTRAINT FK_Classes_Sport
        FOREIGN KEY (sport_id) REFERENCES dbo.Sports(sport_id),

    CONSTRAINT FK_Classes_Room
        FOREIGN KEY (room_id) REFERENCES dbo.Rooms(room_id),

    CONSTRAINT FK_Classes_Coach
        FOREIGN KEY (coach_id) REFERENCES dbo.Users(user_id),

    CONSTRAINT CK_Classes_Status
        CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled'))
);
GO

CREATE INDEX IX_Classes_Sport ON dbo.Classes(sport_id);
CREATE INDEX IX_Classes_Room ON dbo.Classes(room_id);
CREATE INDEX IX_Classes_Coach ON dbo.Classes(coach_id);
GO

/* =========================================================
   7. SCHEDULE
   ERD: schedule_id, class_id, class_date,
        start_datetime, end_datetime.
   ========================================================= */
CREATE TABLE dbo.Schedules (
    schedule_id      BIGINT IDENTITY(1,1) PRIMARY KEY,
    class_id         INT NOT NULL,
    class_date       DATE NOT NULL,
    start_datetime   DATETIME2 NOT NULL,
    end_datetime     DATETIME2 NOT NULL,

    CONSTRAINT FK_Schedules_Class
        FOREIGN KEY (class_id) REFERENCES dbo.Classes(class_id),

    CONSTRAINT CK_Schedules_DateMatch
        CHECK (class_date = CONVERT(DATE, start_datetime)),

    CONSTRAINT CK_Schedules_Time
        CHECK (end_datetime > start_datetime),

    CONSTRAINT UQ_Schedules_ClassStart
        UNIQUE (class_id, start_datetime)
);
GO

CREATE INDEX IX_Schedules_Class
    ON dbo.Schedules(class_id);

CREATE INDEX IX_Schedules_DateTime
    ON dbo.Schedules(class_date, start_datetime);
GO

/* =========================================================
   8. CLASS_REGISTRATION
   ========================================================= */
CREATE TABLE dbo.ClassRegistrations (
    registration_id    BIGINT IDENTITY(1,1) PRIMARY KEY,
    class_id           INT NOT NULL,
    member_id          INT NOT NULL,
    registration_date  DATETIME2 NOT NULL
                       CONSTRAINT DF_ClassRegistrations_Date DEFAULT SYSDATETIME(),
    status              VARCHAR(20) NOT NULL
                        CONSTRAINT DF_ClassRegistrations_Status DEFAULT 'Registered',

    CONSTRAINT FK_ClassRegistrations_Class
        FOREIGN KEY (class_id) REFERENCES dbo.Classes(class_id),

    CONSTRAINT FK_ClassRegistrations_Member
        FOREIGN KEY (member_id) REFERENCES dbo.Users(user_id),

    CONSTRAINT CK_ClassRegistrations_Status
        CHECK (status IN ('Registered', 'Cancelled'))
);
GO

CREATE INDEX IX_ClassRegistrations_Class
    ON dbo.ClassRegistrations(class_id, status);

CREATE INDEX IX_ClassRegistrations_Member
    ON dbo.ClassRegistrations(member_id, status);

/* One active registration per Member + Class. */
CREATE UNIQUE INDEX UX_ClassRegistrations_Active
    ON dbo.ClassRegistrations(class_id, member_id)
    WHERE status = 'Registered';
GO

/* =========================================================
   9. ATTENDANCE
   No member_id: member is obtained through registration_id.
   ========================================================= */
CREATE TABLE dbo.Attendance (
    attendance_id    BIGINT IDENTITY(1,1) PRIMARY KEY,
    schedule_id      BIGINT NOT NULL,
    status            VARCHAR(20) NOT NULL,
    notes             NVARCHAR(500) NULL,
    registration_id  BIGINT NOT NULL,

    CONSTRAINT FK_Attendance_Schedule
        FOREIGN KEY (schedule_id) REFERENCES dbo.Schedules(schedule_id),

    CONSTRAINT FK_Attendance_Registration
        FOREIGN KEY (registration_id)
        REFERENCES dbo.ClassRegistrations(registration_id),

    CONSTRAINT CK_Attendance_Status
        CHECK (status IN ('Present', 'Absent')),

    CONSTRAINT UQ_Attendance_ScheduleRegistration
        UNIQUE (schedule_id, registration_id)
);
GO

CREATE INDEX IX_Attendance_Registration
    ON dbo.Attendance(registration_id);

CREATE INDEX IX_Attendance_Schedule
    ON dbo.Attendance(schedule_id);
GO

/* =========================================================
   10. TRAINING_PLAN
   Optional feature.
   ========================================================= */
CREATE TABLE dbo.TrainingPlans (
    plan_id           BIGINT IDENTITY(1,1) PRIMARY KEY,
    coach_id          INT NOT NULL,
    member_id         INT NULL,
    class_id          INT NULL,
    goals             NVARCHAR(1000) NOT NULL,
    ai_recommendation NVARCHAR(2000) NULL,
    created_date      DATE NOT NULL
                      CONSTRAINT DF_TrainingPlans_Date
                      DEFAULT CONVERT(DATE, GETDATE()),

    CONSTRAINT FK_TrainingPlans_Coach
        FOREIGN KEY (coach_id) REFERENCES dbo.Users(user_id),

    CONSTRAINT FK_TrainingPlans_Member
        FOREIGN KEY (member_id) REFERENCES dbo.Users(user_id),

    CONSTRAINT FK_TrainingPlans_Class
        FOREIGN KEY (class_id) REFERENCES dbo.Classes(class_id),

    CONSTRAINT CK_TrainingPlans_Target
        CHECK ((member_id IS NOT NULL AND class_id IS NULL) OR
               (member_id IS NULL AND class_id IS NOT NULL))
);
GO

CREATE INDEX IX_TrainingPlans_Coach
    ON dbo.TrainingPlans(coach_id, created_date DESC);

CREATE INDEX IX_TrainingPlans_Member
    ON dbo.TrainingPlans(member_id, created_date DESC) WHERE member_id IS NOT NULL;
CREATE INDEX IX_TrainingPlans_Class
    ON dbo.TrainingPlans(class_id, created_date DESC) WHERE class_id IS NOT NULL;
GO

/* Training outcomes and coach feedback - FE-23, FE-24, FE-26. */
CREATE TABLE dbo.TrainingResults (
    training_result_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    schedule_id BIGINT NULL,
    coach_id INT NOT NULL,
    member_id INT NOT NULL,
    result_notes NVARCHAR(2000) NOT NULL,
    progress_comment NVARCHAR(2000) NULL,
    recorded_at DATETIME2 NOT NULL CONSTRAINT DF_TrainingResults_RecordedAt DEFAULT SYSDATETIME(),
    CONSTRAINT FK_TrainingResults_Plan FOREIGN KEY (plan_id) REFERENCES dbo.TrainingPlans(plan_id),
    CONSTRAINT FK_TrainingResults_Schedule FOREIGN KEY (schedule_id) REFERENCES dbo.Schedules(schedule_id),
    CONSTRAINT FK_TrainingResults_Coach FOREIGN KEY (coach_id) REFERENCES dbo.Users(user_id),
    CONSTRAINT FK_TrainingResults_Member FOREIGN KEY (member_id) REFERENCES dbo.Users(user_id)
);
GO
CREATE INDEX IX_TrainingResults_Member ON dbo.TrainingResults(member_id, recorded_at DESC);
CREATE INDEX IX_TrainingResults_Plan ON dbo.TrainingResults(plan_id, recorded_at DESC);
GO

/* =========================================================
   11. PAYMENT
   ERD: payment is linked to Membership only.
   ========================================================= */
CREATE TABLE dbo.Payments (
    payment_id           BIGINT IDENTITY(1,1) PRIMARY KEY,
    membership_id        BIGINT NOT NULL,
    amount                DECIMAL(18,2) NOT NULL,
    payment_date          DATETIME2 NOT NULL
                           CONSTRAINT DF_Payments_Date DEFAULT SYSDATETIME(),
    payment_method        VARCHAR(10) NOT NULL,
    status                 VARCHAR(15) NOT NULL
                           CONSTRAINT DF_Payments_Status DEFAULT 'Pending',
    momo_order_id         VARCHAR(100) NULL,
    momo_transaction_id   VARCHAR(100) NULL,

    CONSTRAINT FK_Payments_Membership
        FOREIGN KEY (membership_id)
        REFERENCES dbo.Memberships(membership_id),

    CONSTRAINT CK_Payments_Amount
        CHECK (amount > 0),

    CONSTRAINT CK_Payments_Method
        CHECK (payment_method IN ('MoMo', 'Cash')),

    CONSTRAINT CK_Payments_Status
        CHECK (status IN ('Paid', 'Failed', 'Pending', 'Cancelled'))
);
GO

CREATE INDEX IX_Payments_Membership
    ON dbo.Payments(membership_id, payment_date DESC);

CREATE INDEX IX_Payments_Status
    ON dbo.Payments(status);

CREATE UNIQUE INDEX UX_Payments_MoMoOrder
    ON dbo.Payments(momo_order_id)
    WHERE momo_order_id IS NOT NULL;

CREATE UNIQUE INDEX UX_Payments_MoMoTransaction
    ON dbo.Payments(momo_transaction_id)
    WHERE momo_transaction_id IS NOT NULL;
GO

/* =========================================================
   12. INVOICE
   One payment can generate at most one invoice.
   ========================================================= */
CREATE TABLE dbo.Invoices (
    invoice_id     BIGINT IDENTITY(1,1) PRIMARY KEY,
    payment_id     BIGINT NOT NULL,
    issue_date     DATETIME2 NOT NULL
                   CONSTRAINT DF_Invoices_Date DEFAULT SYSDATETIME(),
    total_amount   DECIMAL(18,2) NOT NULL,
    invoice_url    VARCHAR(1000) NULL,

    CONSTRAINT FK_Invoices_Payment
        FOREIGN KEY (payment_id) REFERENCES dbo.Payments(payment_id),

    CONSTRAINT UQ_Invoices_Payment UNIQUE (payment_id),

    CONSTRAINT CK_Invoices_Total
        CHECK (total_amount > 0)
);
GO

/* =========================================================
   BUSINESS-INTEGRITY TRIGGERS
   Application services should still validate these rules and return clear errors.
   ========================================================= */
GO
CREATE TRIGGER dbo.TR_Classes_RequireCoach
ON dbo.Classes AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.Users u ON u.user_id=i.coach_id WHERE u.role <> 'Coach')
    BEGIN
        RAISERROR('coach_id must reference a user with role Coach.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
CREATE TRIGGER dbo.TR_Memberships_RequireMember
ON dbo.Memberships AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.Users u ON u.user_id=i.user_id WHERE u.role <> 'Member')
    BEGIN
        RAISERROR('Membership user_id must reference a user with role Member.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
CREATE TRIGGER dbo.TR_ClassRegistrations_RequireMember
ON dbo.ClassRegistrations AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.Users u ON u.user_id=i.member_id WHERE u.role <> 'Member')
    BEGIN
        RAISERROR('member_id must reference a user with role Member.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO
CREATE TRIGGER dbo.TR_TrainingPlans_ValidateRoles
ON dbo.TrainingPlans AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.Users u ON u.user_id=i.coach_id WHERE u.role <> 'Coach')
    BEGIN
        RAISERROR('coach_id must reference a user with role Coach.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.Users u ON u.user_id=i.member_id WHERE u.role <> 'Member')
    BEGIN
        RAISERROR('member_id must reference a user with role Member.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO
CREATE TRIGGER dbo.TR_TrainingResults_ValidateRoles
ON dbo.TrainingResults AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN dbo.Users u ON u.user_id=i.coach_id WHERE u.role <> 'Coach')
       OR EXISTS (SELECT 1 FROM inserted i JOIN dbo.Users u ON u.user_id=i.member_id WHERE u.role <> 'Member')
    BEGIN
        RAISERROR('Training result coach_id/member_id roles are invalid.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO
CREATE TRIGGER dbo.TR_ClassRegistrations_EnforceCapacity
ON dbo.ClassRegistrations AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1
        FROM dbo.Classes c
        JOIN dbo.Rooms r ON r.room_id=c.room_id
        JOIN dbo.ClassRegistrations cr ON cr.class_id=c.class_id AND cr.status='Registered'
        JOIN (SELECT DISTINCT class_id FROM inserted WHERE status='Registered') i ON i.class_id=c.class_id
        GROUP BY c.class_id, r.max_capacity
        HAVING COUNT(*) > r.max_capacity
    )
    BEGIN
        RAISERROR('Class registration exceeds the room capacity.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO
CREATE TRIGGER dbo.TR_Attendance_MatchClass
ON dbo.Attendance AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN dbo.Schedules s ON s.schedule_id=i.schedule_id
        JOIN dbo.ClassRegistrations cr ON cr.registration_id=i.registration_id
        WHERE s.class_id <> cr.class_id
    )
    BEGIN
        RAISERROR('Attendance schedule and registration must belong to the same class.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO
CREATE TRIGGER dbo.TR_Schedules_NoRoomOverlap
ON dbo.Schedules AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN dbo.Classes ci ON ci.class_id=i.class_id
        JOIN dbo.Schedules s ON s.schedule_id<>i.schedule_id
        JOIN dbo.Classes cs ON cs.class_id=s.class_id AND cs.room_id=ci.room_id
        WHERE i.start_datetime < s.end_datetime AND i.end_datetime > s.start_datetime
          AND ci.status <> 'Cancelled' AND cs.status <> 'Cancelled'
    )
    BEGIN
        RAISERROR('A room cannot host overlapping class schedules.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO

/* =========================================================
   HELPFUL VIEWS
   ========================================================= */
CREATE VIEW dbo.vw_ActiveMemberships
AS
SELECT
    m.membership_id,
    m.user_id,
    u.username,
    u.full_name,
    u.phone,
    m.package_id,
    p.name AS package_name,
    p.duration_days,
    p.price,
    m.start_date,
    m.end_date,
    m.status
FROM dbo.Memberships m
JOIN dbo.Users u
    ON u.user_id = m.user_id
JOIN dbo.MembershipPackages p
    ON p.package_id = m.package_id
WHERE m.status = 'Active';
GO

CREATE VIEW dbo.vw_ClassScheduleCapacity
AS
SELECT
    c.class_id,
    c.class_name,
    sp.name AS sport_name,
    r.room_name,
    r.max_capacity,
    u.full_name AS coach_name,
    c.status AS class_status,
    s.schedule_id,
    s.class_date,
    s.start_datetime,
    s.end_datetime,
    COUNT(DISTINCT CASE WHEN cr.status = 'Registered'
                         THEN cr.registration_id END) AS registered_members,
    r.max_capacity
      - COUNT(CASE WHEN cr.status = 'Registered'
                   THEN cr.registration_id END) AS remaining_slots
    -- Note: max_capacity is already listed above; not repeated here to avoid duplicate column names
FROM dbo.Classes c
JOIN dbo.Sports sp
    ON sp.sport_id = c.sport_id
JOIN dbo.Rooms r
    ON r.room_id = c.room_id
JOIN dbo.Users u
    ON u.user_id = c.coach_id
JOIN dbo.Schedules s
    ON s.class_id = c.class_id
LEFT JOIN dbo.ClassRegistrations cr
    ON cr.class_id = c.class_id
GROUP BY
    c.class_id,
    c.class_name,
    sp.name,
    r.room_name,
    r.max_capacity,
    u.full_name,
    c.status,
    s.schedule_id,
    s.class_date,
    s.start_datetime,
    s.end_datetime;
GO

/*
APPLICATION BUSINESS RULES
1. Login uses Users.phone + Users.password.
2. Store a BCrypt hash in Users.password; never plaintext.
3. coach_id must refer to a User whose role = 'Coach'.
4. member_id must refer to a User whose role = 'Member'.
5. Class capacity comes from Room.max_capacity.
6. Registration must be rejected when registered count reaches room capacity.
7. Only one Registered ClassRegistration is allowed per class + member.
8. Re-registration after cancellation may create a new registration row.
9. Attendance must reference a registration belonging to the same class as its schedule.
10. A room cannot host overlapping class schedules.
11. Class status is application-managed:
       Upcoming -> Ongoing -> Completed
    and Manager can set Upcoming -> Cancelled.
12. MoMo payment becomes Paid only after a verified provider result/callback.
13. Invoice is created only for a successful payment.
*/
GO
