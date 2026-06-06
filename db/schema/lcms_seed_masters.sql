-- =====================================================================
-- LCMS — Seed inserts for master/reference tables
-- Source: src/data/sampleData.ts and src/lib/permissions.ts
-- Run after lcms_schema.sql
-- =====================================================================

USE lcms;

-- ---------- Divisions ----------
INSERT INTO divisions (name) VALUES
  ('Bhongir Division'),
  ('Choutuppal Division');

-- ---------- Mandals (+ Tahsildar names) ----------
INSERT INTO mandals (name, tahsildar_name) VALUES
  ('Addagudur',            'Sri. G. Dasaratha'),
  ('Alair',                'Sri. P. Rama Krishna'),
  ('Atmakur(M)',           'Smt. M. Jayamma'),
  ('Bhongir',              'Sri. K. Venkat Reddy'),
  ('Bibinagar',            'Sri. Y. Ashok Reddy'),
  ('Bommalaramaram',       'Smt. P. Padmasundari'),
  ('Motakondur',           'Smt. P. Jyothi'),
  ('Mothkur',              'Sri. Shaik Ahmed'),
  ('Rajapet',              'Sri. P. Ravi Kumar'),
  ('Turkapally',           'Sri. V. Brahmaiah'),
  ('Yadagirigutta',        'Sri. Shobhan Babu'),
  ('Bhoodan Pochampally',  'Smt. B. Veera Bai'),
  ('Choutuppal',           'Sri. P. Shyam Sundar Reddy'),
  ('Ramannapet',           'Sri. V. Anjaneyulu'),
  ('Samsthan Narayanapur', 'Sri. Ch. Srinivasa Raju'),
  ('Valigonda',            'Sri. D. Ganesh'),
  ('Gundala',              'Smt. G. Jyothi');

-- ---------- Division ↔ Mandal mapping ----------
INSERT INTO division_mandals (division_id, mandal_id)
SELECT d.id, m.id FROM divisions d JOIN mandals m
  ON d.name = 'Bhongir Division'
 AND m.name IN ('Bhongir','Bibinagar','Bommalaramaram','Alair','Yadagirigutta',
                'Addagudur','Atmakur(M)','Motakondur','Turkapally');

INSERT INTO division_mandals (division_id, mandal_id)
SELECT d.id, m.id FROM divisions d JOIN mandals m
  ON d.name = 'Choutuppal Division'
 AND m.name IN ('Choutuppal','Mothkur','Rajapet','Bhoodan Pochampally',
                'Ramannapet','Samsthan Narayanapur','Valigonda','Gundala');

-- ---------- Collectorate Sections ----------
INSERT INTO collectorate_sections (code, name, description) VALUES
  ('C', 'Section C', 'Court / Legal Matters'),
  ('D', 'Section D', 'Land Revenue and Relief'),
  ('E', 'Section E', 'Land Administration'),
  ('G', 'Section G', 'Land Acquisition');

-- ---------- Case Types ----------
INSERT INTO case_types (name) VALUES
  ('WP'), ('WA'), ('CRP'), ('SA'), ('CC'),
  ('Writ Petition'), ('Contempt Case'), ('Land Dispute'),
  ('Revenue Matter'), ('Civil Suit'),
  ('Tribunal Matter'), ('Consumer Matter'), ('Service Matter'),
  ('Encroachment Matter'), ('Compensation Matter'), ('Compliance Matter');

-- ---------- Courts ----------
INSERT INTO courts (name, type) VALUES
  ('District Court, Bhongir',            'District Court'),
  ('Principal District Court, Bhongir',  'District Court'),
  ('Telangana High Court',               'High Court'),
  ('Revenue Tribunal',                   'Tribunal'),
  ('Civil Court, Bhongir',               'Civil Court'),
  ('Consumer Forum',                     'Forum');

-- ---------- Departments ----------
INSERT INTO departments (name) VALUES
  ('Collectorate Legal Cell'), ('Revenue Department'), ('Land Records'),
  ('Tahsildar Office'), ('Survey & Settlement'), ('Municipal Administration'),
  ('Panchayat Raj'), ('Roads & Buildings'), ('Irrigation'), ('Education Department');

-- ---------- Nature of Case ----------
INSERT INTO nature_of_case (name) VALUES
  ('Land Ownership Dispute'), ('Encroachment Removal'),
  ('Mutation / Revenue Record Issue'), ('Compensation / Acquisition Matter'),
  ('Service / Administrative Matter'), ('Court Direction Compliance'),
  ('Survey Boundary Dispute'), ('Public Land Protection Matter'),
  ('Municipal Notice Challenge'), ('Departmental Action Matter');

-- ---------- Case Statuses ----------
INSERT INTO case_statuses (name, is_default) VALUES
  ('Fresh', 1), ('Under Process', 1), ('Under Hearing', 1), ('Pending', 1),
  ('Hearing Scheduled', 1), ('Counter Pending', 1), ('Under Review', 1),
  ('Ongoing', 1), ('Appealed', 1), ('Disposed', 1), ('Closed', 1);

-- ---------- Pending Levels ----------
INSERT INTO pending_levels (name) VALUES
  ('Department'), ('GP Approval'), ('Collector Approval'),
  ('Counter Filing'), ('Compliance'), ('Hearing Update'),
  ('Final Action'), ('Closed');

-- ---------- Priorities ----------
INSERT INTO priorities (name) VALUES
  ('High'), ('Medium'), ('Low'), ('Time-Sensitive'), ('Court-Critical');

-- ---------- Compliance Statuses ----------
INSERT INTO compliance_statuses (name) VALUES
  ('Not Applicable'), ('Pending'), ('Partially Complied'), ('Complied');

-- ---------- Collectorate Involvement ----------
INSERT INTO collectorate_involvement_types (name) VALUES
  ('Collectorate as Respondent'),
  ('Collectorate as Co-Respondent'),
  ('Department Involved'),
  ('Monitoring Only');

-- ---------- Roles (from AppRole in src/lib/permissions.ts) ----------
INSERT INTO roles (name) VALUES
  ('Super Admin'), ('Admin'), ('District Collector'),
  ('Additional Collector (Revenue)'), ('Additional Collector (Local Bodies)'),
  ('DRO'), ('Administrative Officer'),
  ('District Legal Officer'),
  ('Section C Officer'), ('Section D Officer'), ('Section E Officer'), ('Section G Officer'),
  ('RDO Bhongir'), ('RDO Choutuppal'),
  ('High Court Representative Officer'),
  ('Department Nodal Officer'), ('Case Handling Officer'),
  ('Mandal-Level User'), ('Data Entry Operator'), ('Read-Only Viewer');
