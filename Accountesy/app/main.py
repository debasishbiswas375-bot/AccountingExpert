import sys
import os
import io
import re
import pandas as pd
import pdfplumber
from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import StreamingResponse
from bs4 import BeautifulSoup

# --- PATH CONFIGURATION ---
# Calculate paths based on project structure
app_dir = os.path.dirname(os.path.abspath(__file__)) 
root_dir = os.path.dirname(app_dir) 
sys.path.append(app_dir)

app = FastAPI(title="Accountesy")

# --- STATIC & TEMPLATES ---
# Ensures CSS and HTML files load correctly from Accountesy root
app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

# --- UNIVERSAL ENGINE ---
def universal_parser(content, filename):
    """Detects headers for all Indian Bank Statements and cleans XML-invalid characters"""
    if filename.endswith('.pdf'):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            rows = []
            for page in pdf.pages:
                table = page.extract_table()
                if table: rows.extend(table)
            # Find header row containing 'date'
            h_idx = next((i for i, r in enumerate(rows) if any('date' in str(c).lower() for c in r if c)), 0)
            df = pd.DataFrame(rows[h_idx+1:], columns=rows[h_idx])
    else:
        # engine fix for excel format
        df = pd.read_excel(io.BytesIO(content), engine='openpyxl')

    # --- CRITICAL FIX: XML TAG CLEANER ---
    # Replaces spaces and special characters with underscores
    def clean_tag(name):
        name = str(name).replace('\n', ' ').strip()
        name = re.sub(r'[^a-zA-Z0-9_]', '_', name) 
        return re.sub(r'_+', '_', name).strip('_')

    df.columns = [clean_tag(c) for c in df.columns]
    return df

# --- PAGE ROUTES ---
@app.get("/")
async def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/workspace")
async def workspace(request: Request):
    return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/history")
async def history(request: Request):
    return templates.TemplateResponse("history.html", {"request": request})

@app.get("/account")
async def account(request: Request):
    return templates.TemplateResponse("account.html", {"request": request})

# --- PROCESSING ENGINE ---
@app.post("/convert/process")
async def process_conversion(bank_file: UploadFile = File(...), master_file: UploadFile = File(...)):
    try:
        # Parse Tally Ledgers from Master.html
        master_content = await master_file.read()
        soup = BeautifulSoup(master_content, "html.parser")
        ledgers = [td.get_text().strip() for td in soup.find_all('td') if 'italic' in str(td.get('style'))]

        # Process Bank Statement
        bank_content = await bank_file.read()
        df = universal_parser(bank_content, bank_file.filename.lower())

        # AI Matching logic
        def match_ledger(narration):
            narration = str(narration).upper()
            if "PAYTM" in narration: return "PAYTM"
            if "HPCL" in narration: return "Hindustan Petroleum Corporation LTD"
            for ledger in ledgers:
                if ledger.upper() in narration: return ledger
            return "Suspense A/c"

        # Auto-detect Narration column
        narr_col = next((c for c in df.columns if any(k in c.lower() for k in ['desc', 'narr', 'partic', 'description'])), None)
        if narr_col:
            df['Suggested_Ledger'] = df[narr_col].apply(match_ledger)

        # Generate XML
        output = io.BytesIO()
        df.to_xml(output, index=False, root_name='ENVELOPE', row_name='VOUCHER')
        output.seek(0)

        return StreamingResponse(
            output, 
            media_type="application/xml",
            headers={"Content-Disposition": "attachment; filename=Accountesy_Tally_Import.xml"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

# Render Port Fix
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
