// lib/game-engine.ts

export interface GameState {
  id: string;
  cash: number;
  engineer_count: number;
  sales_staff_count: number;
  product_quality: number;
  current_quarter: number;
  status: string;
}

export interface PlayerDecisions {
  price: number;
  salary_pct: number;
  engineer_to_be_hired: number;
  sales_to_be_hired: number;
}

export function calculateNextTurn(currentState: GameState, decisions: PlayerDecisions) {
  // --- Game Constants ---
  const INDUSTRY_AVG_SALARY = 30000; // $30,000 per quarter
  const NEW_HIRE_COST = 5000;        // $5,000 one-time cost per hire

  // --- 1. Process Headcount & Hiring Costs ---
  const newEngineersCount = currentState.engineer_count + decisions.engineer_to_be_hired;
  const newSalesStaffCount = currentState.sales_staff_count + decisions.sales_to_be_hired;
  
  const totalNewHires = decisions.engineer_to_be_hired + decisions.sales_to_be_hired;
  const totalHireCost = totalNewHires * NEW_HIRE_COST; // Deducted from cash

  // --- 2. Calculate Product Quality ---
  // Formula: quality + engineers * 0.5 (cap: 100)
  let newQuality = currentState.product_quality + (newEngineersCount * 0.5);
  if (newQuality > 100) {
    newQuality = 100; // Enforce the cap
  }

  // --- 3. Calculate Payroll ---
  // Formula: (salary pct / 100) * 30,000
  const salaryCostPerPerson = (decisions.salary_pct / 100) * INDUSTRY_AVG_SALARY; 
  // Formula: salary_cost * (engineers + sales_staff)
  const totalPayroll = salaryCostPerPerson * (newEngineersCount + newSalesStaffCount);

  // --- 4. Calculate Market Demand ---
  // Formula: quality * 10 - price * 0.0001 (floor: 0)
  let demand = (newQuality * 10) - (decisions.price * 0.0001);
  if (demand < 0) {
    demand = 0; // Enforce the floor
  }

  // --- 5. Calculate Sales & Revenue ---
  // Formula: demand * sales_staff * 0.5
  const unitsSold = Math.floor(demand * newSalesStaffCount * 0.5); 
  // Formula: price * units
  const revenue = decisions.price * unitsSold;

  // --- 6. Calculate Net Income ---
  // Formula: revenue - total payroll
  const netIncome = revenue - totalPayroll;

  // --- 7. Calculate Ending Cash ---
  // Formula: cash + net_income - new hire costs
  const cashEnd = currentState.cash - totalHireCost + netIncome;

  return {
    newState: {
      cash: cashEnd,
      engineer_count: newEngineersCount,
      sales_staff_count: newSalesStaffCount,
      product_quality: newQuality,
      current_quarter: currentState.current_quarter + 1,
    },
    metrics: {
      revenue,
      net_income: netIncome,
      units_sold: unitsSold,
      demand,
      total_payroll: totalPayroll
    }
  };
}