-- create roles
CREATE TABLE roles (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NULL
);

INSERT INTO roles (id, name, description) VALUES
(1,'Admin','System administrators with full access'),
(2,'BaseCommander','Default role; manage own base'),
(3,'LogisticsOfficer','Raise and track logistics requests');

-- Bases
CREATE TABLE bases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(50) UNIQUE
);

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(120),
  password_hash VARCHAR(255),
  is_verified TINYINT(1) DEFAULT 0,
  verification_token VARCHAR(64),
  verification_token_expires_at DATETIME,
  reset_password_token VARCHAR(128),
  reset_password_expires_at DATETIME,
  role_id INT NOT NULL DEFAULT 2,
  base_id INT NOT NULL,
  image_url TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (base_id) REFERENCES bases(id)
);

-- role change requests
CREATE TABLE role_change_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  requested_role_id INT NOT NULL,
  status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  reason VARCHAR(255),
  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (requested_role_id) REFERENCES roles(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- activity logs
CREATE TABLE activity_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50) NULL,
  entity_id INT NULL,
  metadata JSON NULL,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(user_id),
  INDEX(action)
);

-- assets
CREATE TABLE assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  equipment_type VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- asset_stock per base
CREATE TABLE asset_stocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  base_id INT NOT NULL,
  asset_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (base_id) REFERENCES bases(id),
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  UNIQUE KEY (base_id, asset_id)
);

-- purchases
CREATE TABLE purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  base_id INT NOT NULL,
  asset_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NULL,
  total_cost DECIMAL(14,2) NULL,
  purchased_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (base_id) REFERENCES bases(id),
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (purchased_by) REFERENCES users(id)
);

-- transfers
CREATE TABLE transfers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_id INT NOT NULL,
  from_base_id INT NOT NULL,
  to_base_id INT NOT NULL,
  quantity INT NOT NULL,
  requested_by INT NOT NULL,
  approved_by INT NULL,
  approved_at DATETIME NULL,
  status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (from_base_id) REFERENCES bases(id),
  FOREIGN KEY (to_base_id) REFERENCES bases(id),
  FOREIGN KEY (requested_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- assignments
CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  base_id INT NOT NULL,
  asset_id INT NOT NULL,
  assigned_to VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  assigned_by INT NOT NULL,
  status ENUM('Assigned','Returned','Expended') NOT NULL DEFAULT 'Assigned',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (base_id) REFERENCES bases(id),
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- expenditures
CREATE TABLE expenditures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  base_id INT NOT NULL,
  asset_id INT NOT NULL,
  quantity INT NOT NULL,
  reason TEXT,
  reported_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (base_id) REFERENCES bases(id),
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (reported_by) REFERENCES users(id)
);

-- stock ledger (movement track)
CREATE TABLE stock_ledger (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  base_id INT NOT NULL,
  asset_id INT NOT NULL,
  change_amount INT NOT NULL,
  type ENUM('purchase','transfer_in','transfer_out','assignment','expenditure') NOT NULL,
  ref_id INT NULL,
  note VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (base_id) REFERENCES bases(id),
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);
