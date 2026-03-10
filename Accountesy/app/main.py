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

# --- 1. SMART PATH CALCULATION ---
# Forces the app to see the 'Accountesy' folder correctly on Render
app_dir = os.path.dirname(os.path.abspath(__file__)) 
root_dir = os.path.dirname(app_dir) 
sys.path.append(app_dir)

app = FastAPI(title="Accountesy")

# --- 2. MOUNTING & TEMPLATES ---
# Points to Accountesy/static and Accountesy/templates
app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

# --- 3. UNIVERSAL PARSER ---
def universal_parser(content, filename):
    if filename.endswith('.pdf'):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            rows = []
            for page in pdf.pages:
                table = page.extract_table()
                if table: rows.extend(table)
            h_idx = next((i for i, r in enumerate(rows) if any('date' in str(c).lower() for c in r if c)), 0)
            df = pd.DataFrame(rows[h_idx+1:], columns=rows[h_idx])
    else:
        df = pd.read_excel(io.BytesIO(content), engine='openpyxl')

    # Fix: Remove slashes and newlines from XML tags
    def clean_tag(name):
        name = str(name).replace('\n', ' ').strip()
        name = re.sub(r'[^a-zA-Z0-9_]', '_', name) 
        return re.sub(r'_+', '_', name).strip('_')

    df.columns = [clean_tag(c) for c in df.columns]
    return df

# --- 4. ROUTES ---
@app.get("/")
async def landing(request: Request): return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/workspace")
async def workspace(request: Request): return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/history")
async def history(request: Request): return templates.TemplateResponse("history.html", {"request": request})

@app.get("/account")
async def account(request: Request): return templates.TemplateResponse("account.html", {"request": request})

# --- 5. TALLY CONVERSION ENGINE (Strict XML) ---
@app.post("/convert/process")
async def process_conversion(bank_file: UploadFile = File(...), master_file: UploadFile = File(...)):
    try:
        # Parse Tally Ledgers
        master_content = await master_file.read()
        soup = BeautifulSoup(master_content, "html.parser")
        ledgers = [td.get_text().strip() for td in soup.find_all('td') if 'italic' in str(td.get('style'))]

        bank_content = await bank_file.read()
        df = universal_parser(bank_content, bank_file.filename.lower())

        # Start building the strict Tally XML structure
        xml_output = '<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME></REQUESTDESC><REQUESTDATA>'
        
        for _, row in df.iterrows():
            date_raw = str(row.get('Date', '')).replace('/', '').split(' ')[0]
            narration = str(row.get('Narration', 'Bank Transaction')).replace('&', '&amp;')
            debit = str(row.get('Debit', '')).replace(',', '') or "0"
            credit = str(row.get('Credit', '')).replace(',', '') or "0"
            amount = debit if float(debit or 0) > 0 else credit
            vch_type = "Payment" if float(debit or 0) > 0 else "Receipt"
            
            suggested_ledger = "Suspenses"
            for ledger in ledgers:
                if ledger.upper() in narration.upper():
                    suggested_ledger = ledger
                    break

            # Create Double-Entry Voucher Block
            xml_output += f"""
            <TALLYMESSAGE xmlns:UDF="TallyUDF">
                <VOUCHER VCHTYPE="{vch_type}" ACTION="Create">
                    <DATE>{date_raw}</DATE>
                    <VOUCHERTYPENAME>{vch_type}</VOUCHERTYPENAME>
                    <NARRATION>{narration}</NARRATION>
                    <ALLLEDGERENTRIES.LIST>
                        <LEDGERNAME>{suggested_ledger}</LEDGERNAME>
                        <ISDEEMEDPOSITIVE>{"Yes" if vch_type == "Payment" else "No"}</ISDEEMEDPOSITIVE>
                        <AMOUNT>{("-" if vch_type == "Payment" else "") + amount}</AMOUNT>
                    </ALLLEDGERENTRIES.LIST>
                    <ALLLEDGERENTRIES.LIST>
                        <LEDGERNAME>State Bank of India-37017480905</LEDGERNAME>
                        <ISDEEMEDPOSITIVE>{"No" if vch_type == "Payment" else "Yes"}</ISDEEMEDPOSITIVE>
                        <AMOUNT>{"-" if vch_type == "Receipt" else ""}{amount}</AMOUNT>
                    </ALLLEDGERENTRIES.LIST>
                </VOUCHER>
            </TALLYMESSAGE>"""

        xml_output += '</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>'

        return StreamingResponse(
            io.BytesIO(xml_output.encode('utf-8')), 
            media_type="application/xml",
            headers={"Content-Disposition": "attachment; filename=Accountesy_Import_Ready.xml"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
