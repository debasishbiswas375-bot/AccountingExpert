# mapper.py - The Static AI Knowledge Base

# Major Search Keywords for Auto-Classification
ACCOUNTING_RULES = {
    "INDIRECT_EXPENSES": ["CHRG", "CHARGE", "FEE", "MAINTENANCE", "SMS", "ANNUAL", "RENEWAL"],
    "DUTIES_AND_TAXES": ["GST", "TAX", "CGST", "SGST", "IGST", "VAT", "TDS"],
    "CONTRA_CASH": ["CASH", "ATM", "SELF", "WITHDRAWAL", "DEPOSIT"],
    "ROUND_OFF": ["ROUND", "OFF", "DIFF"]
}

# Default Group Mappings for Tally XML Auto-Creation
GROUP_MAPPINGS = {
    "Bank Charges": "Indirect Expenses",
    "GST/Taxes": "Duties & Taxes",
    "Cash": "Cash-in-Hand",
    "Round Off": "Indirect Expenses"
}

def get_ledger_from_narr(narration):
    """
    Auto-AI Search logic to find the best ledger match
    """
    narr = narration.upper()
    
    if any(k in narr for k in ACCOUNTING_RULES["INDIRECT_EXPENSES"]):
        return "Bank Charges", 1 # Confidence Level 1
    
    if any(k in narr for k in ACCOUNTING_RULES["DUTIES_AND_TAXES"]):
        return "GST/Taxes", 1
        
    if any(k in narr for k in ACCOUNTING_RULES["CONTRA_CASH"]):
        return "Cash", 1
        
    return "Suspense A/c", 0
