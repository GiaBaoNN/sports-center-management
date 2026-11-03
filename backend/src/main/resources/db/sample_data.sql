/*
Sports Center Management System
SAMPLE DATA - for local development only
Target: Microsoft SQL Server

Demo login password for every sample account: 123456
Users.password stores a BCrypt hash of 123456.
*/

USE SportsCenterDB;
GO

/* Clear sample/development data in dependency order. */
IF OBJECT_ID(N'dbo.Notifications', N'U') IS NOT NULL DELETE FROM dbo.Notifications;
IF OBJECT_ID(N'dbo.TrainingResults', N'U') IS NOT NULL DELETE FROM dbo.TrainingResults;
IF OBJECT_ID(N'dbo.SupportRequests', N'U') IS NOT NULL DELETE FROM dbo.SupportRequests;
IF OBJECT_ID(N'dbo.AuditLogs', N'U') IS NOT NULL DELETE FROM dbo.AuditLogs;
IF OBJECT_ID(N'dbo.Attendance', N'U') IS NOT NULL DELETE FROM dbo.Attendance;
IF OBJECT_ID(N'dbo.ClassRegistrations', N'U') IS NOT NULL DELETE FROM dbo.ClassRegistrations;
IF OBJECT_ID(N'dbo.Schedules', N'U') IS NOT NULL DELETE FROM dbo.Schedules;
IF OBJECT_ID(N'dbo.TrainingPlans', N'U') IS NOT NULL DELETE FROM dbo.TrainingPlans;
IF OBJECT_ID(N'dbo.Invoices', N'U') IS NOT NULL DELETE FROM dbo.Invoices;
IF OBJECT_ID(N'dbo.Payments', N'U') IS NOT NULL DELETE FROM dbo.Payments;
IF OBJECT_ID(N'dbo.Classes', N'U') IS NOT NULL DELETE FROM dbo.Classes;
IF OBJECT_ID(N'dbo.Rooms', N'U') IS NOT NULL DELETE FROM dbo.Rooms;
IF OBJECT_ID(N'dbo.Sports', N'U') IS NOT NULL DELETE FROM dbo.Sports;
IF OBJECT_ID(N'dbo.Memberships', N'U') IS NOT NULL DELETE FROM dbo.Memberships;
IF OBJECT_ID(N'dbo.MembershipPackages', N'U') IS NOT NULL DELETE FROM dbo.MembershipPackages;
IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL DELETE FROM dbo.Users;
GO

/* BCrypt hash for sample password: 123456 */
DECLARE @DemoPasswordHash VARCHAR(255) =
'$2a$10$ZR9ZsAdGAvRrV/v6aTYky.DebiU6pX4QfPPcmHt4Y7U6q1DzGBLS.';

/* =========================================================
   1. USERS
   ========================================================= */
SET IDENTITY_INSERT dbo.Users ON;

INSERT INTO dbo.Users
(user_id, username, password, full_name, email, phone, role, is_active)
VALUES
(1, 'admin01',  @DemoPasswordHash, N'Nguyen Minh Anh', 'admin@sportscenter.vn', '0901000001', 'Manager',      1),
(2, 'recept01', @DemoPasswordHash, N'Tran Ngoc Mai',   'mai@sportscenter.vn',   '0901000002', 'Receptionist', 1),
(3, 'coach01',  @DemoPasswordHash, N'Le Hoang Nam',    'nam@sportscenter.vn',   '0901000003', 'Coach',        1),
(4, 'coach02',  @DemoPasswordHash, N'Pham Gia Huy',    'huy@sportscenter.vn',   '0901000004', 'Coach',        1),
(5, 'member01', @DemoPasswordHash, N'Nguyen Gia Bao',  'bao@gmail.com',         '0901000005', 'Member',       1),
(6, 'member02', @DemoPasswordHash, N'Tran Minh Khang', 'khang@gmail.com',       '0901000006', 'Member',       1),
(7, 'member03', @DemoPasswordHash, N'Le Thao Vy',      'vy@gmail.com',          '0901000007', 'Member',       1),
(8, 'member04', @DemoPasswordHash, N'Pham Quoc Tuan',  'tuan@gmail.com',        '0901000008', 'Member',       1),
(9, 'member05', @DemoPasswordHash, N'Hoang Ngoc Linh', 'linh@gmail.com',        '0901000009', 'Member',       1);

SET IDENTITY_INSERT dbo.Users OFF;
GO

/* =========================================================
   2. MEMBERSHIP PACKAGES
   ========================================================= */
SET IDENTITY_INSERT dbo.MembershipPackages ON;

INSERT INTO dbo.MembershipPackages
(package_id, name, description, duration_days, price, is_active)
VALUES
(1, N'Basic',   N'Basic membership package',   30,  500000.00, 1),
(2, N'Premium', N'Premium membership package', 90, 1200000.00, 1),
(3, N'Annual',  N'Annual membership package', 365, 4000000.00, 1);

SET IDENTITY_INSERT dbo.MembershipPackages OFF;
GO

/* =========================================================
   3. MEMBERSHIPS
   ========================================================= */
SET IDENTITY_INSERT dbo.Memberships ON;

INSERT INTO dbo.Memberships
(membership_id, user_id, package_id, start_date, end_date, status)
VALUES
(1, 5, 1, '2026-01-01', '2026-01-30', 'Expired'),
(2, 5, 2, '2026-07-01', '2026-09-28', 'Expired'),
(3, 6, 1, '2026-09-15', '2026-10-14', 'Expired'),
(4, 7, 2, '2026-10-07', '2027-01-04', 'Pending'),
(5, 8, 1, '2026-09-01', '2026-09-30', 'Expired'),
(6, 9, 3, '2026-09-01', '2027-08-31', 'Active');

SET IDENTITY_INSERT dbo.Memberships OFF;
GO

/* =========================================================
   4. ROOMS
   ========================================================= */
SET IDENTITY_INSERT dbo.Rooms ON;

INSERT INTO dbo.Rooms
(room_id, room_name, max_capacity, location)
VALUES
(1, N'Room A',        20, N'1st Floor'),
(2, N'Room B',        25, N'1st Floor'),
(3, N'Room C',        15, N'2nd Floor'),
(4, N'Outdoor Court', 30, N'Ground Floor');

SET IDENTITY_INSERT dbo.Rooms OFF;
GO

/* =========================================================
   5. SPORTS
   ========================================================= */
SET IDENTITY_INSERT dbo.Sports ON;

INSERT INTO dbo.Sports
(sport_id, name, description)
VALUES
(1, N'Yoga',      N'Yoga and flexibility training'),
(2, N'Badminton', N'Badminton training'),
(3, N'Swimming',  N'Swimming training'),
(4, N'Fitness',   N'General fitness and strength training');

SET IDENTITY_INSERT dbo.Sports OFF;
GO

/* =========================================================
   6. CLASSES
   No class capacity. Use Room.max_capacity.
   ========================================================= */
SET IDENTITY_INSERT dbo.Classes ON;

INSERT INTO dbo.Classes
(class_id, class_name, sport_id, room_id, coach_id, status)
VALUES
(1, N'Yoga Beginner',      1, 1, 3, 'Upcoming'),
(2, N'Yoga Intermediate',  1, 1, 3, 'Upcoming'),
(3, N'Badminton Basics',   2, 4, 4, 'Upcoming'),
(4, N'Swimming Beginner',  3, 2, 4, 'Upcoming'),
(5, N'Fitness Strength',   4, 3, 3, 'Upcoming'),
(6, N'Badminton Advanced', 2, 4, 4, 'Cancelled');

SET IDENTITY_INSERT dbo.Classes OFF;
GO

/* =========================================================
   7. SCHEDULES
   class_date = DATE(start_datetime)
   ========================================================= */
SET IDENTITY_INSERT dbo.Schedules ON;

INSERT INTO dbo.Schedules
(schedule_id, class_id, class_date, start_datetime, end_datetime)
VALUES
(1, 1, '2026-10-08', '2026-10-08 18:00:00', '2026-10-08 19:00:00'),
(2, 1, '2026-10-10', '2026-10-10 18:00:00', '2026-10-10 19:00:00'),
(3, 2, '2026-10-09', '2026-10-09 19:00:00', '2026-10-09 20:00:00'),
(4, 3, '2026-10-08', '2026-10-08 17:00:00', '2026-10-08 18:30:00'),
(5, 3, '2026-10-11', '2026-10-11 17:00:00', '2026-10-11 18:30:00'),
(6, 4, '2026-10-09', '2026-10-09 16:00:00', '2026-10-09 17:30:00'),
(7, 5, '2026-10-12', '2026-10-12 18:00:00', '2026-10-12 19:00:00'),
(8, 6, '2026-10-13', '2026-10-13 20:00:00', '2026-10-13 21:30:00');

SET IDENTITY_INSERT dbo.Schedules OFF;
GO

/* =========================================================
   8. CLASS REGISTRATIONS
   Includes cancellation + re-registration history.
   ========================================================= */
SET IDENTITY_INSERT dbo.ClassRegistrations ON;

INSERT INTO dbo.ClassRegistrations
(registration_id, class_id, member_id, registration_date, status)
VALUES
(1, 1, 5, '2026-10-02 09:00:00', 'Cancelled'),
(2, 1, 5, '2026-10-07 09:00:00', 'Registered'),
(3, 1, 6, '2026-10-07 09:15:00', 'Registered'),
(4, 1, 7, '2026-10-07 10:00:00', 'Registered'),
(5, 2, 5, '2026-10-07 10:30:00', 'Registered'),
(6, 3, 8, '2026-10-07 11:00:00', 'Registered'),
(7, 3, 9, '2026-10-07 11:30:00', 'Registered'),
(8, 4, 6, '2026-10-07 13:00:00', 'Cancelled'),
(9, 5, 6, '2026-10-07 13:10:00', 'Registered'),
(10, 5, 7, '2026-10-07 13:20:00', 'Registered');

SET IDENTITY_INSERT dbo.ClassRegistrations OFF;
GO

/* =========================================================
   9. ATTENDANCE
   ========================================================= */
SET IDENTITY_INSERT dbo.Attendance ON;

INSERT INTO dbo.Attendance
(attendance_id, schedule_id, status, notes, registration_id)
VALUES
(1,  1, 'Present', N'Arrived on time',       2),
(2,  1, 'Present', NULL,                     3),
(3,  1, 'Absent',  N'Absent without notice', 4),
(4,  2, 'Present', NULL,                     2),
(5,  2, 'Absent',  N'Personal reason',       3),
(6,  4, 'Present', N'Good participation',    6),
(7,  4, 'Present', NULL,                     7),
(8,  5, 'Present', NULL,                     6),
(9,  5, 'Present', NULL,                     7),
(10, 7, 'Present', NULL,                     9),
(11, 7, 'Present', NULL,                     10);

SET IDENTITY_INSERT dbo.Attendance OFF;
GO

/* =========================================================
   10. TRAINING PLANS - Optional
   ========================================================= */
SET IDENTITY_INSERT dbo.TrainingPlans ON;

INSERT INTO dbo.TrainingPlans
(plan_id, coach_id, member_id, goals, ai_recommendation, created_date)
VALUES
(1, 3, 5,
 N'Improve flexibility and core strength',
 N'Practice yoga 3 times per week and stretch for 10 minutes daily',
 '2026-10-01'),
(2, 3, 6,
 N'Increase strength and endurance',
 N'Combine strength training with 20 minutes of cardio',
 '2026-10-02'),
(3, 4, 7,
 N'Learn basic swimming techniques',
 N'Practice breathing and freestyle technique twice per week',
 '2026-10-02'),
(4, 4, 8,
 N'Improve badminton footwork',
 N'Practice footwork drills and basic strokes',
 '2026-10-03'),
(5, 3, 9,
 N'Maintain overall fitness',
 N'Attend fitness classes regularly',
 '2026-10-03');

SET IDENTITY_INSERT dbo.TrainingPlans OFF;
GO

/* =========================================================
   11. PAYMENTS
   ========================================================= */
SET IDENTITY_INSERT dbo.Payments ON;

INSERT INTO dbo.Payments
(payment_id, membership_id, amount, payment_date,
 payment_method, status, momo_order_id, momo_transaction_id)
VALUES
(1, 1,  500000.00, '2026-01-01 09:00:00', 'Cash', 'Paid',    NULL,               NULL),
(2, 2, 1200000.00, '2026-06-30 10:00:00', 'MoMo', 'Paid',    'SCMS-MOMO-000002', 'MOMO-TXN-000002'),
(3, 3,  500000.00, '2026-09-15 08:30:00', 'Cash', 'Paid',    NULL,               NULL),
(4, 4, 1200000.00, '2026-10-07 11:00:00', 'MoMo', 'Failed',  'SCMS-MOMO-000004', NULL),
(5, 4, 1200000.00, '2026-10-07 11:10:00', 'MoMo', 'Pending', 'SCMS-MOMO-000005', NULL),
(6, 5,  500000.00, '2026-09-01 09:00:00', 'Cash', 'Paid',    NULL,               NULL),
(7, 6, 4000000.00, '2026-09-01 15:00:00', 'MoMo', 'Paid',    'SCMS-MOMO-000007', 'MOMO-TXN-000007');

SET IDENTITY_INSERT dbo.Payments OFF;
GO

/* =========================================================
   12. INVOICES - Only Paid payments have invoices.
   ========================================================= */
SET IDENTITY_INSERT dbo.Invoices ON;

INSERT INTO dbo.Invoices
(invoice_id, payment_id, issue_date, total_amount, invoice_url)
VALUES
(1, 1, '2026-01-01 09:06:00',  500000.00, NULL),
(2, 2, '2026-06-30 10:03:00', 1200000.00, NULL),
(3, 3, '2026-09-15 08:36:00',  500000.00, NULL),
(4, 6, '2026-09-01 09:04:00',  500000.00, NULL),
(5, 7, '2026-09-01 15:02:00', 4000000.00, NULL);

SET IDENTITY_INSERT dbo.Invoices OFF;
GO

/* =========================================================
   13. NOTIFICATIONS
   ========================================================= */
SET IDENTITY_INSERT dbo.Notifications ON;

INSERT INTO dbo.Notifications
(notification_id, user_id, title, message, notification_type, created_at, is_read, read_at)
VALUES
(1, 6, N'Membership expiring soon',
 N'Your Basic membership is scheduled to expire on 2026-10-14.',
 'MembershipExpiration', '2026-10-10 09:00:00', 0, NULL),
(2, 7, N'Payment update',
 N'Your membership payment needs to be reviewed. Please contact the receptionist if you need assistance.',
 'PaymentUpdate', '2026-10-07 11:15:00', 1, '2026-10-07 11:20:00'),
(3, 5, N'Class schedule updated',
 N'A class schedule has been updated. Please check your personal training schedule for the latest details.',
 'ClassScheduleChange', '2026-10-09 15:00:00', 0, NULL),
(4, 3, N'Teaching schedule reminder',
 N'Please review your assigned classes and upcoming teaching schedule.',
 'ClassReminder', '2026-10-11 08:00:00', 0, NULL),
(5, 9, N'Welcome to Sports Center',
 N'Welcome! You can review your membership information and class schedules in your account.',
 'General', '2026-10-01 10:00:00', 1, '2026-10-01 10:05:00');

SET IDENTITY_INSERT dbo.Notifications OFF;
GO

/* =========================================================
   14. TRAINING RESULTS - optional feature
   ========================================================= */
INSERT INTO dbo.TrainingResults
(plan_id, schedule_id, coach_id, member_id, result_notes, progress_comment, recorded_at)
VALUES
(1, 1, 3, 5,
 N'Completed beginner flexibility session.',
 N'Improved range of motion; continue daily stretching.',
 '2026-10-08 19:10:00'),
(2, 1, 3, 6,
 N'Completed strength and endurance assessment.',
 N'Increase workload gradually while maintaining correct form.',
 '2026-10-08 19:15:00');
GO

/* =========================================================
   15. AUDIT LOGS
   ========================================================= */
INSERT INTO dbo.AuditLogs
(actor_user_id, action_type, entity_name, entity_id, details, created_at)
VALUES
(1, 'CREATE', 'MembershipPackage', '1', N'Created Basic package.',             '2026-10-01 08:00:00'),
(2, 'CREATE', 'Membership',        '4', N'Registered membership for member 7.','2026-10-07 11:05:00');
GO

/* =========================================================
   16. SUPPORT REQUESTS
   ========================================================= */
INSERT INTO dbo.SupportRequests
(member_id, received_by, subject, description, status, created_at)
VALUES
(7, 2, N'Membership payment question',
 N'Member asked about the pending membership payment.',
 'Open', '2026-10-07 11:20:00'),
(5, 2, N'Class schedule clarification',
 N'Member requested confirmation of the upcoming class schedule.',
 'Resolved', '2026-10-09 15:10:00');
GO

/* =========================================================
   QUICK TEST QUERIES
   ========================================================= */

-- A. Login lookup by phone
SELECT user_id, username, full_name, email, phone, role, is_active
FROM dbo.Users
WHERE phone = '0901000005';
GO

-- B. Active memberships
SELECT * FROM dbo.vw_ActiveMemberships ORDER BY end_date;
GO

-- C. Class schedule and capacity
SELECT * FROM dbo.vw_ClassScheduleCapacity ORDER BY class_date, start_datetime;
GO

-- D. Payment + invoice history
SELECT
    p.payment_id,
    m.membership_id,
    u.full_name,
    u.phone,
    p.amount,
    p.payment_method,
    p.status AS payment_status,
    i.invoice_id,
    i.issue_date
FROM dbo.Payments p
JOIN dbo.Memberships m  ON m.membership_id = p.membership_id
JOIN dbo.Users u        ON u.user_id = m.user_id
LEFT JOIN dbo.Invoices i ON i.payment_id = p.payment_id
ORDER BY p.payment_date DESC;
GO

-- E. Notifications for a single user (example: member user_id = 6)
SELECT notification_id, title, message, notification_type, created_at, is_read, read_at
FROM dbo.Notifications
WHERE user_id = 6
ORDER BY created_at DESC;
GO

-- F. Registration + attendance
SELECT
    cr.registration_id,
    u.full_name AS member_name,
    c.class_name,
    s.class_date,
    s.start_datetime,
    a.status AS attendance_status,
    a.notes
FROM dbo.ClassRegistrations cr
JOIN dbo.Users u        ON u.user_id = cr.member_id
JOIN dbo.Classes c      ON c.class_id = cr.class_id
JOIN dbo.Schedules s    ON s.class_id = c.class_id
LEFT JOIN dbo.Attendance a
    ON a.registration_id = cr.registration_id AND a.schedule_id = s.schedule_id
ORDER BY s.start_datetime, u.full_name;
GO
