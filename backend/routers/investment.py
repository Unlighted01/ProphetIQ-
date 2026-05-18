from fastapi import APIRouter
from schemas.property import InvestmentRequest, InvestmentResponse

router = APIRouter(prefix="/investment", tags=["Investment"])

@router.post("/", response_model=InvestmentResponse)
async def calculate_investment(request: InvestmentRequest):
    price = request.predicted_price_php
    down_pct = request.down_payment_pct
    rate = request.mortgage_rate
    years = request.mortgage_years

    # 1. Mortgage calculation
    loan_amount = price * (1 - down_pct)
    monthly_rate = rate / 12
    n_payments = years * 12
    
    if monthly_rate > 0:
        monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate)**n_payments) / ((1 + monthly_rate)**n_payments - 1)
    else:
        monthly_payment = loan_amount / n_payments

    # 2. Rental yield estimate
    # In PH, a conservative estimate for gross rental yield is around 6-7% annually.
    # Monthly rent is roughly 0.6% of property value.
    estimated_monthly_rent = price * 0.006
    annual_rental_income = estimated_monthly_rent * 12
    gross_rental_yield = (annual_rental_income / price) * 100

    # 3. Cash flow
    annual_mortgage_cost = monthly_payment * 12
    annual_cash_flow = annual_rental_income - annual_mortgage_cost

    # 4. ROI (5-year hold)
    # Assuming an average 5% annual appreciation in PH real estate
    annual_appreciation = 0.05
    future_value_5yr = price * (1 + annual_appreciation) ** 5
    equity_gained = future_value_5yr - price
    
    initial_investment = price * down_pct
    total_return_5yr = equity_gained + (annual_cash_flow * 5)
    
    if initial_investment > 0:
        roi_5yr = (total_return_5yr / initial_investment) * 100
    else:
        roi_5yr = 0.0

    return InvestmentResponse(
        monthly_payment_php=round(monthly_payment, 2),
        estimated_monthly_rent_php=round(estimated_monthly_rent, 2),
        gross_rental_yield_pct=round(gross_rental_yield, 2),
        annual_cash_flow_php=round(annual_cash_flow, 2),
        roi_5yr_pct=round(roi_5yr, 2)
    )
