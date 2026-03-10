import io, re, pandas as pd, pdfplumber
from bs4 import BeautifulSoup

async def get_preview_data(bank_file, master_file):
    # 1. Parse Masters (find short names and account hints)
    master_content = await master_file.read()
    soup = BeautifulSoup(master_content, "html.parser")
    tally_ledgers = [td.get_text().strip() for td in soup.find_all('td') if 'italic' in str(td.get('style'))]

    # 2. Extract Data from PDF
    bank_content = await bank_file.read()
    all_rows = []
    with pdfplumber.open(io.BytesIO(bank_content)) as pdf:
        for page in pdf.pages:
            table = page.extract_table()
            if table: all_rows.extend(table)
    
    # 3. FIX: Universal Date/Header Search
    # We find the row that contains 'Date' and use it as the header
    header_idx = next((i for i, r in enumerate(all_rows) if any('date' in str(c).lower() for c in r if c)), 0)
    df = pd.DataFrame(all_rows[header_idx+1:], columns=all_rows[header_idx])
    
    # Identify the Date Column dynamically
    date_col = next((c for c in df.columns if 'date' in str(c).lower()), df.columns[0])

    preview_results = []
    for _, row in df.iterrows():
        # Skip empty or header-duplicate rows
        raw_date = str(row[date_col]).strip()
        if not re.search(r'\d', raw_date) or 'date' in raw_date.lower(): continue

        narr = str(row.get('Narration', row.get('Description', ''))).replace('\n', ' ').upper()
        debit = re.sub(r'[^\d.]', '', str(row.get('Debit', row.get('Withdrawal', '0')))) or "0"
        credit = re.sub(r'[^\d.]', '', str(row.get('Credit', row.get('Deposit', '0')))) or "0"

        # 4. AI Mapping with Doubt Detection
        suggestions = []
        for ledger in tally_ledgers:
            # Match full name or first 4 chars (Short Name Logic)
            if ledger.upper() in narr or ledger.upper()[:4] in narr:
                suggestions.append(ledger)
        
        preview_results.append({
            "date": raw_date, # VOUCHER DATE FIXED
            "narration": narr,
            "amount": debit if float(debit) > 0 else credit,
            "type": "Payment" if float(debit) > 0 else "Receipt",
            "ledger": suggestions[0] if len(suggestions) == 1 else "Suspense A/c",
            "options": list(set(suggestions + ["Suspense A/c"]))[:4],
            "doubt": len(suggestions) != 1
        })
    
    return preview_results, tally_ledgers
