import pandas as pd
from rapidfuzz import process, utils

def ai_ledger_mapper(statement_df, tally_masters):
    """
    Learns from your tally_masters list to auto-assign ledgers
    to bank transactions based on narration patterns.
    """
    mapped_data = []
    # List of known ledgers from your master.html
    master_ledgers = tally_masters 

    for index, row in statement_df.iterrows():
        description = str(row['Narration']).upper()
        
        # AI Fuzzy Matching: Finds the best ledger match from your master list
        match = process.extractOne(description, master_ledgers, processor=utils.default_process)
        
        suggested_ledger = match[0] if match and match[1] > 80 else "Suspense A/c"
        
        mapped_data.append({
            "Date": row['Date'],
            "Narration": row['Narration'],
            "Amount": row['Debit'] if row['Debit'] > 0 else row['Credit'],
            "Ledger": suggested_ledger
        })
        
    return pd.DataFrame(mapped_data)
