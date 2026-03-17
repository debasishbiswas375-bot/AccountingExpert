def get_preview_and_cost(df):
    """Calculates cost and preps top 10 rows for display."""
    total_rows = len(df)
    # Pro Plan Cost: 0.5 Credits per transaction
    cost = round(total_rows * 0.5, 2)
    
    # Return first 10 rows for user to verify AI mapping
    preview = df.head(10).to_dict(orient='records')
    
    return {
        "total_rows": total_rows,
        "credit_cost": cost,
        "preview_data": preview
    }
