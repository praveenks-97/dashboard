-- ============================================================
-- Custom Dashboard Builder — MySQL Schema
-- Helleyx Challenge II
-- ============================================================

CREATE DATABASE IF NOT EXISTS helleyx_dashboard;
USE helleyx_dashboard;

-- ------------------------------------------------------------
-- customer_orders
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer_orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(100)   NOT NULL,
    last_name       VARCHAR(100)   NOT NULL,
    email           VARCHAR(255)   NOT NULL,
    phone_number    VARCHAR(20)    NOT NULL,
    street_address  VARCHAR(255)   NOT NULL,
    city            VARCHAR(100)   NOT NULL,
    state           VARCHAR(100)   NOT NULL,
    postal_code     VARCHAR(20)    NOT NULL,
    country         VARCHAR(100)   NOT NULL,
    product         VARCHAR(255)   NOT NULL,
    quantity        INT            NOT NULL DEFAULT 1,
    unit_price      DECIMAL(10,2)  NOT NULL,
    total_amount    DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    status          VARCHAR(50)    NOT NULL DEFAULT 'Pending',
    created_by      VARCHAR(100)   NOT NULL,
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_quantity CHECK (quantity >= 1)
);

-- ------------------------------------------------------------
-- dashboard_layouts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dashboard_layouts (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     VARCHAR(100)  NOT NULL DEFAULT 'default_user',
    layout_json LONGTEXT,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- widgets
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS widgets (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    layout_id     BIGINT        NOT NULL,
    widget_type   VARCHAR(50)   NOT NULL,
    title         VARCHAR(255)  NOT NULL,
    description   VARCHAR(500),
    settings_json LONGTEXT,
    width         INT           NOT NULL DEFAULT 4,
    height        INT           NOT NULL DEFAULT 2,
    x_position    INT           NOT NULL DEFAULT 0,
    y_position    INT           NOT NULL DEFAULT 0,
    CONSTRAINT fk_widget_layout FOREIGN KEY (layout_id)
        REFERENCES dashboard_layouts(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Seed Data
-- ------------------------------------------------------------
INSERT INTO customer_orders (first_name,last_name,email,phone_number,street_address,city,state,postal_code,country,product,quantity,unit_price,total_amount,status,created_by) VALUES
('John','Doe','john.doe@example.com','555-0101','123 Main St','New York','NY','10001','United States','Fiber Internet 1 Gbps',2,89.99,179.98,'Completed','Mr. Michael Harris'),
('Jane','Smith','jane.smith@example.com','555-0102','456 Oak Ave','Los Angeles','CA','90001','United States','5GUnlimited Mobile Plan',1,49.99,49.99,'Pending','Ms. Olivia Carter'),
('Bob','Johnson','bob.j@example.com','555-0103','789 Pine Rd','Toronto','ON','M5V2N4','Canada','Business Internet 500 Mbps',3,149.99,449.97,'In Progress','Mr. Ryan Cooper'),
('Alice','Williams','alice.w@example.com','555-0104','321 Elm St','Sydney','NSW','2000','Australia','VoIP Corporate Package',1,199.99,199.99,'Completed','Mr. Lucas Martin'),
('Charlie','Brown','charlie.b@example.com','555-0105','654 Maple Dr','Singapore','Central','018989','Singapore','Fiber Internet 300 Mbps',4,39.99,159.96,'Pending','Mr. Michael Harris'),
('Diana','Lee','diana.l@example.com','555-0106','987 Cedar Ln','Hong Kong','KL','999077','Hong Kong','Fiber Internet 1 Gbps',2,89.99,179.98,'In Progress','Ms. Olivia Carter'),
('Ethan','Davis','ethan.d@example.com','555-0107','246 Birch Blvd','Chicago','IL','60601','United States','5GUnlimited Mobile Plan',5,49.99,249.95,'Completed','Mr. Ryan Cooper'),
('Fiona','Garcia','fiona.g@example.com','555-0108','135 Walnut St','Vancouver','BC','V6B1G5','Canada','Business Internet 500 Mbps',1,149.99,149.99,'Pending','Mr. Lucas Martin'),
('George','Wilson','george.w@example.com','555-0109','890 Spruce Ave','Melbourne','VIC','3000','Australia','Fiber Internet 300 Mbps',2,39.99,79.98,'Completed','Mr. Michael Harris'),
('Hannah','Moore','hannah.m@example.com','555-0110','567 Oak St','Singapore','North','569933','Singapore','VoIP Corporate Package',3,199.99,599.97,'In Progress','Ms. Olivia Carter');

-- Default dashboard layout
INSERT INTO dashboard_layouts (user_id, layout_json) VALUES ('default_user', '[]');
