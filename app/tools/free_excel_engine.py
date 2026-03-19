import pandas as pd

def build_free_excel(df: pd.DataFrame):
    """
    Takes mapped DataFrame (from mapper.py)
    and returns 3 sheets EXACT like your Excel
    """

    # =========================
    # RAW (no changes)
    # =========================
    raw_df = df.copy()

    # =========================
    # PROCESSED (light clean)
    # =========================
    processed_df = df.copy()

    # Ensure columns exist
    for col in ["debit", "credit", "balance"]:
        if col not in processed_df:
            processed_df[col] = 0

    processed_df["debit"] = processed_df["debit"].fillna(0)
    processed_df["credit"] = processed_df["credit"].fillna(0)

    # =========================
    # SUMMARY
    # =========================
    summary_df = pd.DataFrame({
        "Metric": ["Total Transactions", "Total Credit", "Total Debit"],
        "Value": [
            len(processed_df),
            processed_df["credit"].sum(),
            processed_df["debit"].sum()
        ]
    })

    return raw_df, processed_df, summary_df
