from app.database import supabase
from app.tools.mapper import smart_map_bank
import pandas as pd
import os


# =========================================
# 🔹 MATCHING LOGIC
# =========================================

def match_master(txn, master_ledgers):
    for ledger in master_ledgers:
        if ledger.lower() in txn["description"].lower():
            return ledger
    return None


def match_ai_memory(txn, user_id):
    res = supabase.table("ai_memory").select("*").eq("user_id", user_id).execute()

    for item in res.data:
        if item["narration_pattern"] in txn["description"].lower():
            return item["suggested_ledger"]

    return None


def rule_based(txn):
    desc = txn["description"].lower()

    if "gst" in desc:
        return "GST Expense"
    if "petrol" in desc or "fuel" in desc:
        return "Fuel Expense"
    if "zomato" in desc or "swiggy" in desc:
        return "Staff Welfare"
    if "salary" in desc:
        return "Salary Expense"
    if "rent" in desc:
        return "Rent Expense"

    return None


def assign_ledger(txn, user_id, master_ledgers=None, user_default=None):
    ledger = None

    # MASTER
    if master_ledgers:
        ledger = match_master(txn, master_ledgers)

    # AI MEMORY
    if not ledger:
        ledger = match_ai_memory(txn, user_id)

    # RULE BASED
    if not ledger:
        ledger = rule_based(txn)

    # USER DEFAULT
    if not ledger and user_default:
        ledger = user_default

    # FALLBACK
    if not ledger:
        ledger = "Suspense Account"

    return ledger


# =========================================
# 🔥 MAIN ENGINE (PDF → EXCEL)
# =========================================

def process_pdf_to_excel(file_path, user_id="guest"):
    # Step 1: Read file
    with open(file_path, "rb") as f:
        content = f.read()

    # Step 2: Extract raw data using mapper
    df = smart_map_bank(content, os.path.basename(file_path))

    # If not bank statement → only RAW sheet
    if "raw_text" in df.columns:
        output_path = file_path.replace(".pdf", "_converted.xlsx")

        with pd.ExcelWriter(output_path) as writer:
            df.to_excel(writer, sheet_name="Raw Transactions", index=False)

        return output_path

    # Step 3: Process transactions (ledger mapping)
    processed_rows = []

    for _, row in df.iterrows():
        txn = {
            "description": str(row.get("description", "")),
        }

        ledger = assign_ledger(txn, user_id)

        new_row = row.to_dict()
        new_row["ledger"] = ledger

        processed_rows.append(new_row)

    processed_df = pd.DataFrame(processed_rows)

    # Step 4: Summary
    summary_df = pd.DataFrame({
        "Metric": ["Total Transactions", "Total Credit", "Total Debit"],
        "Value": [
            len(processed_df),
            processed_df.get("credit", pd.Series()).sum(),
            processed_df.get("debit", pd.Series()).sum()
        ]
    })

    # Step 5: Save Excel
    output_path = file_path.replace(".pdf", "_processed.xlsx")

    with pd.ExcelWriter(output_path) as writer:
        processed_df.to_excel(writer, sheet_name="Raw Transactions", index=False)
        processed_df.to_excel(writer, sheet_name="Processed Transactions", index=False)
        summary_df.to_excel(writer, sheet_name="Summary", index=False)

    return output_path


# =========================================
# 🔥 LEARNING SYSTEM
# =========================================

def learn_pattern(user_id, narration, ledger):
    supabase.table("ai_memory").upsert({
        "user_id": user_id,
        "narration_pattern": narration.lower(),
        "suggested_ledger": ledger
    }, on_conflict="user_id,narration_pattern").execute()
