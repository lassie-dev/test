# Funeral ERP - Business Logic Documentation

## 📋 Business Overview

### What is this system?
This is a **comprehensive ERP (Enterprise Resource Planning) system for a Chilean funeral home**. The system manages the complete lifecycle of funeral services, from initial client contact through service delivery, payment processing, staff management, and commission calculations.

---

## 🔑 Core Business Concepts

### 1. Contract Types

The system handles two distinct types of funeral contracts:

#### A) Immediate Need (Necesidad Inmediata)
**When it's used:**
- A death has already occurred
- Family needs urgent funeral services
- Service must be provided within hours

**Required data:**
- **Client information**: Name, RUT, phone, email, address
- **Deceased information**: Name, date of death, place of death, age
- **Services selected**: Transport, preparation, wake, burial/cremation
- **Products selected**: Coffin, urn, flowers, memorial cards
- **Service details**: Location, date/time, special requests

**Business rules:**
- MUST have deceased data (required field)
- Cannot proceed without client information
- Inventory is deducted immediately upon contract creation
- WhatsApp notifications sent automatically to assigned staff

#### B) Future Need (Necesidad Futura)
**When it's used:**
- Pre-planning funeral services
- Client purchases services in advance (like funeral insurance)
- No immediate death has occurred

**Required data:**
- **Client information**: Name, RUT, phone, email, address
- **Desired services**: Selected in advance
- **Payment plan**: Usually paid in installments over time

**Business rules:**
- CANNOT have deceased data (deceased fields must be empty/null)
- Can be converted to "Immediate Need" when death occurs
- Inventory is NOT deducted until conversion to immediate need
- No staff assignments until activation

---

### 2. Financial Calculations

#### Pricing Structure

```
SUBTOTAL = Sum of all services + Sum of all products
DISCOUNT_AMOUNT = SUBTOTAL × (DISCOUNT_PERCENTAGE / 100)
TOTAL = SUBTOTAL - DISCOUNT_AMOUNT
```

**Example:**
```
Services: $550,000 (Transport + Wake + Cremation)
Products: $230,000 (Coffin + Urn)
SUBTOTAL: $780,000
Discount: 10% (-$78,000)
TOTAL: $702,000
```

#### Allowed Discount Percentages
The system only permits these specific discount values:
- 0% (no discount)
- 3%
- 5%
- 8%
- 10%
- 15%
- 25%
- 30%

**Discount reasons** (business context):
- Repeat customer loyalty
- Corporate agreements (companies with multiple employees)
- Financial hardship cases
- Special circumstances (e.g., accidents, tragedies)
- Promotional periods

---

### 3. Payment Methods

#### A) Cash Payment (Contado)
- Full payment received at contract signing
- Accepted forms: Cash, debit card, credit card, bank transfer
- Receipt generated immediately
- Contract status: "Paid in Full"

#### B) Credit Payment (Crédito)
- Payment divided into monthly installments
- Funeral home provides financing (no external bank)
- Typical terms: 3, 6, 9, or 12 months
- Down payment may be required (usually 20-30%)
- Interest rate applied according to company policy

**Credit payment tracking:**
- Each installment recorded in Payments module
- Automatic reminders sent before due date
- Late payment alerts for overdue accounts
- Payment history maintained for each contract

**Example credit breakdown:**
```
Total: $702,000
Down payment: 30% ($210,600)
Remaining: $491,400
Term: 6 months
Monthly payment: $81,900
```

---

### 4. Commission System (Critical for Staff Motivation)

Secretaries earn commissions based on contract value and timing. This incentivizes 24/7 availability and holiday coverage.

#### Base Commission: 5%
Applied to every contract created, regardless of time or day.

**Example:**
- Contract total: $1,000,000
- Commission: $1,000,000 × 5% = $50,000

#### Night Service Bonus: +2%
**Qualifies when:**
- Service time is between 20:00 (8:00 PM) and 08:00 (8:00 AM)
- Total commission: 7%

**Example:**
- Contract total: $1,000,000
- Service time: 22:00 (10:00 PM)
- Commission: $1,000,000 × 7% = $70,000

#### Holiday Service Bonus: +3%
**Qualifies when:**
- Service occurs on official Chilean holidays:
  - January 1: New Year
  - Easter (Good Friday)
  - May 1: Labor Day
  - May 21: Navy Day
  - June 29: St. Peter and St. Paul
  - July 16: Our Lady of Mount Carmel
  - August 15: Assumption
  - September 18: Independence Day
  - September 19: Army Day
  - October 12: Columbus Day
  - November 1: All Saints' Day
  - December 8: Immaculate Conception
  - December 25: Christmas
- Total commission: 8%

**Example:**
- Contract total: $1,000,000
- Service date: December 25 (Christmas)
- Commission: $1,000,000 × 8% = $80,000

#### Night + Holiday Bonus: +5%
**Qualifies when:**
- Service is BOTH at night (20:00-08:00) AND on a holiday
- Total commission: 10%

**Example:**
- Contract total: $1,500,000
- Service time: 23:00 on December 25 (Christmas night)
- Commission: $1,500,000 × 10% = $150,000

#### Commission Calculation Rules
1. **Calculated on FINAL total** (after discount)
2. **Paid to the secretary who created the contract**
3. **Cannot be modified manually** (system-calculated only)
4. **Included in monthly payroll**
5. **Based on contract creation datetime**, not service execution time
6. **Only paid after contract is marked as "Finished"** (prevents commission on cancelled contracts)

---

### 5. Complete Workflow Process

#### STEP 1: Initial Contact
**What happens:**
- Family calls the funeral home (24/7 phone line)
- Secretary answers and gathers basic information:
  - Deceased name
  - Location of body
  - Family contact information
  - Approximate time of death

**System action:**
- Secretary opens new contract form
- Begins entering initial data

#### STEP 2: Contract Creation
**What happens:**
- Secretary selects contract type (Immediate or Future)
- Enters complete client information:
  - Full name
  - RUT (Chilean ID) - system validates format
  - Phone number (mobile for WhatsApp)
  - Email address
  - Home address

- If Immediate Need, enters deceased information:
  - Full name
  - Date and time of death
  - Place of death (hospital, home, accident site)
  - Age at death
  - Cause of death (optional)

**System actions:**
- Validates RUT format and checksum
- Formats phone number for WhatsApp
- Generates unique contract number (e.g., CTR-000123)

#### STEP 3: Service Selection
**What happens:**
- Secretary discusses family needs
- Selects appropriate services:
  - **Basic transport**: From place of death to funeral home
  - **Body preparation**: Embalming, dressing, cosmetic work
  - **Wake/Viewing**: 12hr, 24hr, or 48hr options
  - **Ceremony**: Religious or secular service
  - **Final disposition**:
    - Burial (includes cemetery plot coordination)
    - Cremation (includes urn)
  - **Additional services**:
    - Online streaming of ceremony
    - Professional photography
    - Floral arrangements
    - Printed memorial programs
    - Obituary publication

**System actions:**
- Displays available services with current prices
- Calculates running subtotal as services are selected
- Shows service descriptions to help secretary explain to family

#### STEP 4: Product Selection
**What happens:**
- Secretary helps family choose products:
  - **Coffin/Casket**:
    - Economy: Basic wood, simple design
    - Standard: Better wood, enhanced finish
    - Premium: Hardwood, ornate design
    - Luxury: Imported, high-end materials
  - **Urn** (if cremation):
    - Basic ceramic
    - Decorative ceramic
    - Wood urn
    - Metal urn
  - **Flowers/Arrangements**:
    - Small spray
    - Large arrangement
    - Wreath
    - Custom design
  - **Memorial items**:
    - Thank you cards
    - Memorial bookmarks
    - Photo displays
    - Guest book

**System actions:**
- Shows product catalog with photos and prices
- Checks inventory availability in real-time
- Warns if product is low stock or out of stock
- Suggests alternatives if needed
- Updates subtotal as products are selected
- **Reserves inventory immediately** (prevents double-booking)

#### STEP 5: Discount Application
**What happens:**
- Secretary reviews contract total with family
- Assesses if discount is appropriate:
  - Repeat customer? Check history
  - Financial hardship? Verify situation
  - Corporate agreement? Confirm company
  - Special circumstances? Manager approval may be needed
- Applies approved discount percentage

**System actions:**
- Only allows preset discount percentages (3%, 5%, 8%, 10%, 15%, 25%, 30%)
- Recalculates total automatically
- Logs discount reason and who authorized it
- Flags contracts with >15% discount for management review

**Example:**
```
Services subtotal: $550,000
Products subtotal: $230,000
SUBTOTAL: $780,000

Discount applied: 10% (repeat customer)
Discount amount: -$78,000

FINAL TOTAL: $702,000
```

#### STEP 6: Payment Method Selection
**What happens:**
- Secretary explains payment options to family
- If Cash:
  - Accept payment
  - Issue receipt
  - Mark contract as "Paid"
- If Credit:
  - Discuss down payment amount
  - Calculate monthly installments
  - Create payment schedule
  - Explain late payment policy

**System actions:**
- Creates payment record(s)
- For credit: generates installment schedule
- Sets up automatic payment reminders
- Links payment method to contract

#### STEP 7: Staff Assignment
**What happens:**
- System automatically assigns available staff:
  - **Driver**: Based on location proximity and availability
  - **Assistants**: Based on workload and schedule
  - **Ceremony staff**: If ceremony service is included

- Secretary can manually override assignments if needed

**System actions:**
- Checks staff availability in real-time
- Considers staff location for travel time
- Balances workload across team
- Records assignment history
- Marks staff as "busy" during assigned times

#### STEP 8: Automated Notifications
**System sends WhatsApp messages automatically:**

**Immediate (within 5 minutes):**
```
To: Assigned driver
Message: "Nueva asignación - Contrato #CTR-000123
Difunto: Pedro González
Dirección recogida: Calle Ejemplo 123, Santiago
Hora: 14:00
Contacto familia: María González +56987654321
Ver detalles: [link]"
```

**4 Hours After Service:**
```
To: Client/Family
Message: "Estimada familia González,
Nuestras condolencias en este momento difícil.
Algunos consejos para estos días:
- Descansen cuando puedan
- Acepten ayuda de familiares y amigos
- No tomen decisiones importantes inmediatamente
Estamos aquí para lo que necesiten.
Funeraria [Nombre]"
```

**5 Days After Service:**
```
To: Client/Family
Message: "Estimada familia González,
Hemos creado una tarjeta de condolencia digital
personalizada en memoria de Pedro.
Ver y compartir: [link]
Con afecto,
Funeraria [Nombre]"
```

**8 Days After Service:**
```
To: Client/Family
Message: "Estimada familia González,
Su opinión es muy importante para nosotros.
¿Podría completar una breve encuesta sobre
nuestro servicio? (2 minutos)
Encuesta: [link]
Gracias,
Funeraria [Nombre]"
```

#### STEP 9: Service Execution
**What happens:**
- Driver receives notification, goes to pickup location
- Body transported to funeral home
- Preparation team works on body presentation
- Family arrives for wake/viewing
- Ceremony performed (if included)
- Final disposition (burial or cremation) carried out

**System actions:**
- Driver updates status: "En route", "Arrived", "Transporting", "Delivered"
- Each status update logged with timestamp
- Family can track service progress (optional transparency feature)
- Photos uploaded (with family permission)
- Documents signed digitally (pickup confirmation, delivery confirmation)

#### STEP 10: Service Completion
**What happens:**
- All services completed
- Final documents provided to family:
  - Death certificate
  - Cremation certificate (if applicable)
  - Urn or burial location details
  - Itemized receipt
  - Payment records

**System actions:**
- Secretary marks contract as "Finalizado" (Finished)
- System triggers commission calculation
- Inventory adjustments finalized
- Service completion timestamp recorded
- Automatic archival after 30 days

#### STEP 11: Commission Calculation
**System automatically:**
1. Retrieves contract final total: $702,000
2. Checks contract creation timestamp: 22:00 (night service)
3. Checks date: December 20 (not a holiday)
4. Calculates commission: 5% base + 2% night = 7%
5. Commission amount: $702,000 × 7% = $49,140
6. Assigns commission to secretary: María Secretaria
7. Adds to next payroll cycle

**Stored data:**
- Contract ID
- Secretary ID
- Commission percentage applied
- Commission amount
- Calculation timestamp
- Payroll period

#### STEP 12: Payroll Generation
**Monthly process:**
- System compiles all commissions for the month
- Adds to base salary
- Calculates tax withholdings (Chilean tax law)
- Generates liquidación (pay stub)
- Processes payment via bank transfer

**Example payroll:**
```
Secretaria: María Secretaria
Período: Octubre 2025

Sueldo base: $800,000
Comisiones octubre: $320,000 (5 contratos)
Subtotal: $1,120,000

Descuentos:
- Previsión (AFP): 10% (-$112,000)
- Salud (Isapre): 7% (-$78,400)
- Impuesto: (-$85,000)

LÍQUIDO A PAGAR: $844,600
```

---

## 📊 System Modules (Detailed)

### Module 1: Contracts (Core Module)
**Purpose:** Manage complete funeral contract lifecycle

**Features:**
- Create new contracts (Immediate/Future)
- Edit contracts (before finalization)
- View contract details
- Search and filter contracts
- Export contracts to PDF
- Send contract copy to client email
- Track contract status progression
- Duplicate contracts (for similar services)

**Contract States:**
1. **Cotización** (Quote): Initial estimate, not confirmed
2. **Contrato** (Active Contract): Confirmed, service in progress
3. **Finalizado** (Finished): Service completed successfully
4. **Cancelado** (Cancelled): Service cancelled before completion

**State Transitions:**
```
Cotización → Contrato (family confirms)
Contrato → Finalizado (service completed)
Contrato → Cancelado (family cancels)
Cancelado → Contrato (reactivation, rare)
```

**Access Control:**
- Propietario: Full access
- Administrador: View, create, edit (cannot delete finished)
- Secretaria: View, create, edit own contracts
- Conductor/Auxiliar: View assigned contracts only (read-only)

---

### Module 2: Inventory (Stock Management)
**Purpose:** Track funeral products and supplies

**Product Categories:**
- **Coffins/Caskets**
  - Multiple sizes (adult, child, infant)
  - Multiple qualities (economy, standard, premium, luxury)
  - Different materials (wood, metal, biodegradable)

- **Urns**
  - Various sizes
  - Different materials (ceramic, wood, metal, biodegradable)
  - Decorative styles

- **Consumables**
  - Embalming fluids
  - Cosmetics
  - Dressing supplies
  - Flowers
  - Memorial cards
  - Guest books

**Inventory Tracking:**
- Real-time stock levels
- Automatic deduction when contract created
- Low stock alerts (configurable threshold)
- Reorder notifications
- Supplier management
- Purchase order creation
- Receiving/intake process
- Stock valuation (FIFO method)

**Alerts:**
- Red alert: Out of stock
- Yellow alert: Below minimum threshold
- Weekly inventory reports
- Monthly usage statistics

**Access Control:**
- Propietario: Full access
- Administrador: Full access
- Secretaria: View stock, cannot edit
- Others: No access

---

### Module 3: Payments (Financial Tracking)
**Purpose:** Record and track all client payments

**Features:**
- Record payments received
- Track payment installments
- Monitor overdue accounts
- Generate payment reminders
- Issue receipts
- Export payment reports

**Payment Records Include:**
- Contract reference
- Payment date
- Amount received
- Payment method (cash, card, transfer)
- Receipt number
- Processed by (staff member)
- Notes/comments

**Credit Payment Management:**
- Payment schedule generation
- Automatic reminder emails/SMS
- Late payment flagging
- Interest calculation (if applicable)
- Payment history per client

**Reports:**
- Daily collections report
- Overdue accounts report
- Payment method breakdown
- Cash flow projection

**Access Control:**
- Propietario: Full access
- Administrador: Full access
- Secretaria: Record payments, view own contracts
- Others: No access

---

### Module 4: Staff (Personnel Management)
**Purpose:** Manage funeral home employees

**Employee Information:**
- Personal data (name, RUT, address, phone, email)
- Role/position
- Hire date
- Base salary
- Bank account details (for payroll)
- Emergency contact
- Schedule/availability
- Vehicle information (for drivers)

**Staff Roles:**
1. **Propietario** (Owner)
2. **Administrador** (Manager)
3. **Secretaria** (Secretary)
4. **Conductor** (Driver)
5. **Auxiliar** (Assistant)
6. **Personal de Velorio** (Wake Attendant)

**Scheduling Features:**
- Weekly schedule management
- Shift assignment
- Time-off requests
- Availability tracking
- Workload balancing

**Access Control:**
- Propietario: Full access
- Administrador: View, create, edit (cannot delete)
- Others: View own profile only

---

### Module 5: Payroll (Liquidaciones)
**Purpose:** Calculate and process staff payments

**Salary Components:**

**For Secretaries:**
```
Base Salary: $800,000
+ Commissions: (calculated per contract)
+ Overtime: (if applicable)
= GROSS TOTAL

- AFP (Pension): 10%
- Health Insurance: 7%
- Income Tax: (progressive rate)
= NET PAY
```

**For Drivers & Assistants:**
```
Base Salary: $650,000
+ Per-Service Bonus: $15,000 per service
+ Night Shift Bonus: $5,000 per night service
+ Overtime: (if applicable)
= GROSS TOTAL

- AFP (Pension): 10%
- Health Insurance: 7%
- Income Tax: (progressive rate)
= NET PAY
```

**Payroll Process:**
1. **Day 25 of month**: System compiles all data
2. **Day 26-27**: Review and adjustments
3. **Day 28**: Generate liquidaciones (pay stubs)
4. **Day 30**: Process bank transfers
5. **Day 1**: Employees receive payment

**Reports:**
- Monthly payroll summary
- Commission breakdown per secretary
- Comparison vs. previous months
- Tax withholding report (for authorities)

**Access Control:**
- Propietario: Full access
- Administrador: View reports
- Secretaria: View own payroll only
- Others: View own payroll only

---

### Module 6: Reports (Analytics & Insights)
**Purpose:** Business intelligence and decision support

**Available Reports:**

**Sales Reports:**
- Daily sales summary
- Weekly sales trend
- Monthly sales by service type
- Year-over-year comparison
- Revenue by contract type (Immediate vs. Future)

**Contract Reports:**
- Total contracts by period
- Average contract value
- Most popular services
- Most popular products
- Contract status distribution

**Staff Reports:**
- Commission earned by secretary
- Services completed by driver
- Staff productivity metrics
- Utilization rate

**Financial Reports:**
- Cash flow statement
- Accounts receivable aging
- Payment method distribution
- Discount analysis (how much given away)
- Profitability by service type

**Inventory Reports:**
- Stock valuation
- Fast-moving items
- Slow-moving items
- Reorder recommendations
- Supplier performance

**Client Reports:**
- Repeat customer rate
- Customer satisfaction scores
- Payment behavior analysis
- Geographic distribution

**Access Control:**
- Propietario: All reports
- Administrador: All reports except financial details
- Secretaria: Own commission reports only
- Others: No access

---

### Module 7: Dashboard (Command Center)
**Purpose:** Real-time overview of business operations

**Dashboard Widgets:**

**Today's Overview:**
- Active contracts today: 3
- Total revenue today: $2,150,000
- Pending payments: $450,000
- Staff on duty: 8

**Alerts & Notifications:**
- 🔴 Low stock alert: Ataúdes premium (2 restantes)
- 🟡 Payment overdue: Contract #CTR-000118 (15 días)
- 🟢 Service completed: Contract #CTR-000125

**Recent Activity:**
- 10:30 - New contract created (CTR-000126)
- 11:15 - Payment received: $350,000
- 12:00 - Service assigned to driver Juan
- 14:30 - Contract finalized (CTR-000123)

**This Month Statistics:**
- Contracts created: 24
- Revenue: $18,500,000
- Average contract: $770,833
- Commission paid: $1,295,000

**Quick Actions:**
- [+ New Contract]
- [Record Payment]
- [Check Inventory]
- [View Staff Schedule]

**Access Control:**
- Propietario: Full dashboard
- Administrador: Full dashboard (limited financial data)
- Secretaria: Limited view (own contracts, own commissions)
- Others: Very limited view (assigned tasks only)

---

## 🔐 User Roles & Permissions (Detailed)

### Role: Propietario (Owner)
**Access Level:** FULL ACCESS - No restrictions

**Can:**
- Everything in the system
- View all financial data
- Delete records
- Manage user accounts
- Configure system settings
- Access all reports
- Override any restriction

**Use Case:**
- Business owner reviewing monthly financials
- Making strategic decisions based on data
- Managing staff performance
- Setting pricing and discount policies

---

### Role: Administrador (Administrator/Manager)
**Access Level:** HIGH - Some restrictions

**Can:**
- Create/edit contracts
- Manage inventory
- View all contracts
- Manage staff schedules
- Process payroll
- View most reports
- Assign/reassign staff to services

**Cannot:**
- Delete finished contracts
- See detailed financial projections
- Change system settings
- Manage user permissions
- Access owner-level financial reports

**Use Case:**
- Day-to-day operations manager
- Handles escalated issues
- Manages staff assignments
- Ensures smooth operations

---

### Role: Secretaria (Secretary)
**Access Level:** MEDIUM - Job-specific access

**Can:**
- Create new contracts
- Edit own contracts (before finalization)
- View all active contracts (read-only for others')
- Apply discounts up to 15% (higher requires approval)
- Record payments
- View own commissions
- Update contract status
- Communicate with clients

**Cannot:**
- Delete contracts
- Edit other secretaries' contracts
- View other secretaries' commissions
- Access financial reports
- Manage inventory
- View cost prices
- Access payroll system

**Use Case:**
- Takes client calls 24/7
- Creates contracts
- Processes payments
- Main client interface

---

### Role: Conductor (Driver)
**Access Level:** LOW - Task-specific only

**Can:**
- View assigned services
- Update service status (En route, Arrived, Completed)
- View pickup/delivery addresses
- View client contact info
- Upload photos (with permission)
- Mark tasks complete

**Cannot:**
- See pricing/costs
- See commissions
- Create contracts
- Edit any data except status
- View other drivers' assignments
- Access any financial data

**Use Case:**
- Receives WhatsApp notification
- Goes to pickup location
- Transports body
- Updates status in real-time
- Completes assigned task

---

### Role: Auxiliar (Assistant)
**Access Level:** VERY LOW - View only

**Can:**
- View services they're assigned to
- See basic contract info (names, location, time)
- See who else is assigned
- Mark their participation complete

**Cannot:**
- Edit anything
- See pricing
- View other contracts
- Access any module except assigned tasks

**Use Case:**
- Helps driver with transport
- Assists in body preparation
- Supports during wake/ceremony
- Follows driver's instructions

---

## 🇨🇱 Chilean-Specific Features

### RUT (Rol Único Tributario) Validation
**What is RUT:**
- Unique tax identification number
- Assigned to every person/company in Chile
- Format: XX.XXX.XXX-X (e.g., 12.345.678-9)
- Last digit is a verification digit (can be 0-9 or K)

**Validation Algorithm:**
```javascript
function validarRut(rut) {
  // Remove formatting
  const clean = rut.replace(/[^0-9kK]/g, '');

  // Split body and verification digit
  const body = clean.slice(0, -1);
  const verifier = clean.slice(-1).toUpperCase();

  // Calculate expected verifier
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += multiplier * parseInt(body[i]);
    multiplier = multiplier < 7 ? multiplier + 1 : 2;
  }

  const expectedVerifier = 11 - (sum % 11);
  const calculatedVerifier = expectedVerifier === 11 ? '0'
    : expectedVerifier === 10 ? 'K'
    : expectedVerifier.toString();

  return verifier === calculatedVerifier;
}
```

**System Implementation:**
- Real-time validation as user types
- Error message if invalid: "RUT inválido, por favor verifique"
- Automatic formatting (adds dots and dash)
- Database stores without formatting (123456789)
- Display with formatting (12.345.678-9)

---

### Currency: Chilean Peso (CLP)
**Format Rules:**
- Symbol: $ (before amount)
- Thousands separator: . (dot)
- No decimal places (Chile doesn't use cents)
- Example: $1.250.000

**System Implementation:**
```javascript
function formatearMoneda(amount) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Result: $1.250.000
```

**Database Storage:**
- Store as integer (no decimals needed)
- Type: DECIMAL(12,2) for future compatibility
- Always validate > 0 for prices
- Always validate >= 0 for payments

---

### Chilean Holidays (for Commission Calculation)

**Fixed Holidays:**
- January 1: Año Nuevo (New Year)
- May 1: Día del Trabajo (Labor Day)
- May 21: Día de las Glorias Navales (Navy Day)
- June 29: San Pedro y San Pablo (St. Peter and St. Paul)
- July 16: Virgen del Carmen (Our Lady of Mount Carmel)
- August 15: Asunción de la Virgen (Assumption)
- September 18: Independencia Nacional (Independence Day)
- September 19: Día de las Glorias del Ejército (Army Day)
- October 12: Encuentro de Dos Mundos (Columbus Day)
- November 1: Todos los Santos (All Saints' Day)
- December 8: Inmaculada Concepción (Immaculate Conception)
- December 25: Navidad (Christmas)

**Variable Holidays:**
- Viernes Santo (Good Friday) - varies by year
- Sábado Santo (Holy Saturday) - varies by year

**System Implementation:**
- Holiday calendar stored in database
- Updated annually
- Commission calculation checks contract date against holiday list
- Automatic 3% bonus if date matches

---

### Phone Number Format (for WhatsApp)
**Chilean phone format:**
- Country code: +56
- Mobile numbers: 9 digits starting with 9
- Format: +56 9 XXXX XXXX
- Example: +56 9 8765 4321

**System Implementation:**
- Store: 56987654321 (digits only)
- Display: +56 9 8765 4321 (formatted)
- WhatsApp API uses: 56987654321
- Validation: Must start with 569, must be 11 digits total

---

## 📝 Important Business Rules Reference

### Critical Rules (Cannot Be Violated)

1. **Immediate Need contracts MUST have deceased data**
   - Name, date of death required
   - System blocks saving without this data
   - Error: "Debe ingresar datos del difunto para contratos de necesidad inmediata"

2. **Future Need contracts CANNOT have deceased data**
   - Deceased fields must be null/empty
   - System clears deceased data if type changed to Future
   - Warning: "Los datos del difunto serán eliminados al cambiar a Necesidad Futura"

3. **Discount percentages are fixed**
   - Only: 0%, 3%, 5%, 8%, 10%, 15%, 25%, 30%
   - Dropdown selection (not free text)
   - Discounts > 15% require manager approval
   - System logs who authorized discount

4. **Commission calculation is automatic and immutable**
   - Cannot be manually edited
   - Based on contract creation datetime
   - Paid only when contract status = "Finalizado"
   - Cancelled contracts don't generate commission

5. **Products deduct from inventory immediately**
   - Reservation when contract created
   - Committed when contract confirmed
   - Returned to inventory if contract cancelled
   - Cannot sell products with 0 stock

6. **Services do NOT affect inventory**
   - Services are labor/actions
   - No stock tracking for services
   - Can "oversell" services (staff can work extra)

7. **Finished contracts cannot be deleted**
   - Can only be marked as "Cancelado"
   - Maintains audit trail
   - Financial data must be preserved
   - Legal requirement for accounting

8. **Secretary who created contract gets commission**
   - Cannot be reassigned later
   - Tracked by "created_by" field
   - Protects secretary's work
   - Prevents commission theft

---

## 💡 Practical Examples & Scenarios

### Example 1: Standard Immediate Need Contract

**Scenario:**
Mrs. María González calls at 2:00 PM on a Tuesday. Her father, Pedro González (82 years old), passed away this morning at home. She needs basic funeral services.

**Secretary Actions:**
1. Creates new contract
2. Selects: Immediate Need
3. Enters client data:
   - Name: María González López
   - RUT: 15.234.567-8 (validated ✓)
   - Phone: +56 9 8765 4321
   - Email: maria.gonzalez@email.com
   - Address: Calle Los Aromos 456, Santiago

4. Enters deceased data:
   - Name: Pedro González Martínez
   - Date of death: October 20, 2025, 8:30 AM
   - Place of death: Home (Calle Los Aromos 456)
   - Age: 82 years

5. Selects services:
   - Body transport: $50,000
   - Body preparation: $80,000
   - 24-hour wake: $200,000
   - Cremation: $300,000
   - **Services subtotal: $630,000**

6. Selects products:
   - Basic wooden coffin: $150,000
   - Ceramic urn: $80,000
   - Flower arrangement: $40,000
   - Memorial cards (50 units): $20,000
   - **Products subtotal: $290,000**

7. **SUBTOTAL: $920,000**

8. Applies discount:
   - Reason: Family had used services before (2018)
   - Discount: 5%
   - Discount amount: -$46,000

9. **FINAL TOTAL: $874,000**

10. Payment method: Credit
    - Down payment: 30% ($262,200) paid today
    - Remaining: $611,800
    - Term: 6 months
    - Monthly payment: $101,967

11. System assigns:
    - Driver: Juan Pérez (closest to location)
    - Assistant: Carlos Rojas

12. WhatsApp sent to Juan: "Nueva asignación..."

**Commission Calculation:**
- Time: 14:00 (2:00 PM) = Normal hours
- Date: Tuesday (not holiday)
- Commission rate: 5% (base only)
- Commission amount: $874,000 × 5% = **$43,700**
- Paid to: Secretary who created contract

**Inventory Impact:**
- Basic wooden coffin: Stock 8 → 7
- Ceramic urn: Stock 15 → 14
- Flower arrangement: Stock 25 → 24
- Memorial cards: Stock 2,000 → 1,950

---

### Example 2: Night + Holiday Service

**Scenario:**
Family calls at 11:00 PM on December 24th (Christmas Eve). Emergency service needed.

**Contract Details:**
- Client: Juan Pérez Soto
- Deceased: Ana Pérez Jiménez
- Services + Products total: $1,500,000
- Discount: 0% (no discount on emergency)
- Time: 23:00 (11:00 PM)
- Date: December 24 (Christmas Eve, counts as holiday)

**Commission Calculation:**
- Base rate: 5%
- Night bonus: +2% (service between 20:00-08:00)
- Holiday bonus: +3% (December 24/25)
- **Total commission rate: 10%**
- Commission: $1,500,000 × 10% = **$150,000**

This is why secretaries want to work holidays - they can earn double commission!

---

### Example 3: Future Need Contract (Pre-planning)

**Scenario:**
Mr. Roberto Silva (65 years old) wants to pre-purchase his future funeral services.

**Secretary Actions:**
1. Creates new contract
2. Selects: Future Need
3. Enters client data:
   - Name: Roberto Silva Morales
   - RUT: 9.876.543-2
   - Phone: +56 9 5555 1234
   - Email: roberto.silva@email.com

4. Deceased data: **LEFT EMPTY** (no one has died)

5. Selects desired services:
   - Basic transport: $50,000
   - Body preparation: $80,000
   - 24-hour wake: $200,000
   - Cremation: $300,000
   - **Services: $630,000**

6. Selects desired products:
   - Standard coffin: $200,000
   - Decorative urn: $120,000
   - **Products: $320,000**

7. **TOTAL: $950,000**
8. Discount: 8% (pre-planning discount)
9. **FINAL TOTAL: $874,000**

10. Payment method: Credit
    - 12 monthly payments of $72,833
    - No down payment required

**Important Notes:**
- Inventory is NOT deducted yet
- No staff assigned yet
- No WhatsApp notifications sent
- Commission calculated but NOT paid until service activated
- When Mr. Silva eventually passes away, contract converted to Immediate Need

**When conversion happens:**
- Family calls to activate contract
- Secretary adds deceased data
- Changes type to: Immediate Need
- Inventory deducted at that moment
- Staff assigned
- Service proceeds normally
- Commission paid to original secretary

---

### Example 4: Credit Payment Tracking

**Scenario:**
Contract total: $900,000
Payment: Credit (6 months)
Down payment: $270,000 (30%)
Remaining: $630,000
Monthly: $105,000

**Payment Schedule:**
```
Payment 1: Due Nov 30 - $105,000 - Status: PAID (Nov 28)
Payment 2: Due Dec 30 - $105,000 - Status: PAID (Dec 29)
Payment 3: Due Jan 30 - $105,000 - Status: PAID (Jan 25)
Payment 4: Due Feb 28 - $105,000 - Status: PENDING
Payment 5: Due Mar 30 - $105,000 - Status: PENDING
Payment 6: Due Apr 30 - $105,000 - Status: PENDING
```

**System Actions:**
- 7 days before due: Send reminder WhatsApp
- On due date: Check if paid
- 3 days after due: Send overdue notice
- 7 days after due: Flag for collection call
- 15 days after due: Manager notification

**Family receives:**
```
WhatsApp (Feb 21, 7 days before due):
"Estimada familia González,
Recordatorio: Su próxima cuota de $105.000
vence el 28 de febrero.
Pagar en: [payment link]
Funeraria [Nombre]"
```

---

### Example 5: Low Inventory Alert

**Scenario:**
Premium coffins are running low.

**System Status:**
```
Product: Ataúd Premium Caoba
Current stock: 2 units
Minimum threshold: 5 units
Status: 🔴 CRITICAL

Last sold: October 19 (3 days ago)
Average usage: 8 per month
Reorder point: NOW
Suggested order: 15 units
```

**System Actions:**
1. Red alert on dashboard
2. Email to administrator
3. WhatsApp to owner
4. Cannot create new contracts with this product (warns secretary)
5. Suggests alternative products

**Administrator receives:**
```
Email Subject: ALERTA: Stock crítico - Ataúd Premium Caoba

El inventario del producto "Ataúd Premium Caoba"
está en nivel crítico.

Stock actual: 2 unidades
Stock mínimo: 5 unidades
Promedio mensual: 8 unidades

Acción recomendada: Ordenar 15 unidades

[Crear Orden de Compra]
```

---

## 🔄 State Transitions & Workflows

### Contract Status Flow

```
NEW CONTRACT
     ↓
[Cotización] ──────→ [Cancelado]
     ↓                    ↑
  (family              (family
  confirms)            cancels)
     ↓                    ↑
[Contrato] ────────────→ ┘
     ↓
  (service
  completed)
     ↓
[Finalizado]
```

**Status Descriptions:**

**1. Cotización (Quote)**
- Initial state when contract created
- Prices calculated
- Not yet confirmed by family
- Can be freely edited
- No inventory committed
- No staff assigned
- No commission calculated

**2. Contrato (Active Contract)**
- Family has confirmed
- Payment received (full or down payment)
- Inventory committed
- Staff assigned
- WhatsApp notifications sent
- Service in progress
- Commission calculated (not yet paid)

**3. Finalizado (Finished)**
- All services completed
- Final documents delivered
- Family satisfied
- Contract archived
- Commission PAID
- Cannot edit (read-only)
- Kept for legal/accounting records

**4. Cancelado (Cancelled)**
- Contract terminated before completion
- Possible reasons:
  - Family chose competitor
  - Family cannot pay
  - Service not needed (rare)
  - Error/duplicate
- Inventory returned
- Partial refund processed
- Commission NOT paid
- Marked with cancellation reason

---

## 📧 Communication Templates

### WhatsApp Message Templates

**1. Driver Assignment (Immediate)**
```
📋 Nueva Asignación - Contrato #{contract_number}

👤 Difunto: {deceased_name}
📍 Dirección: {pickup_address}
🕐 Hora: {pickup_time}
☎️ Contacto familia: {client_name} {client_phone}

📱 Ver detalles completos: {details_link}

Funeraria {company_name}
```

**2. Family Tips (4 hours after service)**
```
🕊️ Estimada familia {client_last_name},

Nuestro más sentido pésame en este momento difícil.

Algunos consejos para estos días:

💙 Permítanse llorar y expresar emociones
💙 Descansen cuando puedan
💙 Acepten ayuda de familiares y amigos
💙 No tomen decisiones importantes de inmediato
💙 Cuiden su alimentación e hidratación

Estamos aquí para lo que necesiten.

Con afecto,
Funeraria {company_name}
```

**3. Digital Memorial Card (5 days after)**
```
🌹 Estimada familia {client_last_name},

Hemos creado una tarjeta de condolencia digital
personalizada en memoria de {deceased_name}.

Pueden verla, compartirla con familiares y amigos,
y descargarla:

🔗 {memorial_card_link}

Con cariño,
Funeraria {company_name}
```

**4. Service Survey (8 days after)**
```
📊 Estimada familia {client_last_name},

Su opinión es muy importante para nosotros.

¿Podría tomarse 2 minutos para completar una breve
encuesta sobre nuestro servicio?

📝 {survey_link}

Su feedback nos ayuda a mejorar.

Gracias,
Funeraria {company_name}
```

**5. Payment Reminder (7 days before due)**
```
💳 Recordatorio de Pago

Estimada familia {client_last_name},

Su próxima cuota de {installment_amount}
vence el {due_date}.

Puede pagar en:
• Oficina
• Transferencia bancaria
• Link de pago: {payment_link}

¿Consultas?: {company_phone}

Funeraria {company_name}
```

**6. Overdue Payment (3 days after due)**
```
⚠️ Cuota Vencida

Estimada familia {client_last_name},

Su cuota de {installment_amount} con vencimiento
{due_date} aún no ha sido recibida.

Le pedimos regularizar este pago a la brevedad.

Formas de pago: {payment_link}

Para facilidades, contacte:
📞 {company_phone}

Funeraria {company_name}
```

---

## 🎯 Key Performance Indicators (KPIs)

### For Business Owner (Dashboard)

**Monthly KPIs:**
- Total contracts: 24
- Total revenue: $18,500,000
- Average contract value: $770,833
- Conversion rate: 85% (quotes → contracts)
- Cancellation rate: 3%
- Repeat customer rate: 18%

**Service Mix:**
- Cremation: 65%
- Burial: 35%
- Immediate Need: 88%
- Future Need: 12%

**Financial Health:**
- Gross profit margin: 42%
- Average discount given: 6.8%
- Cash payments: 45%
- Credit payments: 55%
- Payment collection rate: 94%

**Staff Performance:**
- Average commission per secretary: $520,000/month
- Services per driver: 18/month
- Customer satisfaction: 4.7/5

---

## 🚨 Alert System

### Critical Alerts (Red)
- Inventory out of stock
- Payment 15+ days overdue
- Contract cancelled after started
- System error/malfunction

### Warning Alerts (Yellow)
- Inventory below threshold
- Payment approaching due date
- Staff overtime threshold reached
- Unusual discount applied (>15%)

### Info Alerts (Blue)
- New contract created
- Payment received
- Service completed
- Monthly report ready

---

## 📚 Glossary of Terms

**Difunto/Fallecido:** Deceased person
**Cliente:** Client (family member who contracts services)
**Necesidad Inmediata:** Immediate Need (death has occurred)
**Necesidad Futura:** Future Need (pre-planning)
**Cotización:** Quote/Estimate
**Velorio:** Wake/Viewing ceremony
**Traslado:** Body transport
**Cremación:** Cremation
**Sepultura:** Burial
**Ataúd:** Coffin/Casket
**Urna:** Urn (for cremated remains)
**Comisión:** Commission
**Liquidación:** Payroll/Pay stub
**Cuota:** Installment payment
**Descuento:** Discount
**Subtotal:** Subtotal (before discount)
**Total:** Final total (after discount)
**RUT:** Chilean national ID number
**AFP:** Chilean pension system
**Isapre:** Chilean private health insurance

---

## 📞 Support & Maintenance

**System Administrator Contacts:**
- Technical issues: {admin_email}
- Billing questions: {billing_email}
- Feature requests: {features_email}
- Emergency hotline: {emergency_phone}

**Business Hours:**
- System available: 24/7/365
- Support hours: Monday-Friday 9:00-18:00
- Emergency support: 24/7 for critical issues

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Created For:** Funeral ERP Development Team
**Language:** Spanish (Chile) with English technical terms

---

*This document is the complete business logic reference for the Funeral ERP system. All developers, designers, and stakeholders should refer to this document when making decisions about features, workflows, or data structures.*
