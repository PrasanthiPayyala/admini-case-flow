-- =====================================================================
-- LCMS — Legal Cell Monitoring System
-- Yadadri Bhuvanagiri District Collectorate
-- MySQL 8.0+ schema (InnoDB, utf8mb4)
--
-- Maps 1:1 to the React/TypeScript data model in:
--   src/data/sampleData.ts        (master lists + CaseRecord, Party, CaseDoc,
--                                  DirectionRecord, ActionTakenRecord, AuditEntry)
--   src/contexts/DataContext.tsx  (HearingRecord, AppealRecord, AlertRecord)
--   src/lib/permissions.ts        (AppRole)
--
-- Every business table carries:
--   id    BIGINT  surrogate PK (for joins/perf)
--   code  VARCHAR human-readable ID used by the React frontend
--         (e.g. "LCMS/YBG/2026/001", "HRG/001", "DIR-…", "AUD-…")
--   created_at / updated_at  TIMESTAMP
--
-- All FKs are RESTRICT by default; child collections of a case CASCADE.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS lcms
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE lcms;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. MASTER / REFERENCE TABLES
-- ---------------------------------------------------------------------

CREATE TABLE divisions (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_divisions_name (name)
) ENGINE=InnoDB;

CREATE TABLE mandals (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(80) NOT NULL,
  tahsildar_name  VARCHAR(120) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_mandals_name (name)
) ENGINE=InnoDB;

CREATE TABLE division_mandals (
  division_id  BIGINT UNSIGNED NOT NULL,
  mandal_id    BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (division_id, mandal_id),
  CONSTRAINT fk_dm_div FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
  CONSTRAINT fk_dm_man FOREIGN KEY (mandal_id)   REFERENCES mandals(id)   ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE collectorate_sections (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(8)  NOT NULL,
  name         VARCHAR(64) NOT NULL,
  description  VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sections_code (code)
) ENGINE=InnoDB;

CREATE TABLE case_types (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_case_types_name (name)
) ENGINE=InnoDB;

CREATE TABLE courts (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(160) NOT NULL,
  type  VARCHAR(64) NULL,    -- High Court / District Court / Tribunal …
  PRIMARY KEY (id),
  UNIQUE KEY uk_courts_name (name)
) ENGINE=InnoDB;

CREATE TABLE departments (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(120) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_departments_name (name)
) ENGINE=InnoDB;

CREATE TABLE nature_of_case (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(120) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_noc_name (name)
) ENGINE=InnoDB;

CREATE TABLE case_statuses (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(64) NOT NULL,
  is_default  TINYINT(1) NOT NULL DEFAULT 0,  -- system status, cannot be deleted
  PRIMARY KEY (id),
  UNIQUE KEY uk_case_statuses_name (name)
) ENGINE=InnoDB;

CREATE TABLE pending_levels (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(64) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_pending_levels_name (name)
) ENGINE=InnoDB;

CREATE TABLE priorities (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_priorities_name (name)
) ENGINE=InnoDB;

CREATE TABLE compliance_statuses (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_compl_statuses_name (name)
) ENGINE=InnoDB;

CREATE TABLE collectorate_involvement_types (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(64) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_civ_name (name)
) ENGINE=InnoDB;

CREATE TABLE roles (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. AUTH
-- ---------------------------------------------------------------------

CREATE TABLE users (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(160) NOT NULL,
  phone           VARCHAR(40) NULL,
  password_hash   VARCHAR(255) NOT NULL,
  designation     VARCHAR(120) NULL,
  department_id   BIGINT UNSIGNED NULL,
  mandal_id       BIGINT UNSIGNED NULL,
  section_id      BIGINT UNSIGNED NULL,
  active          TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at   TIMESTAMP NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  CONSTRAINT fk_users_dept    FOREIGN KEY (department_id) REFERENCES departments(id)            ON DELETE SET NULL,
  CONSTRAINT fk_users_mandal  FOREIGN KEY (mandal_id)     REFERENCES mandals(id)                ON DELETE SET NULL,
  CONSTRAINT fk_users_section FOREIGN KEY (section_id)    REFERENCES collectorate_sections(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE user_roles (
  user_id  BIGINT UNSIGNED NOT NULL,
  role_id  BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE password_resets (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email       VARCHAR(160) NOT NULL,
  token       VARCHAR(120) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pr_email (email),
  UNIQUE KEY uk_pr_token (token)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. CORE CASE DOMAIN
-- ---------------------------------------------------------------------

CREATE TABLE cases (
  id                          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code                        VARCHAR(64)  NOT NULL,                -- CaseRecord.id  (e.g. "LCMS/YBG/2026/001")
  sl_no                       INT NULL,                              -- CaseRecord.slNo
  case_number                 VARCHAR(120) NOT NULL,                 -- CaseRecord.caseNumber
  title                       VARCHAR(255) NOT NULL,
  subject                     TEXT NULL,
  remarks                     TEXT NULL,

  -- Court / type
  court_id                    BIGINT UNSIGNED NULL,
  court_type                  VARCHAR(64) NULL,
  case_type_id                BIGINT UNSIGNED NULL,

  -- Parties (flat denorm strings kept for backward compat with frontend)
  petitioner                  VARCHAR(255) NOT NULL,
  respondent                  VARCHAR(255) NOT NULL,

  -- Org / location
  department_id               BIGINT UNSIGNED NULL,
  mandal_id                   BIGINT UNSIGNED NULL,
  division_id                 BIGINT UNSIGNED NULL,

  -- Filing
  filing_date                 DATE NULL,
  filing_year                 VARCHAR(8) NULL,
  case_year                   VARCHAR(8) NULL,
  sr_number                   VARCHAR(64) NULL,

  -- Assignment
  assigned_officer_id         BIGINT UNSIGNED NULL,
  advocate                    VARCHAR(160) NULL,
  advocate_contact            VARCHAR(80)  NULL,

  -- Classification
  priority                    ENUM('High','Medium','Low','Time-Sensitive','Court-Critical') NULL,
  status_id                   BIGINT UNSIGNED NULL,
  collectorate_involvement    ENUM('Collectorate as Respondent','Collectorate as Co-Respondent',
                                   'Department Involved','Monitoring Only') NULL,
  nature_of_case_id           BIGINT UNSIGNED NULL,
  land_dispute_flag           TINYINT(1) NOT NULL DEFAULT 0,

  -- Hearings cache
  last_hearing                DATE NULL,
  next_hearing                DATE NULL,

  -- Orders & compliance
  order_passed                TINYINT(1) NOT NULL DEFAULT 0,
  order_summary               TEXT NULL,
  compliance_required         TINYINT(1) NOT NULL DEFAULT 0,
  compliance_status           ENUM('Not Applicable','Pending','Partially Complied','Complied') NULL,
  compliance_due_date         DATE NULL,
  compliance_completed_date   DATE NULL,

  -- Approval workflow
  counter_draft_status        VARCHAR(64) NULL,
  gp_approval_status          VARCHAR(64) NULL,
  collector_approval_status   VARCHAR(64) NULL,
  counter_filing_due_date     DATE NULL,
  pending_at_level            VARCHAR(64) NULL,
  interim_order_status        VARCHAR(64) NULL,
  final_judgment_status       VARCHAR(64) NULL,
  final_action_status         VARCHAR(64) NULL,
  instructions_filed          ENUM('Yes','No','Pending') NULL,
  counter_filed               ENUM('Yes','No','Pending') NULL,

  -- Closure
  disposed                    ENUM('Yes','No') NOT NULL DEFAULT 'No',
  disposal_date               DATE NULL,
  disposal_summary            TEXT NULL,
  closed                      TINYINT(1) NOT NULL DEFAULT 0,
  closed_by                   VARCHAR(120) NULL,
  closed_at                   DATE NULL,

  last_updated                DATE NULL,
  created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_cases_code (code),
  KEY idx_cases_status        (status_id),
  KEY idx_cases_next_hearing  (next_hearing),
  KEY idx_cases_mandal        (mandal_id),
  KEY idx_cases_department    (department_id),
  KEY idx_cases_involvement   (collectorate_involvement),
  KEY idx_cases_officer       (assigned_officer_id),
  KEY idx_cases_filing_year   (filing_year),

  CONSTRAINT fk_cases_court    FOREIGN KEY (court_id)            REFERENCES courts(id)         ON DELETE SET NULL,
  CONSTRAINT fk_cases_ctype    FOREIGN KEY (case_type_id)        REFERENCES case_types(id)     ON DELETE SET NULL,
  CONSTRAINT fk_cases_dept     FOREIGN KEY (department_id)       REFERENCES departments(id)    ON DELETE SET NULL,
  CONSTRAINT fk_cases_mandal   FOREIGN KEY (mandal_id)           REFERENCES mandals(id)        ON DELETE SET NULL,
  CONSTRAINT fk_cases_division FOREIGN KEY (division_id)         REFERENCES divisions(id)      ON DELETE SET NULL,
  CONSTRAINT fk_cases_status   FOREIGN KEY (status_id)           REFERENCES case_statuses(id)  ON DELETE SET NULL,
  CONSTRAINT fk_cases_noc      FOREIGN KEY (nature_of_case_id)   REFERENCES nature_of_case(id) ON DELETE SET NULL,
  CONSTRAINT fk_cases_officer  FOREIGN KEY (assigned_officer_id) REFERENCES users(id)          ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tags  (CaseRecord.tags[])
CREATE TABLE case_tags (
  case_id  BIGINT UNSIGNED NOT NULL,
  tag      VARCHAR(64) NOT NULL,
  PRIMARY KEY (case_id, tag),
  CONSTRAINT fk_ct_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Simple co-respondent strings (CaseRecord.coRespondents[])
CREATE TABLE case_co_respondents (
  id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id   BIGINT UNSIGNED NOT NULL,
  name      VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_ccr_case (case_id),
  CONSTRAINT fk_ccr_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Rich parties (Party[] — petitioners / respondents / coRespondentParties)
CREATE TABLE case_parties (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  case_id           BIGINT UNSIGNED NOT NULL,
  role              ENUM('petitioner','respondent','co_respondent') NOT NULL,
  name              VARCHAR(255) NOT NULL,
  party_type        VARCHAR(80) NULL,     -- Party.type   (Individual / Govt Dept / Company …)
  department_id     BIGINT UNSIGNED NULL, -- Party.department resolved
  is_internal_dept  TINYINT(1) NOT NULL DEFAULT 0,
  remarks           TEXT NULL,
  PRIMARY KEY (id),
  KEY idx_cp_case (case_id),
  KEY idx_cp_role (role),
  CONSTRAINT fk_cp_case FOREIGN KEY (case_id)       REFERENCES cases(id)       ON DELETE CASCADE,
  CONSTRAINT fk_cp_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 1:1 approved counter doc (CaseRecord.approvedCounterDoc)
CREATE TABLE case_approved_counter_docs (
  case_id      BIGINT UNSIGNED NOT NULL,
  name         VARCHAR(255) NOT NULL,
  uploaded_by  VARCHAR(120) NOT NULL,
  uploaded_at  DATE NOT NULL,
  PRIMARY KEY (case_id),
  CONSTRAINT fk_acd_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 1:1 judgment doc (CaseRecord.judgmentDoc)
CREATE TABLE case_judgment_docs (
  case_id      BIGINT UNSIGNED NOT NULL,
  name         VARCHAR(255) NOT NULL,
  uploaded_by  VARCHAR(120) NOT NULL,
  uploaded_at  DATE NOT NULL,
  PRIMARY KEY (case_id),
  CONSTRAINT fk_jd_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. WORKFLOW CHILDREN
-- ---------------------------------------------------------------------

CREATE TABLE case_directions (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code                     VARCHAR(64) NOT NULL,                  -- DirectionRecord.id  ("DIR-…")
  case_id                  BIGINT UNSIGNED NOT NULL,
  text                     TEXT NOT NULL,
  issued_by                VARCHAR(120) NOT NULL,
  issued_at                DATE NOT NULL,
  concerned_officer        VARCHAR(160) NOT NULL,
  concerned_department_id  BIGINT UNSIGNED NULL,
  due_date                 DATE NULL,
  priority                 ENUM('High','Medium','Low') NOT NULL DEFAULT 'Medium',
  status                   ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
  created_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_dir_code (code),
  KEY idx_dir_case (case_id),
  CONSTRAINT fk_dir_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  CONSTRAINT fk_dir_dept FOREIGN KEY (concerned_department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE case_actions_taken (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code                  VARCHAR(64) NOT NULL,           -- ActionTakenRecord.id ("ACT-…")
  case_id               BIGINT UNSIGNED NOT NULL,
  summary               TEXT NOT NULL,
  doc_name              VARCHAR(255) NULL,
  doc_size              VARCHAR(40)  NULL,
  uploaded_by           VARCHAR(120) NOT NULL,
  uploaded_at           DATE NOT NULL,
  linked_direction_id   BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_act_code (code),
  KEY idx_act_case (case_id),
  CONSTRAINT fk_act_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  CONSTRAINT fk_act_dir  FOREIGN KEY (linked_direction_id) REFERENCES case_directions(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE case_documents (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code          VARCHAR(64) NOT NULL,                   -- CaseDoc.id ("DOC-…")
  case_id       BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(255) NOT NULL,
  stage         ENUM('Filed','Interim','Counter','Compliance / Action Taken','Judgment','Miscellaneous') NOT NULL,
  uploaded_by   VARCHAR(120) NOT NULL,
  uploaded_at   DATE NOT NULL,
  size          VARCHAR(40) NULL,
  mime          VARCHAR(120) NULL,
  storage_path  VARCHAR(500) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_doc_code (code),
  KEY idx_doc_case_stage (case_id, stage),
  CONSTRAINT fk_doc_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. HEARINGS / APPEALS / ALERTS
-- ---------------------------------------------------------------------

CREATE TABLE hearings (
  id                          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code                        VARCHAR(64) NOT NULL,    -- HearingRecord.id ("HRG/001")
  case_id                     BIGINT UNSIGNED NOT NULL,
  case_title                  VARCHAR(255) NOT NULL,
  court                       VARCHAR(160) NULL,
  date                        DATE NOT NULL,
  time                        VARCHAR(20) NULL,
  type                        VARCHAR(80) NULL,
  officer                     VARCHAR(160) NULL,
  status                      VARCHAR(64) NULL,
  outcome                     VARCHAR(120) NULL,
  remarks                     TEXT NULL,
  order_passed                TINYINT(1) NOT NULL DEFAULT 0,
  order_summary               TEXT NULL,
  compliance_required         TINYINT(1) NOT NULL DEFAULT 0,
  compliance_status           ENUM('Not Applicable','Pending','Partially Complied','Complied') NULL,
  compliance_due_date         DATE NULL,
  compliance_completed_date   DATE NULL,
  responsible_department_id   BIGINT UNSIGNED NULL,
  responsible_officer         VARCHAR(160) NULL,
  compliance_remarks          TEXT NULL,
  created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_hearings_code (code),
  KEY idx_hearings_case_date (case_id, date),
  CONSTRAINT fk_hr_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  CONSTRAINT fk_hr_dept FOREIGN KEY (responsible_department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE appeals (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code                  VARCHAR(64) NOT NULL,         -- AppealRecord.id
  parent_case_id        BIGINT UNSIGNED NOT NULL,
  appeal_number         VARCHAR(120) NOT NULL,
  court_id              BIGINT UNSIGNED NULL,
  filing_date           DATE NULL,
  grounds               TEXT NULL,
  stage                 VARCHAR(64) NULL,
  assigned_officer_id   BIGINT UNSIGNED NULL,
  next_hearing          DATE NULL,
  outcome               VARCHAR(120) NULL,
  remarks               TEXT NULL,
  attachments_count     INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_appeals_code (code),
  KEY idx_appeals_parent (parent_case_id),
  CONSTRAINT fk_ap_case  FOREIGN KEY (parent_case_id)      REFERENCES cases(id) ON DELETE CASCADE,
  CONSTRAINT fk_ap_court FOREIGN KEY (court_id)            REFERENCES courts(id) ON DELETE SET NULL,
  CONSTRAINT fk_ap_offr  FOREIGN KEY (assigned_officer_id) REFERENCES users(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE alerts (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code        VARCHAR(64) NOT NULL,           -- AlertRecord.id
  type        VARCHAR(64) NOT NULL,
  message     TEXT NOT NULL,
  case_id     BIGINT UNSIGNED NULL,
  officer_id  BIGINT UNSIGNED NULL,
  date        DATE NOT NULL,
  priority    ENUM('High','Medium','Low','Time-Sensitive','Court-Critical') NULL,
  status      VARCHAR(40) NOT NULL DEFAULT 'Pending',
  channel     VARCHAR(40) NULL,               -- Email / SMS / In-App
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_alerts_code (code),
  KEY idx_alerts_case (case_id),
  KEY idx_alerts_officer (officer_id),
  CONSTRAINT fk_al_case    FOREIGN KEY (case_id)    REFERENCES cases(id) ON DELETE SET NULL,
  CONSTRAINT fk_al_officer FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. AUDIT  (per-case CaseRecord.auditTrail[] + global globalAudit[])
-- ---------------------------------------------------------------------

CREATE TABLE audit_log (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code        VARCHAR(64) NOT NULL,            -- AuditEntry.id ("AUD-…")
  ts          TIMESTAMP   NOT NULL,
  actor       VARCHAR(120) NOT NULL,
  role        VARCHAR(80)  NOT NULL,
  action      VARCHAR(120) NOT NULL,
  details     TEXT NULL,
  case_code   VARCHAR(64) NULL,                -- back-ref to cases.code for fast per-case lookup
  case_id     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_audit_code (code),
  KEY idx_audit_case (case_id, ts),
  KEY idx_audit_case_code (case_code, ts),
  KEY idx_audit_ts (ts),
  CONSTRAINT fk_audit_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
