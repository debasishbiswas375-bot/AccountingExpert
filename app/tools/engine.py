from app.tools.mapper import smart_map_bank
import pandas as pd
import os

# =========================
# SAFE FALLBACK FUNCTIONS
# =========================

def assign_ledger(txn, user_id=None):
    desc = txn["description"].lower()

    if "gst" in desc:
        return "GST Expense"
    if "fuel" in desc:
        return "Fuel Expense"

    return "Suspense Account"


# =========================
# MAIN ENGINE
# =========================

def process_pdf_to_excel(file_path, user_id="guest"):
    with open(file_path, "rb") as f:
        content = f.read()

    df = smart_map_bank(content, os.path.basename(file_path))

    # RAW only case
    if "raw_text" in df.columns:
        output_path = file_path.replace(".pdf", "_converted.xlsx")

        df.to_excel(output_path, index=False)
        return output_path

    processed_rows = []

    for _, row in df.iterrows():
        txn = {
            "description": str(row.get("description", ""))
        }

        ledger = assign_ledger(txn)

        new_row = row.to_dict()
        new_row["ledger"] = ledger

        processed_rows.append(new_row)

    processed_df = pd.DataFrame(processed_rows)

    output_path = file_path.replace(".pdf", "_processed.xlsx")

    processed_df.to_excel(output_path, index=False)

    return output_path
